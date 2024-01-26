import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CreateAccountScreen } from "../../../business-templates/CreateaAccount";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function CreateAccountPage() {
	const { t } = useTranslation("businessCreateAccount");

	return (
		<>
			<Head>
				<title>{t("createPassword")}</title>
			</Head>
			<CreateAccountScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessCreateAccount",
			])),
		},
	};
};
