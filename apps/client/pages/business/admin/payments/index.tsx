import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PaymentsScreen } from "../../../../business-templates/Payments";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function LoginPage() {
  const { t } = useTranslation(['common', 'businessPayments']);

  return (
    <>
      <Head>
        <title>{t("businessPayments:payments")}</title>
      </Head>
      <PaymentsScreen />
    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessPayments'
      ])),
    },
  };
};