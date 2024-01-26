import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ForgotPasswordForm } from "../../../src/business-templates/ForgotPassword/ForgotPasswordForm";
import Head from "next/head";
import { useTranslation } from "next-i18next";

export default function ForgotPasswordPage() {
	const { t } = useTranslation("businessForgotPassword");

	return (
		<>
			<Head>
				<title>{t("forgotPassoword")}</title>
			</Head>
			<ForgotPasswordForm />
		</>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"businessForgotPassword",
			])),
		},
	};
};
