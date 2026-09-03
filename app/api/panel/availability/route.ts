import { bookingLocations, isBookingLocationId, type BookingLocationId } from "@/app/booking/locations";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import { supabaseAdmin } from "@/lib/supabase-admin";

type RuleInput = {
  locationId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
};

type ExceptionInput = {
  locationId: string;
  date: string;
  kind: "available" | "unavailable";
  startTime?: string;
  endTime?: string;
  slotDurationMinutes?: number;
  note?: string;
};

type StoredRule = {
  id: number;
  location_id: BookingLocationId;
  weekday: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

export async function GET(request: Request) {
  const authorization = await authorize(request);
  if (authorization) return authorization;

  const [rules, exceptions] = await Promise.all([
    supabaseAdmin
      .from("availability_rules")
      .select("id, location_id, weekday, start_time, end_time, slot_duration_minutes, is_active, valid_from, valid_to")
      .order("location_id")
      .order("weekday")
      .order("start_time"),
    supabaseAdmin
      .from("availability_exceptions")
      .select("id, location_id, date, kind, start_time, end_time, slot_duration_minutes, note")
      .order("date", { ascending: true }),
  ]);

  if (rules.error?.code === "42P01" || exceptions.error?.code === "42P01") {
    return Response.json({ migrationRequired: true, rules: [], exceptions: [] });
  }
  if (rules.error || exceptions.error) {
    return Response.json({ message: "Nie udało się pobrać grafiku." }, { status: 503 });
  }
  return Response.json({ migrationRequired: false, rules: rules.data ?? [], exceptions: exceptions.data ?? [] });
}

export async function POST(request: Request) {
  const authorization = await authorize(request);
  if (authorization) return authorization;

  const body = await request.json() as { type: "rule" | "exception"; data: RuleInput | ExceptionInput };

  if (body.type === "rule") {
    const input = body.data as RuleInput;
    if (!validRule(input)) return invalid();

    const conflict = await findRuleConflict(input.weekday, input.startTime, input.endTime);
    if (conflict.kind === "error") return databaseError(conflict.code);
    if (conflict.kind === "conflict") return conflictResponse(conflict.rule);

    const { error } = await supabaseAdmin.from("availability_rules").insert({
      location_id: input.locationId,
      weekday: input.weekday,
      start_time: input.startTime,
      end_time: input.endTime,
      slot_duration_minutes: input.slotDurationMinutes,
      is_active: input.isActive,
    });
    if (error) return databaseError(error.code);
  } else if (body.type === "exception") {
    const input = body.data as ExceptionInput;
    if (!validException(input)) return invalid();
    const { error } = await supabaseAdmin.from("availability_exceptions").insert({
      location_id: input.locationId,
      date: input.date,
      kind: input.kind,
      start_time: input.startTime || null,
      end_time: input.endTime || null,
      slot_duration_minutes: input.slotDurationMinutes ?? null,
      note: input.note?.trim() || null,
    });
    if (error) return databaseError(error.code);
  } else {
    return invalid();
  }

  return Response.json({ success: true });
}

export async function PATCH(request: Request) {
  const authorization = await authorize(request);
  if (authorization) return authorization;

  const { id, isActive } = await request.json();
  if (typeof id !== "number" || typeof isActive !== "boolean") return invalid();

  if (isActive) {
    const current = await supabaseAdmin
      .from("availability_rules")
      .select("id, location_id, weekday, start_time, end_time, is_active")
      .eq("id", id)
      .maybeSingle();
    if (current.error) return databaseError(current.error.code);
    if (!current.data) return Response.json({ message: "Nie znaleziono tego przedziału." }, { status: 404 });

    const rule = current.data as StoredRule;
    const conflict = await findRuleConflict(rule.weekday, rule.start_time, rule.end_time, rule.id);
    if (conflict.kind === "error") return databaseError(conflict.code);
    if (conflict.kind === "conflict") return conflictResponse(conflict.rule);
  }

  const { error } = await supabaseAdmin
    .from("availability_rules")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return databaseError(error.code);
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const authorization = await authorize(request);
  if (authorization) return authorization;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = Number(searchParams.get("id"));
  if (!Number.isInteger(id) || (type !== "rule" && type !== "exception")) return invalid();

  const { error } = await supabaseAdmin
    .from(type === "rule" ? "availability_rules" : "availability_exceptions")
    .delete()
    .eq("id", id);
  if (error) return databaseError(error.code);
  return Response.json({ success: true });
}

async function findRuleConflict(weekday: number, startTime: string, endTime: string, excludedId?: number) {
  const result = await supabaseAdmin
    .from("availability_rules")
    .select("id, location_id, weekday, start_time, end_time, is_active")
    .eq("weekday", weekday)
    .eq("is_active", true);

  if (result.error) return { kind: "error" as const, code: result.error.code };
  const conflict = ((result.data ?? []) as StoredRule[]).find((rule) =>
    rule.id !== excludedId && intervalsOverlap(startTime, endTime, rule.start_time, rule.end_time),
  );
  return conflict ? { kind: "conflict" as const, rule: conflict } : { kind: "none" as const };
}

function intervalsOverlap(start: string, end: string, otherStart: string, otherEnd: string) {
  return start.slice(0, 5) < otherEnd.slice(0, 5) && end.slice(0, 5) > otherStart.slice(0, 5);
}

function conflictResponse(rule: StoredRule) {
  return Response.json(
    {
      message: `Te godziny nakładają się na aktywny przedział ${rule.start_time.slice(0, 5)}–${rule.end_time.slice(0, 5)} (${bookingLocations[rule.location_id]}).`,
    },
    { status: 409 },
  );
}

async function authorize(request: Request) {
  const result = await getPsychologistApiAuthorization(request);
  if (result.kind === "authorized") return null;
  if (result.kind === "unauthenticated") return unauthorized();
  return Response.json({ message: "Nie masz uprawnienia do zarządzania grafikiem." }, { status: 403 });
}

function validRule(input: RuleInput) {
  return isBookingLocationId(input.locationId)
    && Number.isInteger(input.weekday)
    && input.weekday >= 0
    && input.weekday <= 6
    && validTime(input.startTime)
    && validTime(input.endTime)
    && input.startTime < input.endTime
    && typeof input.isActive === "boolean"
    && Number.isInteger(input.slotDurationMinutes)
    && input.slotDurationMinutes >= 5
    && input.slotDurationMinutes <= 240;
}

function validException(input: ExceptionInput) {
  const hasRange = Boolean(input.startTime && input.endTime);
  return isBookingLocationId(input.locationId)
    && /^\d{4}-\d{2}-\d{2}$/.test(input.date)
    && ["available", "unavailable"].includes(input.kind)
    && (!hasRange || (validTime(input.startTime!) && validTime(input.endTime!) && input.startTime! < input.endTime!))
    && (input.kind !== "available" || (
      hasRange
      && Number.isInteger(input.slotDurationMinutes)
      && input.slotDurationMinutes! >= 5
      && input.slotDurationMinutes! <= 240
    ));
}

function validTime(value: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function unauthorized() {
  return Response.json({ message: "Brak dostępu." }, { status: 401 });
}

function invalid() {
  return Response.json({ message: "Nieprawidłowe dane grafiku." }, { status: 400 });
}

function databaseError(code?: string) {
  return Response.json(
    { message: code === "42P01" ? "Wymagana jest ręczna migracja grafiku." : "Nie udało się zapisać grafiku." },
    { status: 503 },
  );
}
