import { createHash } from "node:crypto";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import {
  aiChatIntents,
  materialAgeGroups,
  materialObjectives,
  materialTopics,
  type AiChatIntent,
  type MaterialAgeGroup,
  type MaterialObjective,
  type MaterialTopic,
} from "@/app/panel/domain";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const COOLDOWN_MS = 8_000;
const requestTimes = new Map<string, number>();

type OpenAiResponse = {
  status?: string;
  error?: { message?: string } | null;
  output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
};

function authError(kind: "unauthenticated" | "forbidden") {
  return Response.json(
    { error: kind === "unauthenticated" ? "Zaloguj się ponownie." : "Brak dostępu." },
    { status: kind === "unauthenticated" ? 401 : 403 },
  );
}

function extractOutputText(response: OpenAiResponse) {
  return response.output
    ?.flatMap((item) => item.type === "message" ? item.content ?? [] : [])
    .find((content) => content.type === "output_text")?.text?.trim() ?? null;
}

export async function POST(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") return authError(authorization.kind);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "PsychOLKA AI jest chwilowo niedostępna." }, { status: 503 });

  const lastRequest = requestTimes.get(authorization.identity.userId) ?? 0;
  if (Date.now() - lastRequest < COOLDOWN_MS) {
    return Response.json({ error: "Odczekaj kilka sekund przed kolejnym pytaniem." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const ageGroup = materialAgeGroups.includes(body.ageGroup as MaterialAgeGroup) ? body.ageGroup as MaterialAgeGroup : null;
  const topic = materialTopics.includes(body.topic as MaterialTopic) ? body.topic as MaterialTopic : null;
  const objective = materialObjectives.includes(body.objective as MaterialObjective) ? body.objective as MaterialObjective : null;
  const intent = aiChatIntents.includes(body.intent as AiChatIntent) ? body.intent as AiChatIntent : null;
  if (!ageGroup || !topic || !objective || !intent) {
    return Response.json({ error: "Wybierz grupę, temat, cel i rodzaj odpowiedzi z bezpiecznych list." }, { status: 400 });
  }

  requestTimes.set(authorization.identity.userId, Date.now());

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        store: false,
        reasoning: { effort: "low" },
        max_output_tokens: 1000,
        safety_identifier: createHash("sha256").update(authorization.identity.userId).digest("hex"),
        text: { verbosity: "low" },
        instructions: "Jesteś ostrożnym asystentem wiedzy psychologicznej dla wykwalifikowanej psycholożki pracującej w Polsce. Otrzymujesz wyłącznie neutralne wartości z zamkniętych list, nigdy dane pacjenta ani opis konkretnej osoby. Odpowiadasz po polsku, rzeczowo, ciepło i zwięźle. Pomagasz uporządkować wiedzę, proponujesz pytania lub psychoedukacyjne ćwiczenia do samodzielnej oceny przez psycholożkę. Nie diagnozujesz, nie ustalasz leczenia, nie zastępujesz superwizji, badania klinicznego, aktualnych standardów ani procedur placówki. Nie twórz fikcyjnych źródeł ani cytowań. Wyraźnie wskaż ograniczenia i sytuacje wymagające indywidualnej oceny bezpieczeństwa. Przy ryzyku samouszkodzenia, przemocy lub bezpośredniego zagrożenia życia przypomnij o procedurach kryzysowych i numerze 112.",
        input: `BEZPIECZNE, ANONIMOWE USTAWIENIA\nGrupa: ${ageGroup}\nTemat: ${topic}\nCel: ${objective}\nProśba: ${intent}`,
      }),
      cache: "no-store",
    });

    const payload = await response.json() as OpenAiResponse;
    if (!response.ok || payload.status === "failed") {
      throw new Error(payload.error?.message || `OpenAI zwróciło status ${response.status}.`);
    }

    const answer = extractOutputText(payload);
    if (!answer) throw new Error("Brak treści odpowiedzi.");
    return Response.json({ answer });
  } catch (error) {
    console.error("Psychology AI chat failed", error);
    return Response.json({ error: "PsychOLKA AI chwilowo nie odpowiada. Spróbuj ponownie za moment." }, { status: 503 });
  }
}
