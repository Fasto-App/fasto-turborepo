import "../src/css/normalize.css";
import "../src/css/webflow.css";
import "../src/css/fasto.webflow.css";
import "../src/css/style.css";
import "../src/css/settings.css";
import type { AppProps } from "next/app";
import React, { Fragment, useMemo } from "react";
import { useRouter } from "next/router";
import { BusinessLayout } from "../src/business-templates/Layout/BusinessLayout";
import { CustomerLayout } from "../src/customer-templates/Layout";
import { AppProvider } from "../src/appProvider";
import { BUSINESS, CUSTOMER } from "fasto-route";
import { AppApolloProvider } from "../src/apollo-client/AppApolloProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import NextNProgress from "nextjs-progressbar";
import { useTheme } from "native-base";
import { ErrorBanner } from "../src/components/ErrorBanner";
import { View } from "react-native";
import { appWithTranslation } from "next-i18next";

const LandingWrapper: React.FC = ({ children }) => (
	<Fragment>{children}</Fragment>
);

const ProgressBar = () => {
	const theme = useTheme();

	return (
		<NextNProgress
			height={6}
			color={theme.colors.secondary[400]}
			startPosition={0.8}
		/>
	);
};

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const isBusinessExp = router.route.includes(BUSINESS);
	const isCustomerExp = router.route.includes(CUSTOMER);

	const Wrapper = useMemo(() => {
		if (isCustomerExp) {
			return CustomerLayout;
		} else if (isBusinessExp) {
			return BusinessLayout;
		}

		return LandingWrapper;
	}, [isCustomerExp, isBusinessExp]);

	if (router.isFallback) {
		return <div className="lds-dual-ring"></div>;
	}

	return (
		// 	@ts-ignore
		<View style={{ height: "100%" }}>
			<ThemeProvider>
				<ErrorBanner />
				<AppApolloProvider>
					<AppProvider>
						<Wrapper>
							<React.StrictMode>
								<ProgressBar />
								{/* @ts-ignore */}
								<Component {...pageProps} />
							</React.StrictMode>
						</Wrapper>
					</AppProvider>
				</AppApolloProvider>
			</ThemeProvider>
		</View>
	);
};

MyApp.displayName = "_app";

export default appWithTranslation(MyApp);
