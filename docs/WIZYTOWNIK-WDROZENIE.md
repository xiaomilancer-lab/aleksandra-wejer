# Wizytownik psychOLKI — uruchomienie

Wizytownik korzysta z istniejącego konta psychologa i istniejących kart
pacjentów. Treść nowych notatek jest szyfrowana AES-256-GCM przed zapisem w
Supabase. Klucz szyfrowania nie jest zapisany w bazie, przeglądarce ani pliku
EXE.

## 1. Aktualizacja Supabase

W Supabase otwórz **SQL Editor**, wklej całą zawartość pliku:

`supabase/migrations/create_secure_visit_journal.sql`

i uruchom ją jednym kliknięciem **Run**.

## 2. Klucz szyfrowania

W PowerShell uruchom:

```powershell
cd C:\PsychologApp
.\scripts\generate-wizytownik-key.ps1
```

Skopiuj wygenerowaną wartość. W Vercel przejdź do projektu strony, następnie
**Settings → Environment Variables** i dodaj:

- nazwa: `WIZYTOWNIK_ENCRYPTION_KEY_V1`
- wartość: wygenerowany ciąg
- środowisko: `Production`

Zachowaj drugą kopię klucza w bezpiecznym menedżerze haseł. Nie wysyłaj go w
wiadomości i nie dodawaj do repozytorium. Po zapisaniu zmiennej wykonaj ponowny
deployment produkcyjny.

## 3. Telefon

Na iPhonie otwórz w Safari `https://aleksandrawejer.pl/wizytownik`, zaloguj się,
wybierz **Udostępnij → Do ekranu początkowego**. Powstanie osobna ikona
Wizytownika prowadząca bezpośrednio do prywatnego narzędzia.

## 4. Windows

Przenośny program znajduje się lokalnie w:

`desktop/wizytownik/release/Wizytownik-psychOLKI-1.0.0-Windows.exe`

Program nie wymaga instalatora. Przed przekazywaniem go innym osobom należy
podpisać plik certyfikatem code-signing; bez podpisu Windows może pokazać
ostrzeżenie SmartScreen.

## Ważne zasady

- Nie kasuj zmiennej szyfrującej, dopóki istnieją notatki.
- Nie przechowuj eksportów DOCX/PDF w zwykłym folderze chmurowym bez szyfrowania.
- Włącz szyfrowanie urządzenia BitLocker/FileVault i blokadę ekranu.
- Po utracie urządzenia zmień hasło konta oraz unieważnij jego sesje.
- Raz w miesiącu sprawdź kopię zapasową bazy i możliwość odtworzenia danych.
