export type SelfCareCategory = "all" | "screen" | "places" | "events" | "gifts" | "deals";

export type SelfCareInspiration = {
  id: string;
  category: Exclude<SelfCareCategory, "all">;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
};

export const selfCareInspirations: SelfCareInspiration[] = [
  { id: "k-romance-evening", category: "screen", eyebrow: "Netflix i K-romance", title: "Koreański wieczór romantyczny", description: "Nowa komedia romantyczna, coś dobrego do jedzenia i wieczór bez pośpiechu.", note: "PsychOLKA później podpowie świeże premiery." },
  { id: "big-premiere", category: "screen", eyebrow: "Duża premiera", title: "Film albo serial na wspólny wieczór", description: "Miejsce na najciekawsze nowości Netflixa i innych platform — bez przekopywania całego katalogu.", note: "Lista będzie aktualizowana po podłączeniu źródeł." },
  { id: "cinema-date", category: "events", eyebrow: "Kino", title: "Wieczorny seans we dwoje", description: "Lekka komedia, romans albo głośna premiera kinowa na spokojny wieczór.", note: "Wkrótce: repertuar i daty seansów." },
  { id: "restaurant-evening", category: "places", eyebrow: "Wyjście", title: "Kolacja w wyjątkowym miejscu", description: "Ciekawa restauracja w Starogardzie Gdańskim lub Trójmieście na randkę, rocznicę albo spontaniczny wieczór.", note: "Wkrótce: sprawdzone miejsca i wydarzenia." },
  { id: "important-date-gift", category: "gifts", eyebrow: "Ważne daty", title: "Pomysł na prezent bez stresu", description: "Inspiracje dopasowane do urodzin, rocznicy i zapisanych w panelu okazji.", note: "Połączymy tę sekcję z kalendarzem ważnych dat." },
  { id: "fashion-deal", category: "deals", eyebrow: "Dobra okazja", title: "Kod lub promocja w ulubionym sklepie", description: "Zalando, eobuwie, MODIVO, ASOS, IKEA i inne miejsca warte sprawdzenia.", note: "Pokażemy tylko propozycje z datą ważności i źródłem." },
];
