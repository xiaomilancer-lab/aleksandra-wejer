export const bookingLocations = {
  "nowa-wies-rzeczna": "Nowa Wieś Rzeczna",
  "arthro-cure-clinic": "Arthro Cure Clinic",
} as const;

export type BookingLocationId = keyof typeof bookingLocations;

export function isBookingLocationId(value: string): value is BookingLocationId {
  return value in bookingLocations;
}

export function getBookingLocationName(locationId: BookingLocationId) {
  return bookingLocations[locationId];
}
