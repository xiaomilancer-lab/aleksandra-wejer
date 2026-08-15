import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

const ONLINE_WINDOW_MS = 2 * 60 * 1000;

type ProfileRow = {
  id: string;
  role: string;
  display_name: string | null;
  created_at: string | null;
};

type PresenceRow = {
  user_id: string;
  last_seen_at: string;
  current_path: string | null;
};

export type MemberUserEntry = {
  id: string;
  email: string | null;
  displayName: string;
  role: "psychologist" | "patient" | "parent" | "unknown";
  createdAt: string;
  emailConfirmed: boolean;
  hasLoggedIn: boolean;
  lastSignInAt: string | null;
  online: boolean;
  lastSeenAt: string | null;
  currentPath: string | null;
};

export type MemberUserDirectory = {
  entries: MemberUserEntry[];
  presenceAvailable: boolean;
};

export async function getMemberUserDirectory(now = new Date()): Promise<MemberUserDirectory> {
  const [{ data: authData, error: authError }, { data: profileData, error: profileError }] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabaseAdmin.from("profiles").select("id, role, display_name, created_at"),
  ]);

  if (authError) throw authError;
  if (profileError) throw profileError;

  const presenceResult = await supabaseAdmin
    .from("member_presence")
    .select("user_id, last_seen_at, current_path");
  const presenceAvailable = !presenceResult.error;
  const profileRows = (profileData ?? []) as ProfileRow[];
  const profiles = new Map(profileRows.map((profile) => [profile.id, profile]));
  const presence = new Map(((presenceResult.data as PresenceRow[] | null) ?? []).map((item) => [item.user_id, item]));
  const onlineCutoff = now.getTime() - ONLINE_WINDOW_MS;

  const entries = authData.users.map<MemberUserEntry>((user) => {
    const profile = profiles.get(user.id);
    const active = presence.get(user.id);
    const metadataName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "";
    const role = profile?.role === "psychologist" || profile?.role === "patient" || profile?.role === "parent"
      ? profile.role
      : "unknown";

    return {
      id: user.id,
      email: user.email ?? null,
      displayName: profile?.display_name?.trim() || metadataName.trim() || user.email?.split("@")[0] || "Użytkownik",
      role,
      createdAt: user.created_at,
      emailConfirmed: Boolean(user.email_confirmed_at),
      hasLoggedIn: Boolean(user.last_sign_in_at),
      lastSignInAt: user.last_sign_in_at ?? null,
      online: Boolean(active && new Date(active.last_seen_at).getTime() >= onlineCutoff),
      lastSeenAt: active?.last_seen_at ?? null,
      currentPath: active?.current_path ?? null,
    };
  });

  entries.sort((left, right) => {
    if (left.online !== right.online) return left.online ? -1 : 1;
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });

  return { entries, presenceAvailable };
}
