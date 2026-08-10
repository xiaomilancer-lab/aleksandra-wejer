import Image from "next/image";

const ZIELINSCY_BOOKING_URL = "https://aleksandrawejer.pl/zielinscy?source=zielinscy";

export default function ZielinscyPartnerCard() {
  return (
    <aside aria-labelledby="zielinscy-partner-card-title" className="mx-auto w-full max-w-xl rounded-3xl border border-[#E5E1D8] bg-[#F8F5F0] p-5 shadow-[0_16px_45px_rgba(45,71,57,0.09)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Image src="/images/about-aleksandra-v2.png" alt="Aleksandra Wejer" width={160} height={160} className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6D7A62]">Centrum Medyczno-Estetyczne Zielińscy Premium</p>
          <h2 id="zielinscy-partner-card-title" className="mt-1 text-2xl font-bold text-[#2D4739]">Aleksandra Wejer</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">Konsultacje dla dzieci, młodzieży, dorosłych, par i rodzin.</p>
        </div>
      </div>
      <a href={ZIELINSCY_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#6D7A62] px-5 py-3 font-semibold text-white transition hover:bg-[#58644F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2">Umów wizytę online</a>
    </aside>
  );
}
