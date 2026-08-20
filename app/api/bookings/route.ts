import { isSlotAvailable, AvailabilityError } from "@/app/booking/server/availability";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendBookingNotification } from "@/app/lib/bookingNotifications";
import { acceptsPublicJson, cleanOptionalText, cleanRequiredText, isClockTime, isIsoDate, isValidEmail, isValidPhone, PUBLIC_INPUT_LIMITS } from "@/app/api/_shared/publicInput";

const allowedSources = new Set(["main-site", "zielinscy", "arthro"]);
const conflictMessage = "Ten termin został właśnie zajęty. ❤️ Wybierzmy inny.";

export async function POST(request: Request) {
  if (!acceptsPublicJson(request)) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const locationId = typeof body?.locationId === "string" ? body.locationId : "";
  const source = typeof body?.source === "string" ? body.source : "";
  const name = cleanRequiredText(body?.name, PUBLIC_INPUT_LIMITS.name);
  const phone = cleanRequiredText(body?.phone, PUBLIC_INPUT_LIMITS.phone);
  const email = cleanOptionalText(body?.email, PUBLIC_INPUT_LIMITS.email);
  const message = cleanOptionalText(body?.message, PUBLIC_INPUT_LIMITS.message);
  if (!body || !isBookingLocationId(locationId) || !allowedSources.has(source) || !isIsoDate(body.date) || !isClockTime(body.time) || !name || !phone || email === null || message === null || !isValidPhone(phone) || !isValidEmail(email)) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  try {
    if (!(await isSlotAvailable(locationId, body.date, body.time))) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    const { error } = await supabaseAdmin.from("bookings").insert({ location_id: locationId, location: getBookingLocationName(locationId), source, visit_date: body.date, visit_time: body.time, name, phone, email, message, status: "Nowe" });
    if (error?.code === "23505") return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    if (error) return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    const notification = await sendBookingNotification({ locationId, visitDate: body.date, visitTime: body.time, name, phone, email, message });
    if (!notification.sent) console.error("[mail] booking notification was not delivered", { reason: notification.reason });
    return Response.json({ success: true, message: "Gotowe. ❤️ Aleksandra otrzymała Twoją rezerwację." });
  } catch (error) {
    const message = error instanceof AvailabilityError ? "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️" : "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️";
    return Response.json({ success: false, message }, { status: 503 });
  }
}
