import { notFound } from "next/navigation";
import { ModulePlaceholder } from "@/modules/hris/screens/module-placeholder";

import EmployeeDirectoryPage from "@/app/(protected)/hris/employee_directory/page";
import OrgStructureScreen from "@/modules/hris/screens/OrgStructureScreen";
import AuditLogsScreen from "@/modules/hris/screens/audit-logs-screen";
import { hrisPages, isHrisPageSection, type HrisPageSection } from "@/config/hris-pages";

type HrisSectionPageProps = {
  section: string;
};

export function HrisSectionPage({ section }: HrisSectionPageProps) {
  if (!isHrisPageSection(section)) {
    notFound();
  }

  const page = hrisPages[section as HrisPageSection];

  const realComponents: Record<string, React.ComponentType> = {
    "employees_directory": EmployeeDirectoryPage,
    "organization_structure": OrgStructureScreen,
    "audit_logs": AuditLogsScreen,
    "reports": AuditLogsScreen,
  };

  const Component = realComponents[section];

  if (Component) return <Component />;

  return (
    <ModulePlaceholder
      title={page.title}
      description={page.description}
      estimatedScreens={page.estimatedScreens}
    />
  );
}

export function getHrisStaticParams() {
  return Object.keys(hrisPages).map((section) => ({ section }));
}
