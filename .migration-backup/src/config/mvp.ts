/**
 * MVP scope from PDR — Module 1 (HRIS) is the current build focus.
 * Other modules get routes when Figma + API are shared.
 */

export const userRoles = ["hr_admin", "manager", "employee"] as const;
export type UserRole = (typeof userRoles)[number];

export const mvpModules = [
  {
    id: "hris",
    name: "HRIS",
    description:
      "Central employee database — profiles, history, documents, disciplinary records, org structure.",
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
