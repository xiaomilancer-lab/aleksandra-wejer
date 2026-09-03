import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BusFront, Car, Gamepad2, MapPinned, Palette, Puzzle, Waves } from "lucide-react";

export default function PublicUsefulSpaces() {
  return <section aria-labelledby="public-spaces-title" className="bg-[#F8F5F0] px-4 py-14 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6D7A62]">Dostępne bez konta</p>
        <h2 id="public-spaces-title" className="mt-3 text-3xl font-bold text-[#2D4739] sm:text-4xl">Małe rzeczy, które ułatwiają dzień</h2>
        <p className="mt-4 leading-7 text-gray-600">Spokojna zabawa dla dzieci oraz prosty dojazd do obu gabinetów — bez logowania i bez podawania danych.</p>
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        <Link href="/babyroom" className="group relative overflow-hidden rounded-[32px] border border-[#E5E1D8] bg-white p-6 shadow-[0_16px_45px_rgba(45,71,57,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(45,71,57,0.12)] sm:p-8">
          <div className="grid items-center gap-5 min-[470px]:grid-cols-[1fr_150px] sm:grid-cols-[1fr_190px]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF0F3] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#A14F60]"><Gamepad2 size={16} aria-hidden="true" />Kącik dziecięcy</span>
              <h3 className="mt-4 text-2xl font-bold text-[#2D4739] sm:text-3xl">Babyroom PsychOLKI</h3>
              <p className="mt-3 leading-7 text-gray-600">Szumy, kolorowanki, rysowanie, memory, puzzle i spokojny balonik — wszystko bez reklam.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[#55624D]"><Feature icon={Waves}>Szumisie</Feature><Feature icon={Palette}>Kolorowanki</Feature><Feature icon={Puzzle}>Gry</Feature></div>
              <span className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#2D4739] px-5 py-3 font-bold text-white">Otwórz kącik <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden="true" /></span>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[190px] rounded-full bg-gradient-to-br from-[#FFF4E8] to-[#F5E8EC] shadow-inner">
              <Image src="/psycholka/children/10_children_mis.png" alt="PsychOLKA z misiem zaprasza do kącika dziecięcego" fill sizes="190px" className="object-contain p-2 drop-shadow-[0_14px_12px_rgba(45,71,57,0.16)] transition duration-500 group-hover:scale-105" />
            </div>
          </div>
        </Link>

        <Link href="/dojazd" className="group overflow-hidden rounded-[32px] border border-[#DCE4D8] bg-gradient-to-br from-[#EFF5EC] to-white p-6 shadow-[0_16px_45px_rgba(45,71,57,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(45,71,57,0.12)] sm:p-8">
          <div className="flex h-full flex-col">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-[#6D7A62] shadow-sm"><MapPinned size={31} aria-hidden="true" /></span>
            <h3 className="mt-5 text-2xl font-bold text-[#2D4739] sm:text-3xl">Dojazd do gabinetów</h3>
            <p className="mt-3 leading-7 text-gray-600">Wybierz Centrum Zielińscy Premium albo Arthro Cure Clinic i otwórz gotową trasę samochodem, komunikacją lub w Bolt.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[#55624D]"><Feature icon={Car}>Samochód</Feature><Feature icon={BusFront}>Komunikacja</Feature><Feature icon={MapPinned}>Oba gabinety</Feature></div>
            <span className="mt-auto pt-6"><span className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#6D7A62] bg-white px-5 py-3 font-bold text-[#2D4739]">Zaplanuj trasę <ArrowRight size={18} className="transition group-hover:translate-x-1" aria-hidden="true" /></span></span>
          </div>
        </Link>
      </div>
    </div>
  </section>;
}

function Feature({ icon: Icon, children }: { icon: typeof Waves; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5F0] px-3 py-2"><Icon size={15} aria-hidden="true" />{children}</span>;
}
