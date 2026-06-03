import type { UserRole } from "@/types";
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
      // Changed "calendar" to "leave-management"
      { title: "Leave Management", icon: "leave-management", comingSoon: true },
    ];
  }

  if (role === "manager") {
    return [
      { title: "Dashboard", href: routes.app.dashboard, icon: "layout-dashboard" },
      // Changed "users" to "hris"
      { title: "HRIS", icon: "hris", children: hrisChildren },
      // Changed "calendar" to "leave-management"
      { title: "Leave Management", icon: "leave-management", comingSoon: true },
    ];
  }

  // Admin / Default Role
  return [
    { title: "Dashboard", href: routes.app.dashboard, icon: "layout-dashboard" },
    // Changed all of these to match your custom iconMap keys
    { title: "HRIS", icon: "hris", children: hrisChildren },
    { title: "Recruitment", icon: "recruitment", comingSoon: true },
    { title: "Onboarding", icon: "onboarding", comingSoon: true },
    { title: "Payroll", icon: "payroll", comingSoon: true },
    { title: "Leave Management", icon: "leave-management", comingSoon: true },
    { title: "Time & Attendance", icon: "time-attendance", comingSoon: true },
  ];
}