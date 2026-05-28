import { HrisSectionPage, getHrisStaticParams } from "@/components/features/hris/hris-section-page";

type PageProps = {
  params: Promise<{ section: string }>;
};

// Ensure generateStaticParams is handled as a standard export
export async function generateStaticParams() {
  return await getHrisStaticParams();
}

export default async function Page({ params }: PageProps) {
  // Await the params before accessing the property
  const { section } = await params;

  return <HrisSectionPage section={section} />;
}