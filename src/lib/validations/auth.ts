/**
 * Auth validations re-export
 * All auth-related schemas and types are defined in index.ts
 * This file provides a convenient import path
 */

export {
  authUserSchema,
  authSessionSchema,
  messageResponseSchema,
  registerCompanySchema,
  meResponseSchema,
  dashboardOverviewSchema,
  type AuthUser,
  type AuthSession,
  type LoginInput,
  type RegisterCompanyInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type RegisterCompanyResponse,
  type MeResponse,
} from './index';
