/** HRIS placeholder routes — single dynamic page in `app/(protected)/hris/[section]` */

export const hrisPages = {
  employees: {
    title: "Employees",
    description:
      "Central employee profiles, employment history, and org assignment.",
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
