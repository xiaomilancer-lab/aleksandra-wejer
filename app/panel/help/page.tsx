import { BookOpen, Bot, CalendarCheck2, ClipboardList, HeartHandshake, ShieldCheck, UserRoundCog } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";

const steps = [
  {
    icon: ClipboardList,
    title: "1. Uporządkuj zgłoszenie",
    body: "Otwórz „Wizyty”. Oznacz rekord jako prawdziwy albo testowy i ustaw jego status. Testowe zgłoszenia zostają w historii, ale nie mieszają się z prawdziwym gabinetem.",
  },
  {
    icon: UserRoundCog,
    title: "2. Załóż lub przypisz kartę pacjenta",
    body: "Przy prawdziwej wizycie wybierz istniejącą kartę albo użyj „Utwórz kartę z tego zgłoszenia”. Karta łączy wizyty, pamięć terapeutyczną, zadania, materiały i dalsze działania w jednym miejscu.",
  },
  {
    icon: HeartHandshake,
    title: "3. Uzupełnij to, co pomaga w pracy",
    body: "W karcie pacjenta możesz poprawić imię, telefon i e-mail. Preferencje, ważne cechy spotkań i pomocne obserwacje zapisuj w sekcji „Pamięć pacjenta”. Nie jest to pełna dokumentacja medyczna.",
  },
  {
    icon: BookOpen,
    title: "4. Przygotuj spotkanie",
    body: "Wejdź w konkretną wizytę i w „Przygotowaniu do wizyty” kliknij „Dodaj materiał”. Możesz wyszukać ćwiczenie, scenkę albo scenariusz i przypiąć go wyłącznie do tego spotkania.",
  },
  {
    icon: CalendarCheck2,
    title: "5. Po spotkaniu",
    body: "Zmień status na „Zrealizowana”, uzupełnij potrzebne notatki, zadanie lub kartę po spotkaniu. Materiały i historia pozostaną przy właściwej karcie pacjenta.",
  },
  {
    icon: ShieldCheck,
    title: "6. Bezpieczeństwo",
    body: "Nie przypisuj wizyt testowych do prawdziwych kart. Przed odejściem od urządzenia wyloguj się, a w karcie zapisuj tylko informacje potrzebne do prowadzenia pracy.",
  },
  {
    icon: Bot,
    title: "7. Awaryjna rozmowa z AI",
    body: "W zakładce „Porozmawiaj z AI” wybierasz neutralną grupę, temat, cel i rodzaj odpowiedzi. Nie ma tam pola na opis pacjenta. Historia zostaje tylko w używanej przeglądarce i można ją trwale usunąć.",
  },
];

export default function HelpPage() {
  return (
    <AuthGuard>
      <Dashboard>
        <main className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_16px_45px_rgba(45,71,57,0.06)] sm:p-8">
            <p className="text-sm text-[#667085]">Instrukcja PsychOLKI</p>
            <h1 className="mt-1 text-3xl font-bold text-[#2D4739] sm:text-4xl">Jak prowadzić gabinet krok po kroku</h1>
            <p className="mt-3 max-w-3xl text-[#566159]">Ta strona prowadzi przez najważniejszy obieg: od nowego zgłoszenia, przez kartę pacjenta i przygotowanie materiałów, aż do spokojnego zamknięcia spotkania.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <QuickLink href="/panel/visits">Otwórz wizyty</QuickLink>
              <QuickLink href="/panel/patients">Otwórz pacjentów</QuickLink>
              <QuickLink href="/panel/library">Otwórz bibliotekę</QuickLink>
              <QuickLink href="/panel/ai-chat">Porozmawiaj z AI</QuickLink>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {steps.map(({ icon: Icon, title, body }) => (
              <article key={title} className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.05)]">
                <div className="flex items-start gap-4">
                  <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={22} aria-hidden="true" /></span>
                  <div><h2 className="text-lg font-bold text-[#2D4739]">{title}</h2><p className="mt-2 leading-7 text-[#566159]">{body}</p></div>
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-3xl border border-[#E6D6B9] bg-[#FFF9EE] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#2D4739]">Co zrobić z Janem i Krystyną?</h2>
            <p className="mt-2 leading-7 text-[#6F5735]">Stare demonstracyjne karty Jana i Krystyny są teraz ukryte na listach i w wyborze pacjenta. Powiązana historia testowa nie została skasowana, dlatego nic w bazie nie traci spójności.</p>
          </section>
        </main>
      </Dashboard>
    </AuthGuard>
  );
}

function QuickLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#6D7A62] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#58644F]">{children}</Link>;
}
