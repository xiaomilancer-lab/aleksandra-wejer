import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, CheckCircle2, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import BookingWizard from "@/app/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Umów konsultację | Aleksandra Wejer",
  description: "Sprawdź wolne terminy konsultacji psychologicznych z Aleksandrą Wejer i umów wizytę online.",
  robots: { index: false, follow: true },
};

const trustPoints = [
  { icon: GraduationCap, text: "Magister psychologii, absolwentka Uniwersytetu Gdańskiego" },
  { icon: HeartHandshake, text: "Wsparcie dzieci, młodzieży, dorosłych, par i rodzin" },
  { icon: ShieldCheck, text: "Spokojna i bezpieczna przestrzeń do rozmowy bez oceniania" },
] as const;

export default function ZielinscyPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#2D4739]">
      <section data-pulse-section="hero" className="px-4 pb-14 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-[#E5E1D8] bg-white shadow-[0_24px_70px_rgba(45,71,57,0.10)] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-80 sm:min-h-[30rem] lg:min-h-[38rem]">
            <Image
              src="/images/about-aleksandra-v2.png"
              alt="Aleksandra Wejer podczas konsultacji"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D7A62]">Aleksandra Wejer</p>
              <p className="mt-1 text-lg font-bold text-[#2D4739]">Psycholog</p>
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6D7A62]">Centrum Medyczno-Estetyczne Zielińscy Premium</p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#23332F] sm:text-5xl lg:text-6xl">Aleksandra Wejer</h1>
            <p className="mt-5 text-lg font-semibold text-[#6D7A62] sm:text-xl">Psycholog</p>
            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">Wsparcie psychologiczne dla dzieci, młodzieży, dorosłych, par oraz rodzin.</p>
            <p className="mt-4 max-w-xl leading-7 text-gray-600">Wolny termin możesz sprawdzić i umówić spokojnie online.</p>
            <a href="#rezerwacja" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#6D7A62]/15 transition hover:-translate-y-0.5 hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 sm:w-fit">
              <CalendarDays size={19} aria-hidden="true" />
              Sprawdź wolne terminy
            </a>
          </div>
        </div>
      </section>

      <section data-pulse-section="about" aria-labelledby="zielinscy-trust-title" className="border-y border-[#E5E1D8] bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#6D7A62]">O mnie</p>
            <h2 id="zielinscy-trust-title" className="mt-3 text-3xl font-bold text-[#2D4739] sm:text-4xl">Profesjonalne wsparcie z uważnością</h2>
            <p className="mt-5 leading-7 text-gray-600 sm:text-lg sm:leading-8">W pracy ważne są dla mnie spokój, indywidualne podejście i stworzenie przestrzeni, w której można bezpiecznie porozmawiać o trudnościach.</p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {trustPoints.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4 rounded-2xl border border-[#E5E1D8] bg-[#FCFDFB] p-5 shadow-[0_10px_30px_rgba(45,71,57,0.05)]">
                <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><Icon size={20} aria-hidden="true" /></span>
                <span className="pt-1 text-sm leading-6 text-[#55624D] sm:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="rezerwacja" data-pulse-section="booking" aria-labelledby="zielinscy-booking-title" className="scroll-mt-5 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#EEF1EB] px-4 py-2 text-sm font-semibold text-[#55624D]"><CheckCircle2 size={17} aria-hidden="true" />Rezerwacja online</span>
            <h2 id="zielinscy-booking-title" className="mt-5 text-3xl font-bold text-[#2D4739] sm:text-4xl lg:text-5xl">Wybierz dogodny termin</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600 sm:text-lg">Centrum Medyczno-Estetyczne Zielińscy Premium · Kasztanowa 1 · Nowa Wieś Rzeczna</p>
          </div>
          <BookingWizard source="zielinscy" fixedLocationId="nowa-wies-rzeczna" />
        </div>
      </section>

      <footer className="border-t border-[#E5E1D8] bg-white px-4 py-8 text-center text-sm text-gray-500">
        <p>Aleksandra Wejer · psycholog · <a href="tel:+48510777469" className="font-medium text-[#55624D] underline-offset-4 hover:underline">+48 510 777 469</a></p>
      </footer>
    </main>
  );
}
