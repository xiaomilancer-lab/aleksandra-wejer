import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LocalAreaPage from "@/app/components/LocalAreaPage";
import { getLocalArea, localAreas } from "@/app/lib/localAreas";

export const dynamicParams = false;

export function generateStaticParams() {
  return localAreas.map((area) => ({ location: area.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params;
  const area = getLocalArea(location);
  if (!area) return {};

  const title = `Psycholog ${area.name} | Aleksandra Wejer`;
  const description = `${area.intro} Sprawdź dwie lokalizacje gabinetu i dostępne terminy konsultacji.`;

  return {
    title,
    description,
    alternates: { canonical: `/${area.slug}` },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url: `/${area.slug}`,
      title,
      description,
    },
  };
}

export default async function LocalAreaRoute({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  const area = getLocalArea(location);
  if (!area) notFound();

  return <LocalAreaPage area={area} />;
}
