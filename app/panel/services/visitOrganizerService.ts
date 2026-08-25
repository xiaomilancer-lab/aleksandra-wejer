import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Visit, VisitRecordKind } from "../domain/booking";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { findOrCreatePatient, getPatientById, recordTimelineEvent } from "./patientService";
import type { Patient } from "../domain/patient";
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

export async function assignVisitToPatient(id: number, patientId: string): Promise<Patient> {
  const [visit, patient] = await Promise.all([getOrganizerVisitById(id), getPatientById(patientId)]);
  if (!visit) throw new Error("Nie znaleziono wizyty.");
  if ((visit.record_kind ?? "real") === "test") throw new Error("Wizyta testowa nie może zostać przypisana do karty pacjenta.");
  if (!patient) throw new Error("Nie znaleziono wybranej karty pacjenta.");

  const { error } = await supabaseAdmin.from("bookings").update({ patient_id: patient.id }).eq("id", id);
  if (error) throw error;
  await recordTimelineEvent({
    patientId: patient.id,
    visitId: id,
    eventType: "visit_created",
    title: "Przypisano istniejącą wizytę",
    description: `${visit.visit_date} · ${visit.visit_time}`,
  });
  return patient;
}

export async function createOrMatchPatientFromVisit(id: number): Promise<Patient> {
  const visit = await getOrganizerVisitById(id);
  if (!visit) throw new Error("Nie znaleziono wizyty.");
  if ((visit.record_kind ?? "real") === "test") throw new Error("Wizyta testowa nie może utworzyć karty pacjenta.");
  if (visit.patient_id) {
    const linked = await getPatientById(visit.patient_id);
    if (linked) return linked;
  }

  const patient = await findOrCreatePatient({ name: visit.name, phone: visit.phone, email: visit.email });
  if (!patient) throw new Error("Nie udało się utworzyć karty pacjenta.");
  const { error } = await supabaseAdmin.from("bookings").update({ patient_id: patient.id }).eq("id", id);
  if (error) throw error;
  await recordTimelineEvent({
    patientId: patient.id,
    visitId: id,
    eventType: "visit_created",
    title: "Połączono wizytę z kartą pacjenta",
    description: `${visit.visit_date} · ${visit.visit_time}`,
  });
  return patient;
}

export async function getOrganizerVisitById(id: number): Promise<Visit | null> {
  const { data, error } = await supabaseAdmin.from("bookings").select(fields).eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Visit | null;
}

export async function getNextOrganizerVisit(visit: Visit): Promise<Visit | null> {
  if (!visit.patient_id) return null;
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select(fields)
    .eq("patient_id", visit.patient_id)
    .eq("record_kind", "real")
    .neq("status", "Odwołane")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true });
  if (error) throw error;

  return ((data ?? []) as Visit[]).find((candidate) =>
    candidate.visit_date > visit.visit_date
    || (candidate.visit_date === visit.visit_date && candidate.visit_time > visit.visit_time),
  ) ?? null;
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
