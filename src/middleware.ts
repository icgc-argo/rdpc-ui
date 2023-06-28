import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
	matcher: '/_next/static/chunks/app/:page*',
};

export default function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const hasToken = request.cookies.has('EGO_JWT');

	if (!hasToken && request.nextUrl.pathname === `/_next/static/chunks/app/landing-page/page.js`) {
		const homepageUrl = request.nextUrl.origin;

		return NextResponse.redirect(homepageUrl);
	}

	return response;
}
