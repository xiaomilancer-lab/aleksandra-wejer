import { notFound } from "next/navigation";
import PartnerBookingWidget from "@/app/partners/booking/PartnerBookingWidget";

export default async function BookZielinscyPage({ searchParams }: { searchParams: Promise<{ source?: string }> }) {
  const { source } = await searchParams;
  if (source && source !== "instagram" && source !== "qr" && source !== "embed" && source !== "facebook-zielinscy") notFound();
  const bookingSource = source === "instagram" || source === "qr" || source === "embed" || source === "facebook-zielinscy" ? source : undefined;
  return <main className="min-h-screen bg-[#F8F5F0] p-3 sm:p-8"><PartnerBookingWidget partnerId="zielinscy" source={bookingSource} /></main>;
}
