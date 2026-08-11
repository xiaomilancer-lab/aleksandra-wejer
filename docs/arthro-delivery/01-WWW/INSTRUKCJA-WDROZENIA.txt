# Widget na stronę Arthro Cure Clinic

Wklej poniższy fragment w wybranym miejscu strony. Nie jest wymagana instalacja żadnego systemu ani integracja z bazą danych.

## Pliki

- `widget-arthro.html` - gotowy HTML i CSS widgetu.
- `zdjecie-aleksandra.png` - zaakceptowane zdjęcie Aleksandry.

## Najprostsze wdrożenie

1. Prześlij `zdjecie-aleksandra.png` do biblioteki mediów strony Arthro.
2. W pliku `widget-arthro.html` zamień adres zdjęcia w atrybucie `src` na adres pliku w bibliotece mediów Arthro. Obecny adres może pozostać bez zmian, jeżeli administrator woli korzystać ze zdjęcia na `aleksandrawejer.pl`.
3. Skopiuj blok `<style>...</style>` oraz blok `<div class="aw-arthro-widget">...</div>` do wybranego miejsca strony.
4. Opublikuj stronę i sprawdź widok na komputerze oraz telefonie.

Widget nie wymaga JavaScriptu, Tailwinda, Reacta ani dodatkowych bibliotek. Wszystkie reguły CSS są ograniczone do klasy `.aw-arthro-widget`, dzięki czemu nie powinny wpływać na pozostałą część strony Arthro.

## Przycisk

Tekst: **Sprawdź wolne terminy →**

Adres docelowy:

`https://aleksandrawejer.pl/arthro?source=arthro&utm_source=arthro&utm_medium=partner_widget&utm_campaign=rezerwacja`

Po kliknięciu pacjent przechodzi na dedykowany landing Aleksandry z kalendarzem wyłącznie dla Arthro Cure Clinic. System rezerwacji i aktualne terminy pozostają na `aleksandrawejer.pl`.
