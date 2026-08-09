import { notFound } from "next/navigation";
import PartnerBookingWidget from "@/app/partners/booking/PartnerBookingWidget";
import { getPartnerConfig, type PartnerId } from "@/app/partners/booking/partnerConfig";

export default async function PartnerBookingPage({ params }: { params: Promise<{ partner: string }> }) { const { partner } = await params; if (!getPartnerConfig(partner)) notFound(); return <main className="min-h-screen bg-[#F8F5F0] p-4 sm:p-8"><PartnerBookingWidget partnerId={partner as PartnerId} /></main>; }
