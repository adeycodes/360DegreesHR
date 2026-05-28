import { notFound } from "next/navigation";
import { ModulePlaceholder } from "@/components/features/hris/module-placeholder";
import { EmployeeDirectoryScreen } from "@/components/features/hris/employee-directory-screen";
import { hrisPages, isHrisPageSection, type HrisPageSection } from "@/config/hris-pages";
import OrgStructureScreen from "@/components/features/hris/OrgStructureScreen"; // ✅ default import

type HrisSectionPageProps = {
  section: string;
};

export function HrisSectionPage({ section }: HrisSectionPageProps) {
  if (!isHrisPageSection(section)) {
    notFound();
  }

  const page = hrisPages[section as HrisPageSection];

  const realComponents: Record<string, React.ComponentType> = {
    "employees_directory": EmployeeDirectoryScreen,
    "organization_structure": OrgStructureScreen,
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