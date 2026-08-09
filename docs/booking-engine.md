# psychOLKA Booking Engine

`BookingContext` w `app/booking/bookingContext.ts` opisuje kanał rezerwacji: źródło, partnera, lokalizację, dni i godziny, komunikaty, temat oraz dostępne CTA.

## Kanały

- `main-site`
- `partner-zielinscy`
- `instagram-zielinscy`
- `qr-zielinscy`
- `future-mobile-app`

`/book/zielinscy` używa kontekstu partnera. Parametry `?source=instagram` i `?source=qr` zmieniają wyłącznie zapisane źródło.

## Dostępność i zapis

Partnerzy odczytują zajęte terminy z tabeli `bookings` przez `/api/partner-booked-times`. Zapis przechodzi przez `/api/partner-bookings`, który ponownie waliduje kontekst, lokalizację, dzień i godzinę po stronie serwera.

Wykonaj ręcznie `supabase/migrations/add_booking_source.sql` oraz `supabase/migrations/add_booking_slot_unique_constraint.sql`. Druga migracja jest konieczna do ochrony przed race condition: sam odczyt dostępności w kliencie nie jest wystarczający, a unikalny indeks `(location, visit_date, visit_time)` jest ostatecznym zabezpieczeniem bazy.

## Rozszerzanie

Dodaj nowy `BookingContext`, a następnie podłącz go do publicznej strony, linku social, QR lub przyszłej aplikacji. Nie twórz osobnego magazynu terminów. Neutralne nazwy zdarzeń analitycznych są eksportowane jako `bookingAnalyticsEvents`; tracker nie jest jeszcze podłączony.
