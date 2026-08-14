import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ImportantDate, ImportantDateInput, ImportantDateOccurrence } from "../domain";

const fields = "id, title, person_name, occasion, event_date, recurs_yearly, reminder_days, gift_notes, notes, last_completed_occurrence, created_at, updated_at";
const isTableMissing = (code: string | undefined) => code === "42P01";

export async function getImportantDates(): Promise<ImportantDate[]> {
  const { data, error } = await supabaseAdmin.from("important_dates").select(fields).order("event_date");
  if (error) {
    if (isTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as ImportantDate[];
}

export async function createImportantDate(input: ImportantDateInput): Promise<ImportantDate> {
  const { data, error } = await supabaseAdmin.from("important_dates").insert(toRow(input)).select(fields).single();
  if (error) throw error;
  return data as ImportantDate;
}

export async function updateImportantDate(id: string, input: ImportantDateInput): Promise<ImportantDate> {
  const { data, error } = await supabaseAdmin.from("important_dates").update({ ...toRow(input), updated_at: new Date().toISOString() }).eq("id", id).select(fields).single();
  if (error) throw error;
  return data as ImportantDate;
}

export async function deleteImportantDate(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("important_dates").delete().eq("id", id);
  if (error) throw error;
}

export async function setImportantDateCompletion(id: string, occurrenceDate: string | null): Promise<ImportantDate> {
  const { data, error } = await supabaseAdmin.from("important_dates").update({ last_completed_occurrence: occurrenceDate, updated_at: new Date().toISOString() }).eq("id", id).select(fields).single();
  if (error) throw error;
  return data as ImportantDate;
}

export function getImportantDateOccurrences(items: ImportantDate[], today = warsawDate()): ImportantDateOccurrence[] {
  return items.map((item) => {
    const occurrenceDate = nextOccurrence(item, today);
    return {
      item,
      occurrenceDate,
      daysUntil: differenceInDays(today, occurrenceDate),
      isCompleted: item.last_completed_occurrence === occurrenceDate,
    };
  }).sort((a, b) => a.daysUntil - b.daysUntil || a.item.title.localeCompare(b.item.title, "pl"));
}

function toRow(input: ImportantDateInput) {
  return {
    title: input.title.trim(),
    person_name: input.personName?.trim() ?? "",
    occasion: input.occasion,
    event_date: input.eventDate,
    recurs_yearly: input.recursYearly,
    reminder_days: [...new Set(input.reminderDays)].sort((a, b) => b - a),
    gift_notes: input.giftNotes?.trim() ?? "",
    notes: input.notes?.trim() ?? "",
  };
}

function nextOccurrence(item: ImportantDate, today: string) {
  if (!item.recurs_yearly) return item.event_date;
  const [, month, day] = item.event_date.split("-").map(Number);
  const year = Number(today.slice(0, 4));
  const thisYear = validDate(year, month, day);
  return thisYear >= today ? thisYear : validDate(year + 1, month, day);
}

function validDate(year: number, month: number, day: number) {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(Math.min(day, lastDay)).padStart(2, "0")}`;
}

function differenceInDays(from: string, to: string) {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

function warsawDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
