import { createHash } from "node:crypto";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";

export const dynamic = "force-dynamic";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const requestTimes = new Map<string, number>();
const COOLDOWN_MS = 60_000;

const allowed = {
  occasion: ["Urodziny", "Rocznica", "Święta", "Podziękowanie", "Bez okazji"],
  recipient: ["Partner / partnerka", "Dziecko", "Nastolatek / nastolatka", "Rodzic", "Przyjaciel / przyjaciółka"],
  budget: ["do 100 zł", "100–250 zł", "250–500 zł", "powyżej 500 zł"],
  interest: ["Książki i kultura", "Dom i wnętrza", "Moda", "Relaks i wellness", "Technologia", "Wspólne przeżycie", "Rodzinny wyjazd"],
} as const;

type OpenAiResponse = { status?: string; error?: { message?: string } | null; output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> };
const outputSchema = { type: "object", additionalProperties: false, properties: { suggestions: { type: "array", minItems: 3, maxItems: 5, items: { type: "object", additionalProperties: false, properties: { title: { type: "string", minLength: 3, maxLength: 100 }, description: { type: "string", minLength: 20, maxLength: 320 }, budget_note: { type: "string", minLength: 5, maxLength: 140 }, source_label: { type: "string", minLength: 2, maxLength: 100 }, source_url: { type: "string", minLength: 10, maxLength: 500 } }, required: ["title", "description", "budget_note", "source_label", "source_url"] } } }, required: ["suggestions"] } as const;

function extractOutputText(response: OpenAiResponse) { return response.output?.flatMap((item) => item.type === "message" ? item.content ?? [] : []).find((content) => content.type === "output_text")?.text ?? null; }
function pick<K extends keyof typeof allowed>(key: K, value: unknown) { return allowed[key].includes(value as never) ? value as (typeof allowed)[K][number] : null; }

export async function POST(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") return Response.json({ error: authorization.kind === "unauthenticated" ? "Zaloguj się ponownie." : "Brak dostępu." }, { status: authorization.kind === "unauthenticated" ? 401 : 403 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "PsychOLKA AI chwilowo odpoczywa." }, { status: 503 });
  const lastRequest = requestTimes.get(authorization.identity.userId) ?? 0;
  if (Date.now() - lastRequest < COOLDOWN_MS) return Response.json({ error: "Odczekaj minutę przed kolejnym wyszukiwaniem prezentów." }, { status: 429 });
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const occasion = pick("occasion", body.occasion); const recipient = pick("recipient", body.recipient); const budget = pick("budget", body.budget); const interest = pick("interest", body.interest);
  if (!occasion || !recipient || !budget || !interest) return Response.json({ error: "Wybierz wartości z bezpiecznej listy." }, { status: 400 });
  requestTimes.set(authorization.identity.userId, Date.now());
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-5.6-luna", store: false, reasoning: { effort: "low" }, max_output_tokens: 1700, safety_identifier: createHash("sha256").update(authorization.identity.userId).digest("hex"), tools: [{ type: "web_search_preview", search_context_size: "low", user_location: { type: "approximate", country: "PL", city: "Starogard Gdański", region: "Pomorskie", timezone: "Europe/Warsaw" } }], text: { verbosity: "low", format: { type: "json_schema", name: "psycholka_gift_suggestions", strict: true, schema: outputSchema } }, instructions: "Jesteś ostrożną polską redaktorką prezentową. Podajesz ciepłe, konkretne i różnorodne pomysły, ale nie zgadujesz cen ani dostępności. Korzystasz z aktualnych, najlepiej oficjalnych źródeł i dla każdej propozycji podajesz bezpośredni adres HTTPS. Otrzymujesz wyłącznie neutralne kategorie, bez danych osobowych.", input: `Okazja: ${occasion}\nOdbiorca: ${recipient}\nBudżet: ${budget}\nKierunek: ${interest}\n\nPrzygotuj 3-5 aktualnych propozycji dostępnych w Polsce. Zaznacz potrzebę sprawdzenia aktualnej ceny.` }), cache: "no-store" });
    const payload = await response.json() as OpenAiResponse;
    if (!response.ok || payload.status === "failed") throw new Error(payload.error?.message || `OpenAI zwróciło status ${response.status}.`);
    const outputText = extractOutputText(payload); if (!outputText) throw new Error("Brak treści odpowiedzi.");
    const parsed = JSON.parse(outputText) as { suggestions?: Array<Record<string, unknown>> };
    const suggestions = (parsed.suggestions ?? []).filter((item) => /^https:\/\//i.test(String(item.source_url ?? ""))).map((item) => ({ title: String(item.title ?? ""), description: String(item.description ?? ""), budgetNote: String(item.budget_note ?? ""), sourceLabel: String(item.source_label ?? "Źródło"), sourceUrl: String(item.source_url ?? "") }));
    if (suggestions.length < 3) throw new Error("Propozycje nie przeszły kontroli źródeł.");
    return Response.json({ suggestions });
  } catch (error) { console.error("Gift suggestion generation failed", error); return Response.json({ error: "PsychOLKA chwilowo odpoczywa. Spróbuj później." }, { status: 503 }); }
}
