import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ProductDescriptionScreen }
  from "../../../../customer-templates/ProductDescriptionScreen";
import Head from "next/head";
import { useTranslation } from "react-i18next";


export default function ProductDescriptionPage() {
  const { t } = useTranslation('common');

  return <>
    <Head>
      <title>{t("checkout")}</title>
    </Head>
    <ProductDescriptionScreen />
  </>
}

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