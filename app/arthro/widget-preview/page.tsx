import type { Metadata } from "next";
import ArthroPartnerCard from "@/app/partners/arthro/ArthroPartnerCard";

export const metadata: Metadata = {
  title: "Podgląd widgetu Arthro Cure Clinic",
  robots: { index: false, follow: false },
};

export default function ArthroWidgetPreviewPage() {
  return <main className="grid min-h-screen place-items-center bg-[#EEECE7] px-4 py-12 sm:px-8"><ArthroPartnerCard /></main>;
}
