import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith('/login') ||
      req.nextUrl.pathname.startsWith('/register');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return null;
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // We handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/inventory/:path*',
    '/crm/:path*',
    '/sales/:path*',
    '/purchases/:path*',
    '/finance/:path*',
    '/hr/:path*',
    '/projects/:path*',
    '/documents/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
};
