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
