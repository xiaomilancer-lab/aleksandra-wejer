import { NextResponse } from "next/server";
import { PANEL_SESSION_COOKIE } from "@/app/panel/server/requirePsychologist";
import { supabaseAdmin } from "@/lib/supabase-admin";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60,
};

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
  if (profileError || profile?.role !== "psychologist") {
    return NextResponse.json({ message: "To konto nie ma dostępu do panelu." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(PANEL_SESSION_COOKIE, accessToken, cookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(PANEL_SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
