import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CreateAccountScreen } from "../../../business-templates/CreateaAccount/";


export default CreateAccountScreen

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt", [
        'common',
        // 'businessLogin'
      ])),
    },
  };
};