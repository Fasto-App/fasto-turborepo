import React from "react";
import { TablesScreen } from "../../../../src/business-templates/Tables";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function TablesPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<Head>
				<title>{t("tables")}</title>
			</Head>
			<TablesScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessTables",
			])),
		},
	};
};
