import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { businessCookies } from "./cookies/businessCookies";
import { businessRoute, BUSINESS_ADMIN } from "fasto-route";

export const deleteCookie = (
	request: NextRequest,
	response: NextResponse,
	cookie: string,
) => {
	const { value, options } = request.cookies.getWithOptions(cookie);
	if (value) {
		response.cookies.set(cookie, value, options);
		response.cookies.delete(cookie);
	}
};

// you just call next() method to contious middlerware chain or call nextjs default middleware. your blog website file.
export function middleware(
	request: NextRequest,
	event: NextFetchEvent,
	cookie: string,
) {
	// APP URL's
	const LOGIN_URL = getLoginURL();
	const DASHBOARD_URL = getDashboardUrl();

	const requestCookiesToken = request.cookies.get(businessCookies.token);

	if (
		process.env.NEXT_PUBLIC_ENVIRONMENT !== "development" &&
		request.headers.get("x-forwarded-proto") !== "https"
	) {
		return NextResponse.redirect(
			`https://www.${process.env.HOST_NAME}${request.nextUrl.pathname}`,
			301,
		);
	}

	// Auth routes, if token is valid navigate to DASHBOARD
	if (
		request.nextUrl.pathname.startsWith(businessRoute.login) ||
		request.nextUrl.pathname.startsWith(businessRoute.signup) ||
		request.nextUrl.pathname.startsWith(businessRoute["forgot-password"]) ||
		request.nextUrl.pathname.startsWith(businessRoute["reset-password"]) ||
		request.nextUrl.pathname.startsWith(businessRoute["create-account"])
	) {
		const {
			nextUrl: { search },
		} = request;
		const urlSearchParams = new URLSearchParams(search);
		const params = Object.fromEntries(urlSearchParams.entries());

		// if there's a token in the request cookies, send to dashboard
		if (requestCookiesToken) {
			return NextResponse.redirect(DASHBOARD_URL);
		}

		// if there's a token in the query params, create or reset
		// if there's a token in the query params, they either forgot password or reset password

		if (
			request.nextUrl.pathname.startsWith(businessRoute["create-account"]) ||
			request.nextUrl.pathname.startsWith(businessRoute["reset-password"])
		) {
			const { token, email } = params;

			if (token && email) {
				// TODO: validate token
				// const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(secret))

				// console.log("PAYLOAD MIDDLEWARE", payload)

				const response = NextResponse.next();

				return response;
			} else {
				return NextResponse.redirect(LOGIN_URL);
			}
		}
	}

	// Busines/Admin routes, check if user is valid and move forward
	// otherwise, navigate back to LOGIN
	if (request.nextUrl.pathname.startsWith(BUSINESS_ADMIN)) {
		if (requestCookiesToken) {
			try {
				// const { payload } = await jose.jwtVerify(requestCookiesToken, new TextEncoder().encode(secret))

				return NextResponse.next();
			} catch {
				const response = NextResponse.next();
				deleteCookie(request, response, "opentab-cookies-token");
				return response;
			}
		}

		return NextResponse.redirect(LOGIN_URL);
	}

	return NextResponse.next();

	function getLoginURL() {
		const loginUrl = request.nextUrl.clone();
		loginUrl.pathname = businessRoute.login;
		return loginUrl;
	}

	function getDashboardUrl() {
		const dashBoardUrl = request.nextUrl.clone();
		dashBoardUrl.pathname = businessRoute.dashboard;
		return dashBoardUrl;
	}
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//  ## Setting cookies on the response
//   const response = NextResponse.next()
//   response.cookies.set('vercel', 'fast')
//   response.cookies.set('vercel', 'fast', { path: '/test' })

//   // Getting cookies from the request
//   const cookie = request.cookies.get('vercel')
//
//   const allCookies = request.cookies.entries()
//
//   const { value, options } = response.cookies.getWithOptions('vercel')
//
//

//   // Deleting cookies
//   response.cookies.delete('vercel')
//   response.cookies.clear()

//   return response
// }
