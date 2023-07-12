import React from 'react';

export default function NotFound() {
  return (
    <>
      {/*  This site was created in Webflow. https://www.webflow.com  */}
      {/*  Last Published: Wed Jul 12 2023 16:11:46 GMT+0000 (Coordinated Universal Time)  */}
      <meta charSet="utf-8" />
      <title>Not Found</title>
      <meta content="Not Found" property="og:title" />
      <meta content="Not Found" property="twitter:title" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content="Webflow" name="generator" />
      {/* <link href="css/normalize.css" rel="stylesheet" type="text/css" />
      <link href="css/webflow.css" rel="stylesheet" type="text/css" />
      <link href="css/fasto.webflow.css" rel="stylesheet" type="text/css" /> */}
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link
        href="https://fonts.gstatic.com"
        rel="preconnect"
        crossOrigin="anonymous"
      />
      <link href="images/favicon.gif" rel="shortcut icon" type="image/x-icon" />
      <link href="images/webclip.png" rel="apple-touch-icon" />
      <div className="utility-page-wrap">
        <div className="utility-page-content">
          <img
            src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg"
            alt=""
          />
          <h2>Page Not Found</h2>
          <div className="text-block-2">
            The page you are looking for doesn't exist or has been moved
          </div>
        </div>
      </div>
    </>

  );
}