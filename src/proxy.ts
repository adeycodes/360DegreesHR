import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { routes } from "@/config/routes";
import {
  isAuthEntryPath,
  isProtectedAppPath,
  isPublicPath,
} from "@/lib/utilities";

const AUTH_COOKIE = "auth_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAuthenticated = Boolean(token);

  if (pathname === routes.home) {
    const target = isAuthenticated ? routes.app.dashboard : routes.splash;
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (isPublicPath(pathname)) {
    if (isAuthenticated && isAuthEntryPath(pathname)) {
      return NextResponse.redirect(new URL(routes.app.dashboard, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && isProtectedAppPath(pathname)) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

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
