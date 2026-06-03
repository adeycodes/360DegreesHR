/** HRIS placeholder routes — single dynamic page in `app/(protected)/hris/[section]` */

import { report } from "process";

export const hrisPages = {
  employees_directory: {
    title: "Employees Directory",
    description:
      "Central employee profiles, employment history, and org assignment.",
    estimatedScreens: "12–15 (module total)",
  },
  organization_structure: {
    title: "Organization Structure",
    description: "View and manage your company's organizational hierarchy.",
    estimatedScreens: "12–15 (module total)",
  },
  reports: {
    title: "Reports",
    description: "Employee document vault, contracts, and compliance files.",
    estimatedScreens: "12–15 (module total)",
  },

} as const;

export type HrisPageSection = keyof typeof hrisPages;

export function isHrisPageSection(value: string): value is HrisPageSection {
  return value in hrisPages;
}
