import { isSlotAvailable, AvailabilityError } from "@/app/booking/server/availability";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { getBookingContext, getPartnerConfig } from "@/app/partners/booking/partnerConfig";
import { isPartnerSlotAllowed } from "@/app/partners/booking/partnerAvailabilityRules";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendBookingNotification } from "@/app/lib/bookingNotifications";

const conflictMessage = "Ten termin został właśnie zajęty. ❤️ Wybierzmy inny.";

export async function POST(request: Request) {
  const body = await request.json();
  const partner = getPartnerConfig(body.partner ?? "");
  const context = getBookingContext(body.source ?? "");
  if (!partner || !context || context.partnerId !== body.partner || !isBookingLocationId(context.locationId) || !body.date || !body.time || !body.name || !body.phone) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  if (!isPartnerSlotAllowed(body.partner, body.date)) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
  try {
    if (!(await isSlotAvailable(context.locationId, body.date, body.time))) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    const { error } = await supabaseAdmin.from("bookings").insert({ location_id: context.locationId, location: getBookingLocationName(context.locationId), source: context.source, visit_date: body.date, visit_time: body.time, name: body.name, phone: body.phone, email: body.email ?? "", message: body.message ?? "", status: "Nowe" });
    if (error?.code === "23505") return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    if (error) return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    const notification = await sendBookingNotification({ locationId: context.locationId, visitDate: body.date, visitTime: body.time, name: body.name, phone: body.phone, email: body.email, message: body.message });
    if (!notification.sent) console.error("[mail] partner booking notification was not delivered", { reason: notification.reason });
    return Response.json({ success: true, message: "Gotowe. ❤️ Aleksandra otrzymała Twoją rezerwację." });
  } catch (error) {
    if (error instanceof AvailabilityError) return Response.json({ success: false, message: "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
  }
}
