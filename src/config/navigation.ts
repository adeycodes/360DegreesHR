import type { UserRole } from "@/config/mvp";
import { routes } from "@/config/routes";

export type NavItem = {
  title: string;
  href?: string;
  icon: string;
  children?: { title: string; href: string }[];
  comingSoon?: boolean;
};

const hrisChildren = [
  { title: "Employees Directory", href: routes.hris.employees },
  { title: "Organization Structure", href: routes.hris.organization_structure },
  { title: "Reports", href: routes.hris.reports },
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
