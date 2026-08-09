import type { PsycholkaContext, PsycholkaMood } from "./psycholkaTypes";

export const psycholkaWelcomeMessages = [
  "Dobrze, że jesteś. ❤️",
  "Miło Cię znowu widzieć.",
  "Gotowa?",
  "Zaczynamy spokojnie.",
  "To będzie dobry dzień.",
  "Dzisiaj damy radę.",
  "Witaj ponownie.",
] as const;

export const psycholkaWelcomeHeaders = [
  "Dzień dobry Aleksandro",
  "Miło Cię widzieć.",
  "Dzisiaj pomagasz ludziom.",
] as const;

export const psycholkaSmallComments = [
  "Kawa już gotowa? ☕",
  "Ja już jestem.",
  "Spokojnie.",
  "Krok po kroku.",
  "Dasz radę.",
  "Nie wszystko trzeba zrobić od razu.",
] as const;

export const psycholkaDailyQuotes = [
  "Dzisiaj wystarczy pomóc jednej osobie.",
  "Spokój też jest postępem.",
  "Czasem obecność znaczy więcej niż odpowiedź.",
  "Dobrze, że jesteś.",
  "Krok po kroku.",
  "Uważna obecność jest formą wsparcia.",
  "Nie każda chwila potrzebuje pośpiechu.",
  "Dobra rozmowa ma swoje tempo.",
  "Cisza też może dawać przestrzeń.",
  "Jedno dobre pytanie wystarczy na początek.",
  "Ważne rzeczy mogą zaczynać się spokojnie.",
  "Zaufanie buduje się w małych chwilach.",
  "Każda historia zasługuje na wysłuchanie.",
  "Łagodność pozostaje siłą.",
  "Czasem wystarczy być obok.",
  "Uważność zostawia miejsce na to, co ważne.",
  "Nie wszystko musi wydarzyć się dzisiaj.",
  "Daj rozmowie czas.",
  "Odpoczynek jest częścią pracy.",
  "To, co małe, też ma znaczenie.",
  "Jedna chwila oddechu może wiele zmienić.",
  "Dobre rzeczy nie zawsze są głośne.",
  "Życzliwość mieści się w prostych słowach.",
  "Wystarczy zacząć od tego, co jest teraz.",
  "Każdy dzień może mieć spokojny początek.",
  "Obecność nie potrzebuje pośpiechu.",
  "Rozmowa zaczyna się od uważności.",
  "Mała przerwa też jest troską.",
  "Dzisiaj można zrobić tylko tyle, ile trzeba.",
  "Spokojny krok nadal prowadzi dalej.",
] as const;

export const futurePsycholkaHumorReactions = ["lost_shoe", "coffee", "spider", "looking_for_glasses", "happy_jump"] as const;
// TODO: Add the listed humor reactions only after dedicated assets and interaction rules are approved.

export const futurePsycholkaDeskItems = ["book", "coffee", "plant", "notebook", "lamp"] as const;
// TODO: Add visual desk items only after their final assets and layout rules are approved.

export const psycholkaDeskClickMessages = ["Dobrze, że jesteś.", "Kawa?", "Spokojnie.", "Dasz radę."] as const;

export function resolvePsycholkaMood(context: PsycholkaContext, options: { isFirstVisit?: boolean; hasVisits?: boolean } = {}): PsycholkaMood {
  if (context === "welcome") return "happy";
  if (context === "today") return options.hasVisits === false ? "sad" : "happy";
  if (context === "before_visit" || context === "session") return "focused";
  if (context === "after_visit" || context === "success") return "celebrate";
  if (context === "day_closing") return "sleepy";
  return "calm";
}

export function pickPsycholkaMessage<T extends readonly string[]>(messages: T): T[number] {
  return messages[Math.floor(Math.random() * messages.length)]!;
}

export function pickOptionalPsycholkaComment() {
  return Math.random() < 0.5 ? pickPsycholkaMessage(psycholkaSmallComments) : null;
}

export function getPsycholkaDailyQuote(now: Date = new Date()) {
  const key = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const index = [...key].reduce((sum, character) => sum + character.charCodeAt(0), 0) % psycholkaDailyQuotes.length;
  return psycholkaDailyQuotes[index];
}
