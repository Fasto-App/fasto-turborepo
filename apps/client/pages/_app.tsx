import '../style.css'
import type { AppProps } from 'next/app';
import React, { Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import { BusinessLayout } from '../business-templates/Layout/BusinessLayout';
import { ClientLayout } from '../client-templates/Layout';
import { ClientNavBar } from '../client-templates/Layout/ClientNavbar';
import { AppProvider } from '../appProvider';
import { BUSINESS, CLIENT } from '../routes';
import { AppApolloProvider } from '../apollo-client/AppApolloProvider';
import { ThemeProvider } from '../theme/ThemeProvider';
import NextNProgress from "nextjs-progressbar";
import { Box, useTheme } from 'native-base';


const LandingWrapper: React.FC = ({ children }) => (
	<Fragment>
		<ClientNavBar />
		{children}
	</Fragment>)


const ProgressBar = () => {
	const theme = useTheme()

	return (
		<NextNProgress
			height={6}
			color={theme.colors.secondary[400]}
			startPosition={0.5}
		/>)
}

const MyApp = ({ Component, pageProps }: AppProps) => {
	console.log(`[🚀 Next APP ] ready on PORT ${3000}`);
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
		<ThemeProvider >
			<Box h={"100vh"}>
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
			</Box>
		</ThemeProvider>
	);
}

MyApp.displayName = "_app"

export default MyApp;
