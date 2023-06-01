import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SignUpFormScreen } from "../../../business-templates/SignUp";
import Head from 'next/head';
import { useTranslation } from "next-i18next";

export default function SignUpPage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>{t("signUp")}</title>
      </Head>
      <SignUpFormScreen />
    </>)
}


export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessSignUp'
      ])),
    },
  };
};