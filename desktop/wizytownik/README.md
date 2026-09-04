# Wizytownik psychOLKI — Windows

Program jest bezpiecznym, ograniczonym kontenerem dla prywatnej aplikacji pod
`https://aleksandrawejer.pl/wizytownik`.

## Zabezpieczenia pulpitu

- ładowany jest wyłącznie adres HTTPS `aleksandrawejer.pl`,
- Node.js i tag `webview` są wyłączone w interfejsie,
- izolacja kontekstu i sandbox są wymuszone,
- obce nawigacje, nowe okna, uprawnienia urządzenia i narzędzia deweloperskie są zablokowane,
- eksport jest dozwolony wyłącznie z własnej trasy Wizytownika,
- włączona jest systemowa ochrona zawartości okna.

## Budowanie

W katalogu aplikacji uruchom `npm install`, a następnie `npm run dist`.
Gotowy plik przenośny powstanie w katalogu `release`.

Electron i Chromium trzeba okresowo aktualizować oraz wydawać nową wersję programu.
