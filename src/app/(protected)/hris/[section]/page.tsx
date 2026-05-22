import { HrisSectionPage, getHrisStaticParams } from "@/components/features/hris/hris-section-page";

type PageProps = {
  params: Promise<{ section: string }>;
};

export const generateStaticParams = getHrisStaticParams;

export default async function Page({ params }: PageProps) {
  const { section } = await params;
  return <HrisSectionPage section={section} />;
}
