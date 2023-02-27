import * as jose from "jose"
import * as z from "zod"
import { ApolloError } from "../../ApolloErrorExtended/ApolloErrorExtended"

export async function tokenSigning(id: string, email: string, business?: string) {
  if (!process.env.TOKEN_SECRET) throw ApolloError('InternalServerError')

  return await new jose.SignJWT({ _id: id, email, business })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET))
}

type UserToken = {
  _id: string;
  email: string;
  business?: string;
}

export const getUserFromToken = async (token?: string): Promise<UserToken | null> => {
  const tokenSecret = process.env.TOKEN_SECRET;

  if (!tokenSecret) throw new Error('Token secret or bearer token not found');

  if (!token) {
    console.log("🚯 No Token: Limited Access");
    return null
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

    console.log("🚯 Token error: INVALID Token");
    throw ApolloError("Unauthorized");
  }
}
const emailSchema = z.string().email();

export const validateEmail = (email: string) => {
  const stringifiedEmail = String(email)
  const result = emailSchema.safeParse(stringifiedEmail)

  return result.success
};



export const validatePassword = (password: string) => {
  return String(password)
    .length >= 6 &&
    String(password)
      .match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/);
}

export const IS_DEVELOPMENT_SERVER = process.env.ENVIRONMENT === "development"