export const bookingLocationConfig = {
  "arthro-cure-clinic": {
    name: "Arthro Cure Clinic",
    bookingSnapshotName: "Arthro Cure Clinic",
    city: "Starogard Gdański",
    street: "Al. Jana Pawła II 1/U9",
    image: "/images/offices/arthro1.jpg",
  },
  "nowa-wies-rzeczna": {
    name: "Centrum Medyczno-Estetyczne Zielińscy Premium",
    bookingSnapshotName: "Nowa Wieś Rzeczna",
    city: "Nowa Wieś Rzeczna",
    street: "Kasztanowa 1",
    image: "/images/offices/zielinscy.jpg",
  },
} as const;

export type BookingLocationId = keyof typeof bookingLocationConfig;

export const bookingLocations = Object.fromEntries(
  Object.entries(bookingLocationConfig).map(([id, location]) => [id, location.name]),
) as Record<BookingLocationId, string>;

export function isBookingLocationId(value: string): value is BookingLocationId {
  return value in bookingLocationConfig;
}

export function getBookingLocationName(locationId: BookingLocationId) {
  return bookingLocationConfig[locationId].bookingSnapshotName;
}

export function getBookingLocation(locationId: BookingLocationId) {
  return bookingLocationConfig[locationId];
}

export function getBookingLocationDisplayName(locationId: string | null | undefined, legacySnapshot?: string | null) {
  return isBookingLocationId(locationId ?? "")
    ? bookingLocationConfig[locationId as BookingLocationId].name
    : legacySnapshot?.trim() || "Lokalizacja do potwierdzenia";
}
