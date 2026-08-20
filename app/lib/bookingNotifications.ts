import "server-only";

import { Resend } from "resend";
import { getBookingLocationDisplayName } from "@/app/booking/locations";

const recipient = "psycholog@aleksandrawejer.pl";
const sender = "Aleksandra Wejer <psycholog@aleksandrawejer.pl>";

type ContactNotification = {
  name: string;
  phone: string;
  email?: string;
  category?: string;
  message?: string;
};

type BookingNotification = ContactNotification & {
  locationId: string;
  visitDate: string;
  visitTime: string;
};

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function lines(value: string | null | undefined) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

async function send(subject: string, html: string, replyTo?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[mail] RESEND_API_KEY is missing; notification was not sent.");
    return { sent: false, reason: "missing_key" as const };
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: sender,
    to: recipient,
    replyTo: replyTo?.trim() || undefined,
    subject,
    html,
  });

  if (result.error || !result.data?.id) {
    console.error("[mail] Resend rejected notification", {
      name: result.error?.name,
      message: result.error?.message,
    });
    return { sent: false, reason: "provider_error" as const };
  }

  return { sent: true as const, id: result.data.id };
}

export async function sendContactNotification(input: ContactNotification) {
  return send(
    "🌿 Nowa wiadomość ze strony Aleksandry Wejer",
    `<h2>Nowa wiadomość ze strony</h2>
      <p><strong>Imię i nazwisko:</strong><br>${escapeHtml(input.name)}</p>
      <p><strong>Telefon:</strong><br>${escapeHtml(input.phone)}</p>
      <p><strong>E-mail:</strong><br>${escapeHtml(input.email) || "Nie podano"}</p>
      <p><strong>Dotyczy:</strong><br>${escapeHtml(input.category) || "Wiadomość ze strony"}</p>
      <hr />
      <p><strong>Treść wiadomości:</strong></p>
      <p>${lines(input.message) || "Brak dodatkowej treści."}</p>`,
    input.email,
  );
}

export async function sendBookingNotification(input: BookingNotification) {
  const location = getBookingLocationDisplayName(input.locationId);
  return send(
    `📅 Nowa rezerwacja: ${input.visitDate} · ${input.visitTime.slice(0, 5)}`,
    `<h2>Nowa rezerwacja wizyty</h2>
      <p><strong>Termin:</strong><br>${escapeHtml(input.visitDate)} · ${escapeHtml(input.visitTime.slice(0, 5))}</p>
      <p><strong>Miejsce:</strong><br>${escapeHtml(location)}</p>
      <p><strong>Imię i nazwisko:</strong><br>${escapeHtml(input.name)}</p>
      <p><strong>Telefon:</strong><br>${escapeHtml(input.phone)}</p>
      <p><strong>E-mail:</strong><br>${escapeHtml(input.email) || "Nie podano"}</p>
      <hr />
      <p><strong>Wiadomość:</strong></p>
      <p>${lines(input.message) || "Brak dodatkowej wiadomości."}</p>
      <p style="color:#6b7280;font-size:12px">Rezerwacja jest zapisana w panelu. Ten e-mail jest powiadomieniem.</p>`,
    input.email,
  );
}
