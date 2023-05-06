import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { AddToOrder } from "../../../../business-templates/AddToOrder";

export default AddToOrder;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessAddToOrder',
      ])),
    },
  };
};