import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/features/hris/module-placeholder";
import { hrisPages, isHrisPageSection, type HrisPageSection } from "@/config/hris-pages";

type HrisSectionPageProps = {
  section: string;
};

export function HrisSectionPage({ section }: HrisSectionPageProps) {
  if (!isHrisPageSection(section)) {
    notFound();
  }

  const page = hrisPages[section as HrisPageSection];

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
