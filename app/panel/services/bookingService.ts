// Fetches bookings from the API.
export async function getBookings() {
  throw new Error("Not implemented");
}

// Creates a new booking through the API.
export async function createBooking() {
  throw new Error("Not implemented");
}

// Updates an existing booking status through the API.
export async function updateBooking(id: number, status: string) {
  const { data } = await supabase.auth.getSession();
  const response = await fetch("/api/bookings/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(data.session ? { Authorization: `Bearer ${data.session.access_token}` } : {}),
    },
    body: JSON.stringify({
      id,
      status,
    }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(result?.message ?? "Nie udało się zapisać statusu wizyty.");
  }

  return response.json();
}

// Deletes a booking through the API.
export async function deleteBooking() {
  throw new Error("Not implemented");
}
import { supabase } from "@/lib/supabase";
