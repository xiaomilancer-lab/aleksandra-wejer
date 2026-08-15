export type LocalArea = {
  slug: string;
  name: string;
  intro: string;
  travelTip: string;
  decisionTip: string;
};

export const localAreas: ReadonlyArray<LocalArea> = [
  {
    slug: "skarszewy",
    name: "Skarszewy",
    intro: "Jeśli mieszkasz w Skarszewach i szukasz spokojnej konsultacji psychologicznej, możesz porównać terminy w dwóch gabinetach Aleksandry: w Starogardzie Gdańskim i w Nowej Wsi Rzecznej.",
    travelTip: "Przy wyborze terminu warto od razu sprawdzić obie lokalizacje. Kalendarz pokazuje ich rzeczywistą dostępność oddzielnie, dzięki czemu łatwiej połączyć spotkanie z dojazdem ze Skarszew.",
    decisionTip: "Nie musisz przed pierwszym kontaktem wiedzieć, jakiej formy pomocy potrzebujesz. Krótka rozmowa pozwoli spokojnie ustalić, od czego zacząć i który gabinet będzie praktyczniejszy.",
  },
  {
    slug: "sumin",
    name: "Sumin",
    intro: "Osoby z Sumina mogą umówić konsultację psychologiczną w Starogardzie Gdańskim albo w Nowej Wsi Rzecznej. Na stronie od razu widać wolne dni i godziny dla obu miejsc.",
    travelTip: "Zamiast wybierać gabinet w ciemno, najpierw porównaj kalendarze. Czasem dogodniejszy termin w drugiej lokalizacji pozwala ograniczyć czekanie na pierwsze spotkanie.",
    decisionTip: "Pierwsza konsultacja służy zrozumieniu sytuacji i nie zobowiązuje do kolejnych spotkań. Możesz przyjść z pytaniem, wątpliwością albo po prostu potrzebą uporządkowania tego, co się dzieje.",
  },
  {
    slug: "zblewo",
    name: "Zblewo",
    intro: "Dla mieszkańców Zblewa dostępne są konsultacje w dwóch rzeczywistych lokalizacjach gabinetu Aleksandry Wejer: w Starogardzie Gdańskim oraz w Nowej Wsi Rzecznej.",
    travelTip: "W formularzu rezerwacji wybierasz najpierw miejsce, a potem widzisz tylko terminy przypisane do tego gabinetu. Możesz wrócić o krok i szybko porównać drugą lokalizację.",
    decisionTip: "Aleksandra pracuje z dziećmi, młodzieżą, osobami dorosłymi, parami i rodzinami. Przed rezerwacją możesz również zadzwonić, jeśli nie wiesz, jaki rodzaj spotkania wybrać.",
  },
  {
    slug: "borzechowo",
    name: "Borzechowo",
    intro: "Szukając psychologa w okolicy Borzechowa, możesz sprawdzić konsultacje Aleksandry Wejer w Starogardzie Gdańskim i Nowej Wsi Rzecznej — bez ukrywania miejsca spotkania i bez pośredników.",
    travelTip: "Każda dostępna godzina w kalendarzu jest przypisana do konkretnego gabinetu. Przed potwierdzeniem zobaczysz pełną nazwę miejsca, datę i godzinę spotkania.",
    decisionTip: "Jeżeli zgłoszenie dotyczy dziecka lub nastolatka, przebieg pierwszego spotkania można ustalić indywidualnie, odpowiednio do wieku i sytuacji rodziny.",
  },
  {
    slug: "pelplin",
    name: "Pelplin",
    intro: "Mieszkasz w Pelplinie i rozważasz konsultację psychologiczną w rejonie Starogardu Gdańskiego? Aleksandra Wejer przyjmuje w Starogardzie oraz w Nowej Wsi Rzecznej.",
    travelTip: "Przy dłuższym dojeździe pomocne bywa wybranie godziny bez pośpiechu. W kalendarzu możesz spokojnie porównać dostępność obu gabinetów przed wysłaniem zgłoszenia.",
    decisionTip: "Spotkanie trwa zwykle około 50 minut. Dokładne miejsce i termin widzisz jeszcze przed podaniem danych kontaktowych i potwierdzeniem rezerwacji.",
  },
  {
    slug: "skorcz",
    name: "Skórcz",
    intro: "Osoby ze Skórcza mogą skorzystać z konsultacji Aleksandry Wejer w Starogardzie Gdańskim albo w pobliskiej Nowej Wsi Rzecznej, wybierając dogodniejszy termin online.",
    travelTip: "Jeżeli ważna jest dla Ciebie konkretna pora dnia, sprawdź obie lokalizacje. Dostępność jest prowadzona osobno, ale cały wybór odbywa się w jednym prostym kalendarzu.",
    decisionTip: "Kontakt z psychologiem może dotyczyć trudności emocjonalnych, relacji, sytuacji rodzinnej lub kryzysu. Nie trzeba samodzielnie nazywać problemu przed pierwszą rozmową.",
  },
  {
    slug: "lubichowo",
    name: "Lubichowo",
    intro: "Jeśli szukasz wsparcia psychologicznego w okolicy Lubichowa, na stronie Aleksandry Wejer możesz sprawdzić wizyty w Starogardzie Gdańskim i Nowej Wsi Rzecznej.",
    travelTip: "Po wyborze gabinetu kalendarz pokazuje wyłącznie dostępne godziny dla tego miejsca. Dzięki temu od początku wiadomo, dokąd prowadzi dana rezerwacja.",
    decisionTip: "Możesz umówić pierwszą konsultację albo wcześniej skontaktować się telefonicznie. To dobre rozwiązanie, jeśli chcesz upewnić się, czy Aleksandra pracuje z daną sytuacją.",
  },
  {
    slug: "kaliska",
    name: "Kaliska",
    intro: "Dla mieszkańców Kalisk dostępne są terminy konsultacji Aleksandry Wejer w dwóch gabinetach w rejonie Starogardu Gdańskiego: w Starogardzie i Nowej Wsi Rzecznej.",
    travelTip: "Przed rezerwacją porównaj nie tylko datę, ale też nazwę lokalizacji widoczną przy terminie. Potwierdzenie zachowuje wybrane miejsce, aby później nie było wątpliwości dotyczących dojazdu.",
    decisionTip: "Pierwsze spotkanie jest przestrzenią na spokojne omówienie potrzeb. Dalsze kroki są ustalane wspólnie i nie trzeba podejmować wszystkich decyzji od razu.",
  },
];

export type LocalAreaSlug = (typeof localAreas)[number]["slug"];

export function getLocalArea(slug: string) {
  return localAreas.find((area) => area.slug === slug);
}
