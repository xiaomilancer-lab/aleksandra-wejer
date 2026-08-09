import { isBookingLocationId } from "@/app/booking/locations";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";

type RuleInput = { locationId: string; weekday: number; startTime: string; endTime: string; slotDurationMinutes: number; isActive: boolean };
type ExceptionInput = { locationId: string; date: string; kind: "available" | "unavailable"; startTime?: string; endTime?: string; slotDurationMinutes?: number; note?: string };

export async function GET(request: Request) {
  const authorization = await authorize(request); if (authorization) return authorization;
  const [rules, exceptions] = await Promise.all([supabaseAdmin.from("availability_rules").select("id, location_id, weekday, start_time, end_time, slot_duration_minutes, is_active, valid_from, valid_to").order("location_id").order("weekday").order("start_time"), supabaseAdmin.from("availability_exceptions").select("id, location_id, date, kind, start_time, end_time, slot_duration_minutes, note").order("date", { ascending: true })]);
  if (rules.error?.code === "42P01" || exceptions.error?.code === "42P01") return Response.json({ migrationRequired: true, rules: [], exceptions: [] });
  if (rules.error || exceptions.error) return Response.json({ message: "Nie udało się pobrać grafiku." }, { status: 503 });
  return Response.json({ migrationRequired: false, rules: rules.data ?? [], exceptions: exceptions.data ?? [] });
}

export async function POST(request: Request) {
  const authorization = await authorize(request); if (authorization) return authorization;
  const body = await request.json() as { type: "rule" | "exception"; data: RuleInput | ExceptionInput };
  if (body.type === "rule") { const input = body.data as RuleInput; if (!validRule(input)) return invalid(); const { error } = await supabaseAdmin.from("availability_rules").insert({ location_id: input.locationId, weekday: input.weekday, start_time: input.startTime, end_time: input.endTime, slot_duration_minutes: input.slotDurationMinutes, is_active: input.isActive }); if (error) return databaseError(error.code); }
  else if (body.type === "exception") { const input = body.data as ExceptionInput; if (!validException(input)) return invalid(); const { error } = await supabaseAdmin.from("availability_exceptions").insert({ location_id: input.locationId, date: input.date, kind: input.kind, start_time: input.startTime || null, end_time: input.endTime || null, slot_duration_minutes: input.slotDurationMinutes ?? null, note: input.note?.trim() || null }); if (error) return databaseError(error.code); }
  else return invalid();
  return Response.json({ success: true });
}

export async function PATCH(request: Request) {
  const authorization = await authorize(request); if (authorization) return authorization;
  const { id, isActive } = await request.json();
  if (typeof id !== "number" || typeof isActive !== "boolean") return invalid();
  const { error } = await supabaseAdmin.from("availability_rules").update({ is_active: isActive, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return databaseError(error.code);
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const authorization = await authorize(request); if (authorization) return authorization;
  const { searchParams } = new URL(request.url); const type = searchParams.get("type"); const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || (type !== "rule" && type !== "exception")) return invalid();
  const { error } = await supabaseAdmin.from(type === "rule" ? "availability_rules" : "availability_exceptions").delete().eq("id", id);
  if (error) return databaseError(error.code);
  return Response.json({ success: true });
}

async function authorize(request: Request) {
  const result = await getPsychologistApiAuthorization(request);
  if (result.kind === "authorized") return null;
  if (result.kind === "unauthenticated") return unauthorized();
  return Response.json({ message: "Nie masz uprawnienia do zarządzania grafikiem." }, { status: 403 });
}
function validRule(input: RuleInput) { return isBookingLocationId(input.locationId) && Number.isInteger(input.weekday) && input.weekday >= 0 && input.weekday <= 6 && /^\d{2}:\d{2}$/.test(input.startTime) && /^\d{2}:\d{2}$/.test(input.endTime) && input.startTime < input.endTime && Number.isInteger(input.slotDurationMinutes) && input.slotDurationMinutes >= 5 && input.slotDurationMinutes <= 240; }
function validException(input: ExceptionInput) { const hasRange = Boolean(input.startTime && input.endTime); return isBookingLocationId(input.locationId) && /^\d{4}-\d{2}-\d{2}$/.test(input.date) && ["available", "unavailable"].includes(input.kind) && (!hasRange || (input.startTime! < input.endTime!)) && (input.kind !== "available" || (hasRange && Boolean(input.slotDurationMinutes))); }
function unauthorized() { return Response.json({ message: "Brak dostępu." }, { status: 401 }); }
function invalid() { return Response.json({ message: "Nieprawidłowe dane grafiku." }, { status: 400 }); }
function databaseError(code?: string) { return Response.json({ message: code === "42P01" ? "Wymagana jest ręczna migracja grafiku." : "Nie udało się zapisać grafiku." }, { status: 503 }); }
