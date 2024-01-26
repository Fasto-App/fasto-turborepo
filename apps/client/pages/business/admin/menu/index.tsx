import React from "react";
import { MenuScreen } from "../../../../business-templates/Menu";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function MenuPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<Head>
				<title>{t("menu")}</title>
			</Head>
			<MenuScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessMenu",
			])),
		},
	};
};
