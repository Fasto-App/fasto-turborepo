import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SignUpFormScreen } from "../../../business-templates/SignUp";

export default SignUpFormScreen;


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessSignUp'
      ])),
    },
  };
};