export const PROXY_HRIS_PAGES = [
  "recruitment",
  "onboarding",
  "time",
  "performance",
  "learning",
  "succession",
  "compensation",
  "benefits",
  "workforce-planning",
  "employee-experience",
  "analytics",
] as const;

export type ProxyHrisPage = typeof PROXY_HRIS_PAGES[number];

export function isProxyHrisPage(section: string): section is ProxyHrisPage {
  return PROXY_HRIS_PAGES.includes(section as ProxyHrisPage);
}
