import { createHash } from "node:crypto";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import {
  knowledgeCategories,
  materialAgeGroups,
  materialFormats,
  materialObjectives,
  materialTopics,
  type GeneratedMaterialPackage,
  type KnowledgeCategory,
  type MaterialAgeGroup,
  type MaterialFormat,
  type MaterialObjective,
  type MaterialTopic,
} from "@/app/panel/domain";

export const dynamic = "force-dynamic";
const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const requestTimes = new Map<string, number>();
const COOLDOWN_MS = 30_000;

type OpenAiResponse = {
  status?: string;
  error?: { message?: string } | null;
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
};

const materialSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kind: { type: "string", enum: ["professional", "home"] },
    title: { type: "string", minLength: 5, maxLength: 110 },
    category: { type: "string", enum: [...knowledgeCategories] },
    description: { type: "string", minLength: 20, maxLength: 360 },
    tags: { type: "array", minItems: 3, maxItems: 10, items: { type: "string", minLength: 2, maxLength: 40 } },
    content: { type: "string", minLength: 300, maxLength: 7000 },
  },
  required: ["kind", "title", "category", "description", "tags", "content"],
} as const;

const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", minLength: 20, maxLength: 500 },
    safety_note: { type: "string", minLength: 20, maxLength: 500 },
    professional_material: { ...materialSchema, properties: { ...materialSchema.properties, kind: { type: "string", enum: ["professional"] } } },
    home_material: { ...materialSchema, properties: { ...materialSchema.properties, kind: { type: "string", enum: ["home"] } } },
  },
  required: ["summary", "safety_note", "professional_material", "home_material"],
} as const;

function extractOutputText(response: OpenAiResponse) {
  return response.output
    ?.flatMap((item) => item.type === "message" ? item.content ?? [] : [])
    .find((content) => content.type === "output_text")?.text ?? null;
}

function isCategory(value: unknown): value is KnowledgeCategory { return knowledgeCategories.includes(value as KnowledgeCategory); }
function isGeneratedPackage(value: unknown): value is { summary: string; safety_note: string; professional_material: GeneratedMaterialPackage["professionalMaterial"]; home_material: GeneratedMaterialPackage["homeMaterial"] } {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const validMaterial = (candidate: unknown, kind: "professional" | "home") => {
    if (!candidate || typeof candidate !== "object") return false;
    const material = candidate as Record<string, unknown>;
    return material.kind === kind && isCategory(material.category)
      && ["title", "description", "content"].every((key) => typeof material[key] === "string")
      && Array.isArray(material.tags) && material.tags.every((tag) => typeof tag === "string");
  };
  return typeof item.summary === "string" && typeof item.safety_note === "string"
    && validMaterial(item.professional_material, "professional") && validMaterial(item.home_material, "home");
}

export async function POST(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") {
    return Response.json({ error: authorization.kind === "unauthenticated" ? "Zaloguj się ponownie." : "Brak dostępu." }, { status: authorization.kind === "unauthenticated" ? 401 : 403 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "PsychOLKA AI chwilowo odpoczywa. Materiały offline nadal działają." }, { status: 503 });

  const lastRequest = requestTimes.get(authorization.identity.userId) ?? 0;
  if (Date.now() - lastRequest < COOLDOWN_MS) return Response.json({ error: "Odczekaj chwilę przed kolejnym generowaniem." }, { status: 429 });

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const ageGroup = materialAgeGroups.includes(body.ageGroup as MaterialAgeGroup) ? body.ageGroup as MaterialAgeGroup : "Dziecko 9–12 lat";
  const topic = materialTopics.includes(body.topic as MaterialTopic) ? body.topic as MaterialTopic : null;
  const objective = materialObjectives.includes(body.objective as MaterialObjective) ? body.objective as MaterialObjective : null;
  const format = materialFormats.includes(body.format as MaterialFormat) ? body.format as MaterialFormat : null;
  if (!topic || !objective || !format) return Response.json({ error: "Wybierz temat, cel i format z bezpiecznej listy." }, { status: 400 });

  requestTimes.set(authorization.identity.userId, Date.now());
  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        store: false,
        reasoning: { effort: "low" },
        max_output_tokens: 4200,
        safety_identifier: createHash("sha256").update(authorization.identity.userId).digest("hex"),
        text: { verbosity: "low", format: { type: "json_schema", name: "psycholka_visit_materials", strict: true, schema: outputSchema } },
        instructions: "Jesteś asystentką materiałową dla wykwalifikowanej psycholożki w Polsce. Otrzymujesz wyłącznie neutralne wartości wybrane z zamkniętych list — nigdy dane pacjenta ani notatki z wizyty. Tworzysz robocze, psychoedukacyjne materiały pomocnicze do indywidualnej oceny i edycji przez psycholożkę. Nie diagnozujesz, nie dobierasz leczenia, nie składasz obietnic efektu i nie zastępujesz oceny bezpieczeństwa. Pisz po polsku, ciepło, konkretnie i neuroróżnorodnie afirmująco. Przygotuj dokładnie dwa samodzielne materiały: szczegółowy przewodnik do pracy podczas spotkania oraz bezpieczne, proste ćwiczenie domowe. Każdy materiał ma zawierać cel, przygotowanie, przebieg krok po kroku, pytania domykające, wariant łatwiejszy i sygnały do przerwania lub dostosowania. Dla dzieci stosuj atrakcyjne symbole, scenki, kolory opisane tekstem i elementy do wycięcia lub narysowania. Nie twórz materiału kryzysowego ani interwencyjnego.",
        input: `BEZPIECZNE USTAWIENIA MATERIAŁU\nGrupa: ${ageGroup}\nTemat: ${topic}\nCel: ${objective}\nFormat: ${format}`,
      }),
      cache: "no-store",
    });
    const payload = await response.json() as OpenAiResponse;
    if (!response.ok || payload.status === "failed") throw new Error(payload.error?.message || `OpenAI zwróciło status ${response.status}.`);
    const outputText = extractOutputText(payload);
    if (!outputText) throw new Error("Brak treści odpowiedzi.");
    const parsed = JSON.parse(outputText) as unknown;
    if (!isGeneratedPackage(parsed)) throw new Error("Materiał nie przeszedł kontroli formatu.");
    return Response.json({
      summary: parsed.summary,
      safetyNote: parsed.safety_note,
      professionalMaterial: parsed.professional_material,
      homeMaterial: parsed.home_material,
    } satisfies GeneratedMaterialPackage);
  } catch (error) {
    console.error("Visit material generation failed", error);
    return Response.json({ error: "PsychOLKA AI chwilowo odpoczywa. Skorzystaj z wyników biblioteki offline i spróbuj później." }, { status: 503 });
  }
}
