import React from "react";
import { SettingsScreen } from "../../../../src/business-templates/Settings";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function SettingsPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<Head>
				<title>{t("settings")}</title>
			</Head>
			<SettingsScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessSettings",
			])),
		},
	};
};
