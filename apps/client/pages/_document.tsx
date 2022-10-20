import React from 'react'
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
          {/* ADDED FROM NEXT-PWA  */}
          <meta name="application-name" content="OpenTab" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="apple-mobile-web-app-title" content="OpenTab" />
          <meta name="description" content="The Smartest and Fastest Way to Order" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#90cdf4" />
          {/* END */}
          {/* ADDED FROM GOOGLE PWA */}
          <meta
            name="theme-color"
            content="black"
          />
          <meta
            name="theme-color"
            content="black"
          />
          {/* END */}
          {/*  */}
          <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/touch-icon-ipad.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/touch-icon-iphone-retina.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icons/touch-icon-ipad-retina.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          {/* ADDED FROM NEXT-PWA */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content={process.env.FRONTEND_PROD_URL} />
          <meta name="twitter:title" content="OpenTab" />
          <meta
            name="twitter:description"
            content="The Smartest and Fastest Way to Order"
          />
          <meta
            name="twitter:image"
            content="https://yourdomain.com/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@DavidWShadow" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="OpenTab" />
          <meta property="og:description" content="The Smartest and Fastest Way to Order" />
          <meta property="og:site_name" content="OpenTab" />
          <meta property="og:url" content={process.env.FRONTEND_PROD_URL} />
          <meta
            property="og:image"
            content="https://yourdomain.com/icons/apple-touch-icon.png"
          />
          {/* END */}
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
