import type { GetServerSidePropsContext } from "next"
import { ResetPasswordScreen } from "../../../business-templates/ResetPassword";
import * as jose from 'jose'
import { businessRoute } from "../../../routes";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { email, token, _id } = context.query
  let jwtData: jose.JWTPayload;

  try {

    // TODO: validate token
    // const { payload } = await jose.jwtVerify(
    //   token as string, new TextEncoder().encode(secret)
    // )

    // 

    // // [TODO] check to see if email from URL matches email from JWT, or don't even send email
    // if (!payload._id) {
    //   
    //   throw new Error("[ERROR]: Email and token don't match. Redirecting.");
    // }


    return {
      props: {
        private: true,
        email,
        token
      }
    }

  } catch {
    return {
      redirect: {
        destination: businessRoute.login,
        permanent: false,
      },
    };
  }
}

export default ResetPasswordScreen