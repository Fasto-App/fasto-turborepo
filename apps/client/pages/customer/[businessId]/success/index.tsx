import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SplitScreen } from "../../../../src/customer-templates/Split";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { SuccessScreen } from "../../../../src/customer-templates/SuccessScreen/SuccessScreen";

export default function CheckoutPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("checkout")}</title>
			</Head>
			<SuccessScreen />
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
