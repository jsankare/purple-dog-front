import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value;
  const { pathname } = request.nextUrl;
  
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
  ],
};
