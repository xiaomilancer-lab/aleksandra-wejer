import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BookingLocationId } from "../locations";

export type AvailabilityState = "AVAILABLE" | "NO_SLOTS" | "NO_SCHEDULE" | "ERROR";
export type AvailableSlot = { date: string; time: string; locationId: BookingLocationId };
export type AvailableSlotsResult = { state: Exclude<AvailabilityState, "ERROR">; slots: AvailableSlot[] };

type AvailabilityRule = { weekday: number; start_time: string; end_time: string; slot_duration_minutes: number; valid_from: string | null; valid_to: string | null };
type AvailabilityException = { date: string; kind: "available" | "unavailable"; start_time: string | null; end_time: string | null; slot_duration_minutes: number | null };

export class AvailabilityError extends Error {
  constructor(message: string, public readonly source: "availability_rules" | "availability_exceptions" | "bookings" | "date_parser" | "unknown", options?: ErrorOptions) {
    super(message, options);
    this.name = "AvailabilityError";
  }
}

export async function getAvailableSlots({ locationId, from, to, now = new Date() }: { locationId: BookingLocationId; from: string; to: string; now?: Date }): Promise<AvailableSlotsResult> {
  if (!isIsoDate(from) || !isIsoDate(to) || from > to) throw new AvailabilityError("Nieprawidłowy zakres dat.", "date_parser");

  const [rulesResult, exceptionsResult, bookingsResult] = await Promise.all([
    supabaseAdmin.from("availability_rules").select("weekday, start_time, end_time, slot_duration_minutes, valid_from, valid_to").eq("location_id", locationId).eq("is_active", true),
    supabaseAdmin.from("availability_exceptions").select("date, kind, start_time, end_time, slot_duration_minutes").eq("location_id", locationId).gte("date", from).lte("date", to),
    supabaseAdmin.from("bookings").select("visit_date, visit_time, status").eq("location_id", locationId).gte("visit_date", from).lte("visit_date", to).neq("record_kind", "test"),
  ]);

  if (rulesResult.error) throw new AvailabilityError(`Błąd availability_rules (${rulesResult.error.code ?? "unknown"}).`, "availability_rules", { cause: rulesResult.error });
  if (exceptionsResult.error) throw new AvailabilityError(`Błąd availability_exceptions (${exceptionsResult.error.code ?? "unknown"}).`, "availability_exceptions", { cause: exceptionsResult.error });
  if (bookingsResult.error) throw new AvailabilityError(`Błąd bookings (${bookingsResult.error.code ?? "unknown"}).`, "bookings", { cause: bookingsResult.error });

  const rules = (rulesResult.data ?? []) as AvailabilityRule[];
  const exceptions = (exceptionsResult.data ?? []) as AvailabilityException[];
  if (rules.length === 0) return { state: "NO_SCHEDULE", slots: [] };
  const occupied = new Set((bookingsResult.data ?? []).filter((booking) => booking.status !== "Odwołane").map((booking) => `${booking.visit_date}T${booking.visit_time.slice(0, 5)}`));
  const slots: AvailableSlot[] = [];

  for (const date of eachDate(from, to)) {
    const dayRules = rules.filter((rule) => weekday(date) === rule.weekday && isRuleValidForDate(rule, date));
    const dayExceptions = exceptions.filter((exception) => exception.date === date);
    if (dayExceptions.some((exception) => exception.kind === "unavailable" && !exception.start_time && !exception.end_time)) continue;

    const intervals = [
      ...dayRules.map((rule) => ({ start: rule.start_time, end: rule.end_time, duration: rule.slot_duration_minutes })),
      ...dayExceptions.filter((exception) => exception.kind === "available" && exception.start_time && exception.end_time && exception.slot_duration_minutes).map((exception) => ({ start: exception.start_time!, end: exception.end_time!, duration: exception.slot_duration_minutes! })),
    ];

    for (const interval of intervals) {
      for (const time of makeTimes(interval.start, interval.end, interval.duration)) {
        if (dayExceptions.some((exception) => exception.kind === "unavailable" && isTimeWithin(time, exception.start_time, exception.end_time))) continue;
        if (isPast(date, time, now) || occupied.has(`${date}T${time}`)) continue;
        slots.push({ date, time, locationId });
      }
    }
  }

  const uniqueSlots = [...new Map(slots.map((slot) => [`${slot.date}T${slot.time}`, slot])).values()].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));
  return { state: uniqueSlots.length ? "AVAILABLE" : "NO_SLOTS", slots: uniqueSlots };
}

export async function isSlotAvailable(locationId: BookingLocationId, date: string, time: string) {
  const result = await getAvailableSlots({ locationId, from: date, to: date });
  return result.slots.some((slot) => slot.time === time);
}

function isIsoDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value); }
function eachDate(from: string, to: string) { const dates: string[] = []; const current = new Date(`${from}T12:00:00Z`); const end = new Date(`${to}T12:00:00Z`); while (current <= end) { dates.push(current.toISOString().slice(0, 10)); current.setUTCDate(current.getUTCDate() + 1); } return dates; }
function weekday(date: string) { return new Date(`${date}T12:00:00Z`).getUTCDay(); }
function isRuleValidForDate(rule: AvailabilityRule, date: string) { return (!rule.valid_from || rule.valid_from <= date) && (!rule.valid_to || rule.valid_to >= date); }
function makeTimes(start: string, end: string, duration: number) { const values: string[] = []; let minutes = toMinutes(start); const endMinutes = toMinutes(end); while (minutes + duration <= endMinutes) { values.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`); minutes += duration; } return values; }
function toMinutes(value: string) { const [hours, minutes] = value.slice(0, 5).split(":").map(Number); return hours * 60 + minutes; }
function isTimeWithin(time: string, start: string | null, end: string | null) { return (!start || time >= start.slice(0, 5)) && (!end || time < end.slice(0, 5)); }
function isPast(date: string, time: string, now: Date) { return new Date(`${date}T${time}:00`).getTime() <= now.getTime(); }
