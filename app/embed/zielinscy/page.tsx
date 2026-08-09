import type { Metadata } from "next";
import ZielinscyBookingTeaser from "@/app/partners/booking/ZielinscyBookingTeaser";

export const metadata: Metadata = {
  title: "Umów wizytę | Centrum Zielińscy",
  robots: { index: false, follow: false },
};

export default function ZielinscyEmbedPage() {
  return <main className="min-h-screen bg-[#F8F5F0] p-3 sm:p-4"><ZielinscyBookingTeaser variant="embed" /></main>;
}
