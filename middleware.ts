// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
    sub: string;
    role: string;
    exp: number;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define route types
    const publicRoutes = ['/', '/services', '/staff'];
    const authRoutes = ['/login', '/register'];
    const protectedRoutes = ['/appointments', '/profile', '/dashboard', '/schedule'];
    const staffOnlyRoutes = ['/dashboard', '/schedule'];

    // Always allow access to auth routes and public routes
    const isPublicRoute = publicRoutes.some(route => pathname === route);
    const isAuthRoute = authRoutes.some(route => pathname === route);
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Allow access to auth and public routes without token
    if (isPublicRoute || isAuthRoute) {
        // If user has token and tries to access login/register, redirect them
        if (token && isAuthRoute) {
            try {
                const decoded = jwtDecode<JWTPayload>(token);
                if (decoded.role === 'STAFF') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                } else {
                    return NextResponse.redirect(new URL('/appointments', request.url));
                }
            } catch {
                // Invalid token, let them access login/register
            }
        }
        return NextResponse.next();
    }

    // For protected routes, check if user has token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If token exists for protected routes
    if (token && isProtectedRoute) {
        try {
            // Decode token to get user info
            const decoded = jwtDecode<JWTPayload>(token);
            const currentTime = Date.now() / 1000;

            // Check if token is expired
            if (decoded.exp < currentTime) {
                // Token expired, redirect to login
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('token');
                response.cookies.delete('refreshToken');
                return response;
            }

            // Check role-based access for staff-only routes
            if (staffOnlyRoutes.some(route => pathname.startsWith(route))) {
                if (decoded.role !== 'STAFF') {
                    return NextResponse.redirect(new URL('/appointments', request.url));
                }
            }

        } catch (error) {
            // Invalid token
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            response.cookies.delete('refreshToken');
            return response;
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};