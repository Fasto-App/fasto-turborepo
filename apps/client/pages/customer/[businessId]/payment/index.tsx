import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MenuScreen } from "../../../../src/customer-templates/MenuScreen/MenuScreen";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { PaymentScreen } from "../../../../src/customer-templates/PaymentScreen";

export default function MenuPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>{/* <title>{t("payment")}</title> */}</Head>
			<PaymentScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"customerPayment",
			])),
		},
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	return { paths: [], fallback: true };
};
