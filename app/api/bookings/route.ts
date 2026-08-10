import { isSlotAvailable, AvailabilityError } from "@/app/booking/server/availability";
import { getBookingLocationName, isBookingLocationId } from "@/app/booking/locations";
import { supabaseAdmin } from "@/lib/supabase-admin";

const allowedSources = new Set(["main-site", "zielinscy", "arthro"]);
const conflictMessage = "Ten termin został właśnie zajęty. ❤️ Wybierzmy inny.";

export async function POST(request: Request) {
  const body = await request.json();
  if (!isBookingLocationId(body.locationId ?? "") || !allowedSources.has(body.source) || !body.date || !body.time || !body.name || !body.phone) return Response.json({ success: false, message: "Nieprawidłowe dane rezerwacji." }, { status: 400 });
  try {
    if (!(await isSlotAvailable(body.locationId, body.date, body.time))) return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    const { error } = await supabaseAdmin.from("bookings").insert({ location_id: body.locationId, location: getBookingLocationName(body.locationId), source: body.source, visit_date: body.date, visit_time: body.time, name: body.name, phone: body.phone, email: body.email ?? "", message: body.message ?? "", status: "Nowe" });
    if (error?.code === "23505") return Response.json({ success: false, message: conflictMessage }, { status: 409 });
    if (error) return Response.json({ success: false, message: "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️" }, { status: 503 });
    return Response.json({ success: true, message: "Gotowe. ❤️ Aleksandra otrzymała Twoją rezerwację." });
  } catch (error) {
    const message = error instanceof AvailabilityError ? "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️" : "Nie udało się zapisać rezerwacji. Spróbuj ponownie za chwilę. ❤️";
    return Response.json({ success: false, message }, { status: 503 });
  }
}
