"use server";

import { getMemberAuthorization } from "@/app/room/server/requireMember";
import { getMemberPatientAccess } from "@/app/room/server/memberContext";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type ChangeRequestState = { kind: "idle" | "success" | "error"; message: string };

export async function requestAppointmentChangeAction(bookingId: number, _previous: ChangeRequestState, formData: FormData): Promise<ChangeRequestState> {
  const authorization = await getMemberAuthorization();
  if (authorization.kind !== "authorized") return { kind: "error", message: "Sesja wygasła. Zaloguj się ponownie." };

  if (!Number.isInteger(bookingId) || bookingId <= 0) return { kind: "error", message: "Nieprawidłowa wizyta." };
  const requestType = String(formData.get("requestType") ?? "");
  const requestedDate = String(formData.get("requestedDate") ?? "");
  const requestedTime = String(formData.get("requestedTime") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  if (requestType !== "reschedule" && requestType !== "cancel") return { kind: "error", message: "Wybierz rodzaj prośby." };
  if (requestType === "reschedule" && (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate) || !/^\d{2}:\d{2}$/.test(requestedTime))) return { kind: "error", message: "Podaj proponowaną datę i godzinę." };
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  if (requestType === "reschedule" && requestedDate < today) return { kind: "error", message: "Proponowana data nie może być w przeszłości." };
  if (message.length > 1000) return { kind: "error", message: "Wiadomość może mieć maksymalnie 1000 znaków." };

  const accessRows = await getMemberPatientAccess(authorization.identity.userId);
  const patientIds = [...new Set(accessRows.map((row) => row.patient_id))];
  if (patientIds.length === 0) return { kind: "error", message: "Konto nie jest jeszcze połączone z kartą pacjenta." };

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from("bookings")
    .select("id, patient_id, visit_date, status, record_kind")
    .eq("id", bookingId)
    .in("patient_id", patientIds)
    .eq("record_kind", "real")
    .maybeSingle();
  if (bookingError) throw bookingError;
  if (!booking) return { kind: "error", message: "Nie znaleziono wizyty przypisanej do tego konta." };
  if (booking.status === "Odwołane" || booking.status === "Zrealizowane") return { kind: "error", message: "Dla tej wizyty nie można już wysłać prośby o zmianę." };

  const { data: pending } = await supabaseAdmin
    .from("appointment_change_requests")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("requester_user_id", authorization.identity.userId)
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  if (pending) return { kind: "error", message: "Prośba dotycząca tej wizyty już czeka na odpowiedź." };

  const { error } = await supabaseAdmin.from("appointment_change_requests").insert({
    booking_id: booking.id,
    patient_id: booking.patient_id,
    requester_user_id: authorization.identity.userId,
    request_type: requestType,
    requested_date: requestType === "reschedule" ? requestedDate : null,
    requested_time: requestType === "reschedule" ? requestedTime : null,
    message,
    status: "pending",
  });
  if (error) throw error;

  return { kind: "success", message: "Prośba została wysłana. Termin zmieni się dopiero po potwierdzeniu przez Aleksandrę." };
}
