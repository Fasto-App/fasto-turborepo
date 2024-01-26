import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { AddToOrder } from "../../../../business-templates/AddToOrder";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function AddToOrderPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("quickSale")}</title>
			</Head>
			<AddToOrder />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessAddToOrder",
			])),
		},
	};
};
