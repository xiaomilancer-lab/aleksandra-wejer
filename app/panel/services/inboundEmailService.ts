import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { InboundEmail } from "../domain/inboundEmail";

const fields = "id, resend_email_id, sender, recipients, cc, reply_to, subject, body_text, attachment_metadata, received_at, is_read, read_at, archived_at";

export async function getInboundEmails(query = "") {
  // The panel is a short-lived working mirror. OVH/Roundcube remains the mailbox of record.
  await supabaseAdmin.from("inbound_emails").delete().lt("retention_until", new Date().toISOString());

  let request = supabaseAdmin
    .from("inbound_emails")
    .select(fields)
    .is("archived_at", null)
    .order("received_at", { ascending: false })
    .limit(100);

  const search = query.trim().slice(0, 120);
  if (search) {
    const escaped = search.replace(/[,%()]/g, " ");
    request = request.or(`sender.ilike.%${escaped}%,subject.ilike.%${escaped}%`);
  }

  const { data, error } = await request;
  if (error) {
    if (error.code === "42P01") return { emails: [] as InboundEmail[], available: false };
    throw error;
  }
  return { emails: (data ?? []) as unknown as InboundEmail[], available: true };
}

export async function getInboundEmail(id: string) {
  const { data, error } = await supabaseAdmin
    .from("inbound_emails")
    .select(fields)
    .eq("id", id)
    .is("archived_at", null)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as InboundEmail | null;
}

export async function markInboundEmailRead(id: string, read: boolean) {
  const { error } = await supabaseAdmin
    .from("inbound_emails")
    .update({ is_read: read, read_at: read ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function archiveInboundEmail(id: string) {
  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("inbound_emails")
    .update({ archived_at: now, updated_at: now })
    .eq("id", id);
  if (error) throw error;
}
