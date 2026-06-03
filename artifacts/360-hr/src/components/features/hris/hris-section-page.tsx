import { notFound } from "next/navigation";
import { ModulePlaceholder } from "@/components/features/hris/module-placeholder";

// ✅ 1. Import your main Page container instead of the presentation Screen
import EmployeeDirectoryPage from "@/app/(protected)/hris/employee_directory/page";
import OrgStructureScreen from "@/components/features/hris/OrgStructureScreen";
import { hrisPages, isHrisPageSection, type HrisPageSection } from "@/config/hris-pages";

type HrisSectionPageProps = {
  section: string;
};

export function HrisSectionPage({ section }: HrisSectionPageProps) {
  if (!isHrisPageSection(section)) {
    notFound();
  }

  const page = hrisPages[section as HrisPageSection];

  // ✅ 2. Change the value from EmployeeDirectoryScreen to EmployeeDirectoryPage. 
  // It matches React.ComponentType perfectly because it takes no props {}
  const realComponents: Record<string, React.ComponentType> = {
    "employees_directory": EmployeeDirectoryPage,
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