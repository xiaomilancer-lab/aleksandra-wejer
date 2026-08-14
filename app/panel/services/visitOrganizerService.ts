import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Visit, VisitRecordKind } from "../domain/booking";

const fields = "id, patient_id, name, email, phone, location, location_id, visit_date, visit_time, status, message, source, record_kind";
const fallbackFields = "id, patient_id, name, email, phone, location, location_id, visit_date, visit_time, status, message, source";

export interface VisitOrganizerData {
  visits: Visit[];
  classificationAvailable: boolean;
}

export async function getVisitOrganizerData(): Promise<VisitOrganizerData> {
  const result = await supabaseAdmin.from("bookings").select(fields).order("visit_date", { ascending: false }).order("visit_time", { ascending: false });
  if (!result.error) return { visits: (result.data ?? []) as Visit[], classificationAvailable: true };

  if (result.error.code !== "42703") throw result.error;
  const fallback = await supabaseAdmin.from("bookings").select(fallbackFields).order("visit_date", { ascending: false }).order("visit_time", { ascending: false });
  if (fallback.error) throw fallback.error;
  return {
    visits: (fallback.data ?? []).map((visit) => ({ ...visit, record_kind: "real" })) as Visit[],
    classificationAvailable: false,
  };
}

export async function updateVisitRecordKind(id: number, recordKind: VisitRecordKind) {
  const { error } = await supabaseAdmin.from("bookings").update({ record_kind: recordKind }).eq("id", id);
  if (error) throw error;
}
