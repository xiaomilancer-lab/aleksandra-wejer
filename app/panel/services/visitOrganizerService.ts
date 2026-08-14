import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Visit, VisitRecordKind } from "../domain/booking";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { getPatientById } from "./patientService";
import type { HistoricalVisitInput } from "../actions/visitOrganizerActions";

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

export async function getOrganizerVisitById(id: number): Promise<Visit | null> {
  const { data, error } = await supabaseAdmin.from("bookings").select(fields).eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Visit | null;
}

export async function createHistoricalVisit(input: HistoricalVisitInput) {
  if (!isBookingLocationId(input.locationId)) throw new Error("Nieprawidłowa lokalizacja.");
  const patient = input.patientId ? await getPatientById(input.patientId) : null;
  if (input.patientId && !patient) throw new Error("Nie znaleziono wybranej karty pacjenta.");

  const { data: conflict, error: conflictError } = await supabaseAdmin.from("bookings").select("id").eq("location_id", input.locationId).eq("visit_date", input.visitDate).eq("visit_time", input.visitTime).eq("record_kind", "real").neq("status", "Odwołane").limit(1);
  if (conflictError) throw conflictError;
  if (conflict?.length) throw new Error("W tym terminie jest już zapisana prawdziwa wizyta.");

  const { error } = await supabaseAdmin.from("bookings").insert({
    patient_id: patient?.id ?? null,
    name: patient?.name ?? input.name.trim(),
    phone: patient?.phone ?? input.phone.trim(),
    email: patient?.email ?? input.email.trim(),
    location_id: input.locationId,
    location: getBookingLocationName(input.locationId),
    visit_date: input.visitDate,
    visit_time: input.visitTime,
    status: "Zrealizowane",
    record_kind: "real",
    source: "panel-history",
    message: input.description.trim(),
  });
  if (error?.code === "23505") throw new Error("W tym terminie istnieje już prawdziwa wizyta.");
  if (error) throw error;
}
