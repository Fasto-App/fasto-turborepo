import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HomeScreen } from "../../../src/customer-templates/HomeScreen/HomeScreen";

import React from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function HomePage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("home")}</title>
			</Head>
			<HomeScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"customerHome",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
