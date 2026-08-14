import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

export type MemberPatientAccess = {
  patient_id: string;
  access_role: "patient" | "parent";
};

export async function getMemberPatientAccess(userId: string): Promise<MemberPatientAccess[]> {
  const { data, error } = await supabaseAdmin
    .from("member_patient_access")
    .select("patient_id, access_role")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) throw error;
  return (data ?? []) as MemberPatientAccess[];
}

export async function getLatestCompletedBooking(patientIds: string[]) {
  if (patientIds.length === 0) return null;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id, patient_id, location_id, location, visit_date, visit_time")
    .in("patient_id", patientIds)
    .eq("record_kind", "real")
    .eq("status", "Zrealizowane")
    .order("visit_date", { ascending: false })
    .order("visit_time", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}
