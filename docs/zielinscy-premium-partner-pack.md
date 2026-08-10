# Pakiet partnerski — Centrum Medyczno-Estetyczne Zielińscy Premium

## Publiczne adresy

- Landing rezerwacyjny: `https://aleksandrawejer.pl/zielinscy`
- Link partnerski: `https://aleksandrawejer.pl/zielinscy?source=zielinscy`
- QR: `https://aleksandrawejer.pl/zielinscy?source=zielinscy&utm_source=zielinscy&utm_medium=qr&utm_campaign=rezerwacja`

Landing korzysta z tego samego `BookingWizard`, `/api/availability`, reguł dostępności i zapisu rezerwacji co strona główna. Nie ma osobnego kalendarza ani bazy.

## Tracking

Rezerwacje z `/zielinscy` zapisują `source = zielinscy` w istniejącej kolumnie `bookings.source`. Parametry UTM pozostają w adresie dla analityki webowej. Nowa migracja nie jest potrzebna, ponieważ kolumna `source` i jej indeks istnieją już w projekcie.

## Widget

- Komponent aplikacji: `app/partners/zielinscy/ZielinscyPartnerCard.tsx`
- Samodzielny HTML/CSS: `docs/zielinscy-premium-widget.html`

Plik HTML nie wymaga Tailwinda ani JavaScriptu. Można wkleić zawartość karty i stylów do strony partnera lub osadzić cały plik w iframe po umieszczeniu go na serwerze partnera.

## Materiały

- QR SVG: `public/materials/zielinscy/zielinscy-booking-qr.svg`
- QR PNG: `public/materials/zielinscy/zielinscy-booking-qr.png`
- Karta QR do druku: `docs/zielinscy-premium-qr-card.html`
- Layout posta i relacji: `docs/zielinscy-premium-social-layouts.html`

Layouty social mają dokładne plansze 1080 × 1080 i 1080 × 1920, wykorzystują prawdziwe zdjęcie Aleksandry i nie wymagają dodatkowych bibliotek aplikacji.

## SEO

Landing ma `noindex,follow` i nie jest dodany do sitemap. Dzięki temu pozostaje użyteczną stroną partnerską, ale nie konkuruje w indeksie ze stroną główną Aleksandry.
