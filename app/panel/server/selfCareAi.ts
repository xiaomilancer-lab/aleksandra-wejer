import "server-only";

import { FAMILY_CACHE_PREFIX, getFamilyContentFreshness, getPublishedFamilyContent, type FamilyContentCategory } from "@/lib/family-content-cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const CACHE_LIFETIME_DAYS = 2;

type GeneratedItem = {
  category: FamilyContentCategory;
  title: string;
  eyebrow: string;
  description: string;
  note: string;
  source_label: string;
  source_url: string;
};

type OpenAiResponse = {
  status?: string;
  error?: { message?: string } | null;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  usage?: { input_tokens?: number; output_tokens?: number; total_tokens?: number } | null;
};

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      minItems: 10,
      maxItems: 14,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string", enum: ["attraction", "event", "restaurant", "hotel", "cinema", "netflix", "deal"] },
          title: { type: "string", minLength: 3, maxLength: 100 },
          eyebrow: { type: "string", minLength: 3, maxLength: 80 },
          description: { type: "string", minLength: 20, maxLength: 360 },
          note: { type: "string", minLength: 10, maxLength: 220 },
          source_label: { type: "string", minLength: 2, maxLength: 100 },
          source_url: { type: "string", minLength: 10, maxLength: 500 },
        },
        required: ["category", "title", "eyebrow", "description", "note", "source_label", "source_url"],
      },
    },
  },
  required: ["items"],
} as const;

function extractOutputText(response: OpenAiResponse) {
  return response.output
    ?.flatMap((item) => item.type === "message" ? item.content ?? [] : [])
    .find((content) => content.type === "output_text")?.text ?? null;
}

function isGeneratedItem(value: unknown): value is GeneratedItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const categories: FamilyContentCategory[] = ["attraction", "event", "restaurant", "hotel", "cinema", "netflix", "deal"];
  return categories.includes(item.category as FamilyContentCategory)
    && ["title", "eyebrow", "description", "note", "source_label", "source_url"].every((key) => typeof item[key] === "string")
    && /^https:\/\//i.test(item.source_url as string);
}

async function generateItems() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Brakuje serwerowej zmiennej OPENAI_API_KEY.");

  const today = new Intl.DateTimeFormat("pl-PL", { dateStyle: "full", timeZone: "Europe/Warsaw" }).format(new Date());
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.6-luna",
      store: false,
      reasoning: { effort: "low" },
      max_output_tokens: 2600,
      tools: [{
        type: "web_search_preview",
        search_context_size: "low",
        user_location: { type: "approximate", country: "PL", city: "Starogard Gdański", region: "Pomorskie", timezone: "Europe/Warsaw" },
      }],
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "psycholka_fresh_inspirations",
          strict: true,
          schema: outputSchema,
        },
      },
      instructions: "Jesteś ostrożną polską redaktorką PsychOLKI. Przygotowujesz krótkie, ciepłe i praktyczne inspiracje, nigdy porady medyczne. Korzystaj wyłącznie z aktualnych, wiarygodnych stron źródłowych. Nie zgaduj dat, repertuarów, cen, dostępności ani kodów rabatowych. Kod rabatowy podawaj tylko wtedy, gdy widnieje w aktualnym oficjalnym źródle; w przeciwnym razie opisz promocję bez wymyślania kodu. Każdy element musi mieć bezpośredni adres HTTPS do źródła. Preferuj źródła oficjalne. Nie umieszczaj danych osobowych użytkowników. Nie przygotowuj propozycji prezentów — są uruchamiane osobno i wyłącznie na wyraźne życzenie psycholożki.",
      input: `Dzisiaj jest ${today}. Znajdź 10-14 świeżych propozycji dla psycholożki i rodzin z okolic Starogardu Gdańskiego, powiatu starogardzkiego, Trójmiasta oraz na rodzinny wyjazd do około 200 km. Uwzględnij: atrakcje dla dzieci, wydarzenia, ciekawą restaurację, hotel rodzinny, lekką premierę kinową, nowości Netflix (szczególnie koreański romans lub komedię romantyczną) oraz 2-3 aktualne promocje w lubianych sklepach, np. Zalando, eobuwie, MODIVO, ASOS lub IKEA. Wydarzenia i promocje minione odrzuć. Teksty mają być po polsku, konkretne i spokojne. W polu note podaj ważną datę, miejscowość, warunki promocji albo zalecenie sprawdzenia dostępności.`,
    }),
    cache: "no-store",
  });

  const payload = await response.json() as OpenAiResponse;
  if (!response.ok || payload.status === "failed") {
    throw new Error(payload.error?.message || `OpenAI zwróciło status ${response.status}.`);
  }

  const outputText = extractOutputText(payload);
  if (!outputText) throw new Error("OpenAI nie zwróciło treści do zapisania.");
  const parsed = JSON.parse(outputText) as { items?: unknown[] };
  const items = Array.isArray(parsed.items) ? parsed.items.filter(isGeneratedItem) : [];
  if (items.length < 6) throw new Error("Pakiet AI nie przeszedł kontroli kompletności.");
  return { items, usage: payload.usage ?? null };
}

export async function refreshSelfCareCache({ force = false }: { force?: boolean } = {}) {
  const freshness = await getFamilyContentFreshness();
  if (!force && !freshness.isStale) {
    return { refreshed: false, items: await getPublishedFamilyContent(), refreshedAt: freshness.refreshedAt, usage: null };
  }

  const generated = await generateItems();
  const refreshedAt = new Date();
  const expiresAt = new Date(refreshedAt.getTime() + CACHE_LIFETIME_DAYS * 24 * 60 * 60 * 1000);
  const rows = generated.items.map((item, index) => ({
    cache_key: `${FAMILY_CACHE_PREFIX}${String(index + 1).padStart(2, "0")}`,
    category: item.category,
    area: "pomorskie",
    title: item.title,
    payload: { eyebrow: item.eyebrow, description: item.description, note: item.note },
    source_label: item.source_label,
    source_url: item.source_url,
    is_published: true,
    refreshed_at: refreshedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
  }));

  const { error: upsertError } = await supabaseAdmin
    .from("family_content_cache")
    .upsert(rows, { onConflict: "cache_key" });
  if (upsertError) throw new Error("Nie udało się zapisać nowego pakietu PsychOLKI.");

  const activeKeys = rows.map((row) => row.cache_key);
  const quotedActiveKeys = activeKeys.map((key) => `"${key}"`).join(",");
  const { error: hideError } = await supabaseAdmin
    .from("family_content_cache")
    .update({ is_published: false })
    .like("cache_key", `${FAMILY_CACHE_PREFIX}%`)
    .not("cache_key", "in", `(${quotedActiveKeys})`);
  if (hideError) console.warn("Nie udało się ukryć starszych nadmiarowych wpisów cache.");

  return {
    refreshed: true,
    items: await getPublishedFamilyContent(),
    refreshedAt: refreshedAt.toISOString(),
    usage: generated.usage,
  };
}
