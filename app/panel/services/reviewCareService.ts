import { supabaseAdmin } from "@/lib/supabase-admin";
import type { PatientReviewCare } from "../domain";

const reviewFields = "id, name, review_request_sent, review_request_sent_at, review_request_scheduled_at, review_response, google_review_clicked_at, private_feedback";

function isReviewCareMigrationMissing(errorCode: string | undefined) {
  return errorCode === "42703" || errorCode === "42P01";
}

function getScheduleHour() {
  const configuredHour = Number(process.env.REVIEW_REQUEST_SCHEDULE_HOUR ?? 18);
  return Number.isInteger(configuredHour) && configuredHour >= 0 && configuredHour <= 23
    ? configuredHour
    : 18;
}

function warsawSchedule(date: string, hour: number) {
  const [year, month, day] = date.split("-").map(Number);
  const instant = Date.UTC(year, month - 1, day, hour);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(instant));
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const displayedAsUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"));
  return new Date(instant - (displayedAsUtc - instant)).toISOString();
}

export async function scheduleReviewRequestAfterCompletedVisit(patientId: string, visitDate: string) {
  const { data: patient, error: patientError } = await supabaseAdmin
    .from("patients")
    .select("review_request_sent, review_request_scheduled_at")
    .eq("id", patientId)
    .maybeSingle();

  if (patientError) {
    // TODO: Run create_patient_review_care.sql before activating Care After Visit.
    if (isReviewCareMigrationMissing(patientError.code)) return false;
    throw patientError;
  }

  if (!patient || patient.review_request_sent || patient.review_request_scheduled_at) return false;

  const { error } = await supabaseAdmin
    .from("patients")
    .update({ review_request_scheduled_at: warsawSchedule(visitDate, getScheduleHour()) })
    .eq("id", patientId)
    .eq("review_request_sent", false)
    .is("review_request_scheduled_at", null);

  if (error) throw error;

  // TODO: A scheduled worker must send the configured e-mail/SMS. Only that
  // worker should set review_request_sent after confirmed delivery.
  return true;
}

export async function getPatientReviewCare(patientId: string): Promise<PatientReviewCare | null> {
  const { data, error } = await supabaseAdmin.from("patients").select(reviewFields).eq("id", patientId).maybeSingle();
  if (error) {
    if (isReviewCareMigrationMissing(error.code)) return null;
    throw error;
  }
  return data as PatientReviewCare | null;
}

export async function getReviewCareOverview(): Promise<PatientReviewCare[]> {
  const { data, error } = await supabaseAdmin.from("patients").select(reviewFields).order("updated_at", { ascending: false });
  if (error) {
    if (isReviewCareMigrationMissing(error.code)) return [];
    throw error;
  }
  return ((data ?? []) as PatientReviewCare[]).filter((patient) =>
    patient.review_response !== null || patient.private_feedback !== null || patient.review_request_scheduled_at !== null,
  );
}

export async function recordGoogleReviewClick(patientId: string) {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin.from("patients").update({
    review_request_sent: true,
    review_request_sent_at: now,
    review_response: "google",
    google_review_clicked_at: now,
  }).eq("id", patientId);
  if (error) throw error;
}

export async function savePrivateFeedback(patientId: string, feedback: string) {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin.from("patients").update({
    review_request_sent: true,
    review_request_sent_at: now,
    review_response: "private_feedback",
    private_feedback: feedback.trim(),
  }).eq("id", patientId);
  if (error) throw error;
}
