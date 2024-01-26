import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Checkout } from "../../../../business-templates/Checkout/Checkout";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function CheckoutPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("checkout")}</title>
			</Head>
			<Checkout />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessCheckout",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
