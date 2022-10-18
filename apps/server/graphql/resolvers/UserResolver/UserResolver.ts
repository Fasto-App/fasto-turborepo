
import bcrypt from "bcryptjs";
import { CourierClient } from "@trycourier/courier";
import { UserModel } from "../../../models/user";
import { SessionModel } from "../../../models/session";
import {
  tokenSigning,
  validateEmail,
  validatePassword,
  IS_DEVELOPMENT_SERVER,
  typedKeys
} from "../utils"
import { Connection } from "mongoose"
import { Context } from "../types";
import { UserInputError, ValidationError } from "apollo-server-express";
import { BusinessModel } from "../../../models/business";
import { Privileges } from "../../../models/types";
import { CreateUserInput, RequestUserAccountCreationInput, UpdateUserInput } from "./types";
import { CannotBeSymbolError } from "@typegoose/typegoose/lib/internal/errors";

const courier = CourierClient({ authorizationToken: "pk_prod_9AMCPRZA2MM1GKGAX8NPA99CKXPV" });

const URL_FRONT_DEV = process.env.FRONTEND_DEV_URL;
const URL_FRONT_PROD = process.env.FRONTEND_PROD_URL;
const ABSOLUTE_URL = IS_DEVELOPMENT_SERVER ? URL_FRONT_DEV : URL_FRONT_PROD;



export const requestUserAccountCreation = async (_parent: any,
  { input }: { input: RequestUserAccountCreationInput },
  { db }: Context) => {

  const Session = SessionModel(db)

  if (input.email !== input.emailConfirmation || !validateEmail(input.email)) {

    throw new UserInputError("Invalid email");
  }

  const User = UserModel(db)
  const user = await User.findOne({ email: input.email })

  if (user) throw new Error("An account with this email already exists")

  const newSession = await Session.create({
    email: input.email,
  })

  if (!newSession?.email) {
    throw new Error("Could not create session");
  }

  let token;

  try {
    token = await tokenSigning(newSession._id, newSession.email);
  } catch (err) {
    return { ok: false }
  }

  newSession.token = `${token}`
  newSession.save()

  const url = `${ABSOLUTE_URL}/business/create-account?token=${token}&email=${input.email}`

  if (!token) {
    throw new Error("Token not found");
  }

  try {

    const { requestId } = await courier.send({
      message: {
        to: {
          email: newSession.email,
          data: {
            name: newSession.email,
            url,
          },
        },
        template: "8ETVZCQK0KM7S5KK5YMEBXCDYH3T",
        routing: {
          method: "single",
          channels: ["email"],
        },
      },
    });

    // if we have a request id it means the email was sent
    return { ok: !!requestId, url };
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

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(input.password, salt);
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

export const getUserByToken = async (_parent: any, _: any, { db, user }: Context) => {
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
  const users = await User.find({})

  return users
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

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(input.password, salt);

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
  const url = `${ABSOLUTE_URL}/business/reset-password?token=${token}&email=${user.email}&_id=${user._id}`;

  if (!token) return { ok: false }

  const { requestId } = await courier.send({
    message: {
      to: {
        email: user.email,
        data: {
          name: user.name,
          url,
        },
      },
      template: "DWCK46XWTH4GHYG03D1NFZAMYN6J",
      routing: {
        method: "single",
        channels: ["email"],
      },
    },
  });

  return { ok: !!requestId }
}




const UserResolverMutation = {
  requestUserAccountCreation,
  updateUserInformation,
  deleteUser,
  createUser,
  recoverPassword,
  postUserLogin,
}
const UserResolverQuery = {
  getUserByID,
  getAllUsers,
  getUserByToken,
}

const UserResolver = {

}

export { UserResolver, UserResolverMutation, UserResolverQuery }
