import { getMemberAuthorization } from "@/app/room/server/requireMember";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  const authorization = await getMemberAuthorization();
  if (authorization.kind !== "authorized") {
    return Response.json({ accepted: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { path?: unknown } | null;
  const requestedPath = typeof body?.path === "string" ? body.path.trim() : "";
  const currentPath = requestedPath.startsWith("/room") && requestedPath.length <= 200
    ? requestedPath
    : "/room";

  const { error } = await supabaseAdmin.from("member_presence").upsert({
    user_id: authorization.identity.userId,
    last_seen_at: new Date().toISOString(),
    current_path: currentPath,
  }, { onConflict: "user_id" });

  if (error) {
    const configurationPending = error.code === "PGRST205" || error.code === "42P01";
    return Response.json(
      { accepted: false, configurationPending },
      { status: configurationPending ? 200 : 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return Response.json(
    { accepted: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
