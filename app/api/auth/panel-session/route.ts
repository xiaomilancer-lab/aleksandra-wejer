import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE } from "@/app/panel/server/requirePsychologist";
import { supabaseAdmin } from "@/lib/supabase-admin";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 30 * 60,
  priority: "high" as const,
};

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0", Pragma: "no-cache" };

function json(body: object, init?: { status?: number }) {
  return NextResponse.json(body, { ...init, headers: noStoreHeaders });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { accessToken?: unknown } | null;
  const accessToken = typeof body?.accessToken === "string" ? body.accessToken : null;
  if (!accessToken || accessToken.length > 8_192) return json({ message: "Brak uwierzytelnienia." }, { status: 401 });

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) return json({ message: "Nieprawidłowa sesja." }, { status: 401 });

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();
  if (profileError?.code === "PGRST205") {
    if (process.env.NODE_ENV !== "production") console.error("Panel profiles table is missing.");
    return json({ message: "Panel wymaga jednorazowej konfiguracji dostępu." }, { status: 503 });
  }
  if (profileError || profile?.role !== "psychologist") {
    return json({ message: "To konto nie ma dostępu do panelu." }, { status: 403 });
  }

  const response = json({ success: true });
  response.cookies.set(PANEL_SESSION_COOKIE, accessToken, cookieOptions);
  return response;
}

export async function DELETE() {
  const response = json({ success: true });
  response.cookies.set(PANEL_SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
