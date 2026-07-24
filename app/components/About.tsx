import Image from "next/image";
import { MapPin } from "lucide-react";

export default function About() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-8">

        {/* Nagłówek */}

        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm tracking-[0.35em] uppercase text-[#6D7A62] font-semibold">
            Poznajmy się
          </span>

          <h2 className="mt-5 text-4xl lg:text-5xl font-bold text-[#4B4338]">
            Każda historia zasługuje
            <br />
            na uważne wysłuchanie.
          </h2>

          <p className="mt-8 text-xl leading-9 text-gray-600">
            Wierzę, że rozmowa oparta na zaufaniu,
            empatii i poczuciu bezpieczeństwa
            może być początkiem pozytywnej zmiany.
          </p>
        </div>

        {/* Treść */}

        <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center">

          {/* Lewa kolumna */}

          <div>

            <span className="text-[#6D7A62] font-semibold uppercase tracking-[0.25em] text-sm">
              O mnie
            </span>

            <h3 className="mt-4 text-3xl lg:text-4xl font-bold text-[#4B4338]">
              Nazywam się Aleksandra Wejer
            </h3>

            <p className="mt-8 text-lg leading-8 text-gray-600">
              Jestem psychologiem, absolwentką pięcioletnich
              studiów magisterskich na Uniwersytecie Gdańskim
              oraz mamą dwóch chłopców.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              W swojej pracy spotykam się z dziećmi, młodzieżą, osobami dorosłymi,
parami i rodzinami. Wierzę, że każda historia jest wyjątkowa i wymaga
indywidualnego podejścia, uważności oraz wzajemnego zaufania.
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tworzę przestrzeń, w której można spokojnie opowiedzieć o swoich
trudnościach, emocjach i doświadczeniach, bez oceniania i pośpiechu.
Wspólnie szukamy sposobów, które pomogą odzyskać równowagę i poczucie
wpływu na własne życie.
            </p>

          </div>

          {/* Prawa kolumna */}

          <div className="relative">

            <div className="absolute -inset-5 bg-[#F3EFE8] rounded-[40px] -rotate-2"></div>

            <div className="relative overflow-hidden rounded-[40px] shadow-xl">

  <Image
    src="/images/gabinet.jpg"
    alt="Gabinet psychologiczny Aleksandry Wejer"
    width={700}
    height={500}
    className="w-full h-auto"
  />



    <div className="absolute bottom-8 right-6 w-72 rounded-2xl bg-white/80 backdrop-blur-md px-5 py-1.5 shadow-lg">

  <div className="mt-6 flex justify-center items-center gap-1 text-[#4B4338] font-semibold">

    <MapPin size={15} />

    <span className="whitespace-nowrap">
      Gabinet psychologiczny
    </span>

  </div>

  <p className="mt-0.5 text-center text-gray-600 text-sm">
    Nowa Wieś Rzeczna
  </p>

    <div className="my-4 h-px bg-gray-200"></div>


  </div>

</div>

          </div>

        </div>

      </div>
    </section>
  );
}