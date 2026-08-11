import { Location } from "./types";
import { bookingLocationConfig } from "@/app/booking/locations";

export const locations: Location[] = Object.entries(bookingLocationConfig).map(([id, location]) => ({
  id,
  name: location.name,
  city: location.city,
  street: location.street,
  image: location.image,
  active: true,
  available: true,
}));
