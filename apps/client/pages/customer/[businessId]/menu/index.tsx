import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MenuScreen } from "../../../../customer-templates/MenuScreen/MenuScreen";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function MenuPage() {
  const { t } = useTranslation('common');

  return <>
    <Head>
      <title>{t("menu")}</title>
    </Head>
    <MenuScreen />
  </>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
      ])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};
