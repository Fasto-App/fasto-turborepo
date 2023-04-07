import '../style.css'
import type { AppProps } from 'next/app';
import React, { Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import { BusinessLayout } from '../business-templates/Layout/BusinessLayout';
import { ClientLayout } from '../client-templates/Layout';
import { AppProvider } from '../appProvider';
import { BUSINESS, CLIENT } from '../routes';
import { AppApolloProvider } from '../apollo-client/AppApolloProvider';
import { ThemeProvider } from '../theme/ThemeProvider';
import NextNProgress from "nextjs-progressbar";
import { useTheme } from 'native-base';
import { ModalFeedback } from '../components/ModalFeedback';
import { View } from 'react-native';
import { ErrorBanner } from '../components/ErrorBanner';


const LandingWrapper: React.FC = ({ children }) => (
	<Fragment>
		{children}
	</Fragment>)


const ProgressBar = () => {
	const theme = useTheme()

	return (
		<NextNProgress
			height={6}
			color={theme.colors.secondary[400]}
			startPosition={0.8}
		/>)
}

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const isBusinessExp = router.route.includes(BUSINESS);
	const isClientExp = router.route.includes(CLIENT);

	const Wrapper = useMemo(() => {
		if (isClientExp) {
			return ClientLayout
		} else if (isBusinessExp) {
			return BusinessLayout
		}

		return LandingWrapper

	}, [isClientExp, isBusinessExp])

	return (
		<View style={{ height: "100%" }}>
			<ThemeProvider >
				<ErrorBanner />
				<AppApolloProvider>
					<AppProvider>
						<Wrapper>
							<React.StrictMode>
								<ProgressBar />
								<Component {...pageProps} />
							</React.StrictMode>
						</Wrapper>
					</AppProvider>
				</AppApolloProvider>

				<ModalFeedback />
			</ThemeProvider>
		</View>
	);
}

MyApp.displayName = "_app"

export default MyApp;
