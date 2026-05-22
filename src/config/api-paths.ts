/**
 * Backend path map — update each path when the real API contract is shared.
 * Base URL: NEXT_PUBLIC_API_URL (see .env.example)
 */
export const apiPaths = {
  auth: {
    /** Create company + initial HR admin account */
    registerCompany: "/auth/register",
    login: "/auth/login",
    /** Current authenticated user */
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  dashboard: {
    /** HRIS module 1 — admin overview (adjust per backend) */
    overview: "/dashboard",
  },
} as const;
