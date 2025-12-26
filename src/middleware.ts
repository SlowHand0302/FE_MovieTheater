import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoute = ['/admin/', '/profile'];
const publicRoute = ['/login', '/signup'];

export async function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get('refresh_token')?.value;
    const { pathname } = req.nextUrl;

    if (publicRoute.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (protectedRoute.some((route) => pathname.startsWith(route))) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);

        console.log(refreshToken);

        if (refreshToken) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/profile', '/login', '/signup', '/:path*'],
};
