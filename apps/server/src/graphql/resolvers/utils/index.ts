import * as jose from "jose"
import * as z from "zod"
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended"
import { ClientContext, UserContext } from "../types"
import { DateType } from "../../../generated/graphql"

export async function tokenSigning(id: string, email: string, business?: string) {
  if (!process.env.TOKEN_SECRET) throw ApolloError(new Error("No token"), 'InternalServerError')

  return await new jose.SignJWT({ _id: id, email, business })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET))
}

export async function tokenClient({ _id, business, request }: ClientContext) {
  if (!process.env.TOKEN_SECRET) throw ApolloError(new Error("No token"), 'InternalServerError')

  return await new jose.SignJWT({ _id, business, request })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET))
}

export const getUserFromToken = async (token?: string): Promise<UserContext | undefined> => {
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!tokenSecret) throw new Error('Token secret not found');

  if (!token) {
    // console.log("🚯 No Token: Limited Access");
    return undefined
  }

  try {
    const { payload } = await jose.jwtVerify(
      token as string,
      new TextEncoder().encode(tokenSecret)
    )

    return {
      _id: payload._id as string,
      email: payload.email as string,
      business: payload.business as string,
    };

  } catch (error) {

    console.log("🚯 invalid User Token");
    throw ApolloError(error as Error, "Unauthorized");
  }
}

export const getClientFromToken = async (token?: string): Promise<ClientContext | undefined> => {
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!tokenSecret) throw new Error('Token secret not found');

  if (!token) {
    // console.log("🟡 No Tab");
    return undefined
  }

  try {
    const { payload } = await jose.jwtVerify(
      token as string,
      new TextEncoder().encode(tokenSecret)
    )

    return {
      _id: payload._id as string,
      business: payload.business as string,
      request: payload.request as string,
    };

  } catch (error) {

    console.log("⚛️ Invalid Client Token");
  }
}

const emailSchema = z.string().email();

export const validateEmail = (email: string) => {
  const stringifiedEmail = String(email)
  const result = emailSchema.safeParse(stringifiedEmail)

  return result.success
};

export const getDaysAgo = (input: DateType) => {
  let days;

  switch (input) {
    case DateType.SevenDays:
      days = 7
      break;
    case DateType.ThirtyDays:
      days = 30
      break;
    case DateType.NinetyDays:
      days = 90
      break;
    case DateType.AllTime:
      days = 0
      break
  }

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);

  return { daysAgo, days }
}



export const validatePassword = (password: string) => {
  return String(password)
    .length >= 6 &&
    String(password)
      .match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
}

export const IS_DEVELOPMENT_SERVER = process.env.ENVIRONMENT === "development"