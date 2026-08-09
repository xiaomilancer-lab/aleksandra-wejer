"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section id="start" className="relative overflow-hidden bg-gradient-to-b from-[#F8F5F0] via-white to-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-8 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D8D2C7] bg-white/80 px-5 py-2 text-sm font-medium text-[#6D7A62] shadow-sm backdrop-blur-sm">
              <MapPin size={16} />
              <span className="hidden sm:inline">Gabinety psychologiczne · Starogard Gdański · Nowa Wieś Rzeczna</span>
              <span className="sm:hidden">Starogard Gdański · Nowa Wieś Rzeczna</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#4B4338] lg:text-6xl">Aleksandra Wejer</h1>
            <h2 className="mt-5 text-2xl font-medium leading-relaxed text-[#6D7A62] lg:text-3xl">Psycholog dla dzieci, młodzieży,<br />dorosłych, par i rodzin.</h2>
            <p className="mt-8 text-xl leading-9 text-gray-600">Wierzę, że każdy człowiek zasługuje na spokojną rozmowę, zrozumienie oraz możliwość odzyskania wiary we własne możliwości.</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">Wspieram dzieci, młodzież, dorosłych, pary oraz rodziny w odnajdywaniu spokoju, pewności siebie i lepszego zrozumienia własnych emocji.</p>
            <p className="mt-10 text-sm leading-6 text-gray-500">Pierwsza wiadomość nie zobowiązuje do wizyty.<br />Wspólnie ustalimy dogodny termin spotkania.</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-5 rotate-3 rounded-[40px] bg-[#EDE8DF]" />
            <div className="relative overflow-hidden rounded-[40px] shadow-2xl">
              <Image src="/images/aleksandra.jpeg" alt="Aleksandra Wejer" width={700} height={900} className="h-auto w-full" priority />
              <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/60 bg-white/75 p-4 shadow-lg backdrop-blur-md md:bottom-6 md:left-10 md:right-10 md:p-7">
                <div className="flex items-center gap-2 font-semibold text-[#4B4338]"><MapPin size={16} className="md:h-[18px] md:w-[18px]" /><span>Gabinety psychologiczne<br />Starogard Gdański · Nowa Wieś Rzeczna</span></div>
                <p className="mt-1 text-sm text-gray-600 md:mt-2 md:text-base">Wizyty po wcześniejszym umówieniu</p>
                <div className="my-4 hidden h-px bg-gray-200 md:block" />
                <p className="hidden text-sm text-gray-600 md:block">Dzieci · Młodzież · Dorośli<br />Pary · Rodziny</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
