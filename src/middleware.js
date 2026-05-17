// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
    // Cookie que emite el backend: 'access_token'
    const token = request.cookies.get('access_token')?.value;

    const { pathname } = request.nextUrl;

    // Proteger rutas del dashboard
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Evitar que un usuario autenticado entre a /auth/login
    if (pathname.startsWith('/auth/login') && token) {
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*',
    ],
};