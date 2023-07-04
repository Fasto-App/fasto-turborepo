import React from "react"
import Script from "next/script";
import Link from "next/link";

export default function Index() {

  return (
    <>
      {/*  This site was created in Webflow. https://www.webflow.com  */}
      {/*  Last Published: Sun Jul 02 2023 19:13:39 GMT+0000 (Coordinated Universal Time)  */}
      <meta charSet="utf-8" />
      <title>Fasto</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content="Webflow" name="generator" />
      {/* <a href="css/normalize.css" rel="stylesheet" type="text/css" />
      <a href="css/webflow.css" rel="stylesheet" type="text/css" />
      <a href="css/fasto.webflow.css" rel="stylesheet" type="text/css" /> */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        href="https://fonts.gstatic.com"
        rel="preconnect"
        crossOrigin="anonymous"
      />
      <a href="html/images/favicon.gif" rel="shortcut icon" type="image/x-icon" />
      <a href="html/images/webclip.png" rel="apple-touch-icon" />
      <div className="page-content" style={{ overflow: "scroll" }}>
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
                href="index.html"
                aria-current="page"
                className="logo w-nav-brand w--current"
              >
                <img
                  src="/html/images/Fasto-Logo-White.webp"
                  loading="lazy"
                  srcSet="
                  html/images/Fasto-Logo-White-p-500.png   500w,
                  html/images/Fasto-Logo-White-p-800.png   800w,
                  html/images/Fasto-Logo-White-p-1080.png 1080w,
                  html/images/Fasto-Logo-White.webp       2847w
                  "
                  alt=""
                  className="image"
                />
              </a>
              <nav role="navigation" className="w-nav-menu">
                <Link href={"#How-it-works"}>
                  <div className="nav-link w-nav-link">
                    How it Works
                  </div>
                </Link>
                <Link href={"#Features-and-benefits"}>
                  <div className="nav-link w-nav-link">
                    Features and Benefits
                  </div>
                </Link>
                <Link href={"#Pricing"}>
                  <div className="nav-link w-nav-link">
                    Pricing
                  </div>
                </Link>
                <Link href={"partners"}>

                  <div className="nav-link w-nav-link">
                    Partners
                  </div>
                </Link>
              </nav>
              <a
                href="/business/login"
                className="link-block w-inline-block"
              >
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
                <h1 className="heading">THE SMARTEST WAY TO PLACE YOUR ORDER</h1>
                <p className="paragraph">
                  Fasto is a powerful web app that revolutionizes the ordering
                  experience, enhancing client satisfaction while boosting business
                  efficiency.
                </p>
                <a
                  href="business/signup"
                  className="button w-button"
                >
                  CREATE AN ACCOUNT
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
            <h2 className="heading-2">the ultimate solution for your business</h2>
            <div className="w-layout-hflex business-features-box">
              <img
                src="html/images/Fasto-iPad.webp"
                loading="lazy"
                sizes="(max-width: 479px) 60vw, 35vw"
                srcSet="
							html/images/Fasto-iPad-p-500.png   500w,
							html/images/Fasto-iPad-p-800.png   800w,
							html/images/Fasto-iPad-p-1080.png 1080w,
							html/images/Fasto-iPad.webp       1380w
							"
                alt="iPad displaying a restaurant menu at Fasto App for businesses"
                className="business-features-image"
              />
              <div className="text-wrapper-column">
                <p className="paragraph dark">
                  With our user-friendly interface and powerful features, you'll
                  have everything you need to manage your business with ease.
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
              sizes="(max-width: 479px) 83vw, (max-width: 767px) 90vw, (max-width: 991px) 84vw, (max-width: 1919px) 90vw, 93vw"
              srcSet="
						html/images/Website_Infographic-p-500.png   500w,
						html/images/Website_Infographic-p-800.png   800w,
						html/images/Website_Infographic-p-1080.png 1080w,
						html/images/Website_Infographic-p-1600.png 1600w,
						html/images/Website_Infographic-p-2000.png 2000w,
						html/images/Website_Infographic.webp       3869w
						"
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
              srcSet="
						html/images/Fasto-Home-p-500.png   500w,
						html/images/Fasto-Home-p-800.png   800w,
						html/images/Fasto-Home-p-1080.png 1080w,
						html/images/Fasto-Home.webp       1482w
						"
              alt="Fasto App for clients, homepage"
              className="client-features-image"
            />
            <img
              src="html/images/Fasto-Menu.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="
						html/images/Fasto-Menu-p-500.png   500w,
						html/images/Fasto-Menu-p-800.png   800w,
						html/images/Fasto-Menu-p-1080.png 1080w,
						html/images/Fasto-Menu.webp       1484w
						"
              alt="Fasto App for clients, menu page"
              className="client-features-image"
            />
            <div className="feature-card margin-left">
              <h3>Increased Efficiency</h3>
              <p className="paragraph dark">
                Streamline the purchasing process for users, resulting in faster
                transactions and increased efficiency for both customers and
                businesses.
              </p>
            </div>
          </div>
          <div className="w-layout-hflex client-feature-box">
            <div className="feature-card margin-right">
              <h3>Flexible Bill Splitting</h3>
              <p className="paragraph dark">
                Customers can enjoy greater flexibility and convenience when paying
                for their purchases, leading to a more positive overall shopping
                experience and potentially increasing customer loyalty
              </p>{" "}
            </div>
            <img
              src="html/images/Fasto-Checkout.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="
						html/images/Fasto-Checkout-p-500.png   500w,
						html/images/Fasto-Checkout-p-800.png   800w,
						html/images/Fasto-Checkout-p-1080.png 1080w,
						html/images/Fasto-Checkout.webp       1484w
						"
              alt="Fasto App for clients, splitting bill page"
              className="client-features-image"
            />
            <img
              src="html/images/Fasto-End-Session.webp"
              loading="lazy"
              sizes="(max-width: 479px) 35vw, 25vw"
              srcSet="
						html/images/Fasto-End-Session-p-500.png   500w,
						html/images/Fasto-End-Session-p-800.png   800w,
						html/images/Fasto-End-Session-p-1080.png 1080w,
						html/images/Fasto-End-Session.webp       1484w
						"
              alt="Fasto App for clients, ending session page"
              className="client-features-image"
            />
          </div>
        </section>
        <section className="section dark wf-section">
          <div className="content-container">
            <h2>
              DESIGNED TO PROVIDE THE BEST EXPERIENCE fOR both Business and
              customers
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
                    What types of businesses can benefit from your POS system?
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    Our POS system is suitable for businesses of all sizes and
                    types, including restaurants, cafes, bars, food trucks, and
                    more.
                  </a>
                </nav>
              </div>
              <div data-hover="false" data-delay={0} className="w-dropdown">
                <div className="dropdown-toggle w-dropdown-toggle">
                  <div className="icon w-icon-dropdown-toggle" />
                  <div className="paragraph">
                    Can your POS system handle online ordering and delivery?
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    Yes, our POS system offers online ordering and delivery
                    integration, making it easy for businesses to manage their
                    orders and fulfill deliveries.
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
                    How much does your POS system cost?
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    Our POS system is competitively priced and can be customized to
                    fit your specific business needs. Please contact us for pricing
                    details and to schedule a demo.
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
                    What kind of support do you offer for your POS system?
                  </div>
                </div>
                <nav className="w-dropdown-list">
                  <a href="#" className="dropdown-link w-dropdown-link">
                    We offer comprehensive support and training for our POS system,
                    including onboarding, technical assistance, and ongoing customer
                    support. Our team is committed to delivering exceptional service
                    and support to our clients.
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </section>
        <section id="Pricing" className="section wf-section">
          <div className="content-container">
            <h2>pricing</h2>
            <div className="w-layout-hflex pricing-box">
              <div className="pricing-cards">
                <h3>ONLINE MENU</h3>
                <h3 className="h3-highlight">FREE</h3>
                <div className="text-block">Access to 1 online menu.</div>
                <a
                  href="https://www.fastoapp.com/business/signup"
                  target="_blank"
                  className="button small w-button" rel="noreferrer"
                >Select</a>
              </div>
              <div className="pricing-cards">
                <h3>POS/ORDER</h3>
                <h3 className="h3-highlight">$59</h3>
                <div className="text-block">
                  Access to 3 Online Menus
                  <br />
                  Management System
                  <br />
                  Quick Sale
                  <br />
                  Payment Breakdown
                  <br />
                  Basic Analytics
                </div>
                <a
                  href="https://www.fastoapp.com/business/signup"
                  target="_blank"
                  className="button small w-button" rel="noreferrer"
                >Select</a>
              </div>
              <div className="pricing-cards">
                <h3>FULL SERVICE</h3>
                <h3 className="h3-highlight">$249</h3>
                <div className="text-block">
                  All previous perks
                  <br />
                  Unlimited Online Menus
                  <br />
                  Full Analytics
                  <br />
                  Ordering System
                </div>
                <a
                  href="https://www.fastoapp.com/business/signup"
                  target="_blank"
                  className="button small w-button" rel="noreferrer"
                >Select</a>
              </div>
            </div>
          </div>
        </section>
        <section className="section dark wf-section">
          <div className="content-container">
            <div className="column-3 w-row">
              <div className="w-col w-col-4">
                <a
                  href="index.html"
                  aria-current="page"
                  className="w-inline-block w--current"
                >
                  <img
                    src="html/images/Fasto-Logo-White.webp"
                    loading="lazy"
                    sizes="120px"
                    srcSet="
									html/images/Fasto-Logo-White-p-500.png   500w,
									html/images/Fasto-Logo-White-p-800.png   800w,
									html/images/Fasto-Logo-White-p-1080.png 1080w,
									html/images/Fasto-Logo-White.webp       2847w
									"
                    alt=""
                    className="logo"
                  />
                </a>
              </div>
              <div className="w-col w-col-4">
                <div className="text-highlight">Pages</div>
                <a href="#How-it-works" className="links-footer">
                  How it Works
                </a>
                <a href="#Features-and-benefits" className="links-footer">
                  Features and Benefits
                </a>
                <a href="#Pricing" className="links-footer">
                  Pricing
                </a>
                <a href="#" className="links-footer">
                  Become an Investor
                </a>
              </div>
              <div className="w-col w-col-4">
                <div className="text-highlight">Contact</div>
                <a href="mailto:info@fastoapp.com" className="links-footer">
                  info@fastoapp.com
                </a>
                <a href="tel:+19173303561" className="links-footer">
                  +19173303561
                </a>
                <a
                  href="https://www.instagram.com/thefastoapp/"
                  target="_blank"
                  className="social-media-icon w-inline-block" rel="noreferrer"
                ><img src="html/images/Insta.webp" loading="lazy" alt="" className="instagram"
                  /></a>
                <a
                  href="https://www.linkedin.com/company/thefastoapp/"
                  target="_blank"
                  className="social-media-icon margin w-inline-block" rel="noreferrer"
                ><img src="html/images/linkedin-white.webp" loading="lazy" alt="" className="linkedin"
                  /></a>
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
