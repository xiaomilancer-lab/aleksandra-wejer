import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const PANEL_SESSION_COOKIE = "psycholka-panel-session";

export type PsychologistIdentity = {
  userId: string;
  email: string | null;
};

export type PanelAuthorizationResult =
  | { kind: "authorized"; identity: PsychologistIdentity }
  | { kind: "unauthenticated" }
  | { kind: "forbidden" };

function getBearerToken(request: Request) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice("Bearer ".length).trim() : null;
}

async function resolvePsychologist(accessToken: string | null): Promise<PanelAuthorizationResult> {
  if (!accessToken) return { kind: "unauthenticated" };

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData.user) return { kind: "unauthenticated" };

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  // A missing profile is deliberately treated as denied access. Do not expose schema details.
  if (profileError || profile?.role !== "psychologist") return { kind: "forbidden" };

  return {
    kind: "authorized",
    identity: { userId: userData.user.id, email: userData.user.email ?? null },
  };
}

/** Resolves a verified psychologist from a server-side panel request. */
export async function getPsychologistAuthorization(): Promise<PanelAuthorizationResult> {
  const cookieStore = await cookies();
  return resolvePsychologist(cookieStore.get(PANEL_SESSION_COOKIE)?.value ?? null);
}

/** Protects App Router pages and Server Actions before any clinical query executes. */
export async function requirePsychologist(): Promise<PsychologistIdentity> {
  const result = await getPsychologistAuthorization();
  if (result.kind === "authorized") return result.identity;

  redirect(result.kind === "unauthenticated" ? "/login?next=/panel" : "/login?error=forbidden");
}

/** API variant with explicit 401/403 semantics. Accepts a bearer token or the HttpOnly panel cookie. */
export async function getPsychologistApiAuthorization(request: Request): Promise<PanelAuthorizationResult> {
  const bearer = getBearerToken(request);
  if (bearer) return resolvePsychologist(bearer);

  const cookieStore = await cookies();
  return resolvePsychologist(cookieStore.get(PANEL_SESSION_COOKIE)?.value ?? null);
}
