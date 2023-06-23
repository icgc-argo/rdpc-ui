import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
	matcher: '/_next/static/chunks/app/:page*',
};

export function middleware(request: NextRequest) {
	const authToken = request.cookies.get('EGO_JWT');

	if (request.nextUrl.pathname === '/_next/static/chunks/app/landing-page/page.js' && !authToken) {
		const homepageUrl = request.nextUrl.origin;

		return NextResponse.redirect(homepageUrl);
	}
}
