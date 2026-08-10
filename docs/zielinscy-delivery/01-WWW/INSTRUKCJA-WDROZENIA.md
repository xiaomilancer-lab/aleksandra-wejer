# Widget na stronę Centrum

Wklej poniższy fragment w wybranym miejscu strony. Nie jest wymagana instalacja żadnego systemu ani integracja z bazą danych.

## Pliki

- `widget-zielinscy.html` - gotowy HTML i CSS widgetu.
- `zdjecie-aleksandra.png` - zaakceptowane zdjęcie Aleksandry.

## Najprostsze wdrożenie

1. Prześlij `zdjecie-aleksandra.png` do biblioteki mediów strony Centrum.
2. W pliku `widget-zielinscy.html` zamień adres zdjęcia w atrybucie `src` na adres pliku w bibliotece mediów Centrum. Obecnie wskazuje on zaakceptowane zdjęcie na `aleksandrawejer.pl` i może pozostać bez zmian, jeżeli administrator woli korzystać z tego adresu.
3. Skopiuj blok `<style>...</style>` oraz blok `<div class="aw-zielinscy-widget">...</div>` do wybranego miejsca strony.
4. Opublikuj stronę i sprawdź widok na komputerze oraz telefonie.

Widget nie wymaga JavaScriptu, Tailwinda, Reacta ani dodatkowych bibliotek. Wszystkie reguły CSS są ograniczone do klasy `.aw-zielinscy-widget`, dzięki czemu nie powinny wpływać na pozostałą część strony Centrum.

## Przycisk

Tekst: **Sprawdź wolne terminy →**

Adres docelowy:

`https://aleksandrawejer.pl/zielinscy?source=zielinscy&utm_source=zielinscy&utm_medium=partner_widget&utm_campaign=rezerwacja`

Po kliknięciu pacjent przechodzi na dedykowany landing Aleksandry z kalendarzem wyłącznie dla Centrum Medyczno-Estetycznego Zielińscy Premium. System rezerwacji i aktualne terminy pozostają na `aleksandrawejer.pl`.
