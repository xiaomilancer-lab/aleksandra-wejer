# Partner Pack — Centrum Medyczno-Estetyczne Zielińscy

## Adresy

| Zastosowanie | Adres | Źródło rezerwacji |
| --- | --- | --- |
| Strona partnera | `https://aleksandrawejer.pl/partner/zielinscy` | `partner-zielinscy` |
| Rezerwacja bezpośrednia | `https://aleksandrawejer.pl/book/zielinscy` | `partner-zielinscy` |
| Instagram | `https://aleksandrawejer.pl/i/zielinscy` | `instagram-zielinscy` |
| QR | `https://aleksandrawejer.pl/q/zielinscy` | `qr-zielinscy` |
| Embed | `https://aleksandrawejer.pl/embed/zielinscy` | `partner-zielinscy-embed` |

Wszystkie adresy prowadzą wyłącznie do flow Zielińskich: Nowa Wieś Rzeczna. Nie pokazują Arthro Cure Clinic ani ZnanyLekarz.

## Embed iframe

Wersja v1 używa `iframe`, aby nie wymagać skryptu na stronie partnera i nie wchodzić w konflikt z jej stylami.

```html
<iframe
  src="https://aleksandrawejer.pl/embed/zielinscy"
  title="Umów konsultację z Aleksandrą Wejer"
  width="100%"
  height="360"
  loading="lazy"
  style="display:block; max-width:640px; border:0; margin:0 auto;"
></iframe>
```

Zalecenia responsywne:

- umieść iframe w kontenerze o szerokości `100%`;
- ustaw `max-width: 640px` i co najmniej `360px` wysokości;
- nie nakładaj `overflow: hidden` na rodzica iframe;
- link w iframe otwiera właściwy formularz rezerwacji w tej samej karcie.

## Przycisk CTA

Można użyć neutralnego przycisku prowadzącego bezpośrednio do rezerwacji:

```html
<a
  href="https://aleksandrawejer.pl/book/zielinscy"
  style="display:inline-block; padding:12px 20px; border-radius:12px; background:#6D7A62; color:#fff; font:600 16px/1.25 system-ui,sans-serif; text-decoration:none;"
>
  Umów konsultację z Aleksandrą
</a>
```

## Ważne przed publikacją

Ten pakiet nie zmienia zasad dostępności. Przed osadzeniem lub publikacją linków Booking Engine musi otrzymać status **GO**: wspólne, wiarygodne źródło wolnych terminów, potwierdzoną blokadę double-booking na poziomie bazy i zatwierdzony mechanizm zgód. Do tego czasu nie udostępniaj adresów pacjentom.
