import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SettingsScreen } from "../../../../src/customer-templates/SettingsScreen";

import { useTranslation } from "next-i18next";
import Head from "next/head";

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
				"customerSettings",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
