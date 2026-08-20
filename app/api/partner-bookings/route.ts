import { isSlotAvailable, AvailabilityError } from "@/app/booking/server/availability";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { getBookingContext, getPartnerConfig } from "@/app/partners/booking/partnerConfig";
import { isPartnerSlotAllowed } from "@/app/partners/booking/partnerAvailabilityRules";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendBookingNotification } from "@/app/lib/bookingNotifications";
import { acceptsPublicJson, cleanOptionalText, cleanRequiredText, isClockTime, isIsoDate, isValidEmail, isValidPhone, PUBLIC_INPUT_LIMITS } from "@/app/api/_shared/publicInput";

const conflictMessage = "Ten termin został właśnie zajęty. ❤️ Wybierzmy inny.";

export async function POST(request: Request) {
  if (!acceptsPublicJson(request)) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const partnerId = typeof body?.partner === "string" ? body.partner : "";
  const source = typeof body?.source === "string" ? body.source : "";
  const partner = getPartnerConfig(partnerId);
  const context = getBookingContext(source);
  const name = cleanRequiredText(body?.name, PUBLIC_INPUT_LIMITS.name);
  const phone = cleanRequiredText(body?.phone, PUBLIC_INPUT_LIMITS.phone);
  const email = cleanOptionalText(body?.email, PUBLIC_INPUT_LIMITS.email);
  const message = cleanOptionalText(body?.message, PUBLIC_INPUT_LIMITS.message);
  if (!body || !partner || !context || context.partnerId !== partnerId || !isBookingLocationId(context.locationId) || !isIsoDate(body.date) || !isClockTime(body.time) || !name || !phone || email === null || message === null || !isValidPhone(phone) || !isValidEmail(email)) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  if (!isPartnerSlotAllowed(partnerId, body.date)) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
  try {
    if (!(await isSlotAvailable(context.locationId, body.date, body.time))) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    const { error } = await supabaseAdmin.from("bookings").insert({ location_id: context.locationId, location: getBookingLocationName(context.locationId), source: context.source, visit_date: body.date, visit_time: body.time, name, phone, email, message, status: "Nowe" });
    if (error?.code === "23505") return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    if (error) return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    const notification = await sendBookingNotification({ locationId: context.locationId, visitDate: body.date, visitTime: body.time, name, phone, email, message });
    if (!notification.sent) console.error("[mail] partner booking notification was not delivered", { reason: notification.reason });
    return Response.json({ success: true, message: "Gotowe. ❤️ Aleksandra otrzymała Twoją rezerwację." });
  } catch (error) {
    if (error instanceof AvailabilityError) return Response.json({ success: false, message: "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
  }
}
