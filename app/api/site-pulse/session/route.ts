import { createSitePulseSessionToken } from "@/app/site-pulse/sessionToken";
import { bodyIsTooLarge, validatePublicPulseRequest } from "@/app/site-pulse/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!validatePublicPulseRequest(request) || bodyIsTooLarge(request)) return Response.json({ message: "Invalid request." }, { status: 400 });
  try {
    return Response.json(createSitePulseSessionToken(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Site Pulse is not configured." }, { status: 503 });
  }
}
