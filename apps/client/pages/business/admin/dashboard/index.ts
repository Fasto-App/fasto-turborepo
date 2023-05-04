import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DashboardScreen } from "../../../../business-templates/Dashboard/DashboardScreen";

export default DashboardScreen;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
      ])),
    },
  };
};