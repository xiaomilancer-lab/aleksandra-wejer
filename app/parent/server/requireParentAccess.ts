import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";

export class ParentAccessError extends Error {
  constructor(message: string, public readonly status: 401 | 403 = 403) {
    super(message);
  }
}

function getBearerToken(request: Request) {
  const value = request.headers.get("authorization");
  return value?.startsWith("Bearer ") ? value.slice("Bearer ".length).trim() : null;
}

export async function requireParentAccess(request: Request, patientId: string) {
  const token = getBearerToken(request);
  if (!token) throw new ParentAccessError("Brak uwierzytelnienia.", 401);

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) throw new ParentAccessError("Nieprawidłowa sesja.", 401);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (profile?.role !== "parent") throw new ParentAccessError("To konto nie ma uprawnienia rodzica.");

  const { data: relation, error: relationError } = await supabaseAdmin
    .from("parent_child_access")
    .select("id")
    .eq("parent_user_id", userData.user.id)
    .eq("patient_id", patientId)
    .eq("is_active", true)
    .maybeSingle();
  if (relationError) throw relationError;
  if (!relation) throw new ParentAccessError("Brak aktywnego dostępu do danych dziecka.");

  return { parentUserId: userData.user.id, relationId: relation.id as string };
}
