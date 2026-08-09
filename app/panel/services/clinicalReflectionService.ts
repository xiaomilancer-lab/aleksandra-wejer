import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { ReflectionCard, ReflectionCardInput } from "../domain";

const cardFields = "id, patient_id, visit_id, title, content, category, is_important, is_pinned_to_next_visit, created_at";

function isCardsTableMissing(errorCode: string | undefined) { return errorCode === "42P01"; }

export async function getReflectionCards(patientId: string): Promise<ReflectionCard[]> {
  const { data, error } = await supabaseAdmin.from("reflection_cards").select(cardFields).eq("patient_id", patientId).order("created_at", { ascending: false });
  if (error) {
    // TODO: Run create_reflection_cards.sql before enabling Clinical Reflection.
    if (isCardsTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as ReflectionCard[];
}

export async function getPinnedReflectionCards(patientId: string): Promise<ReflectionCard[]> {
  const { data, error } = await supabaseAdmin.from("reflection_cards").select(cardFields).eq("patient_id", patientId).eq("is_pinned_to_next_visit", true).order("created_at", { ascending: false });
  if (error) {
    // TODO: Run create_reflection_cards.sql before showing pinned reflections in Visit Brief.
    if (isCardsTableMissing(error.code)) return [];
    throw error;
  }
  return (data ?? []) as ReflectionCard[];
}

export async function createReflectionCard(input: ReflectionCardInput): Promise<ReflectionCard> {
  const { data, error } = await supabaseAdmin.from("reflection_cards").insert(toRecord(input)).select(cardFields).single();
  if (error) throw error;
  return data as ReflectionCard;
}

export async function updateReflectionCard(cardId: string, input: ReflectionCardInput): Promise<ReflectionCard> {
  const { data, error } = await supabaseAdmin.from("reflection_cards").update(toRecord(input)).eq("id", cardId).select(cardFields).single();
  if (error) throw error;
  return data as ReflectionCard;
}

function toRecord(input: ReflectionCardInput) { return { patient_id: input.patientId, visit_id: input.visitId ?? null, title: input.title.trim(), content: input.content.trim(), category: input.category, is_important: input.isImportant, is_pinned_to_next_visit: input.isPinnedToNextVisit }; }
