import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_BODY_LENGTH = 200_000;

function htmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!apiKey || !webhookSecret) {
    console.error("[inbound-email] Resend webhook configuration is missing.");
    return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
  }

  const payload = await request.text();
  const resend = new Resend(apiKey);
  let event;

  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type !== "email.received") return NextResponse.json({ received: true });

  const { data: receivedEmail, error: receivedError } = await resend.emails.receiving.get(event.data.email_id, { html_format: "cid" });
  if (receivedError || !receivedEmail) {
    console.error("[inbound-email] Unable to retrieve received email metadata.");
    return NextResponse.json({ error: "Email unavailable" }, { status: 502 });
  }

  const body = (receivedEmail.text?.trim() || (receivedEmail.html ? htmlToText(receivedEmail.html) : "")).slice(0, MAX_BODY_LENGTH);
  const webhookId = request.headers.get("svix-id");
  const { error: storageError } = await supabaseAdmin.from("inbound_emails").upsert({
    resend_email_id: receivedEmail.id,
    webhook_id: webhookId || null,
    message_id: receivedEmail.message_id || null,
    sender: receivedEmail.from.slice(0, 1000),
    recipients: receivedEmail.to,
    cc: receivedEmail.cc ?? [],
    reply_to: receivedEmail.reply_to ?? [],
    subject: (receivedEmail.subject.trim() || "(bez tematu)").slice(0, 1000),
    body_text: body,
    attachment_metadata: receivedEmail.attachments.map((attachment) => ({
      id: attachment.id,
      filename: attachment.filename,
      size: attachment.size,
      content_type: attachment.content_type,
      content_disposition: attachment.content_disposition,
    })),
    received_at: receivedEmail.created_at,
    updated_at: new Date().toISOString(),
  }, { onConflict: "resend_email_id" });

  if (storageError) {
    console.error("[inbound-email] Unable to store verified message.");
    return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
  }

  return NextResponse.json({ received: true });
}
