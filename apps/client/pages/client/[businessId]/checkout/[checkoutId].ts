import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CheckoutScreen } from "../../../../client-templates/CheckoutScreen";
import { GetStaticPaths, GetStaticProps } from "next";

export default CheckoutScreen

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "pt", [
        'common',
        'clientCheckout'
      ])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};