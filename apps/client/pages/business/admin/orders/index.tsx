import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { OrdersScreen } from "../../../../src/business-templates/OrderScreen";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function OrdersPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<Head>
				<title>{t("placedOrders")}</title>
			</Head>
			<OrdersScreen />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessOrders",
				"businessPayments",
			])),
		},
	};
};
