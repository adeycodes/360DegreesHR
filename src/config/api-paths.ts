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
    resetPassword: (token: string) => `/auth/reset-password?token=${token}`,
  },
  dashboard: {
    overview: "/dashboard",
    hris: {
      // CHANGE THESE to match the backend docs (/employees)
      employee_directory: "/employees",
      // This will now correctly resolve to /employees/{id}
      employee: (id: string) => `/employees/${id}`,
      organization_structure: "/hris/organization_structure",
      reports: "/hris/reports",
    },
  },
} as const;
