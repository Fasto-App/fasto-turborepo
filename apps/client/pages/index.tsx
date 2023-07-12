import React from "react"
import Script from "next/script";
import Link from "next/link";
import { FDSSelect } from "../components/FDSSelect";
import { useRouter } from "next/router";
import { Locale, localeObj } from "app-helpers";
import { Box, HStack } from "native-base";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

export default function Index() {

  const router = useRouter();
  const { t } = useTranslation("landingPage");

  return (
    <>
      <meta charSet="utf-8" />
      <title>
        {t("title")}
      </title>
      <meta
        content={t("description")}
        name="description"
      />
      <meta
        content={(t("og-title"))}
        property="og:title"
      />
      <meta
        content={t("og-description")}
        property="og:description"
      />
      <meta
        content="https://uploads-ssl.webflow.com/6480b8939d58cca063ed09c9/64ad80cc471cc7fb1c560f07_Fasto%20Logo.png"
        property="og:image"
      />
      <meta
        content={(t("og-title"))}
        property="twitter:title"
      />
      <meta
        content={t("og-description")}
        property="twitter:description"
      />
      <meta
        content="https://uploads-ssl.webflow.com/6480b8939d58cca063ed09c9/64ad80cc471cc7fb1c560f07_Fasto%20Logo.png"
        property="twitter:image"
      />
      <meta property="og:type" content="website" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content="Webflow" name="generator" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        href="https://fonts.gstatic.com"
        rel="preconnect"
        crossOrigin="anonymous"
      />
      <link href="html/images/favicon.gif" rel="shortcut icon" type="image/x-icon" />
      <link href="html/images/webclip.png" rel="apple-touch-icon" />
      <div className="page-content" style={{ overflow: "scroll" }}>
        <HStack
          w={"100%"}
          borderColor={"red.500"}
          justifyContent={"flex-end"} p={2}>
          <FDSSelect
            w="100"
            h="8"
            array={localeObj}
            selectedValue={router.locale as Locale}
            setSelectedValue={(value) => {
              const path = router.asPath;
              return router.push(path, path, { locale: value });
            }} />
        </HStack>
        <section className="hero wf-section">
          <div
            data-animation="default"
            data-collapse="small"
            data-duration={400}
            data-easing="ease"
            data-easing2="ease"
            role="banner"
            className="navbar w-nav"
          >
            <div className="w-layout-hflex flex-block-navbar">
              <a
                href="/"
                aria-current="page"
                className="logo w-nav-brand w--current"
              >
                <img
                  src="html/images/Fasto-Logo-White.webp"
                  loading="lazy"
                  sizes="(max-width: 479px) 29vw, (max-width: 767px) 110px, (max-width: 1919px) 120px, 200px"
                  srcSet="html/images/Fasto-Logo-White-p-500.png 500w, html/images/Fasto-Logo-White-p-800.png 800w, html/images/Fasto-Logo-White-p-1080.png 1080w, html/images/Fasto-Logo-White.webp 2847w"
                  alt=""
                  className="image"
                />
              </a>
              <nav role="navigation" className="w-nav-menu">
                <a href="#How-it-works" className="nav-link w-nav-link">
                  {t("how-it-works")}
                </a>
                <a href="#Features-and-benefits" className="nav-link w-nav-link">
                  {(t("features-and-benefits"))}
                </a>
                <a href="#Pricing" className="nav-link w-nav-link">
                  {t("pricing")}
                </a>
                <a href="#Pricing" className="nav-link w-nav-link">
                  {t("partners")}
                </a>
              </nav>
              <a href="business/login" className="link-block w-inline-block">
                <img src="html/images/Login-grad.webp" loading="lazy" alt="" />
              </a>
              <div className="menu-button w-nav-button">
                <div className="icon-3 w-icon-nav-menu" />
              </div>
            </div>
          </div>
          <div
            id="w-node-cad2f904-77a4-6f46-f911-b5731641bd20-63ed09d8"
            className="w-layout-layout hero-stack wf-layout-layout"
          >
            <div
              id="w-node-cad2f904-77a4-6f46-f911-b5731641bd21-63ed09d8"
              className="w-layout-cell hero-cell1"
            >
              <div className="text-hero-wrapper">
                <h1 className="heading">{t("hero-title")}</h1>
                <p className="paragraph">
                  {t("hero-subtitle")}
                </p>
                <a
                  href="business/signup"
                  className="button w-button"
                >
                  {t("hero-cta")}
                </a>
              </div>
            </div>
            <div
              id="w-node-cad2f904-77a4-6f46-f911-b5731641bd22-63ed09d8"
              className="w-layout-cell home-cell-2"
            >
              <img
                src="html/images/Cellphone-Home.webp"
                loading="lazy"
                sizes="(max-width: 479px) 215.625px, 45vw"
                srcSet="html/images/Cellphone-Home-p-500.png 500w, html/images/Cellphone-Home.webp 1003w"
                alt="A cellphone showing Fasto App homepage"
                className="fasto-home-image"
              />
            </div>
          </div>
        </section>
        <section id="How-it-works" className="section wf-section">
          <div className="content-container">
            <h2 className="heading-2">{t("how-it-works-title")}</h2>
            <div className="w-layout-hflex business-features-box">
              <img
                src="html/images/Fasto-iPad.webp"
                loading="lazy"
                sizes="(max-width: 479px) 60vw, 35vw"
                srcSet="html/images/Fasto-iPad-p-500.png 500w, html/images/Fasto-iPad-p-800.png 800w, html/images/Fasto-iPad-p-1080.png 1080w, html/images/Fasto-iPad.webp 1380w"
                alt="iPad displaying a restaurant menu at Fasto App for businesses"
                className="business-features-image"
              />
              <div className="text-wrapper-column">
                <p className="paragraph dark">
                  {(t("how-it-works-subtitle"))}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="section dark wf-section">
          <div className="content-container">
            <img
              src="html/images/Website_Infographic.webp"
              loading="lazy"
              sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, (max-width: 991px) 88vw, (max-width: 1919px) 90vw, 93vw"
              srcSet="html/images/Website_Infographic-p-500.png 500w, html/images/Website_Infographic-p-800.png 800w, html/images/Website_Infographic-p-1080.png 1080w, html/images/Website_Infographic-p-1600.png 1600w, html/images/Website_Infographic-p-2000.png 2000w, html/images/Website_Infographic.webp 3869w"
              alt="Fasto App features"
              className="fasto-business"
            />
          </div>
        </section>
        <section id="Features-and-benefits" className="section wf-section">
          <div className="w-layout-hflex client-feature-box">
            <img
              src="html/images/Fasto-Home.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="html/images/Fasto-Home-p-500.png 500w, html/images/Fasto-Home-p-800.png 800w, html/images/Fasto-Home-p-1080.png 1080w, html/images/Fasto-Home.webp 1482w"
              alt="Fasto App for clients, homepage"
              className="client-features-image"
            />
            <img
              src="html/images/Menu-Fasto.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="html/images/Menu-Fasto-p-500.png 500w, html/images/Menu-Fasto-p-800.png 800w, html/images/Menu-Fasto-p-1080.png 1080w, html/images/Menu-Fasto.webp 1484w"
              alt="Fasto App for customers - menu"
              className="client-features-image"
            />
            <div className="feature-card margin-left">
              <h3 className="heading-3">{t("increased-efficiency")}</h3>
              <p className="paragraph dark">
                {t("increased-efficiency-text")}
              </p>
            </div>
          </div>
          <div className="w-layout-hflex client-feature-box">
            <div className="feature-card margin-right">
              <h3 className="heading-3">{t("flexible-payment")}</h3>
              <p className="paragraph dark">
                {t("flexible-payment-text")}
              </p>
            </div>
            <img
              src="html/images/Checkout-Split-Fasto.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="html/images/Checkout-Split-Fasto-p-500.png 500w, html/images/Checkout-Split-Fasto-p-800.png 800w, html/images/Checkout-Split-Fasto-p-1080.png 1080w, html/images/Checkout-Split-Fasto.webp 1484w"
              alt="Fasto App for customers - split bill"
              className="client-features-image"
            />
            <img
              src="html/images/End-Session-Fasto.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="html/images/End-Session-Fasto-p-500.png 500w, html/images/End-Session-Fasto-p-800.png 800w, html/images/End-Session-Fasto-p-1080.png 1080w, html/images/End-Session-Fasto.webp 1484w"
              alt="Fasto App for customers - end session"
              className="client-features-image"
            />
          </div>
        </section>
        <section className="section dark wf-section">
          <div className="content-container">
            <h2 className="heading-2">
              {t("qa-title")}
            </h2>
            <div className="dropdown-wrapper">
              <div
                data-hover="false"
                data-delay={0}
                className="dropdown w-dropdown"
              >
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle" />
                  <div className="paragraph">
                    {(t("qa-1"))}
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    {(t("qa-1-text"))}
                  </a>
                </nav>
              </div>
              <div data-hover="false" data-delay={0} className="w-dropdown">
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle" />
                  <div className="paragraph">
                    {(t("qa-2"))}
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    {(t("qa-2-text"))}
                  </a>
                </nav>
              </div>
              <div
                data-hover="false"
                data-delay={0}
                className="dropdown w-dropdown"
              >
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle" />
                  <div className="paragraph">
                    {(t("qa-3"))}
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    {(t("qa-3-text"))}
                  </a>
                </nav>
              </div>
              <div
                data-hover="false"
                data-delay={0}
                className="dropdown w-dropdown"
              >
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle" />
                  <div className="paragraph">
                    {(t("qa-4"))}
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    {(t("qa-4-text"))}
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </section>
        <section id="Pricing" className="section wf-section">
          <div className="content-container">
            <h2 className="heading-2">{t("pricing")}</h2>
            <div className="w-layout-hflex pricing-box">
              <div className="pricing-cards">
                <h3 className="heading-3">{t("online-menu")}</h3>
                <h3 className="h3-highlight">{t("free")}</h3>
                <div className="text-block">{t("free-text")}</div>
                <a href="http://business/signup" className="button small w-button">
                  {t("select")}
                </a>
              </div>
              <div className="pricing-cards">
                <h3 className="heading-3">{t("pos-order")}</h3>
                <h3 className="h3-highlight">{t("pos-order-price")}</h3>
                <div className="text-block">
                  {t("pos-order-text")}
                </div>
                <a href="http://business/signup" className="button small w-button">
                  {t("select")}
                </a>
              </div>
              <div className="pricing-cards">
                <h3 className="heading-3">{t("full-service")}</h3>
                <h3 className="h3-highlight">{t("full-service-price")}</h3>
                <div className="text-block">
                  {t("full-service-text")}
                </div>
                <a href="http://business/signup" className="button small w-button">
                  {t("select")}
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="section dark wf-section">
          <div className="content-container">
            <div className="column-3 w-row">
              <div className="w-col w-col-4">
                <a
                  href="/"
                  aria-current="page"
                  className="w-inline-block w--current"
                >
                  <img
                    src="html/images/Fasto-Logo-White.webp"
                    loading="lazy"
                    sizes="(max-width: 1919px) 120px, 200px"
                    srcSet="html/images/Fasto-Logo-White-p-500.png 500w, html/images/Fasto-Logo-White-p-800.png 800w, html/images/Fasto-Logo-White-p-1080.png 1080w, html/images/Fasto-Logo-White.webp 2847w"
                    alt=""
                    className="logo"
                  />
                </a>
              </div>
              <div className="w-col w-col-4">
                <div className="text-highlight">Pages</div>
                <a href="#How-it-works" className="links-footer">
                  {(t("how-it-works"))}
                </a>
                <a href="#Features-and-benefits" className="links-footer">
                  {(t("features-and-benefits"))}
                </a>
                <a href="#Pricing" className="links-footer">
                  {(t("pricing"))}
                </a>
                <a href="#" className="links-footer">
                  {t("partners")}
                </a>
              </div>
              <div className="w-col w-col-4">
                <div className="text-highlight">{t("contact-us")}</div>
                <a href="mailto:fasto.contact@gmail.com" className="links-footer">
                  fasto.contact@gmail.com
                </a>
                <a href="tel:+19173303561" className="links-footer">
                  +19173303561
                </a>
                <a
                  href="https://www.instagram.com/thefastoapp/"
                  target="_blank"
                  className="social-media-icon w-inline-block" rel="noreferrer"
                >
                  <img
                    src="html/images/Insta.webp"
                    loading="lazy"
                    alt=""
                    className="instagram"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/thefastoapp/"
                  target="_blank"
                  className="social-media-icon margin w-inline-block" rel="noreferrer"
                >
                  <img
                    src="html/images/linkedin-white.webp"
                    loading="lazy"
                    alt=""
                    className="linkedin"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="bg-light">
        <div className="big-circle" />
        <div className="medium-circle" />
      </div>
      <Script
        src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6480b8939d58cca063ed09c9"
        strategy="afterInteractive" />
      <Script src="html/js/webflow.js" strategy="lazyOnload" defer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        'landingPage',
      ])),
    },
  };
};

