import { supabaseAdmin } from "@/lib/supabase-admin";
import { bodyIsTooLarge, readEventInput, readSession, tableMissing, validatePublicPulseRequest } from "@/app/site-pulse/server";

const MAX_EVENTS_PER_HOUR = 60;

export async function POST(request: Request) {
  if (!validatePublicPulseRequest(request) || bodyIsTooLarge(request)) return Response.json({ accepted: false }, { status: 400 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const session = body && readSession(body);
  const input = body && readEventInput(body);
  if (!session) return Response.json({ accepted: false }, { status: 401 });
  if (!input) return Response.json({ accepted: false }, { status: 400 });

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const countResult = await supabaseAdmin.from("site_analytics_events").select("id", { count: "exact", head: true }).eq("journey_id", session.journeyId).gte("occurred_at", hourAgo);
  if (countResult.error) return tableMissing(countResult.error.code) ? migrationPending() : Response.json({ accepted: false }, { status: 503 });
  if ((countResult.count ?? 0) >= MAX_EVENTS_PER_HOUR) return Response.json({ accepted: false }, { status: 429 });

  const { error } = await supabaseAdmin.from("site_analytics_events").insert({
    event_id: input.eventId,
    journey_id: session.journeyId,
    event_type: input.eventType,
    page_key: input.pageKey,
    section_key: input.sectionKey,
    source_key: input.attribution.sourceKey,
    utm_source: input.attribution.utmSource,
    utm_medium: input.attribution.utmMedium,
    utm_campaign: input.attribution.utmCampaign,
  });
  if (error?.code === "23505") return Response.json({ accepted: true, duplicate: true });
  if (error) return tableMissing(error.code) ? migrationPending() : Response.json({ accepted: false }, { status: 503 });
  return Response.json({ accepted: true });
}

function migrationPending() {
  return Response.json({ accepted: false, migrationRequired: true }, { status: 202 });
}
