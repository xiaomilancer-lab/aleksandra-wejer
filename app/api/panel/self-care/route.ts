import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import { refreshSelfCareCache } from "@/app/panel/server/selfCareAi";
import { getFamilyContentFreshness, getPublishedFamilyContent } from "@/lib/family-content-cache";

export const dynamic = "force-dynamic";
const MANUAL_REFRESH_COOLDOWN_MS = 6 * 60 * 60 * 1000;

function authError(kind: "unauthenticated" | "forbidden") {
  return Response.json({ error: kind === "unauthenticated" ? "Zaloguj się ponownie." : "Brak dostępu." }, { status: kind === "unauthenticated" ? 401 : 403 });
}

export async function GET(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") return authError(authorization.kind);

  try {
    const [items, freshness] = await Promise.all([getPublishedFamilyContent(), getFamilyContentFreshness()]);
    return Response.json({ items, refreshedAt: freshness.refreshedAt, isStale: freshness.isStale });
  } catch {
    return Response.json({ items: [], refreshedAt: null, isStale: true, fallback: true });
  }
}

export async function POST(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") return authError(authorization.kind);

  try {
    const freshness = await getFamilyContentFreshness();
    if (freshness.refreshedAt && Date.now() - new Date(freshness.refreshedAt).getTime() < MANUAL_REFRESH_COOLDOWN_MS) {
      return Response.json({ error: "Pakiet jest jeszcze świeży. Kolejne ręczne odświeżenie będzie możliwe po 6 godzinach." }, { status: 429 });
    }
    return Response.json(await refreshSelfCareCache({ force: true }));
  } catch (error) {
    console.error("Self-care AI refresh failed", error);
    return Response.json({ error: "PsychOLKA nie mogła teraz pobrać nowości. Ostatnia kolekcja pozostaje dostępna." }, { status: 503 });
  }
}
