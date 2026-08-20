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

export const STARTER_KNOWLEDGE_MATERIALS: KnowledgeMaterial[] = [...sessionPlans, ...activities];

