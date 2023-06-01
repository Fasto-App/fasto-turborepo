import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoginForm } from "../../../business-templates/Login";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function LoginPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t("login")}</title>
      </Head>
      <LoginForm />
    </>)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessLogin'
      ])),
    },
  };
};