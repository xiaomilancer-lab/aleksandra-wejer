import { getAvailableSlots, AvailabilityError } from "@/app/booking/server/availability";
import { isBookingLocationId } from "@/app/booking/locations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? from;
  if (!isBookingLocationId(locationId)) return Response.json({ state: "ERROR", message: "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️" }, { status: 400 });
  try {
    return Response.json(await getAvailableSlots({ locationId, from, to }));
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      const source = error instanceof AvailabilityError ? error.source : "unknown";
      const cause = error instanceof AvailabilityError ? error.cause : undefined;
      console.error(`[availability] request failed\nlocationId=${locationId}\nfrom=${from}\nto=${to}\nsource=${source}\nstack=${error instanceof Error ? error.stack : String(error)}\ncause=${JSON.stringify(cause)}`);
    }
    const message = "Nie udało się teraz sprawdzić terminów. Spróbuj ponownie za chwilę. ❤️";
    return Response.json({ state: "ERROR", message }, { status: 503 });
  }
}
