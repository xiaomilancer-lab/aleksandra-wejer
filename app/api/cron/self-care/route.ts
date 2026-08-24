import { refreshSelfCareCache } from "@/app/panel/server/selfCareAi";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await refreshSelfCareCache();
    return Response.json({ ok: true, refreshed: result.refreshed, refreshedAt: result.refreshedAt, itemCount: result.items.length });
  } catch (error) {
    console.error("Scheduled self-care refresh failed", error);
    return Response.json({ ok: false, error: "Refresh failed; previous cache preserved." }, { status: 503 });
  }
}
