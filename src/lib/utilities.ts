// ============================================================================
// CONSOLIDATED UTILITIES
// This file combines all utility modules to reduce file count
// ============================================================================

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ZodError } from "zod"
import type { DashboardOverview } from "@/lib/validations/dashboard"

// ============================================================================
// CLASSNAME UTILITIES
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// AUTH UTILITIES - Session token management
// ============================================================================

const TOKEN_KEY = "auth_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getAuthHeader(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ============================================================================
// FORM UTILITIES - Zod error handling
// ============================================================================

export function fieldErrorsFromZod<T extends Record<string, string>>(error: ZodError): Partial<T> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    if (issue.path.length > 0) {
      const key = issue.path[0] as string;
      errors[key] = issue.message;
    }
  }
  return errors as Partial<T>;
}

// ============================================================================
// ROUTING UTILITIES - Path checkers for middleware
// ============================================================================

import { publicPaths } from "@/config/routes";

export const PROXY_HRIS_PAGES = [
  "recruitment",
  "onboarding",
  "time",
  "performance",
  "learning",
  "succession",
  "compensation",
  "benefits",
  "workforce-planning",
  "employee-experience",
  "analytics",
] as const;

export type ProxyHrisPage = typeof PROXY_HRIS_PAGES[number];

export function isProxyHrisPage(section: string): section is ProxyHrisPage {
  return PROXY_HRIS_PAGES.includes(section as ProxyHrisPage);
}

/**
 * Check if a path is public (unauthenticated access allowed)
 */
export function isPublicPath(pathname: string): boolean {
  return publicPaths.some(path => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  });
}

/**
 * Check if a path is an auth entry point (login, register, etc.)
 * These redirect authenticated users to dashboard
 */
export function isAuthEntryPath(pathname: string): boolean {
  return [
    "/login",
    "/login/password",
    "/register",
    "/forgot-password",
    "/forgot-password/sent",
    "/reset-password",
  ].some(path => pathname.startsWith(path));
}

/**
 * Check if a path requires authentication (protected app routes)
 */
export function isProtectedAppPath(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || 
         pathname.startsWith("/hris") ||
         pathname.startsWith("/app");
}

// ============================================================================
// DESIGN SYSTEM UTILITIES - Color types
// ============================================================================

export type ColorScaleKey = 50 | 100 | 200 | 300 | 400 | 500;
export type ColorScale = {
  name: string;
  scale: Record<ColorScaleKey, string>;
  tokenPrefix: string;
};

// ============================================================================
// MOCK DATA - Dashboard
// ============================================================================

export const mockDashboardData: DashboardOverview = {
  stats: [
    { label: "Total Employees", value: "1,234", change: "+12%" },
    { label: "Pending Approvals", value: 23, change: "-5%" },
    { label: "Open Positions", value: 18, change: "+3%" },
    { label: "Attendance Rate", value: "94.5%", change: "+1.2%" },
  ],
  pendingApprovals: 23,
  recentActivity: [
    { id: "1", title: "New employee onboarded", timestamp: "2 hours ago" },
    { id: "2", title: "Performance review completed", timestamp: "5 hours ago" },
    { id: "3", title: "Leave request approved", timestamp: "1 day ago" },
  ],
};
