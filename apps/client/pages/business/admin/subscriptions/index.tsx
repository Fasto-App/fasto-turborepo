import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { Subscriptions } from "../../../../src/business-templates/Subscription";

export default function SubscriptionsPage() {
	const { t } = useTranslation("common");

	return (
		<>
			<Head>
				<title>{t("subscriptions")}</title>
			</Head>
			<Subscriptions />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessSubscriptions",
			])),
		},
	};
};
