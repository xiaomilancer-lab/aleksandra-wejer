import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE } from "@/app/panel/server/requirePsychologist";
import { MEMBER_SESSION_COOKIE } from "@/app/room/server/requireMember";
import { supabaseAdmin } from "@/lib/supabase-admin";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60,
};

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", { ...cookieOptions, maxAge: 0 });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { accessToken?: unknown } | null;
  const accessToken = typeof body?.accessToken === "string" ? body.accessToken : null;
  if (!accessToken) return NextResponse.json({ message: "Brak uwierzytelnienia." }, { status: 401 });

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) return NextResponse.json({ message: "Nieprawidłowa sesja." }, { status: 401 });

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ message: "Konto nie ma jeszcze aktywnego profilu." }, { status: 403 });
  }

  if (profile.role === "psychologist") {
    const response = NextResponse.json({ success: true, role: profile.role, destination: "/panel" });
    response.cookies.set(PANEL_SESSION_COOKIE, accessToken, cookieOptions);
    clearCookie(response, MEMBER_SESSION_COOKIE);
    return response;
  }

  if (profile.role === "patient" || profile.role === "parent") {
    const response = NextResponse.json({ success: true, role: profile.role, destination: "/room" });
    response.cookies.set(MEMBER_SESSION_COOKIE, accessToken, cookieOptions);
    clearCookie(response, PANEL_SESSION_COOKIE);
    return response;
  }

  return NextResponse.json({ message: "To konto nie ma dostępu do aplikacji." }, { status: 403 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearCookie(response, PANEL_SESSION_COOKIE);
  clearCookie(response, MEMBER_SESSION_COOKIE);
  return response;
}
