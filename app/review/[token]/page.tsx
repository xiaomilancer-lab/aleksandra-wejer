import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareAfterVisitForm from "./CareAfterVisitForm";
import { verifyReviewToken } from "../reviewToken";
import { getReviewLocation } from "../reviewLocations";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payload = verifyReviewToken(token);
  if (!payload) notFound();

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("location_id")
    .eq("patient_id", payload.patientId)
    .eq("record_kind", "real")
    .eq("status", "Zrealizowane")
    .order("visit_date", { ascending: false })
    .order("visit_time", { ascending: false })
    .limit(1)
    .maybeSingle();
  const reviewLocation = getReviewLocation(booking?.location_id);

  return <CareAfterVisitForm token={token} suggestedLocationId={booking?.location_id ?? null} suggestedLocationLabel={reviewLocation?.label ?? null} />;
}
