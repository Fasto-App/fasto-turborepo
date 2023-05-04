import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ProductDescriptionScreen }
  from "../../../../customer-templates/ProductDescriptionScreen";


export default ProductDescriptionScreen;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'customerProductDescription'
      ])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};