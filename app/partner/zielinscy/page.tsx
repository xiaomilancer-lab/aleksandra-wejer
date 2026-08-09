import type { Metadata } from "next";
import ZielinscyBookingTeaser from "@/app/partners/booking/ZielinscyBookingTeaser";

export const metadata: Metadata = {
  title: "Konsultacje psychologiczne | Centrum Zielińscy",
  description: "Konsultacje z Aleksandrą Wejer w Centrum Medyczno-Estetycznym Zielińscy w Nowej Wsi Rzecznej.",
};

export default function ZielinscyPartnerPage() {
  return <main className="min-h-screen bg-[#F8F5F0] px-4 py-10 sm:px-8 sm:py-16"><ZielinscyBookingTeaser variant="landing" /></main>;
}
