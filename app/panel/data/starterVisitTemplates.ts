import type { VisitTemplateInput } from "../domain";

export interface StarterVisitTemplate extends VisitTemplateInput {
  id: string;
  ageGroup: string;
  keywords: string[];
}

export const STARTER_VISIT_TEMPLATES: StarterVisitTemplate[] = [
  {
    id: "child-adhd-structure",
    title: "ADHD — krótka i przewidywalna sesja",
    category: "Dzieci · neuroróżnorodność",
    ageGroup: "7–12 lat",
    keywords: ["ADHD", "uwaga", "impulsywność", "organizacja"],
    description: "Plan oparty na mocnych stronach, krótkich etapach i czytelnej agendzie. Materiał pomocniczy; nie służy rozpoznaniu ADHD ani ocenie leczenia.",
    noteTemplate: `CEL SPOTKANIA (ustalony wspólnie):

MOCNA STRONA / ZAINTERESOWANIE DZIECKA:

AGENDA W 3 KRÓTKICH KROKACH:
1.
2.
3.

CO POMAGAŁO UTRZYMAĆ UWAGĘ:
□ krótka instrukcja  □ wybór  □ ruch  □ przerwa  □ plan obrazkowy  □ inne:

AUTORSKI CHECK-IN „ENERGIA I UWAGA” (nie jest testem):
Energia 0–10: ___  Skupienie 0–10: ___  Napięcie 0–10: ___

OBSERWACJE W RÓŻNYCH SYTUACJACH (bez wniosków diagnostycznych):

USTALENIE Z DZIECKIEM I OPIEKUNEM:`,
    homeworkTemplate: "Wybierzcie jedną codzienną czynność. Rozpiszcie ją na trzy małe kroki i zaznaczcie, który sposób przypominania dziecko wybiera: obrazek, alarm, kartka lub pomoc dorosłego. Na kolejnej wizycie omówcie, co było pomocne — bez oceniania.",
    isFavorite: true,
  },
  {
    id: "child-autism-preferences",
    title: "Spektrum autyzmu — mapa komfortu i komunikacji",
    category: "Dzieci · neuroróżnorodność",
    ageGroup: "6–15 lat",
    keywords: ["autyzm", "spektrum", "Asperger", "sensoryka", "komunikacja", "przewidywalność"],
    description: "Arkusz preferencji komunikacyjnych, sensorycznych i środowiskowych. Nie zakłada jednego sposobu funkcjonowania i nie jest narzędziem diagnostycznym.",
    noteTemplate: `JAK DZIECKO CHCE DZIŚ UCZESTNICZYĆ:
□ rozmowa  □ rysowanie  □ pisanie  □ wskazywanie  □ aktywność obok rozmowy  □ inny sposób:

CO DAJE POCZUCIE PRZEWIDYWALNOŚCI:

MAPA KOMFORTU SENSORYCZNEGO:
Dźwięki: ___  Światło: ___  Dotyk: ___  Zapachy: ___  Ruch: ___

SYGNAŁ „POTRZEBUJĘ PRZERWY” USTALONY Z DZIECKIEM:

ZAINTERESOWANIA I MOCNE STRONY, KTÓRE MOŻNA WŁĄCZYĆ:

SYTUACJA → MOŻLIWY WYZWALACZ → POTRZEBA → POMOCNA ZMIANA:

CO DZIECKO CHCE, ABY DOROŚLI ROZUMIELI:`,
    homeworkTemplate: "Wspólnie przygotujcie małą kartę „Pomaga mi… / Nie pomaga mi… / Gdy potrzebuję przerwy…”. Dziecko decyduje, co znajdzie się na karcie i komu chce ją pokazać.",
    isFavorite: true,
  },
  {
    id: "child-selective-mutism",
    title: "Mutyzm wybiórczy — drabinka komfortu bez nacisku",
    category: "Dzieci · lęk i komunikacja",
    ageGroup: "5–13 lat",
    keywords: ["mutyzm", "lęk", "komunikacja", "szkoła"],
    description: "Plan wspierający komunikację bez wymuszania mowy. Zaczyna od sposobu, który jest dla dziecka możliwy i bezpieczny; nie zastępuje specjalistycznej diagnozy ani skoordynowanego planu ze szkołą i rodziną.",
    noteTemplate: `DOZWOLONE SPOSOBY ODPOWIEDZI DZISIAJ:
□ gest  □ wskazanie  □ rysunek  □ pisanie  □ szept do zaufanej osoby  □ mowa  □ brak odpowiedzi

OSOBY / MIEJSCA / SYTUACJE O RÓŻNYM POZIOMIE KOMFORTU:

AUTORSKA SKALA KOMFORTU 0–5 (nie jest testem): ___

NAJMNIEJSZY MOŻLIWY KROK WYBRANY PRZEZ DZIECKO:

CZEGO DOROŚLI NIE BĘDĄ ROBIĆ (np. ponaglać, nagradzać za samo mówienie, odpowiadać publicznie za dziecko bez ustalenia):

CO ZMNIEJSZA NAPIĘCIE:

USTALENIA Z OPIEKUNEM / SZKOŁĄ ZA ZGODĄ RODZINY:`,
    homeworkTemplate: "Wybierzcie jedną bezpieczną sytuację i jeden mikrokrok komunikacyjny, który nie musi oznaczać mówienia. Po próbie zapiszcie tylko: „co ułatwiło?” i „co następnym razem zmniejszymy?”.",
    isFavorite: false,
  },
  {
    id: "child-grief-safety",
    title: "Dziecko po stracie — bezpieczeństwo, pamięć i tempo",
    category: "Dzieci · strata i żałoba",
    ageGroup: "6–15 lat",
    keywords: ["żałoba", "strata", "śmierć rodzica", "bezpieczeństwo"],
    description: "Delikatny scenariusz pozwalający rozmawiać, rysować albo nie podejmować tematu. Obejmuje sprawdzenie bezpieczeństwa i sygnałów wymagających pilnej konsultacji.",
    noteTemplate: `ZGODA DZIECKA NA TEMAT I SPOSÓB PRACY:
□ rozmowa  □ rysunek  □ wspomnienie  □ pudełko pamięci  □ dziś bez rozmowy o stracie

CO DZIECKO ROZUMIE O TYM, CO SIĘ WYDARZYŁO (język dostosowany do wieku):

WAŻNE UCZUCIA / PYTANIA / POCZUCIE WINY DO ŁAGODNEGO WYJAŚNIENIA:

OSOBY I MIEJSCA DAJĄCE BEZPIECZEŃSTWO:

SPOSÓB PAMIĘTANIA WYBRANY PRZEZ DZIECKO:

CODZIENNE FUNKCJONOWANIE: sen ___ apetyt ___ szkoła ___ relacje ___ zabawa/zainteresowania ___

SPRAWDZENIE BEZPIECZEŃSTWA: wypowiedzi o dołączeniu do zmarłej osoby, samouszkodzenie, utrata nadziei, poważne wycofanie lub nagły spadek funkcjonowania:

PLAN KONSULTACJI / PILNEGO WSPARCIA, JEŚLI POTRZEBNY:`,
    homeworkTemplate: "Jeśli dziecko chce: wybierzcie zdjęcie, przedmiot, piosenkę lub historię związaną z ważną osobą. Dziecko decyduje, czy chce ją przynieść, opisać, narysować, czy zachować tylko dla siebie.",
    isFavorite: true,
  },
  {
    id: "child-divorce-two-homes",
    title: "Rozstanie rodziców — bezpieczeństwo między dwoma domami",
    category: "Dzieci · rodzina i rozwód",
    ageGroup: "6–15 lat",
    keywords: ["rozwód", "rozstanie", "dwa domy", "konflikt rodziców"],
    description: "Arkusz oddzielający sprawy dorosłych od odpowiedzialności dziecka. Pomaga nazwać stałe elementy życia i ograniczyć wciąganie dziecka w konflikt lojalnościowy.",
    noteTemplate: `CO DZIECKO WIE I JAK TO ROZUMIE:

ZDANIA, KTÓRE DZIECKO POTRZEBUJE USŁYSZEĆ:
□ To nie twoja wina.  □ Nie musisz naprawiać relacji dorosłych.  □ Możesz kochać oboje rodziców.

CO POZOSTAJE STAŁE:

CO SIĘ ZMIENIA I JAK ZOSTANIE WYJAŚNIONE:

MAPA DWÓCH DOMÓW: rutyny, ważne przedmioty, kontakt, szkoła, przekazywanie informacji

SYTUACJE KONFLIKTU LOJALNOŚCIOWEGO / PRZEKAZYWANIA WIADOMOŚCI PRZEZ DZIECKO:

PLAN OCHRONY DZIECKA PRZED KONFLIKTEM DOROSŁYCH:

GŁOS DZIECKA — CO CHCE, ABY DOROŚLI WIEDZIELI:`,
    homeworkTemplate: "Stwórzcie prosty, przewidywalny kalendarz najbliższego tygodnia. Dziecko może zaznaczyć symbolem rzeczy, które chce mieć w obu domach. Nie pytajcie go, którego rodzica wybiera.",
    isFavorite: false,
  },
  {
    id: "teen-belonging",
    title: "Nastolatek poza grupą — mapa przynależności",
    category: "Nastolatki · relacje rówieśnicze",
    ageGroup: "12–18 lat",
    keywords: ["grupa", "samotność", "rówieśnicy", "szkoła", "lęk społeczny"],
    description: "Scenariusz rozmowy o samotności, odrzuceniu i małych krokach społecznych. Nie etykietuje nieśmiałości jako zaburzenia i uwzględnia ryzyko przemocy rówieśniczej.",
    noteTemplate: `CO OZNACZA DLA NASTOLATKA „PASOWAĆ DO GRUPY”:

MAPA RELACJI: bezpieczne ___ neutralne ___ trudne ___ online ___

SYTUACJA → MYŚL / PRZEWIDYWANIE → ODCZUCIE W CIELE → DZIAŁANIE:

AUTORSKI CHECK-IN (nie jest testem):
Poczucie przynależności 0–10: ___  Napięcie społeczne 0–10: ___  Samotność 0–10: ___

CZY WYSTĘPUJE WYŚMIEWANIE, WYKLUCZANIE, PRZEMOC LUB CYBERPRZEMOC:

NAJMNIEJSZY KROK WYBRANY PRZEZ NASTOLATKA:

OSOBA DOROSŁA / RÓWIEŚNICZA, KTÓRA MOŻE POMÓC:

SPRAWDZENIE NASTROJU, NADZIEI I BEZPIECZEŃSTWA:`,
    homeworkTemplate: "Wybierz jeden mały eksperyment społeczny na skali trudności maksymalnie 3/10, np. krótkie przywitanie, pytanie o zadanie albo obecność przez 10 minut. Zapisz przewidywanie przed i rzeczywisty przebieg po — bez oceny sukces/porażka.",
    isFavorite: true,
  },
  {
    id: "teen-emotion-map",
    title: "Nastolatek — mapa emocji, przeciążenia i wsparcia",
    category: "Nastolatki · emocje i bezpieczeństwo",
    ageGroup: "12–18 lat",
    keywords: ["emocje", "przeciążenie", "stres", "bezpieczeństwo"],
    description: "Ogólny check-in do rozmowy o obciążeniu, strategiach radzenia sobie i dostępnych osobach. Nie jest skalą kliniczną ani testem przesiewowym.",
    noteTemplate: `CO JEST TERAZ NAJCIĘŻSZE / CO DAJE CHOĆ TROCHĘ ULGI:

AUTORSKI TERMOMETR 0–10 (nie jest testem):
Napięcie ___ Smutek ___ Złość ___ Lęk ___ Nadzieja ___ Energia ___

SYGNAŁY PRZECIĄŻENIA W CIELE I ZACHOWANIU:

STRATEGIE: pomocne ___ obojętne ___ pogarszające sytuację ___

LUDZIE, DO KTÓRYCH MOŻNA NAPISAĆ / ZADZWONIĆ:

BEZPOŚREDNIE SPRAWDZENIE BEZPIECZEŃSTWA (myśli o śmierci, samouszkodzeniu, plan, środki, intencja):

PLAN BEZPIECZEŃSTWA / PILNA ŚCIEŻKA POMOCY, JEŚLI POTRZEBNA:

JEDEN REALNY KROK DO KOLEJNEGO SPOTKANIA:`,
    homeworkTemplate: "Przez trzy wybrane dni zaznacz jedną liczbę napięcia 0–10 i jedną rzecz, która choć trochę pomogła. Bez obowiązku prowadzenia pełnego dziennika.",
    isFavorite: false,
  },
  {
    id: "couple-listening-repair",
    title: "Para — rozmowa bez eskalacji i próba naprawy",
    category: "Pary · komunikacja",
    ageGroup: "Dorośli",
    keywords: ["para", "konflikt", "komunikacja", "naprawa"],
    description: "Struktura rozmowy pomagająca zwolnić konflikt i usłyszeć potrzeby obu stron. Nie jest odpowiednia do wspólnej pracy, gdy występuje przemoc, przymus lub realne zagrożenie.",
    noteTemplate: `TEMAT WYBRANY WSPÓLNIE (jeden, możliwie konkretny):

ZASADY BEZPIECZNEJ ROZMOWY / SYGNAŁ PRZERWY:

OSOBA A: Kiedy ___, czuję ___, ponieważ ważne jest dla mnie ___, proszę o ___
OSOBA B — co usłyszała bez obrony i interpretacji:

OSOBA B: Kiedy ___, czuję ___, ponieważ ważne jest dla mnie ___, proszę o ___
OSOBA A — co usłyszała bez obrony i interpretacji:

AUTORSKI CHECK-IN (nie jest testem):
Poczucie bycia wysłuchanym A 0–10: ___  B 0–10: ___

PRÓBA NAPRAWY, KTÓRĄ KAŻDA OSOBA POTRAFI PRZYJĄĆ:

SPRAWDZENIE PRZEMOCY, KONTROLI, PRZYMUSU I BEZPIECZEŃSTWA:

MAŁA UMOWA DO SPRAWDZENIA:`,
    homeworkTemplate: "Dwa razy w tygodniu zróbcie 10-minutowy check-in: 4 minuty mówi jedna osoba, druga tylko podsumowuje; zamiana; ostatnie 2 minuty na jedną możliwą prośbę. Przerwijcie, jeśli rozmowa przestaje być bezpieczna.",
    isFavorite: true,
  },
  {
    id: "couple-needs-boundaries",
    title: "Para — potrzeby, granice i wspólne ustalenia",
    category: "Pary · bliskość i granice",
    ageGroup: "Dorośli",
    keywords: ["para", "potrzeby", "granice", "bliskość", "obowiązki"],
    description: "Arkusz porządkujący oczekiwania bez zakładania, że kompromis zawsze oznacza środek. Każde ustalenie wymaga dobrowolności i może zostać ponownie omówione.",
    noteTemplate: `OBSZAR: □ czas  □ bliskość  □ obowiązki  □ finanse  □ rodzina  □ rodzicielstwo  □ inne

POTRZEBA A / POTRZEBA B:

GRANICA A / GRANICA B:

CO JEST NEGOCJOWALNE / NIENEGOCJOWALNE I DLACZEGO:

CO KAŻDA OSOBA MOŻE ZROBIĆ DOBROWOLNIE:

JAK POZNAMY, ŻE USTALENIE DZIAŁA:

TERMIN SPOKOJNEGO SPRAWDZENIA USTALENIA:

CZY KTÓRAŚ OSOBA BOI SIĘ ODMÓWIĆ LUB ODCZUWA PRZYMUS — DALSZA OCENA BEZPIECZEŃSTWA:`,
    homeworkTemplate: "Wybierzcie jedno małe ustalenie na siedem dni. Zapiszcie je jednym zdaniem wraz z datą sprawdzenia. Celem jest zebranie informacji, nie udowodnienie racji.",
    isFavorite: false,
  },
  {
    id: "adult-family-conflict",
    title: "Dorosły — konflikt rodzinny i granice odpowiedzialności",
    category: "Dorośli · rodzina",
    ageGroup: "Dorośli",
    keywords: ["rodzina", "konflikt", "granice", "odpowiedzialność"],
    description: "Mapa relacji, wpływu i odpowiedzialności pomagająca oddzielić własne decyzje od oczekiwań innych członków rodziny.",
    noteTemplate: `KONKRETNA SYTUACJA / POWTARZAJĄCY SIĘ WZORZEC:

OSOBY I ROLE W SYSTEMIE RODZINNYM:

CO JEST POD MOJĄ KONTROLĄ / WPŁYWEM / POZA MOIM WPŁYWEM:

MOJA ODPOWIEDZIALNOŚĆ:

ODPOWIEDZIALNOŚĆ INNYCH OSÓB, KTÓREJ NIE MUSZĘ PRZEJMOWAĆ:

GRANICA WYRAŻONA KRÓTKIM ZDANIEM:

MOŻLIWA REAKCJA RODZINY I PLAN ZADBANIA O SIEBIE:

ZASOBY / OSOBY WSPIERAJĄCE:`,
    homeworkTemplate: "Dokończ dwa zdania: „Mogę zadbać o…” oraz „Nie jestem odpowiedzialna/y za…”. Wybierz jedną małą granicę do przećwiczenia w bezpiecznej sytuacji.",
    isFavorite: false,
  },
  {
    id: "adult-stress-balance",
    title: "Dorosły — mapa obciążenia, zasobów i regeneracji",
    category: "Dorośli · stres i codzienność",
    ageGroup: "Dorośli",
    keywords: ["stres", "przeciążenie", "rodzina", "praca", "regeneracja"],
    description: "Niediagnostyczny bilans codziennego obciążenia i dostępnych zasobów. Pomaga wybrać małą zmianę bez tworzenia kolejnej listy wymagań.",
    noteTemplate: `NAJWAŻNIEJSZE OBSZARY OBCIĄŻENIA:
□ praca  □ rodzina  □ relacja  □ zdrowie  □ opieka nad bliskimi  □ finanse  □ inne

AUTORSKI CHECK-IN 0–10 (nie jest testem):
Obciążenie ___ Energia ___ Sen/regeneracja ___ Poczucie wpływu ___ Wsparcie ___

CO ZABIERA ENERGIĘ / CO JĄ CHOĆ TROCHĘ ODNAWIA:

SYGNAŁY, ŻE GRANICA ZOSTAŁA PRZEKROCZONA:

CO MOŻNA: usunąć ___ odłożyć ___ uprościć ___ delegować ___ przyjąć pomoc ___

NAJMNIEJSZA REALNA ZMIANA:

CZY POTRZEBNA JEST DODATKOWA KONSULTACJA MEDYCZNA / PSYCHIATRYCZNA / INTERWENCYJNA:`,
    homeworkTemplate: "Przez tydzień wybierz jeden pięciominutowy moment regeneracji, który nie wymaga przygotowań ani wydatków. Zapisz tylko, czy był możliwy i co go ułatwiło lub utrudniło.",
    isFavorite: false,
  },
  {
    id: "general-first-meeting",
    title: "Pierwsze spotkanie — cele, zasoby i bezpieczeństwo",
    category: "Ogólne · pierwsza konsultacja",
    ageGroup: "Nastolatki i dorośli",
    keywords: ["pierwsza wizyta", "cele", "zasoby", "bezpieczeństwo"],
    description: "Neutralna struktura pierwszego spotkania. Nie podpowiada rozpoznania; pomaga uzgodnić cel, preferencje współpracy i kolejne kroki.",
    noteTemplate: `CO SPRAWIŁO, ŻE OSOBA ZGŁASZA SIĘ WŁAŚNIE TERAZ:

JAK SAMA OPISUJE TRUDNOŚĆ I JEJ WPŁYW NA CODZIENNOŚĆ:

CO JUŻ POMAGA / CO WCZEŚNIEJ NIE POMAGAŁO:

MOCNE STRONY, ZASOBY, WAŻNE RELACJE:

CEL WŁASNYMI SŁOWAMI OSOBY:

PREFEROWANY SPOSÓB PRACY, TEMPO, POTRZEBA PRZERW:

ZDROWIE, SEN, SUBSTANCJE, LEKI I INNE FORMY POMOCY — tylko w zakresie potrzebnym do bezpiecznej współpracy:

SPRAWDZENIE BEZPIECZEŃSTWA I CZYNNIKÓW RYZYKA:

USTALONY NASTĘPNY KROK / POTRZEBA SKIEROWANIA:`,
    homeworkTemplate: "Jeśli osoba chce: zapisać jedno zdanie „Po czym poznam, że nasze spotkania mi pomagają?”. Odpowiedź może się później zmienić.",
    isFavorite: false,
  },
];

export const STARTER_TEMPLATE_SOURCES = [
  { label: "NICE NG87 — ADHD", href: "https://www.nice.org.uk/guidance/ng87/chapter/Recommendations" },
  { label: "NICE CG170 — spektrum autyzmu u osób poniżej 19 lat", href: "https://www.nice.org.uk/guidance/cg170/chapter/Recommendations" },
  { label: "NHS — lęk społeczny", href: "https://www.nhs.uk/mental-health/conditions/social-anxiety/" },
  { label: "NHS — lęk u dzieci", href: "https://www.nhs.uk/mental-health/children-and-young-adults/advice-for-parents/anxiety-in-children/" },
  { label: "NCTSN — żałoba traumatyczna dzieci", href: "https://www.nctsn.org/node/2175" },
  { label: "AACAP — dzieci i rozwód", href: "https://www.aacap.org/AACAP/AACAP/Families_and_Youth/Facts_for_Families/FFF-Guide/Children-and-Divorce-001.aspx" },
  { label: "AACAP — żałoba u dzieci", href: "https://www.aacap.org/AACAP/AACAP/Families_and_Youth/Facts_for_Families/FFF-Guide/Children-And-Grief-008.aspx" },
];
