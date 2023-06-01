import type { GetStaticProps } from "next"
import { ResetPasswordScreen } from "../../../business-templates/ResetPassword";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import React from "react";
import Head from 'next/head';
import { useTranslation } from "next-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation('businessResetPassword');

  return (
    <>
      <Head>
        <title>{t("resetPassword")}</title>
      </Head>
      <ResetPasswordScreen />
    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessResetPassword'
      ])),
    },
  };
};