import NextAuth from 'next-auth';
import { authConfig } from './lib/auth.config';

export default NextAuth(authConfig).auth;

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
