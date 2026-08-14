import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { MemberRole } from "@/app/room/types";

export const MEMBER_SESSION_COOKIE = "psycholka-member-session";

export type MemberIdentity = {
  userId: string;
  email: string | null;
  displayName: string;
  role: MemberRole;
};

export type MemberAuthorizationResult =
  | { kind: "authorized"; identity: MemberIdentity }
  | { kind: "unauthenticated" }
  | { kind: "forbidden" };

export async function resolveMember(accessToken: string | null): Promise<MemberAuthorizationResult> {
  if (!accessToken) return { kind: "unauthenticated" };

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData.user) return { kind: "unauthenticated" };

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, display_name")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || (profile?.role !== "patient" && profile?.role !== "parent")) {
    return { kind: "forbidden" };
  }

  return {
    kind: "authorized",
    identity: {
      userId: userData.user.id,
      email: userData.user.email ?? null,
      displayName: profile.display_name || "Gość PsychOLKI",
      role: profile.role,
    },
  };
}

export async function getMemberAuthorization(): Promise<MemberAuthorizationResult> {
  const cookieStore = await cookies();
  return resolveMember(cookieStore.get(MEMBER_SESSION_COOKIE)?.value ?? null);
}

export async function requireMember(): Promise<MemberIdentity> {
  const result = await getMemberAuthorization();
  if (result.kind === "authorized") return result.identity;

  redirect(result.kind === "unauthenticated" ? "/login?next=/room" : "/login?error=forbidden");
}
