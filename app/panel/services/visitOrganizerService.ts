import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Visit, VisitRecordKind } from "../domain/booking";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { findOrCreatePatient, getPatientById, recordTimelineEvent } from "./patientService";
import type { Patient } from "../domain/patient";
import type { HistoricalVisitInput, ManualVisitInput, RescheduleVisitInput } from "../actions/visitOrganizerActions";

const fields = "id, patient_id, name, email, phone, location, location_id, visit_date, visit_time, status, message, source, record_kind";
const financeFields = `${fields}, visit_fee`;
const fallbackFields = "id, patient_id, name, email, phone, location, location_id, visit_date, visit_time, status, message, source";

export interface VisitOrganizerData {
  visits: Visit[];
  classificationAvailable: boolean;
  financeAvailable: boolean;
}

export async function getVisitOrganizerData(): Promise<VisitOrganizerData> {
  const result = await supabaseAdmin.from("bookings").select(financeFields).order("visit_date", { ascending: false }).order("visit_time", { ascending: false });
  if (!result.error) return { visits: (result.data ?? []) as Visit[], classificationAvailable: true, financeAvailable: true };

  if (result.error.code !== "42703") throw result.error;
  const withoutFinance = await supabaseAdmin.from("bookings").select(fields).order("visit_date", { ascending: false }).order("visit_time", { ascending: false });
  if (!withoutFinance.error) {
    return {
      visits: (withoutFinance.data ?? []).map((visit) => ({ ...visit, visit_fee: null })) as Visit[],
      classificationAvailable: true,
      financeAvailable: false,
    };
  }

  if (withoutFinance.error.code !== "42703") throw withoutFinance.error;
  const fallback = await supabaseAdmin.from("bookings").select(fallbackFields).order("visit_date", { ascending: false }).order("visit_time", { ascending: false });
  if (fallback.error) throw fallback.error;
  return {
    visits: (fallback.data ?? []).map((visit) => ({ ...visit, record_kind: "real", visit_fee: null })) as Visit[],
    classificationAvailable: false,
    financeAvailable: false,
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
  const result = await supabaseAdmin.from("bookings").select(financeFields).eq("id", id).maybeSingle();
  if (!result.error) return result.data as Visit | null;
  if (result.error.code !== "42703") throw result.error;

  const fallback = await supabaseAdmin.from("bookings").select(fields).eq("id", id).maybeSingle();
  if (!fallback.error) return fallback.data ? { ...(fallback.data as Visit), visit_fee: null } : null;
  if (fallback.error.code !== "42703") throw fallback.error;

  const legacy = await supabaseAdmin.from("bookings").select(fallbackFields).eq("id", id).maybeSingle();
  if (legacy.error) throw legacy.error;
  return legacy.data ? { ...(legacy.data as Visit), record_kind: "real", visit_fee: null } : null;
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

async function createOrganizerVisit(input: HistoricalVisitInput, options: { status: string; source: string }) {
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
    status: options.status,
    record_kind: "real",
    source: options.source,
    message: input.description.trim(),
  });
  if (error?.code === "23505") throw new Error("W tym terminie istnieje już prawdziwa wizyta.");
  if (error) throw error;
}

export async function createHistoricalVisit(input: HistoricalVisitInput) {
  await createOrganizerVisit(input, { status: "Zrealizowane", source: "panel-history" });
}

export async function createManualVisit(input: ManualVisitInput) {
  await createOrganizerVisit(input, { status: input.status, source: "panel-manual" });
}

export async function rescheduleVisit(id: number, input: RescheduleVisitInput): Promise<Visit> {
  const visit = await getOrganizerVisitById(id);
  if (!visit) throw new Error("Nie znaleziono wizyty.");

  if (visit.visit_date === input.visitDate && visit.visit_time.slice(0, 5) === input.visitTime) return visit;

  if ((visit.record_kind ?? "real") === "real" && visit.status !== "Odwołane" && visit.location_id) {
    const { data: conflict, error: conflictError } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("location_id", visit.location_id)
      .eq("visit_date", input.visitDate)
      .eq("visit_time", input.visitTime)
      .eq("record_kind", "real")
      .neq("status", "Odwołane")
      .neq("id", id)
      .limit(1);
    if (conflictError) throw conflictError;
    if (conflict?.length) throw new Error("W tym gabinecie jest już prawdziwa wizyta o wybranej porze.");
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ visit_date: input.visitDate, visit_time: input.visitTime })
    .eq("id", id)
    .select(fields)
    .single();
  if (error?.code === "23505") throw new Error("W tym gabinecie jest już prawdziwa wizyta o wybranej porze.");
  if (error) throw error;

  const updated = { ...(data as Visit), visit_fee: visit.visit_fee ?? null };
  if (updated.patient_id) {
    await recordTimelineEvent({
      patientId: updated.patient_id,
      visitId: updated.id,
      eventType: "status_changed",
      title: "Zmieniono termin wizyty",
      description: `${visit.visit_date} · ${visit.visit_time.slice(0, 5)} → ${updated.visit_date} · ${updated.visit_time.slice(0, 5)}`,
      metadata: {
        previous_date: visit.visit_date,
        previous_time: visit.visit_time.slice(0, 5),
        new_date: updated.visit_date,
        new_time: updated.visit_time.slice(0, 5),
      },
    });
  }
  return updated;
}

export async function updateVisitFee(id: number, visitFee: number | null): Promise<number | null> {
  const visit = await getOrganizerVisitById(id);
  if (!visit) throw new Error("Nie znaleziono wizyty.");
  if ((visit.record_kind ?? "real") === "test") throw new Error("Kwotę można przypisać wyłącznie do prawdziwej wizyty.");

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ visit_fee: visitFee })
    .eq("id", id)
    .select("visit_fee")
    .single();
  if (error?.code === "42703") throw new Error("Kwoty czekają na uruchomienie przygotowanej migracji Supabase.");
  if (error) throw error;

  const savedFee = data.visit_fee === null ? null : Number(data.visit_fee);
  if (visit.patient_id) {
    await recordTimelineEvent({
      patientId: visit.patient_id,
      visitId: visit.id,
      eventType: "status_changed",
      title: "Zaktualizowano kwotę wizyty",
      description: savedFee === null ? "Usunięto orientacyjną kwotę wizyty." : `Wpisano orientacyjną kwotę ${savedFee.toFixed(2)} zł.`,
      metadata: { visit_fee: savedFee },
    });
  }
  return savedFee;
}
