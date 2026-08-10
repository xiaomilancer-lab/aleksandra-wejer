import type { Metadata } from "next";
import ZielinscyPartnerCard from "@/app/partners/zielinscy/ZielinscyPartnerCard";

export const metadata: Metadata = {
  title: "Podgląd widgetu Zielińscy Premium",
  robots: { index: false, follow: false },
};

export default function ZielinscyWidgetPreviewPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#EEECE7] px-4 py-12 sm:px-8">
      <ZielinscyPartnerCard />
    </main>
  );
}
