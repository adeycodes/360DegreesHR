import { publicPaths, routes } from "@/config/routes";

/** Paths where an authenticated user should skip auth marketing (splash/login/register) */
export const authEntryPaths = [
  routes.home,
  routes.splash,
  routes.auth.login,
  routes.auth.loginPassword,
  routes.auth.register,
] as const;

export function isPublicPath(pathname: string): boolean {
  return publicPaths.some((path) => {
    if (path === routes.home) {
      return pathname === routes.home;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  });
}

export function isAuthEntryPath(pathname: string): boolean {
  return authEntryPaths.some(
    (path) => pathname === path || (path !== routes.home && pathname.startsWith(`${path}/`)),
  );
}

export function isProtectedAppPath(pathname: string): boolean {
  return (
    pathname === routes.app.dashboard ||
    pathname.startsWith(`${routes.app.dashboard}/`) ||
    pathname === routes.hris.root ||
    pathname.startsWith(`${routes.hris.root}/`)
  );
}
