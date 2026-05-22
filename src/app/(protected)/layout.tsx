import { DashboardShell } from "@/components/shared/dashboard-shell";

export default function AppRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
