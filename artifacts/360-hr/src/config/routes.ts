/** Central route map — use these constants instead of hardcoded paths */

export const routes = {
  home: "/",
  splash: "/splash",
  designSystem: "/design-system",

  auth: {

    login: "/login",
    loginPassword: "/login/password",
    register: "/register",
    forgotPassword: "/forgot-password",
    forgotPasswordSent: "/forgot-password/sent",
    resetPassword: "/reset-password",
  },

  app: {
    dashboard: "/dashboard",
  },

  hris: {
    root: "/hris",
    employees: "/hris/employees_directory",
    organization_structure: "/hris/organization_structure",
    reports: "/hris/reports",
  },



} as const;

/** Unauthenticated access allowed (prefix match except `/` which is exact only) */
export const publicPaths = [
  routes.home,
  routes.splash,
  routes.designSystem,
  routes.auth.login,
  routes.auth.loginPassword,
  routes.auth.register,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
] as const;
