
import bcrypt from "bcryptjs";
import { User, UserModel } from "../../../models/user";
import { SessionModel } from "../../../models/session";
import {
  getUserFromToken,
  tokenSigning,
  validateEmail,
} from "../utils"
import { Connection } from "mongoose"
import { Context } from "../types";
import { UserInputError } from "apollo-server-express";
import { BusinessModel } from "../../../models/business";
import { typedKeys, SignUpSchemaInput, CreateAccountField, createAccountSchema, AccountInformation, ResetPasswordSchemaInput, CreateEmployeeAccountInput, createEmployeeAccountSchema } from "app-helpers";
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
} from "../../../email-tool";
import { uploadFileS3Bucket } from "../../../s3/s3";
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended";

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export const requestUserAccountCreation = async (_parent: any,
  { input }: { input: SignUpSchemaInput },
  { db }: Context) => {

  if (!validateEmail(input.email)) {
    throw new UserInputError("Invalid email");
  }

  const Session = SessionModel(db)
  const User = UserModel(db)
  const user = await User.findOne({ email: input.email })

  if (user) throw new Error("An account with this email already exists");

  let newSession;

  const existingSession = await Session.findOne({ email: input.email })

  if (!existingSession) {
    newSession = await Session.create({
      email: input.email,
    })
  } else {
    newSession = existingSession
  }

  if (!newSession?.email) throw new Error("Could not create session");

  try {

    const token = await tokenSigning(newSession._id, newSession.email);

    newSession.token = token;
    await newSession.save()

    if (!token) throw new Error("Token not found");

    return await sendWelcomeEmail({
      email: input.email,
      token,
    })
  } catch (err) {
    throw new Error(`Could not send email ${err}`);
  }
}

export const createUser = async (_parent: any, { input }: { input: CreateAccountField }, { db }: { db: Connection }) => {

  try {
    const validInput = createAccountSchema.parse(input)

    const Session = SessionModel(db)
    const Business = BusinessModel(db)
    const findSession = await Session.findOne({ email: validInput.email })

    if (!findSession) throw new UserInputError('Session not found. Check you email again or request a new access token.');

    const hashedPassword = hashPassword(validInput.password)
    const User = UserModel(db)

    const user = await User.create({
      name: validInput.name,
      email: validInput.email.toLowerCase(),
      password: hashedPassword,
      isGuest: false,
    })

    const savedUser = await user.save()

    const creatingBusiness = await Business.create({
      user: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      employees: [savedUser._id]
    })

    const businessToString = creatingBusiness._id.toString()

    user.businesses = {
      [businessToString]: {
        privilege: "Admin",
        jobTitle: "Owner",
      }
    }

    const token = tokenSigning(user._id, input.email.toLowerCase(), creatingBusiness?._id);
    await user.save()

    return ({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      token,
    });

  } catch (err) {
    throw new Error(`${err}`);
  }
}


// Enter credentials to get existing user
// TODO: Add email verification from ZOD
export const postUserLogin = async (_parent: any, { input }: any, { db }: { db: Connection }) => {
  const { email, password } = input

  if (!validateEmail(email)) {
    throw ApolloError('BadRequest', 'Invalid email bitchass')
  }

  const User = UserModel(db)
  const user = await User.findOne({ email })

  if (!user) throw new Error("User not found")

  const isPasswordMatch = await bcrypt.compare(password, user.password as string);
  if (!isPasswordMatch) throw new Error("User not found")

  const allBusiness = typedKeys(user.businesses)
  const businessId = allBusiness.length ? allBusiness[0] as string : undefined;

  const token = await tokenSigning(user._id, email, businessId);

  return ({
    _id: user._id,
    name: user.name,
    token,
    email,
  })
}

export const getUserInformation = async (_parent: any, _args: any, { db, user }: Context) => {

  console.log("getUserInformation", user)
  const foundUser = await UserModel(db).findById(user);

  if (!foundUser) return null

  const token = tokenSigning(foundUser._id, foundUser.email as string);

  return ({
    _id: foundUser._id,
    name: foundUser.name,
    email: foundUser.email,
    picture: foundUser.picture,
    token,
  });
}

export const getToken = async (_parent: any, _: any, { db, user }: Context) => {
  if (!user) throw new Error("User not found");

  const userProfile = await UserModel(db).findById(user._id);
  if (!userProfile) return null

  const allBusiness = typedKeys(userProfile.businesses)
  const businessId = allBusiness.length ? allBusiness[0] as string : undefined;

  const token = await tokenSigning(userProfile._id, userProfile.email as string, businessId);

  return ({
    _id: userProfile._id,
    name: userProfile.name,
    email: userProfile.email,
    token,
  });
}

export const getAllUsers = async (_parent: any, _args: any, { db }: Context) => {
  const User = UserModel(db)
  return await User.find({})
}

export const deleteUser = async (_parent: any, { input }: { input: string }, { db, user }: Context) => {
  if (!user) throw new Error("User not found");

  const User = await UserModel(db).findOneAndDelete({ _id: user._id })

  return { ok: !!User }
}

//TODO: when a new email is created, a new token should be generated
export const updateUserInformation = async (_parent: any,
  { input }: { input: AccountInformation & { picture: any } },
  { db, user }: Context) => {

  if (!user) throw new Error("User not found.");

  const User = UserModel(db)
  const foundUser = await User.findById(user._id);

  if (input.picture) {
    const file = await uploadFileS3Bucket(input.picture)

    foundUser?.set({ picture: file.Location })
  }

  if (input.newPassword && input.oldPassword) {
    const isPasswordMatch = await bcrypt.compare(input.oldPassword, foundUser?.password as string);
    const hashedPassword = hashPassword(input.newPassword)

    if (!isPasswordMatch) throw new Error("User not found")

    foundUser?.set({ password: hashedPassword })
  }

  return await foundUser?.set({
    name: input.name,
  }).save()
}

// recover password
export const recoverPassword = async (_parent: any, { input }: { input: string }, { db }: Context) => {

  if (!validateEmail(input)) {
    throw ApolloError('BadRequest')
  }

  const User = UserModel(db)
  const user = await User.findOne({ email: input })

  if (!user || !user.email || !user.name) throw ApolloError('NotFound')

  const allBusiness = typedKeys(user.businesses)
  const businessId = allBusiness.length ? allBusiness[0] as string : undefined;
  const token = await tokenSigning(user._id, user.email, businessId);

  if (!token) throw ApolloError('InternalServerError')

  try {

    const courierResponse = await sendResetPasswordEmail({
      email: user.email,
      name: user.name,
      token,
    })

    return courierResponse
  } catch (err) {
    throw new Error(`Could not send email ${err}`);
  }
}


const createEmployeeAccount = async (_parent: any, { input }: { input: CreateEmployeeAccountInput }, { db }: Context) => {
  try {
    const validInput = createEmployeeAccountSchema.parse(input)
    const { token, password, email, name } = validInput
    if (!email || !token) throw ApolloError("BadRequest", "Invalid Input")
    // the token will be used to know what business the user is creating the account for
    const Session = SessionModel(db)
    const foundSession = await Session.findOne({ email: email, token: token })
    // with the session we can try to get the job role

    if (!foundSession) throw ApolloError("BadRequest", "Invalid Token. Request a new one")

    const {
      _id,
      email: emailFromToken,
      business
    } = await getUserFromToken(token) || {}

    if (!business || !emailFromToken) {
      throw ApolloError("BadRequest", "Invalid Token. Request a new one")
    }

    const User = UserModel(db)
    const hashedPassword = hashPassword(password)
    // make sure business exists  
    const businessFound = await BusinessModel(db).findById(business)

    const privilege = foundSession?.business?.privilege
    const jobTitle = foundSession?.business?.jobTitle

    if (!businessFound || !privilege || !jobTitle) {
      throw ApolloError("BadRequest", "Invalid Business or Privileges")
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isGuest: false,
      businesses: {
        [businessFound._id]: {
          privilege,
          jobTitle
        }
      },
    })

    // this should never be undefined, but just in case
    businessFound.employees = [...businessFound?.employees || [], user._id]
    businessFound.employeesPending = businessFound?.employeesPending?.filter((employee) => employee?.toString() !== _id?.toString())

    await businessFound.save()

    const newToken = await tokenSigning(user._id, user.email as string, businessFound._id)

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      token: newToken,
    }

  } catch (err: any) {
    throw ApolloError("BadRequest", `${err}`)
  }

}

const getBusinessByUser = (user: User, input: any, context: Context) => {
  const business = user.businesses

  if (!business) return []

  const mappedbusinesses = typedKeys(business).map((businessId: string | number) => {
    return {
      business: businessId,
      privilege: business[businessId].privilege
    }
  })

  return mappedbusinesses
}

const passwordReset = async (_parent: any,
  { input: { password, token } }: { input: ResetPasswordSchemaInput },
  { db }: Context) => {

  console.log("RESET PASSWORD", password, token)

  if (!token) throw ApolloError('BadRequest')

  try {
    const decodedToken = await getUserFromToken(token)

    console.log("decodedToken", decodedToken)


    if (!decodedToken) throw ApolloError("BadRequest", "Token Invalid");

    const User = UserModel(db)
    const user = await User.findOne({ email: decodedToken.email })

    if (!user) throw new Error("User not found");

    const hashedPassword = hashPassword(password)

    user.password = hashedPassword
    await user.save()

    return ({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    })
  } catch (error) {
    throw ApolloError('BadRequest', "somehting with the token was not right")
  }

}

const getClientInformation = async (_parent: any, { input }: { input: string }, { db, client }: Context) => {
  const User = UserModel(db)
  const foundClient = await User.findById(client?._id)

  if (!foundClient) throw ApolloError('BadRequest', 'Client not found')

  return foundClient
}




const UserResolverMutation = {
  requestUserAccountCreation,
  updateUserInformation,
  deleteUser,
  createUser,
  recoverPassword,
  postUserLogin,
  passwordReset,
  createEmployeeAccount
}
const UserResolverQuery = {
  getUserInformation,
  getAllUsers,
  getToken,
  getClientInformation
}

const UserResolver = {
  getBusinessByUser
}

export { UserResolver, UserResolverMutation, UserResolverQuery }
