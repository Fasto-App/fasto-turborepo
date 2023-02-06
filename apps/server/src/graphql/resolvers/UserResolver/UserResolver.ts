
import bcrypt from "bcryptjs";
import { User, UserModel } from "../../../models/user";
import { SessionModel } from "../../../models/session";
import {
  tokenSigning,
  validateEmail,
  validatePassword,
} from "../utils"
import { Connection, Types } from "mongoose"
import { Context } from "../types";
import { UserInputError } from "apollo-server-express";
import { BusinessModel } from "../../../models/business";
import { Privileges } from "../../../models/types";
import { CreateUserInput, RequestUserAccountCreationInput, UpdateUserInput } from "./types";
import { PrivilegesType, typedKeys } from "app-helpers";
import type { Ref } from '@typegoose/typegoose';
import { sendCourierEmail } from "../../../courier";

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export const requestUserAccountCreation = async (_parent: any,
  { input }: { input: RequestUserAccountCreationInput },
  { db }: Context) => {

  if (input.email !== input.emailConfirmation || !validateEmail(input.email)) {
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

    console.log("FUCKING REQUESTING USER ACCOUNT CREATION")

    const courierResponse = await sendCourierEmail({
      template: "request-account-creation",
      email: input.email,
      _id: newSession._id,
      name: input.email,
      token,
    })

    return courierResponse;
  } catch (err) {
    throw new Error(`Could not send email ${err}`);
  }
}

export const createUser = async (_parent: any, { input }: { input: CreateUserInput }, { db }: { db: Connection }) => {

  // TODO: user needs a valid token
  // find a session with the email id. 
  // if we the email is the same as the one from the DB, then move forward
  const Session = SessionModel(db)
  const Business = BusinessModel(db)
  const findSession = await Session.findOne({ email: input.email })

  if (!findSession) throw new UserInputError('Session not found. Check you email again or request a new access token.');

  if (input.name.length < 3) {
    throw new UserInputError('Name must be at least 3 characters long.');
  }

  if (!validateEmail(input.email)) {
    throw new Error("Please, provide a valid email");
  }

  if (input.password !== input.passwordConfirmation) {
    throw new UserInputError('Please, provide a valid email.');
  }

  if (!validatePassword(input.password)) {
    throw new UserInputError('Password must be at least 8 characters long and contain letters and numbers.');
  }

  const hashedPassword = hashPassword(input.password)
  const User = UserModel(db)

  try {
    const user = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
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
    throw new Error("An error occurred while creating the user");
  }
}

// Enter credentials to get existing user
export const postUserLogin = async (_parent: any, { input }: any, { db }: { db: Connection }) => {

  console.log("postUserLogin", input)



  const { email, password } = input

  if (!validateEmail(email)) {
    throw new Error("User not found");
  }

  const User = UserModel(db)
  const user = await User.findOne({ email })

  if (!user) throw new Error("User not found")

  const isPasswordMatch = await bcrypt.compare(password, user.password as string);
  if (!isPasswordMatch) throw new Error("User not found")

  const allBusiness = typedKeys(user.businesses)
  const businessId = allBusiness.length ? allBusiness[0] : undefined;

  const token = tokenSigning(user._id, email, businessId);
  const loginResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  }

  console.log("loginResponse", loginResponse)

  return loginResponse;
}

export const getUserByID = async (_parent: any, { userID }: { userID: string }, { db }: { db: Connection }) => {
  const user = await UserModel(db).findById(userID);

  if (!user) return null
  const token = tokenSigning(user._id, user.email as string);

  return ({
    _id: user._id,
    name: user.name,
    email: user.email,
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

// 
export const deleteUser = async (_parent: any, { input }: { input: string }, { db, user }: Context) => {
  if (!user) throw new Error("User not found");

  const User = await UserModel(db).findOneAndDelete({ _id: user._id })


  return { ok: !!User }
}

//TODO: when a new email is created, a new token should be generated
export const updateUserInformation = async (_parent: any,
  { input }: { input: UpdateUserInput },
  { db, user }: Context) => {

  if (input?._id && input.password) {

    const hashedPassword = hashPassword(input.password)

    const updatedUser = await UserModel(db).findByIdAndUpdate(input._id, {
      password: hashedPassword
    }, { new: true, runValidators: true })

    if (!updatedUser) throw new Error("Error finding user");

    const allBusiness = typedKeys(updatedUser.businesses)
    const businessId = allBusiness.length ? allBusiness[0] : undefined;

    const token = await tokenSigning(updatedUser._id, updatedUser.email as string, businessId);

    return ({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token,
    });
  }

  if (!user) throw new Error("User not found.");

  const updatedUser = await UserModel(db).findByIdAndUpdate(user._id, {
    name: input.name,
    email: input.email,
    // password: input.password
  }, { new: true, runValidators: true })

  return updatedUser
}

// recover password
export const recoverPassword = async (_parent: any, { input }: { input: string }, { db }: Context) => {

  if (!validateEmail(input)) {
    return { ok: false };
  }

  const User = UserModel(db)
  const user = await User.findOne({ email: input })

  if (!user) return { ok: false }

  const allBusiness = typedKeys(user.businesses)
  const businessId = allBusiness.length ? allBusiness[0] : undefined;
  const token = await tokenSigning(user._id, user.email as string, businessId);

  if (!token) return { ok: false }

  try {

    const courierResponse = await sendCourierEmail({
      template: "reset-password",
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

    sendCourierEmail({
      template: "reset-password",
      email: newUser.email,
      token,
      name: newUser.name,
      _id: newUser._id,
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
  getUserByID,
  getAllUsers,
  getToken,
}

const UserResolver = {
  getBusinessByUser
}

export { UserResolver, UserResolverMutation, UserResolverQuery }
