import Image from "next/image";

const ZIELINSCY_BOOKING_URL = "https://aleksandrawejer.pl/zielinscy?source=zielinscy&utm_source=zielinscy&utm_medium=partner_widget&utm_campaign=rezerwacja";

export default function ZielinscyPartnerCard() {
  return (
    <aside aria-labelledby="zielinscy-partner-card-title" className="mx-auto grid w-full max-w-[640px] overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white shadow-[0_16px_45px_rgba(45,71,57,0.09)] sm:grid-cols-[220px_1fr]">
      <div className="relative min-h-52 sm:min-h-full">
        <Image src="/images/about-aleksandra-v2.png" alt="Aleksandra Wejer siedząca w fotelu" fill sizes="(max-width: 639px) 100vw, 220px" className="object-cover object-center" />
      </div>
      <div className="flex min-w-0 flex-col justify-center bg-[#F8F5F0] p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6D7A62]">Psycholog</p>
        <h2 id="zielinscy-partner-card-title" className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#23332F]">Aleksandra Wejer</h2>
        <p className="mt-4 text-sm leading-6 text-gray-600">Wsparcie dzieci, młodzieży, dorosłych, par i rodzin.</p>
        <p className="mt-3 text-xs leading-5 text-[#6D7A62]">Przyjmuje w Centrum Medyczno-Estetycznym Zielińscy Premium.</p>
        <a href={ZIELINSCY_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6D7A62] px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2">Sprawdź wolne terminy →</a>
      </div>
    </aside>
  );
}
