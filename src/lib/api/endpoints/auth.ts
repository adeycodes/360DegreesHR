import { apiPaths } from "@/config/api-paths";
import { get, post } from "@/lib/api/client";
import { getAuthHeader } from "@/lib/utilities";
import {
  authSessionSchema,
  registerResponseSchema,
  authUserSchema,
  meResponseSchema,
  messageResponseSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterCompanyInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { dashboardOverviewSchema } from "@/lib/validations/dashboard";

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const authApi = {
  /** Register a new company + admin account → returns session */
  registerCompany: (input: RegisterCompanyInput) =>
    post(apiPaths.auth.registerCompany, registerResponseSchema, input),

  /** Login with email & password → returns session */
  login: (input: LoginInput) =>
    post(apiPaths.auth.login, authSessionSchema, {
      userEmail: input.email,
      password: input.password,
    }),

  /** Get the currently logged-in user (needs token) */
  me: () =>
    get(apiPaths.auth.me, meResponseSchema, { headers: getAuthHeader() }),

  /** Request a password-reset email */
  forgotPassword: (input: ForgotPasswordInput) =>
    post(apiPaths.auth.forgotPassword, messageResponseSchema, input),

  /** Set new password using the reset token */
  resetPassword: (input: ResetPasswordInput) =>
    post(apiPaths.auth.resetPassword, messageResponseSchema, input),
};

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

export const dashboardApi = {
  /** Fetch the admin dashboard overview */
  getOverview: () =>
    get(apiPaths.dashboard.overview, dashboardOverviewSchema, {
      headers: getAuthHeader(),
    }),
};
