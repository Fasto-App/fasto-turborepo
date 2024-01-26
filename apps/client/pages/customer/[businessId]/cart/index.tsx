import React from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CartScreen } from "../../../../src/customer-templates/CartScreen";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function CartPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("cart")}</title>
			</Head>
			<CartScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"customerCart",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
