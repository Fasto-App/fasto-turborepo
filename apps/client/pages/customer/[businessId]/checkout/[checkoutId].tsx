import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CheckoutScreen } from "../../../../customer-templates/CheckoutScreen";
import { GetStaticPaths, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import Head from "next/head";

export default function CheckoutPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("checkout")}</title>
			</Head>
			<CheckoutScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"customerCheckout",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
