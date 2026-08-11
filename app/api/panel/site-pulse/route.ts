import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import { getSitePulseDashboardData } from "@/app/panel/services/sitePulseService";

export async function GET(request: Request) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind === "unauthenticated") return Response.json({ message: "Brak dostępu." }, { status: 401 });
  if (authorization.kind === "forbidden") return Response.json({ message: "Brak uprawnienia." }, { status: 403 });
  try {
    return Response.json(await getSitePulseDashboardData(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Puls strony jest chwilowo niedostępny." }, { status: 503 });
  }
}
