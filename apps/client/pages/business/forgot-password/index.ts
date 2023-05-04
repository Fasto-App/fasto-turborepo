import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ForgotPasswordForm } from "../../../business-templates/ForgotPassword/ForgotPasswordForm"

export default ForgotPasswordForm


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessForgotPassword'
      ])),
    },
  };
};