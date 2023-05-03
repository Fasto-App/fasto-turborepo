import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HomeScreen } from "../../../customer-templates/HomeScreen/HomeScreen";

export default HomeScreen

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt", [
        'common',
        'customerHome'
      ])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};