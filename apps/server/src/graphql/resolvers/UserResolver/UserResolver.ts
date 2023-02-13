
import bcrypt from "bcryptjs";
import { User, UserModel } from "../../../models/user";
import { SessionModel } from "../../../models/session";
import {
  getUserFromToken,
  tokenSigning,
  validateEmail,
  validatePassword,
} from "../utils"
import { Connection, Types } from "mongoose"
import { Context } from "../types";
import { UserInputError } from "apollo-server-express";
import { BusinessModel } from "../../../models/business";
import { Privileges } from "../../../models/types";
import { PrivilegesType, typedKeys, SignUpSchemaInput, CreateAccountField, createAccountSchema, AccountInformation, ResetPasswordSchemaInput } from "app-helpers";
import type { Ref } from '@typegoose/typegoose';
import {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendEployeeEmail,
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

  let token;

  try {

    token = await tokenSigning(newSession._id, newSession.email);

    newSession.token = token;
    newSession.save()

    if (!token) throw new Error("Token not found");

    const courierResponse = await sendWelcomeEmail({
      email: input.email,
      token,
    })

    console.log("COURIER RESPONSE", courierResponse)

    return courierResponse
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
    })

    const savedUser = await user.save()

    const creatingBusiness = await Business.create({
      user: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      employees: [savedUser._id]
    })

    const businessToString = creatingBusiness._id.toString()

    user.businesses = { [businessToString]: [Privileges.ADMIN] }

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

export const resetPassword = async (_parent: any, { input: { password, token } }: { input: ResetPasswordSchemaInput }, { db }: { db: Connection }) => {

  if (!token) throw ApolloError('BadRequest')

  try {
    const decodedToken = await getUserFromToken(token)
    if (!decodedToken) throw new Error("Token not found");

    const User = UserModel(db)
    const user = await User.findOne({ email: decodedToken.email })

    if (!user) throw new Error("User not found");

    const hashedPassword = hashPassword(password)

    user.password = hashedPassword

    return await user.save()

  } catch {
    throw ApolloError('BadRequest')
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
  const businessId = allBusiness.length ? allBusiness[0] : undefined;

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
  const businessId = allBusiness.length ? allBusiness[0] : undefined;

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

  if (!user) throw ApolloError('NotFound')

  const allBusiness = typedKeys(user.businesses)
  const businessId = allBusiness.length ? allBusiness[0] : undefined;
  const token = await tokenSigning(user._id, user.email as string, businessId);

  if (!token) throw ApolloError('InternalServerError')

  try {

    const courierResponse = await sendResetPasswordEmail({
      email: user.email,
      token,
      name: user.name,
      _id: user._id,
    })

    return courierResponse
  } catch (err) {
    throw new Error(`Could not send email ${err}`);
  }
}

type AddEmployeeInput = {
  name: string;
  privileges: PrivilegesType;
  email: string;
  phone: string;
  picture: string;
}

export const addEmployeeToBusiness = async (_parent: any, { input }: { input: AddEmployeeInput }, { db, user, business }: Context) => {
  const User = UserModel(db)
  const Business = BusinessModel(db)
  const userFound = await User.findOne({ email: input.email })
  const businessFound = await Business.findById(business)

  async function updatebusiness(userId: Ref<User, Types.ObjectId>) {
    if (!businessFound?.employees) throw new Error("Object with Key employees not found")

    const arr = [...businessFound?.employees, userId]
    const uniqueEmployees = arr.filter((a, i) => arr.findIndex((s) => a?.toString() === s?.toString()) === i)
    businessFound.employees = uniqueEmployees
    await businessFound.save()
  }

  if (!business || !businessFound) throw new Error("Business not found")

  if (userFound) {
    if (!userFound.businesses) throw new Error("Object with Key business not found")

    if (userFound.businesses[business]) {
      const privileges = [...new Set([...userFound.businesses[business], input.privileges])]
      userFound.businesses[business] = privileges
      userFound.save()
      await updatebusiness(userFound._id)


      return userFound
    }

    userFound.businesses = { ...userFound.businesses, [business]: [input.privileges] }
    userFound.save()

    await updatebusiness(userFound._id)

    return userFound
  }

  const hashedPassword = hashPassword(input.email)

  try {
    const newUser = await User.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      businesses: { [business]: [input.privileges] },
      ...(input.phone && { phone: input.phone }),
      ...(input.picture && { picture: input.picture }),
    })

    await updatebusiness(newUser._id)

    const token = await tokenSigning(newUser._id, newUser.email as string, business);

    if (!token) throw new Error("Could not create token")

    sendEployeeEmail({
      token,
      email: newUser.email,
      name: newUser.name,
    })

    return newUser

  } catch (error) {
    console.log(error)
  }

}

const getBusinessByUser = (user: User, input: any, context: Context) => {
  console.log("user", user)
  const business = user.businesses

  if (!business) return []

  const mappedbusinesses = typedKeys(business).map((businessId: string | number) => {
    return { business: businessId, privileges: business[businessId] }
  })

  return mappedbusinesses
}


const UserResolverMutation = {
  requestUserAccountCreation,
  updateUserInformation,
  deleteUser,
  createUser,
  recoverPassword,
  postUserLogin,
  addEmployeeToBusiness,
}
const UserResolverQuery = {
  getUserInformation,
  getAllUsers,
  getToken,
}

const UserResolver = {
  getBusinessByUser
}

export { UserResolver, UserResolverMutation, UserResolverQuery }
