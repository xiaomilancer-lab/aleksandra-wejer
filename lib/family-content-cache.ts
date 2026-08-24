import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

export const FAMILY_CACHE_PREFIX = "psycholka-ai:";
// The production cron runs every morning. A 20-hour freshness window makes
// each daily run prepare a genuinely new pack instead of reusing yesterday's.
export const FAMILY_CACHE_MAX_AGE_HOURS = 20;

export type FamilyContentCategory = "attraction" | "event" | "restaurant" | "hotel" | "cinema" | "netflix" | "deal";

export type FamilyContentItem = {
  id: string;
  cacheKey: string;
  category: FamilyContentCategory;
  title: string;
  eyebrow: string;
  description: string;
  note: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
  refreshedAt: string;
  expiresAt: string;
  isExpired: boolean;
};

type CacheRow = {
  id: string;
  cache_key: string;
  category: FamilyContentCategory;
  title: string;
  payload: unknown;
  source_label: string | null;
  source_url: string | null;
  refreshed_at: string;
  expires_at: string;
};

function readText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function mapCacheRow(row: CacheRow): FamilyContentItem {
  const payload = row.payload && typeof row.payload === "object" ? row.payload as Record<string, unknown> : {};
  return {
    id: row.id,
    cacheKey: row.cache_key,
    category: row.category,
    title: row.title,
    eyebrow: readText(payload.eyebrow, "PsychOLKA poleca"),
    description: readText(payload.description),
    note: readText(payload.note, "Sprawdź szczegóły w źródle przed wyjściem."),
    sourceLabel: row.source_label,
    sourceUrl: row.source_url,
    refreshedAt: row.refreshed_at,
    expiresAt: row.expires_at,
    isExpired: new Date(row.expires_at).getTime() <= Date.now(),
  };
}

export async function getPublishedFamilyContent() {
  const { data, error } = await supabaseAdmin
    .from("family_content_cache")
    .select("id, cache_key, category, title, payload, source_label, source_url, refreshed_at, expires_at")
    .eq("is_published", true)
    .order("category")
    .order("refreshed_at", { ascending: false });

  if (error) throw new Error("Nie udało się odczytać wspólnego cache PsychOLKI.");
  return (data as CacheRow[]).map(mapCacheRow);
}

export async function getFamilyContentFreshness() {
  const { data, error } = await supabaseAdmin
    .from("family_content_cache")
    .select("refreshed_at")
    .like("cache_key", `${FAMILY_CACHE_PREFIX}%`)
    .eq("is_published", true)
    .order("refreshed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error("Nie udało się sprawdzić daty cache PsychOLKI.");
  const refreshedAt = typeof data?.refreshed_at === "string" ? data.refreshed_at : null;
  const ageMs = refreshedAt ? Date.now() - new Date(refreshedAt).getTime() : Number.POSITIVE_INFINITY;
  return {
    refreshedAt,
    isStale: ageMs >= FAMILY_CACHE_MAX_AGE_HOURS * 60 * 60 * 1000,
  };
}
