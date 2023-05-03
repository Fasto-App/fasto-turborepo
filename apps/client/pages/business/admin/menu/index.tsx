import React from "react"
import { MenuScreen } from "../../../../business-templates/Menu"
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default MenuScreen

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'common',
        'businessMenu'
      ])),
    },
  };
};