# Partner booking widget

Widget embed URL: `/embed/booking/zielinscy`.

## Add a partner

Add one entry in `app/partners/booking/partnerConfig.ts`: `location`, `allowedWeekdays` (`0` Sunday through `6` Saturday), `availableTimes`, contact flags, `theme`, `source`, and `cta`.

The server validates the partner, location, weekdays, times, and source. Do not trust values posted from an embedding page.

## Theme and CTA

Use `theme` as a stable styling hook (`data-partner-theme`) and change `cta` for partner-specific wording. Add color tokens in widget CSS when a partner receives approved branding.

## Availability

Set `allowedWeekdays` and `availableTimes` in the partner configuration. The Zielińscy entry uses `[1, 3, 4, 5]`, so Tuesdays are never shown.

## Database

Before enabling a partner widget, run `supabase/migrations/add_booking_source.sql` manually. It adds `bookings.source`; no new table is created.
