import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DashboardScreen } from "../../../../business-templates/Dashboard/DashboardScreen";
import React from "react";
import Head from 'next/head';
import { useTranslation } from "next-i18next";

export default function DashboardPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t("dashboard")}</title>
      </Head>
      <DashboardScreen />
    </>)
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