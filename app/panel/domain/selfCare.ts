export type SelfCareCategory = "all" | "netflix" | "cinema" | "places" | "events" | "gifts" | "deals";

export type SelfCareInspiration = {
  id: string;
  category: Exclude<SelfCareCategory, "all">;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
};

export const selfCareInspirations: SelfCareInspiration[] = [
  { id: "k-romance-evening", category: "netflix", eyebrow: "Netflix · K-romance", title: "Koreański wieczór romantyczny", description: "Nowy koreański serial albo film romantyczny, coś dobrego do jedzenia i wieczór bez pośpiechu.", note: "PsychOLKA później podpowie świeże premiery Netflixa." },
  { id: "big-netflix-premiere", category: "netflix", eyebrow: "Netflix · Nowości", title: "Wielka premiera na wspólny wieczór", description: "Najciekawsze nowe filmy i seriale Netflixa — bez przekopywania całego katalogu.", note: "Lista będzie aktualizowana po podłączeniu źródeł." },
  { id: "cinema-date", category: "cinema", eyebrow: "Kino · Polecane", title: "Komedia albo romans na dużym ekranie", description: "Polecana komedia, film romantyczny albo ciekawa premiera kinowa na spokojny wieczór.", note: "Wkrótce: aktualny repertuar i daty seansów." },
  { id: "restaurant-evening", category: "places", eyebrow: "Wyjście", title: "Kolacja w wyjątkowym miejscu", description: "Ciekawa restauracja w Starogardzie Gdańskim lub Trójmieście na randkę, rocznicę albo spontaniczny wieczór.", note: "Wkrótce: sprawdzone miejsca i wydarzenia." },
  { id: "important-date-gift", category: "gifts", eyebrow: "Ważne daty", title: "Pomysł na prezent bez stresu", description: "Inspiracje dopasowane do urodzin, rocznicy i zapisanych w panelu okazji.", note: "Połączymy tę sekcję z kalendarzem ważnych dat." },
  { id: "fashion-deal", category: "deals", eyebrow: "Dobra okazja", title: "Kod lub promocja w ulubionym sklepie", description: "Zalando, eobuwie, MODIVO, ASOS, IKEA i inne miejsca warte sprawdzenia.", note: "Pokażemy tylko propozycje z datą ważności i źródłem." },
];
