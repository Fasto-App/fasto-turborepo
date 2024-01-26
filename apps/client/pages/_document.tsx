import React from "react";
import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document";

//@ts-ignore
class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
			styles: <>{initialProps.styles}</>,
		};
	}

	render() {
		return (
			<Html>
				<Head>
					{/* Failed attempt to move the address bar on scroll using ChatGPT */}
					{/* Warning: viewport meta tags should not be used in _document.js's <Head>. https://nextjs.org/docs/messages/no-document-viewport-meta */}
					{/* <meta name="viewport" content="height=device-height, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> */}

					{/* ADDED FROM NEXT-PWA  */}
					<meta name="application-name" content="Fasto" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-title" content="Fasto" />
					<meta
						name="description"
						content="The Smartest and Fastest Way to Order"
					/>
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="msapplication-config" content="/browserconfig.xml" />
					<meta name="msapplication-TileColor" content="#d56f5b" />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta name="theme-color" content="#d56f5b" />
					{/* END */}
					{/* ADDED FROM GOOGLE PWA */}
					<meta name="theme-color" content="black" />
					<meta name="theme-color" content="black" />
					{/* END */}
					{/*  */}
					{/* <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" /> */}
					<link rel="apple-touch-icon" sizes="152x152" href="/ios/152.png" />
					<link rel="apple-touch-icon" sizes="180x180" href="/ios/180.png" />
					<link rel="apple-touch-icon" sizes="167x167" href="/ios/167.png" />
					<link rel="icon" type="image/png" sizes="32x32" href="/ios/32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/ios/16.png" />
					<link rel="manifest" href="/manifest.json" />
					<link rel="mask-icon" href="/images/fasto-logo.svg" color="#d56f5b" />
					<link rel="shortcut icon" href="/favicon.ico" />
					{/* ADDED FROM NEXT-PWA */}
					<meta name="twitter:card" content="summary" />
					<meta name="twitter:url" content={process.env.FRONTEND_URL} />
					<meta name="twitter:title" content="Fasto" />
					<meta
						name="twitter:description"
						content="The Smartest and Fastest Way to Order"
					/>
					<meta
						name="twitter:image"
						content={`${process.env.FRONTEND_URL}/ios/192.png`}
					/>
					<meta name="twitter:creator" content="@mendesbr__" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="Fasto" />
					<meta
						property="og:description"
						content="The Smartest and Fastest Way to Order"
					/>
					<meta property="og:site_name" content="Fasto" />
					<meta property="og:url" content={process.env.FRONTEND_URL} />
					<meta
						property="og:image"
						content={`${process.env.FRONTEND_URL}/ios/180.png`}
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
				<div id="portal" />
			</Html>
		);
	}
}

export default MyDocument;
