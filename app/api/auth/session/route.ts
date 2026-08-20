import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE } from "@/app/panel/server/requirePsychologist";
import { MEMBER_SESSION_COOKIE } from "@/app/room/server/requireMember";
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

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
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

  if (profileError || !profile) {
    return json({ message: "Konto nie ma jeszcze aktywnego profilu." }, { status: 403 });
  }

  if (profile.role === "psychologist") {
    const response = json({ success: true, role: profile.role, destination: "/panel" });
    response.cookies.set(PANEL_SESSION_COOKIE, accessToken, cookieOptions);
    clearCookie(response, MEMBER_SESSION_COOKIE);
    return response;
  }

  if (profile.role === "patient" || profile.role === "parent") {
    const response = json({ success: true, role: profile.role, destination: "/room" });
    response.cookies.set(MEMBER_SESSION_COOKIE, accessToken, cookieOptions);
    clearCookie(response, PANEL_SESSION_COOKIE);
    return response;
  }

  return json({ message: "To konto nie ma dostępu do aplikacji." }, { status: 403 });
}

export async function DELETE() {
  const response = json({ success: true });
  clearCookie(response, PANEL_SESSION_COOKIE);
  clearCookie(response, MEMBER_SESSION_COOKIE);
  response.cookies.set("psycholka-patient-vault", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/panel",
    maxAge: 0,
  });
  response.cookies.set("psycholka-patient-vault", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/panel/patients",
    maxAge: 0,
  });
  return response;
}
