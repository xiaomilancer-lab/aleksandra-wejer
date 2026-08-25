import type { KnowledgeCategory, KnowledgeMaterial } from "../domain";
import { STARTER_VISIT_TEMPLATES } from "./starterVisitTemplates";

const RELEASE_DATE = "2026-08-20T00:00:00.000Z";

function categoryForTemplate(title: string): KnowledgeCategory {
  if (title.includes("ADHD")) return "ADHD";
  if (title.includes("Spektrum")) return "Spektrum autyzmu";
  if (title.includes("Mutyzm")) return "Mutyzm";
  if (title.includes("Para")) return "Pary";
  if (title.includes("Nastolatek")) return "Nastolatki";
  if (title.includes("Dorosły")) return "Dorośli";
  if (title.includes("stracie")) return "Rodzina";
  if (title.includes("rodziców")) return "Rodzina";
  return "Rozwój";
}

const sessionPlans: KnowledgeMaterial[] = STARTER_VISIT_TEMPLATES.map((template) => ({
  id: `starter-plan-${template.id}`,
  title: template.title,
  category: categoryForTemplate(template.title),
  description: template.description,
  tags: [template.ageGroup, "plan sesji", "forma:tekst", ...template.keywords],
  content: `PLAN SPOTKANIA\n\n${template.noteTemplate}\n\nĆWICZENIE MIĘDZY SPOTKANIAMI\n\n${template.homeworkTemplate}\n\nWAŻNE\nMateriał pomocniczy do indywidualnego dostosowania przez psychologa. Nie jest testem diagnostycznym ani samodzielną procedurą leczenia.`,
  is_pinned: template.isFavorite,
  created_at: RELEASE_DATE,
  updated_at: RELEASE_DATE,
}));

function activity(
  id: string,
  title: string,
  category: KnowledgeCategory,
  description: string,
  tags: string[],
  content: string,
  pinned = false,
): KnowledgeMaterial {
  return {
    id: `starter-activity-${id}`,
    title,
    category,
    description,
    tags,
    content,
    is_pinned: pinned,
    created_at: RELEASE_DATE,
    updated_at: RELEASE_DATE,
  };
}

const activities: KnowledgeMaterial[] = [
  activity(
    "emotion-detective",
    "Detektyw emocji — obrazkowa mapa sytuacji",
    "Dzieci",
    "Zabawowe ćwiczenie pomagające połączyć sytuację, sygnały z ciała, emocję, potrzebę i możliwą reakcję.",
    ["6–12 lat", "emocje", "samoregulacja", "forma:obrazkowe", "forma:gra", "do gabinetu", "do domu"],
    `CEL\nRozwijanie języka emocji bez oceniania odpowiedzi jako dobrych lub złych.\n\nPRZYGOTOWANIE\nNarysuj pięć pól lub użyj pięciu kartek: CO SIĘ STAŁO? / CIAŁO / EMOCJA / POTRZEBA / CO MOGĘ ZROBIĆ?\n\nPRZEBIEG\n1. Dziecko wybiera prawdziwą albo wymyśloną sytuację.\n2. W polu CIAŁO rysuje lub zaznacza miejsce napięcia, ciepła, ciężaru albo energii.\n3. Wybiera nazwę emocji; może wskazać kolor lub minkę zamiast mówić.\n4. Zastanawia się, czego bohater potrzebował.\n5. Losuje albo wymyśla trzy bezpieczne reakcje i ocenia je: „mogę spróbować”, „może później”, „to nie dla mnie”.\n\nWARIANT ZABAWOWY\nPsycholog opisuje zagadkę, a dziecko jest detektywem i szuka wskazówek w ciele bohatera.\n\nPYTANIA DOMYKAJĄCE\nCo było najłatwiejsze? Co dorośli mogliby zauważyć wcześniej? Jaki sygnał może oznaczać potrzebę przerwy?`,
    true,
  ),
  activity(
    "adhd-mission",
    "Misja w trzech krokach — ADHD i funkcje wykonawcze",
    "ADHD",
    "Krótka gra do ćwiczenia rozpoczynania zadania, pamięci roboczej i elastycznego planowania.",
    ["7–14 lat", "ADHD", "funkcje wykonawcze", "organizacja", "forma:gra", "ruch", "do gabinetu", "do domu"],
    `CEL\nPrzećwiczenie dzielenia zadania na małe, widoczne etapy.\n\nMATERIAŁY\nTrzy kartki, flamaster, minutnik bez głośnego alarmu, dowolny mały przedmiot jako „znacznik misji”.\n\nPRZEBIEG\n1. Wybierz neutralną misję, np. przygotowanie stanowiska do rysowania.\n2. Dziecko ustala trzy kroki i rysuje dla nich symbole.\n3. Przed startem wybiera pomoc: ruch / obrazek / przypomnienie / wspólne rozpoczęcie.\n4. Po każdym kroku przesuwa znacznik.\n5. Po misji nie oceniamy szybkości. Sprawdzamy: co pomogło zacząć, co rozproszyło, co warto zmienić.\n\nPOZIOM 2\nWprowadź niespodziewaną, bezpieczną zmianę i wspólnie ułóż plan B.\n\nDO DOMU\nJedna codzienna czynność w trzech krokach. Opiekun pyta „jakiej pomocy potrzebujesz?”, zamiast wielokrotnie przypominać.`,
    true,
  ),
  activity(
    "sensory-traffic-lights",
    "Sygnalizacja sensoryczna — zielone, żółte, czerwone",
    "Spektrum autyzmu",
    "Wizualna mapa komfortu, przeciążenia i sposobów proszenia o zmianę lub przerwę.",
    ["6–16 lat", "autyzm", "spektrum", "sensoryka", "komunikacja", "forma:obrazkowe", "do gabinetu", "do domu"],
    `CEL\nPoznanie indywidualnych sygnałów komfortu i przeciążenia. Nie chodzi o uczenie maskowania.\n\nARKUSZ\nZIELONE — jest mi wystarczająco wygodnie; mogę uczestniczyć po swojemu.\nŻÓŁTE — pojawiają się pierwsze sygnały obciążenia.\nCZERWONE — potrzebuję zatrzymania, ciszy, wyjścia albo wsparcia.\n\nDLA KAŻDEGO KOLORU UZUPEŁNIJ\n• Co może dziać się w ciele?\n• Jak zachowanie może być widoczne dla innych?\n• Jakie dźwięki, światło, dotyk, zapach lub ruch mają znaczenie?\n• Co pomaga, a co zwykle pogarsza sytuację?\n• Jak dziecko chce zakomunikować potrzebę przerwy?\n\nZAKOŃCZENIE\nWybierzcie jeden sygnał i jedną zmianę środowiska, które dorośli będą respektować. Dziecko decyduje, komu karta może zostać pokazana.`,
    true,
  ),
  activity(
    "communication-menu",
    "Menu komunikacji bez nacisku",
    "Mutyzm",
    "Karta wyboru sposobu uczestnictwa dla dziecka, które nie zawsze może lub chce odpowiadać głosem.",
    ["5–14 lat", "mutyzm", "lęk", "komunikacja", "forma:obrazkowe", "forma:gra", "do gabinetu", "szkoła"],
    `NA POCZĄTKU SPOTKANIA\nPokaż dziecku menu bez proszenia o głośną odpowiedź:\n□ mogę wskazywać\n□ mogę rysować\n□ mogę pisać\n□ mogę wybierać z dwóch opcji\n□ mogę użyć gestu TAK/NIE\n□ mogę mówić do wybranej osoby\n□ dziś wolę obserwować\n\nZASADY DLA DOROSŁEGO\n• Daj czas i nie komentuj ciszy.\n• Nie stawiaj mówienia jako warunku udziału lub nagrody.\n• Nie zadawaj serii pytań.\n• Zauważaj zaangażowanie w każdej formie.\n• Przed zmianą oczekiwań uzgodnij mikrokrok z dzieckiem.\n\nZABAWA\nDziecko projektuje własne symbole menu i kartę „stop / przerwa / jeszcze raz”.\n\nMONITOROWANIE\nZapisujemy warunki, które zwiększały komfort — nie liczbę wypowiedzianych słów.`,
  ),
  activity(
    "grief-memory-island",
    "Wyspa wspomnień — praca po stracie",
    "Rodzina",
    "Delikatne ćwiczenie narracyjne pozwalające dziecku lub nastolatkowi decydować, ile chce pokazać.",
    ["7–17 lat", "żałoba", "strata", "śmierć bliskiej osoby", "forma:obrazkowe", "do gabinetu", "do domu"],
    `WAŻNE\nĆwiczenie jest zaproszeniem, nie obowiązkiem. Osoba może przerwać, zmienić temat albo zachować część pracy tylko dla siebie.\n\nPRZEBIEG\n1. Na kartce narysuj wyspę.\n2. Dodaj miejsca: ważne wspomnienie, rzecz której brakuje, coś czego nauczyła mnie ta osoba, trudne pytanie, bezpieczna przystań.\n3. Most może symbolizować ludzi i czynności pomagające wracać do codzienności.\n4. Latarnia oznacza to, co warto zachować w pamięci.\n\nPYTANIA BEZ NACISKU\nKtóre miejsce chcesz dziś odwiedzić? Które omijamy? Kto może być z tobą w bezpiecznej przystani?\n\nDOMKNIĘCIE\nPowrót do teraźniejszości: rozejrzenie się po pokoju, stopy na podłodze, wybór spokojnej czynności po spotkaniu. W razie sygnałów zagrożenia konieczna jest bezpośrednia ocena bezpieczeństwa.`,
    true,
  ),
  activity(
    "worry-creature",
    "Stworek zmartwień i pudełko wpływu",
    "Lęki",
    "Obrazowe oddzielenie dziecka od lęku oraz porządkowanie spraw na te, na które ma wpływ i na które go nie ma.",
    ["6–12 lat", "lęk", "zmartwienia", "forma:obrazkowe", "forma:gra", "do gabinetu", "do domu"],
    `PRZEBIEG\n1. Dziecko rysuje stworka zmartwień: jak mówi, kiedy przychodzi, gdzie czuć go w ciele.\n2. Nadaje mu imię, ale samo wybiera, czy chce o nim opowiadać.\n3. Przygotuj dwa pudełka: „mogę zrobić mały krok” i „potrzebuję pomocy / nie mam kontroli”.\n4. Zapisujcie lub rysujcie zmartwienia i wkładajcie je do odpowiedniego pudełka.\n5. Dla pierwszego pudełka wybierzcie jeden mały krok; dla drugiego — bezpieczną osobę albo zdanie wsparcia.\n\nNIE ROBIMY\nNie zapewniamy automatycznie „na pewno nic się nie stanie” i nie zawstydzamy za lęk.\n\nDO DOMU\nPięciominutowa „pora na zmartwienia” o stałej porze, zakończona powrotem do konkretnej czynności tu i teraz.`,
  ),
  activity(
    "teen-social-experiment",
    "Laboratorium społeczne — mały eksperyment nastolatka",
    "Nastolatki",
    "Arkusz planowania niewielkiego kroku społecznego i porównania przewidywania z rzeczywistym przebiegiem.",
    ["12–18 lat", "lęk społeczny", "samotność", "rówieśnicy", "forma:tekst", "do gabinetu", "do domu"],
    `ZASADA\nTo eksperyment zbierający informacje, nie egzamin z bycia towarzyskim.\n\nPLAN\nSytuacja: ___\nCo przewiduję: ___\nNapięcie przed 0–10: ___\nNajmniejszy krok o trudności maksymalnie 3/10: ___\nPlan wyjścia / osoba wspierająca: ___\n\nPO EKSPERYMENCIE\nCo faktycznie się wydarzyło (same obserwowalne fakty): ___\nNapięcie w trakcie / po: ___\nCo było choć odrobinę inne od przewidywania: ___\nCzego dowiedziałem/am się o sytuacji lub o sobie: ___\nNastępnym razem: powtórzę / zmniejszę krok / zmienię warunki / zrezygnuję: ___\n\nBEZPIECZEŃSTWO\nJeśli występuje przemoc lub cyberprzemoc, celem nie jest lepsze „dopasowanie się”, tylko uruchomienie ochrony i wsparcia dorosłych.`,
  ),
  activity(
    "teen-values-compass",
    "Kompas wartości — decyzje i tożsamość nastolatka",
    "Nastolatki",
    "Ćwiczenie pomagające odróżnić własne wartości od presji grupy i wybrać mały zgodny z nimi krok.",
    ["13–18 lat", "tożsamość", "wartości", "decyzje", "presja grupy", "forma:tekst", "forma:gra", "do gabinetu"],
    `PRZYGOTOWANIE\nNa osobnych kartkach zapisz: przyjaźń, bezpieczeństwo, odwaga, ciekawość, rodzina, niezależność, uczciwość, zabawa, rozwój, spokój oraz puste karty.\n\nPRZEBIEG\n1. Nastolatek wybiera pięć ważnych wartości, potem trzy.\n2. Dla każdej odpowiada: „jak wygląda w działaniu?”, bez oceniania.\n3. Wybiera aktualny dylemat i sprawdza, które wartości są w napięciu.\n4. Tworzy trzy możliwe działania i ocenia ich zgodność z wartościami 0–10.\n5. Wybiera najmniejszy odwracalny krok.\n\nPYTANIA\nCzy to mój wybór, czy próba uniknięcia oceny? Jaką cenę ma każda opcja? Co doradził(a)bym bliskiej osobie?\n\nUWAGA\nĆwiczenie nie służy przekonywaniu nastolatka do wartości dorosłego.`,
  ),
  activity(
    "adult-circle-control",
    "Kręgi wpływu — przeciążenie i granice",
    "Dorośli",
    "Praktyczny arkusz rozdzielający kontrolę, wpływ i sprawy pozostające poza wpływem.",
    ["dorośli", "stres", "granice", "przeciążenie", "forma:tekst", "do gabinetu", "do domu"],
    `NARYSUJ TRZY KRĘGI\n1. MAM KONTROLĘ — moje zachowanie, słowa, decyzje i sposób zadbania o siebie.\n2. MAM WPŁYW — mogę poprosić, negocjować, przygotować się, ale nie decyduję za innych.\n3. POZA MOIM WPŁYWEM — przeszłość, cudze wybory, część zdarzeń i reakcji.\n\nPRACA\nWpisz elementy aktualnej sytuacji do kręgów. Sprawdź, czy nie przejmujesz odpowiedzialności innych osób.\n\nWYBÓR\nJedna rzecz z kręgu kontroli, którą zrobię: ___\nJedna prośba z kręgu wpływu: ___\nJedno zdanie pozwalające odłożyć sprawę spoza wpływu: ___\n\nDOMKNIĘCIE\nCo może utrudnić wykonanie kroku? Jak zmniejszyć go o połowę? Kto może wesprzeć bez przejmowania odpowiedzialności?`,
    true,
  ),
  activity(
    "adult-needs-translator",
    "Tłumacz potrzeb — od krytyki do konkretnej prośby",
    "Dorośli",
    "Arkusz zmiany uogólnienia lub oskarżenia w obserwację, emocję, potrzebę i wykonalną prośbę.",
    ["dorośli", "relacje", "komunikacja", "potrzeby", "forma:tekst", "do gabinetu", "do domu"],
    `ZDANIE STARTOWE\n„Ty zawsze / nigdy…” albo myśl krytyczna: ___\n\nTŁUMACZENIE\n1. Obserwowalny fakt bez „zawsze” i „nigdy”: Kiedy wydarza się ___\n2. Emocja, a nie ocena drugiej osoby: czuję ___\n3. Potrzeba lub ważna wartość: ponieważ ważne jest dla mnie ___\n4. Konkretna, możliwa do odrzucenia prośba: czy możesz ___ do/kiedy ___?\n\nSPRAWDZENIE PROŚBY\nCzy druga osoba wie dokładnie, o co proszę? Czy może odpowiedzieć „nie” bez kary? Czy to prośba o zachowanie, a nie zmianę osobowości?\n\nPLAN B\nJeśli odpowiedź brzmi „nie”, mogę: negocjować / zadbać o granicę / odłożyć rozmowę / poszukać wsparcia.`,
  ),
  activity(
    "couple-pause-card",
    "Karta bezpiecznej przerwy dla pary",
    "Pary",
    "Gotowa struktura przerwy w konflikcie, która nie oznacza porzucenia rozmowy.",
    ["dorośli", "para", "konflikt", "komunikacja", "forma:tekst", "do gabinetu", "do domu"],
    `UMOWA PRZERWY\nSygnał, którego używamy: ___\nZdanie: „Chcę wrócić do tej rozmowy. Teraz potrzebuję ___ minut przerwy.”\nMinimalny czas: ___  Maksymalny czas: ___\nDokładna pora i miejsce powrotu: ___\n\nW TRAKCIE PRZERWY\nPomocne: spacer, woda, spokojny oddech, zapisanie potrzeb, kontakt z ciałem.\nNiepomocne: przygotowywanie kontrargumentów, wiadomości obrażające, angażowanie dzieci, alkohol/substancje, groźby odejścia.\n\nPO POWROCIE\nKażda osoba mówi przez 2 minuty: co czuję, czego potrzebuję, o co proszę. Druga podsumowuje.\n\nGRANICA\nWspólna praca nie jest właściwa, jeśli występuje przemoc, kontrola, przymus lub strach przed odmową — wtedy potrzebna jest oddzielna ocena bezpieczeństwa.`,
  ),
  activity(
    "family-team-map",
    "Rodzinny zespół — mapa potrzeb bez szukania winnego",
    "Rodzina",
    "Ćwiczenie rodzinne porządkujące potrzeby, zasoby i jedną małą wspólną zmianę.",
    ["rodzina", "dzieci", "nastolatki", "konflikt", "współpraca", "forma:obrazkowe", "forma:gra", "do gabinetu"],
    `ZASADA\nOpisujemy problem jako wspólnego przeciwnika rodziny, nie jako „trudną osobę”.\n\nMAPA\nNa środku: nazwa problemu neutralnym językiem, np. „poranny pośpiech”.\nWokół każda osoba uzupełnia:\n• co wtedy widzę i słyszę,\n• co czuję / czego potrzebuję,\n• co już czasem pomaga,\n• jakiej małej pomocy mogę udzielić,\n• czego nie jestem w stanie obiecać.\n\nEKSPERYMENT NA TYDZIEŃ\nWybierzcie jedną zmianę, która nie obciąża tylko jednej osoby. Ustalcie po czym poznacie, że pomaga choć w 10%.\n\nSPRAWDZENIE\nCo zachowujemy? Co upraszczamy? Czy każdy, również dziecko, mógł powiedzieć „to mi nie pomaga”?`,
  ),
  activity(
    "strengths-cards",
    "Karty mocnych stron — zauważam dowody",
    "Rozwój",
    "Uniwersalna gra dla dzieci, nastolatków i dorosłych oparta na konkretnych przykładach zamiast pustych komplementów.",
    ["dzieci", "nastolatki", "dorośli", "mocne strony", "samoocena", "forma:gra", "do gabinetu", "do domu"],
    `PRZYGOTOWANIE\nPrzygotuj karty: wytrwałość, ciekawość, troska, humor, odwaga, kreatywność, uczciwość, współpraca, elastyczność, proszenie o pomoc oraz puste karty.\n\nPRZEBIEG\n1. Osoba wybiera kartę, która czasem do niej pasuje — nie musi „zawsze”.\n2. Szuka jednego małego dowodu z ostatnich dwóch tygodni.\n3. Wybiera kartę, którą chciałaby częściej wykorzystywać.\n4. Planuje sytuację, w której może jej użyć w wersji 1%.\n\nWARIANT GRUPOWY / RODZINNY\nInni mogą podarować kartę tylko z konkretnym, życzliwym przykładem i za zgodą odbiorcy.\n\nDO DOMU\nZauważ jeden moment użycia mocnej strony. Bez tabeli wyników i obowiązku codziennego raportowania.`,
  ),
  activity(
    "grounding-menu",
    "Menu powrotu do tu i teraz",
    "Lęki",
    "Zestaw krótkich, dobrowolnych sposobów uziemienia do sprawdzenia i indywidualnego wyboru.",
    ["nastolatki", "dorośli", "lęk", "napięcie", "przeciążenie", "forma:tekst", "do gabinetu", "do domu"],
    `WAŻNE\nNie każda technika uspokaja każdą osobę. Nie wymuszamy zamykania oczu ani pracy z oddechem.\n\nMENU — WYBIERZ JEDNĄ OPCJĘ\n□ nazwij 5 rzeczy, które widzisz, i 3 dźwięki, które słyszysz\n□ oprzyj stopy i zauważ nacisk podłoża\n□ trzymaj chłodny lub ciepły przedmiot o bezpiecznej temperaturze\n□ opisz dokładnie jeden przedmiot w pokoju\n□ powolny ruch: przeciągnięcie, przejście kilku kroków\n□ policz wybrane kształty lub kolory\n□ powiedz datę, miejsce i zdanie „teraz jestem…”\n□ własny sposób: ___\n\nPO PRÓBIE\nCzy jest: lepiej / bez zmian / gorzej? Co zmodyfikować? Osoba może zrezygnować bez tłumaczenia.\n\nPLAN\nMoje dwie najbardziej neutralne lub pomocne opcje: ___`,
  ),
];

const colorfulActivities: KnowledgeMaterial[] = [
  activity(
    "emotion-town",
    "Kolorowe miasteczko emocji — scenki do opowiadania",
    "Dzieci",
    "Cztery barwne scenki pomagające dziecku zauważyć emocje, potrzeby i różne możliwe zakończenia historii.",
    ["5–11 lat", "emocje", "potrzeby", "scenki", "forma:obrazkowe", "forma:gra", "do gabinetu", "do domu"],
    `KOLOROWE MIASTECZKO
Narysuj cztery domki albo wydrukuj cztery osobne karty.

🟡 DOMEK SŁOŃCA
Bohater czeka na swoją kolej, ale ktoś wchodzi przed niego.
Co może czuć? Czego potrzebuje? Co może powiedzieć lub pokazać?

🔵 DOMEK DESZCZU
Bohater nie został zaproszony do wspólnej zabawy.
Jakie sygnały mogą pojawić się w ciele? Kto mógłby go wesprzeć?

🟢 DOMEK OGRODU
Bohater próbuje czegoś nowego i popełnia błąd.
Jak można zmienić zakończenie, żeby błąd stał się informacją, a nie oceną?

🟣 DOMEK CISZY
Bohater ma za dużo dźwięków, pytań albo osób wokół.
Jak może poprosić o przerwę bez używania słów?

ZABAWA
Dziecko wybiera kolory, rysuje miny i dopowiada co najmniej dwa możliwe zakończenia. Nie szukamy jednej „dobrej” odpowiedzi.

DOMKNIĘCIE
Który domek był dziś najłatwiejszy? Który odkładamy na później?`,
    true,
  ),
  activity(
    "needs-detective",
    "Detektyw potrzeb — obrazkowe karty tropów",
    "Dzieci",
    "Gra w łączenie zachowania z możliwą potrzebą, bez oceniania i bez zgadywania jednej pewnej przyczyny.",
    ["6–12 lat", "potrzeby", "emocje", "komunikacja", "forma:obrazkowe", "forma:gra", "do gabinetu"],
    `PRZYGOTUJ KARTY TROPÓW
✋ PRZERWA  🫶 WSPARCIE  🔇 CISZA  🎯 JASNA INSTRUKCJA
🧩 WYBÓR  🚶 RUCH  ⏳ WIĘCEJ CZASU  💬 BYCIE WYSŁUCHANYM

MISJE DETEKTYWA
1. Ktoś odsuwa kartkę i przestaje pracować.
2. Ktoś mówi bardzo głośno, gdy zmienia się plan.
3. Ktoś stoi obok grupy, ale nie dołącza.
4. Ktoś trzy razy pyta, co będzie potem.

PRZEBIEG
Dziecko wybiera jeden lub kilka możliwych tropów. Potem tworzy pytanie sprawdzające, np. „Potrzebujesz przerwy czy wolisz, żebym pokazał pierwszy krok?”.

SUPERMOCE DETEKTYWA
□ nie czytam w myślach
□ sprawdzam zamiast oceniać
□ akceptuję odpowiedź „nie wiem”
□ pamiętam, że zachowanie może mieć kilka przyczyn

WŁASNA KARTA
Dziecko projektuje symbol potrzeby, której zabrakło w talii.`,
  ),
  activity(
    "space-team",
    "Kosmiczna drużyna — współpraca i elastyczny plan",
    "ADHD",
    "Ruchowa misja z kolorowymi planetami do ćwiczenia rozpoczynania, dzielenia zadania i spokojnej zmiany planu.",
    ["7–13 lat", "ADHD", "funkcje wykonawcze", "współpraca", "forma:obrazkowe", "forma:gra", "ruch", "do gabinetu"],
    `PLANSZA
Narysuj drogę rakiety przez cztery planety:
🔴 START — jaki jest pierwszy najmniejszy ruch?
🟠 PALIWO — jakiej pomocy lub przypomnienia potrzebuję?
🟢 MISJA — które trzy kroki wykonamy?
🔵 PLAN B — co zrobimy, gdy coś się zmieni?

ROLE
Nawigator pokazuje następny krok. Pilot wykonuje krok. Mechanik zauważa przeciążenie i może użyć karty PRZERWA. Role można zamieniać.

NIESPODZIANKA
Po drugim kroku wylosuj bezpieczną zmianę: mniej czasu / inny przyrząd / dodatkowa przerwa / zamiana ról. Drużyna wybiera plan B.

PUNKTY DRUŻYNY
Nie przyznajemy punktów za szybkość. Gwiazdka pojawia się za: poproszenie o pomoc, zauważenie potrzeby przerwy, zmianę planu albo powrót po rozproszeniu.

PYTANIE NA KONIEC
Która pomoc była dziś paliwem rakiety?`,
    true,
  ),
  activity(
    "weather-map",
    "Pogodowa mapa dnia — emocje dla młodszych",
    "Dzieci",
    "Prosty, kolorowy arkusz pozwalający pokazać nastrój i potrzebę również bez mówienia.",
    ["5–9 lat", "emocje", "samoregulacja", "komunikacja", "forma:obrazkowe", "do gabinetu", "do domu"],
    `MOJA POGODA TERAZ
☀️ słonecznie  🌤️ trochę chmur  🌧️ deszczowo  ⛈️ burzowo  🌫️ mgliście  🌈 różnie naraz

DZIECKO MOŻE
• zakreślić symbol,
• pokolorować niebo,
• narysować własną pogodę,
• niczego nie wyjaśniać.

CO MOŻE POMÓC TEJ POGODZIE?
🫶 ktoś obok  🔇 ciszej  🚶 ruch  🧸 bezpieczny przedmiot
🎨 rysowanie  ⏸️ przerwa  💬 rozmowa  ❓ jeszcze nie wiem

TRZY KLATKI
1. Pogoda rano: ___
2. Pogoda teraz: ___
3. Pogoda, której potrzebuję po spotkaniu: ___

DLA DOROSŁEGO
Nie poprawiaj pogody i nie wymagaj „słońca”. Zapytaj: „Czy chcesz, żebym tylko zobaczył, czy mamy coś zrobić?”.`,
  ),
];

const illustratedScenarios: KnowledgeMaterial[] = [
  activity(
    "peer-group-first-step",
    "Scenka: Pierwszy krok do grupy — nastolatka poza paczką",
    "Nastolatki",
    "Zobrazowany scenariusz rozmowy o samotności i bezpiecznym rozpoczęciu kontaktu bez udawania kogoś innego.",
    ["12–17 lat", "relacje rówieśnicze", "samotność", "forma:scenki", "scenariusz zobrazowany", "do gabinetu", "do domu"],
    `🎯 CEL\nZnaleźć jeden mały, autentyczny sposób wejścia w kontakt — bez presji, że trzeba od razu zdobyć całą grupę.\n\n🖼️ SCENERIA\nPrzerwa w szkole. Przy oknie stoi Lena. Obok trzy osoby rozmawiają o serialu. Nad Leną narysuj trzy chmurki: „Podejdę”, „Poczekam”, „Zapytam jedną osobę”.\n\n🎬 SCENA 1 — STOP-KLATKA\nCo Lena zauważa w ciele? Jaką myśl dopowiada jej lęk? Jakie inne wyjaśnienia zachowania grupy są możliwe?\n\n🗣️ ZACZEPKI ROZMOWY\n• „Słyszałam tytuł — warto zacząć oglądać?”\n• „Mogę usiąść obok?”\n• „Nie wiem, jak zacząć, ale chciałam dołączyć.”\nPsycholog i pacjent odgrywają każdą wersję w tempie 25%, 50% i naturalnym.\n\n🧩 WYBÓR PACJENTA\nZielona karta: mogę spróbować. Żółta: potrzebuję wsparcia. Czerwona: dziś tylko obserwuję. Każdy wybór jest ważny.\n\n🏠 DO DOMU\nJedno mikro-połączenie: kontakt wzrokowy, krótkie pytanie albo wiadomość do jednej bezpiecznej osoby. Po próbie zapisać nie wynik, lecz odwagę i poziom napięcia.\n\n🛟 BEZPIECZEŃSTWO\nNie ćwiczymy dopasowania za wszelką cenę. Sprawdzamy też, czy grupa jest życzliwa i bezpieczna.`,
    true,
  ),
  activity(
    "adhd-energy-station",
    "Scenka: Stacja energii — dziecko z ADHD zaczyna zadanie",
    "ADHD",
    "Kolorowa misja pokazująca, jak rozpocząć zadanie, poprosić o pomoc i wrócić po rozproszeniu.",
    ["7–13 lat", "ADHD", "funkcje wykonawcze", "forma:scenki", "scenariusz zobrazowany", "forma:obrazkowe", "do gabinetu"],
    `🎯 CEL\nOddzielić „nie mogę zacząć” od „nie chcę” i wspólnie znaleźć paliwo do pierwszego kroku.\n\n🖼️ SCENERIA\nKosmiczna stacja ma cztery pulpity: START, PALIWO, PRZERWA, POWRÓT. Dziecko wybiera postać pilota i rysuje jej wskaźnik energii.\n\n🎬 SCENA 1 — ZAMROŻONY START\nNa biurku leży zadanie. Pilot chodzi po pokoju i dotyka innych rzeczy. Co mówi ciało? Czego brakuje: jasnego pierwszego kroku, ruchu, obecności dorosłego czy czasu?\n\n🗣️ ZACZEPKI ROZMOWY\n• „Pokaż mi najmniejszy możliwy start.”\n• „Chcesz, żebym był nawigatorem czy tylko obserwatorem?”\n• „Jak poznamy, że potrzebna jest przerwa?”\n\n🧩 TRZY KARTY POMOCY\n🚀 Zaczynamy razem przez 30 sekund.  🗺️ Rysujemy trzy kroki.  ⚡ Najpierw ruch, potem powrót.\n\n🏠 DO DOMU\nWybrać jedną codzienną czynność i przetestować jedną kartę pomocy. Dorosły pyta, co zadziałało, bez oceniania szybkości.\n\n🛟 BEZPIECZEŃSTWO\nNie odbieramy ruchu jako kary i nie używamy scenki do diagnozowania.`,
    true,
  ),
  activity(
    "mutism-choice-bridge",
    "Scenka: Most wyborów — komunikacja bez presji mówienia",
    "Mutyzm",
    "Bezpieczny scenariusz pozwalający uczestniczyć gestem, obrazkiem lub słowem, bez wymuszania głosu.",
    ["6–14 lat", "mutyzm", "komunikacja", "forma:scenki", "scenariusz zobrazowany", "forma:obrazkowe", "do gabinetu"],
    `🎯 CEL\nZbudować poczucie wpływu i kilka równorzędnych dróg komunikacji.\n\n🖼️ SCENERIA\nMiędzy dwiema wyspami jest most z kart: 👀 patrzę, 👉 wskazuję, ✍️ piszę, 🎨 rysuję, 💬 mówię jeśli chcę. Pacjent ustala kolejność kart.\n\n🎬 SCENA 1 — PYTANIE W SKLEPIE\nBohater chce wybrać sok. Jak może przekazać wybór bez mówienia? Psycholog gra życzliwego sprzedawcę, który cierpliwie czeka.\n\n🗣️ ZACZEPKI DLA PSYCHOLOGA\n• „Możesz odpowiedzieć na dowolny sposób albo pominąć.”\n• „Która karta jest dziś najbezpieczniejsza?”\n• „Czy mam zgadywać, czy wolisz mi pokazać?”\n\n🧩 ZMIANA SCENY\nSzkoła / dom / gabinet. Pacjent wybiera tylko jedną scenerię i może zatrzymać grę kartą STOP.\n\n🏠 DO DOMU\nStworzyć mały osobisty zestaw dwóch kart komunikacyjnych do użycia w jednej bezpiecznej sytuacji.\n\n🛟 BEZPIECZEŃSTWO\nMówienie nie jest nagrodą ani warunkiem sukcesu. Tempo ustala pacjent.`,
    true,
  ),
  activity(
    "two-homes-backpack",
    "Scenka: Plecak między dwoma domami — rozstanie rodziców",
    "Rodzina",
    "Obrazkowa historia pomagająca dziecku nazwać potrzeby i oddzielić sprawy dorosłych od własnej odpowiedzialności.",
    ["7–15 lat", "rozwód", "dwa domy", "rodzina", "forma:scenki", "scenariusz zobrazowany", "do gabinetu", "do domu"],
    `🎯 CEL\nPokazać, że dziecko nie musi wybierać strony ani naprawiać relacji dorosłych.\n\n🖼️ SCENERIA\nNarysuj dwa domy i drogę. Bohater niesie plecak. Do plecaka wkłada symbole: rzeczy potrzebne, pytania, tęsknotę, złość i „to nie jest moje zadanie”.\n\n🎬 SCENA 1 — PRZEKAZANIE\nDorośli są spięci. Bohater słyszy: „Powiedz mamie…” albo „Zapytaj tatę…”. Gdzie może odłożyć taką wiadomość? Kto dorosły powinien ją przenieść?\n\n🗣️ ZACZEPKI ROZMOWY\n• „Co chciałbyś mieć tak samo w obu domach?”\n• „Jak dorośli mogą ułatwić drogę?”\n• „Jakie zdanie ochronne pasuje: «Proszę, porozmawiajcie ze sobą»?”\n\n🧩 KARTA WPŁYWU\nMam wpływ: co zabieram, komu mówię, czego potrzebuję. Nie mam wpływu: decyzje dorosłych, ich emocje, ich spory.\n\n🏠 DO DOMU\nDorośli ustalają jedną przewidywalną rzecz wspólną dla obu domów. Dziecko nie jest posłańcem.\n\n🛟 BEZPIECZEŃSTWO\nPrzy podejrzeniu przemocy lub zagrożenia scenkę zastępuje ocena bezpieczeństwa i właściwa procedura.`,
  ),
  activity(
    "memory-lighthouse",
    "Scenka: Latarnia wspomnień — po stracie bliskiej osoby",
    "Rodzina",
    "Delikatna historia do rozmowy o tęsknocie i pamięci z pełnym prawem do przerwy oraz niewiedzy.",
    ["dzieci", "nastolatki", "żałoba", "strata", "forma:scenki", "scenariusz zobrazowany", "forma:obrazkowe", "do gabinetu"],
    `🎯 CEL\nDać język tęsknocie bez narzucania sposobu przeżywania żałoby.\n\n🖼️ SCENERIA\nNa brzegu stoi latarnia. Każde okno może przechować jedno wspomnienie: obraz, słowo, kolor albo pozostać puste.\n\n🎬 SCENA 1 — FALA\nBohatera nagle zalewa fala wspomnienia w zwykłym dniu. Co może zrobić ciało? Kogo może zawołać? Co pomaga przeczekać falę?\n\n🗣️ ZACZEPKI ROZMOWY\n• „Czy dziś otwieramy okno, czy tylko patrzymy na latarnię?”\n• „Jakiego koloru jest tęsknota?”\n• „Co chciałbyś, żeby dorośli rozumieli bez pytania?”\n\n🧩 WYBÓR\nNarysować / opowiedzieć / wybrać przedmiot / ominąć. Pacjent może zamknąć okno w dowolnym momencie.\n\n🏠 DO DOMU\nJeśli pacjent chce: stworzyć małe bezpieczne pudełko pamięci i ustalić, kto może je otwierać.\n\n🛟 BEZPIECZEŃSTWO\nPrzed ćwiczeniem sprawdzić gotowość, aktualne wsparcie i ryzyko. Nie wymuszać ekspozycji na wspomnienia.`,
  ),
  activity(
    "couple-translation-room",
    "Scenka: Pokój tłumaczy — para w trudnej rozmowie",
    "Pary",
    "Scenariusz pomagający zamienić oskarżenie na obserwację, emocję, potrzebę i konkretną prośbę.",
    ["dorośli", "para", "komunikacja", "konflikt", "forma:scenki", "scenariusz zobrazowany", "do gabinetu", "do domu"],
    `🎯 CEL\nSpowolnić konflikt i przełożyć obronę na komunikat, który druga osoba może usłyszeć.\n\n🖼️ SCENERIA\nMiędzy dwiema osobami stoi konsola z czterema przyciskami: FAKT, EMOCJA, POTRZEBA, PROŚBA. Psycholog jest tłumaczem, nie sędzią.\n\n🎬 SCENA 1 — SPÓŹNIENIE\nZdanie wejściowe: „Nigdy się ze mną nie liczysz”. Zatrzymujemy obraz i sprawdzamy, co jest obserwacją, a co interpretacją.\n\n🗣️ WERSJA PO TŁUMACZENIU\n„Kiedy wróciłeś później i nie dostałam wiadomości, poczułam napięcie i samotność. Potrzebuję przewidywalności. Czy następnym razem napiszesz krótką wiadomość?”\n\n🧩 ZMIANA RÓL\nDruga osoba najpierw powtarza sens własnymi słowami, bez zgadzania się lub bronienia. Potem role się zmieniają. Każdy ma kartę PAUZA.\n\n🏠 DO DOMU\nJedna dziesięciominutowa rozmowa o małym temacie z użyciem czterech przycisków. Zakończyć przed eskalacją.\n\n🛟 BEZPIECZEŃSTWO\nNie stosować wspólnej scenki przy przemocy, zastraszaniu lub braku bezpieczeństwa.`,
  ),
];

export const STARTER_KNOWLEDGE_MATERIALS: KnowledgeMaterial[] = [...sessionPlans, ...activities, ...colorfulActivities, ...illustratedScenarios];
