import type { GetStaticProps } from "next"
import { ResetPasswordScreen } from "../../../business-templates/ResetPassword";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt", [
        'common',
        'businessResetPassword'
      ])),
    },
  };
};

export default ResetPasswordScreen