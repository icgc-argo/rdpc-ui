import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
	matcher: '/_next/static/chunks/app/:page*',
};

const rootPath = `/_next/static/chunks/app/page.js`;
const layoutPath = `/_next/static/chunks/app/layout.js`;
const loginPath = `/_next/static/chunks/app/logging-in/page.js`;

// paths not requiring auth
const openPaths = [rootPath, layoutPath, loginPath];

export default function middleware(request: NextRequest) {
	const hasToken = request.cookies.has('EGO_JWT');
	const response = NextResponse.next();
	const { pathname } = request.nextUrl;

	if (!hasToken && !openPaths.includes(pathname)) {
		const homepageUrl = request.nextUrl.origin;

		return NextResponse.redirect(homepageUrl);
	}

	return response;
}
