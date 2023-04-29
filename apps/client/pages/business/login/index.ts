import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoginForm } from "../../../business-templates/Login";

export default LoginForm;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt", [
        'common',
        'businessLogin'
      ])),
    },
  };
};