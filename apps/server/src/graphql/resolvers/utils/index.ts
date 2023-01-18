import * as jose from "jose"
import * as z from "zod"

export const typedKeys = <T extends object>(obj?: T) => Object.keys(obj || {}) as Array<keyof T>
export const typesValues = <T extends object>(obj?: T) => Object.values(obj || {}) as Array<T[keyof T]>

export async function tokenSigning(id: string, email: string, business?: string) {
  if (!process.env.TOKEN_SECRET) return

  return await new jose.SignJWT({ _id: id, email, business })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.TOKEN_SECRET))
}

export const getUserFromToken = async (token: string, tokenSecret: string) => {
  // TODO token should be loaded here, not passed as a function
  if (!token || !tokenSecret) {
    return null
  }

  try {
    const { payload } = await jose.jwtVerify(
      token as string, new TextEncoder().encode(tokenSecret)
    )

    return {
      _id: payload._id,
      email: payload.email,
      business: payload.business
    };

  } catch (error) {

    console.log("🚯 Token error: ");
    return null
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