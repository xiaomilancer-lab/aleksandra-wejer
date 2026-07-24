import Image from "next/image";
import {
  MapPin,
  Phone,
  MessageCircle,
  Check,
  ArrowRight,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F5F0] via-white to-[#F8F5F0]">

  <div className="max-w-7xl mx-auto px-8 py-20">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEWA STRONA */}

        <div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D8D2C7] bg-white/80 backdrop-blur-sm px-5 py-2 text-sm font-medium text-[#6D7A62] shadow-sm mb-8">

  <MapPin size={16} />

  <span className="hidden sm:inline">
    Gabinet psychologiczny • Nowa Wieś Rzeczna k. Starogardu Gdańskiego
  </span>

  <span className="sm:hidden">
  Nowa Wieś Rzeczna • Starogard Gdański
</span>

</div>

<h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-[#4B4338] leading-tight">
  Aleksandra Wejer
</h1>

<h2 className="mt-5 text-2xl lg:text-3xl font-medium leading-relaxed text-[#6D7A62]">
  Psycholog dla dzieci, młodzieży,
  <br />
  dorosłych, par i rodzin.
</h2>

          <p className="mt-8 text-xl leading-9 text-gray-600">

            Wierzę, że każdy człowiek zasługuje
            na spokojną rozmowę, zrozumienie
            oraz możliwość odzyskania wiary
            we własne możliwości.

          </p>

          <p className="mt-6 text-lg leading-8 text-gray-600">

            Wspieram dzieci, młodzież,
            dorosłych, pary oraz rodziny
            w odnajdywaniu spokoju,
            pewności siebie i lepszego
            zrozumienia własnych emocji.

          </p>

          <div className="flex flex-wrap gap-4 mt-10">

  <a
    href="#kontakt"
    className="
    bg-[#6D7A62]
    hover:bg-[#56614C]
    transition
    text-white
    px-8
    py-4
    rounded-2xl
    shadow-xl
    text-lg
    font-semibold
    inline-block
    "
  >
     Umów pierwszą konsultację
  </a>

  <a
    href="tel:510777469"
    className="
    border-2
    border-[#6D7A62]
    text-[#6D7A62]
    px-8
    py-4
    rounded-2xl
    hover:bg-[#6D7A62]
    hover:text-white
    transition
    text-lg
    font-semibold
    "
  >
     510 777 469
  </a>

  <a
    href="https://wa.me/48510777469"
    target="_blank"
    rel="noopener noreferrer"
    className="
    bg-[#25D366]
    hover:bg-[#1FAE57]
    transition
    text-white
    px-8
    py-4
    rounded-2xl
    shadow-xl
    text-lg
    font-semibold
    "
  >
     WhatsApp
  </a>

</div>

          <p className="mt-6 text-sm text-gray-500 leading-6">

            Pierwsza wiadomość nie zobowiązuje
            do rozpoczęcia konsultacji.

            <br />

            Wspólnie ustalimy dogodny termin spotkania.

          </p>

        </div>

        {/* PRAWA STRONA */}

        <div className="relative">

          <div className="absolute -inset-5 bg-[#EDE8DF] rounded-[40px] rotate-3"></div>

          <div className="relative overflow-hidden rounded-[40px] shadow-2xl">

  <Image
    src="/images/aleksandra.jpeg"
    alt="Aleksandra Wejer"
    width={700}
    height={900}
    className="w-full h-auto"
    priority
  />

  <div className="
absolute
bottom-4
left-4
right-4
rounded-3xl
bg-white/75
backdrop-blur-md
border
border-white/60
p-4
shadow-lg

md:bottom-6
md:left-10
md:right-10
md:p-7
">

  <div className="flex items-center gap-2 text-[#4B4338] font-semibold">
    <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
    <span>Nowa Wieś Rzeczna</span>
  </div>

  <p className="mt-1 text-sm text-gray-600 md:mt-2 md:text-base">
    Wizyty po wcześniejszym umówieniu
  </p>

  <div className="hidden md:block my-4 h-px bg-gray-200"></div>

  <p className="hidden md:block text-sm text-gray-600">
    Dzieci • Młodzież • Dorośli
    <br />
    Pary • Rodziny
  </p>

</div>

</div>

        </div>

      </div>

    </div>

</section>
  );
}
