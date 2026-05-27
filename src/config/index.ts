// ============================================================================
// CONSOLIDATED CONFIGURATION
// This file combines all configuration modules to reduce file count
// ============================================================================

// ============================================================================
// API PATHS
// ============================================================================

export const apiPaths = {
  auth: {
    registerCompany: "/auth/register",
    login: "/auth/login",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  dashboard: {
    overview: "/dashboard",
  },
} as const;

// ============================================================================
// ROUTES
// ============================================================================

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
    employees: "/hris/employees",
    employee: (id: string) => `/hris/employees/${id}`,
    departments: "/hris/departments",
    documents: "/hris/documents",
    disciplinary: "/hris/disciplinary",
  },
} as const;

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

// ============================================================================
// HRIS PAGES
// ============================================================================

export const hrisPages = {
  employees: {
    title: "Employees",
    description: "Central employee profiles, employment history, and org assignment.",
    estimatedScreens: "12–15 (module total)",
  },
  departments: {
    title: "Departments",
    description: "Organizational structure, teams, and reporting lines.",
    estimatedScreens: "12–15 (module total)",
  },
  documents: {
    title: "Documents",
    description: "Employee document vault, contracts, and compliance files.",
    estimatedScreens: "12–15 (module total)",
  },
  disciplinary: {
    title: "Disciplinary",
    description: "Cases, warnings, and disciplinary action records.",
    estimatedScreens: "12–15 (module total)",
  },
} as const;

export type HrisPageSection = keyof typeof hrisPages;

export function isHrisPageSection(value: string): value is HrisPageSection {
  return value in hrisPages;
}

// ============================================================================
// MVP MODULES & USER ROLES
// ============================================================================

export const userRoles = ["hr_admin", "manager", "employee"] as const;
export type UserRole = (typeof userRoles)[number];

export const mvpModules = [
  {
    id: "hris",
    name: "HRIS",
    description: "Central employee database — profiles, history, documents, disciplinary records, org structure.",
    status: "active" as const,
    estimatedScreens: "12–15",
    basePath: "/hris",
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "Requisitions, pipeline, interviews, hiring decisions.",
    status: "planned" as const,
    estimatedScreens: "10–12",
    basePath: "/recruitment",
  },
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Offer letters, documents, profile creation, first login.",
    status: "planned" as const,
    estimatedScreens: "8–10",
    basePath: "/onboarding",
  },
  {
    id: "payroll",
    name: "Payroll",
    description: "Salary config, deductions, summaries, payslips.",
    status: "planned" as const,
    estimatedScreens: "10–12",
    basePath: "/payroll",
  },
  {
    id: "leave",
    name: "Leave",
    description: "Leave types, balances, approvals, calendar.",
    status: "planned" as const,
    estimatedScreens: "8–10",
    basePath: "/leave",
  },
  {
    id: "analytics",
    name: "Dashboard & Analytics",
    description: "Role-based dashboards and overview metrics.",
    status: "active" as const,
    estimatedScreens: "10–12",
    basePath: "/dashboard",
  },
] as const;

export type MvpModuleId = (typeof mvpModules)[number]["id"];

// ============================================================================
// NAVIGATION
// ============================================================================

export type NavItem = {
  title: string;
  href?: string;
  icon: string;
  children?: { title: string; href: string }[];
  comingSoon?: boolean;
};

const hrisChildren = [
  { title: "Employees", href: routes.hris.employees },
  { title: "Departments", href: routes.hris.departments },
  { title: "Documents", href: routes.hris.documents },
  { title: "Disciplinary", href: routes.hris.disciplinary },
];

export function getSidebarNav(role: UserRole): NavItem[] {
  if (role === "employee") {
    return [
      { title: "Dashboard", href: routes.app.dashboard, icon: "layout-dashboard" },
      { title: "My profile", href: routes.hris.employees, icon: "user" },
      { title: "Leave Management", icon: "calendar", comingSoon: true },
    ];
  }

  if (role === "manager") {
    return [
      { title: "Dashboard", href: routes.app.dashboard, icon: "layout-dashboard" },
      { title: "HRIS", icon: "users", children: hrisChildren },
      { title: "Leave Management", icon: "calendar", comingSoon: true },
    ];
  }

  return [
    { title: "Dashboard", href: routes.app.dashboard, icon: "layout-dashboard" },
    { title: "HRIS", icon: "users", children: hrisChildren },
    { title: "Recruitment", icon: "briefcase", comingSoon: true },
    { title: "Onboarding", icon: "user-plus", comingSoon: true },
    { title: "Payroll", icon: "wallet", comingSoon: true },
    { title: "Leave Management", icon: "calendar", comingSoon: true },
    { title: "Time & Attendance", icon: "clock", comingSoon: true },
  ];
}

// ============================================================================
// SITE CONFIG
// ============================================================================

export const siteConfig = {
  name: "360DegreesHR",
  description: "Modern HR platform for people operations, performance, and workforce insights.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
} as const;

// ============================================================================
// DESIGN SYSTEM - COLORS
// ============================================================================

export const primaryBase = "#274376" as const;
export const secondaryBase = "#F7A316" as const;
export const successBase = "#0CAF60" as const;
export const warningBase = "#FFD023" as const;
export const errorBase = "#E03137" as const;

export const greyscale = {
  50: "#FAFAFA",
  100: "#FBFBFB",
  200: "#F1F2F4",
  300: "#E9EAEC",
  400: "#CBD5E0",
  500: "#A0AEC0",
  600: "#6B7588",
  700: "#525B6E",
  800: "#3D4556",
  900: "#282E3C",
} as const;

export type GreyscaleKey = keyof typeof greyscale;

export const additional = {
  white: "#FFFFFF",
  orange: "#FE984A",
  blue: "#2F7BEE",
  purple: "#8C62FF",
} as const;

export type AdditionalColorKey = keyof typeof additional;

export const mainColors = [
  {
    name: "Primary",
    scale: {
      50: "color-mix(in srgb, #274376 8%, white)",
      100: "color-mix(in srgb, #274376 16%, white)",
      200: "color-mix(in srgb, #274376 32%, white)",
      300: "color-mix(in srgb, #274376 48%, white)",
      400: "color-mix(in srgb, #274376 64%, white)",
      500: primaryBase,
    },
    tokenPrefix: "primary",
  },
  {
    name: "Secondary",
    scale: {
      50: "color-mix(in srgb, #F7A316 8%, white)",
      100: "color-mix(in srgb, #F7A316 16%, white)",
      200: "color-mix(in srgb, #F7A316 32%, white)",
      300: "color-mix(in srgb, #F7A316 48%, white)",
      400: "color-mix(in srgb, #F7A316 64%, white)",
      500: secondaryBase,
    },
    tokenPrefix: "secondary",
  },
] as const;

export const alertColors = [
  {
    name: "Success",
    scale: {
      50: "color-mix(in srgb, #0CAF60 8%, white)",
      100: "color-mix(in srgb, #0CAF60 16%, white)",
      200: "color-mix(in srgb, #0CAF60 32%, white)",
      300: "color-mix(in srgb, #0CAF60 48%, white)",
      400: "color-mix(in srgb, #0CAF60 64%, white)",
      500: successBase,
    },
    tokenPrefix: "success",
  },
  {
    name: "Warning",
    scale: {
      50: "color-mix(in srgb, #FFD023 8%, white)",
      100: "color-mix(in srgb, #FFD023 16%, white)",
      200: "color-mix(in srgb, #FFD023 32%, white)",
      300: "color-mix(in srgb, #FFD023 48%, white)",
      400: "color-mix(in srgb, #FFD023 64%, white)",
      500: warningBase,
    },
    tokenPrefix: "warning",
  },
  {
    name: "Error",
    scale: {
      50: "color-mix(in srgb, #E03137 8%, white)",
      100: "color-mix(in srgb, #E03137 16%, white)",
      200: "color-mix(in srgb, #E03137 32%, white)",
      300: "color-mix(in srgb, #E03137 48%, white)",
      400: "color-mix(in srgb, #E03137 64%, white)",
      500: errorBase,
    },
    tokenPrefix: "error",
  },
] as const;

export const greyscaleSteps = Object.entries(greyscale).map(([step, hex]) => ({
  step: Number(step) as GreyscaleKey,
  hex,
  token: `grey-${step}`,
}));

export const additionalColors = Object.entries(additional).map(([name, hex]) => ({
  name: name as AdditionalColorKey,
  hex,
  token: name,
}));

// ============================================================================
// DESIGN SYSTEM - ICONS
// ============================================================================

export const BRAND_ICONS = ["apple", "facebook", "google"] as const;
export type BrandIconName = typeof BRAND_ICONS[number];

export const DASHBOARD_ICONS = [
  "employees",
  "recruitment",
  "onboarding",
  "time",
  "performance",
  "learning",
  "succession",
  "compensation",
  "benefits",
  "workforce",
  "analytics",
] as const;
export type DashboardIconName = typeof DASHBOARD_ICONS[number];
