import { supabaseAdmin } from "@/lib/supabase-admin";
import { bodyIsTooLarge, readPresenceInput, readSession, tableMissing, validatePublicPulseRequest } from "@/app/site-pulse/server";

const MIN_HEARTBEAT_INTERVAL_MS = 30_000;

export async function POST(request: Request) {
  if (!validatePublicPulseRequest(request) || bodyIsTooLarge(request)) return Response.json({ accepted: false }, { status: 400 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const session = body && readSession(body);
  const input = body && readPresenceInput(body);
  if (!session) return Response.json({ accepted: false }, { status: 401 });
  if (!input) return Response.json({ accepted: false }, { status: 400 });

  const existing = await supabaseAdmin.from("site_analytics_presence").select("last_seen_at").eq("journey_id", session.journeyId).maybeSingle();
  if (existing.error) return tableMissing(existing.error.code) ? migrationPending() : Response.json({ accepted: false }, { status: 503 });
  if (existing.data && Date.now() - new Date(existing.data.last_seen_at).getTime() < MIN_HEARTBEAT_INTERVAL_MS) return Response.json({ accepted: true, throttled: true });

  const now = new Date().toISOString();
  const presence = {
    journey_id: session.journeyId,
    last_seen_at: now,
    page_key: input.pageKey,
    section_key: input.sectionKey,
    source_key: input.attribution.sourceKey,
    ...(existing.data ? {} : { first_seen_at: now }),
  };
  const { error } = await supabaseAdmin.from("site_analytics_presence").upsert(presence, { onConflict: "journey_id" });
  if (error) return tableMissing(error.code) ? migrationPending() : Response.json({ accepted: false }, { status: 503 });
  return Response.json({ accepted: true });
}

function migrationPending() {
  return Response.json({ accepted: false, migrationRequired: true }, { status: 202 });
}
