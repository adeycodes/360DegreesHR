import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { publicPaths, routes } from "@/config/routes";

const AUTH_COOKIE = "auth_token";

// Paths where an authenticated user should skip auth pages (splash/login/register)
const authEntryPaths = [
  routes.home,
  routes.splash,
  routes.auth.login,
  routes.auth.loginPassword,
  routes.auth.register,
] as const;

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => {
    if (path === routes.home) return pathname === routes.home;
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

function isAuthEntryPath(pathname: string): boolean {
  return authEntryPaths.some(
    (path) => pathname === path || (path !== routes.home && pathname.startsWith(`${path}/`)),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  // Root: send authenticated users to the dashboard, everyone else to splash
  if (pathname === routes.home) {
    const target = isAuthenticated ? routes.app.dashboard : routes.splash;
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Public paths: allow through, but redirect already-authenticated users
  // away from login/register entry points
  if (isPublicPath(pathname)) {
    if (isAuthenticated && isAuthEntryPath(pathname)) {
      return NextResponse.redirect(new URL(routes.app.dashboard, request.url));
    }
    return NextResponse.next();
  }

  // Everything else is a protected route — require a valid token
  if (!isAuthenticated) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
