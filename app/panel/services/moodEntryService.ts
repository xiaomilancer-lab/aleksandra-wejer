import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { MoodEntry, MoodEntryInput } from "../domain";

const fields = "id, patient_id, date, mood, note, created_at";
const isTableMissing = (code: string | undefined) => code === "42P01";

export async function getMoodEntries(patientId: string, days = 14): Promise<MoodEntry[]> {
  const safeDays = Math.min(Math.max(days, 1), 90);
  const from = new Date();
  from.setDate(from.getDate() - safeDays + 1);
  const { data, error } = await supabaseAdmin.from("mood_entries").select(fields).eq("patient_id", patientId).gte("date", from.toISOString().slice(0, 10)).order("date", { ascending: false });
  if (error) {
    if (isTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as MoodEntry[];
}

export async function saveMoodEntry(input: MoodEntryInput): Promise<MoodEntry> {
  const { data, error } = await supabaseAdmin.from("mood_entries").upsert({ patient_id: input.patientId, date: input.date, mood: input.mood, note: input.note?.trim() || null }, { onConflict: "patient_id,date" }).select(fields).single();
  if (error) throw error;
  return data as MoodEntry;
}
