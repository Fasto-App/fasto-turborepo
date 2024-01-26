import React from "react";
import { AddProductsCategories } from "../../../../business-templates/AddProductsCategory";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function AddProductsCategoriesPage() {
	const { t } = useTranslation("common");
	return (
		<>
			<Head>
				<title>{t("categoriesProducts")}</title>
			</Head>
			<AddProductsCategories />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessCategoriesProducts",
			])),
		},
	};
};
