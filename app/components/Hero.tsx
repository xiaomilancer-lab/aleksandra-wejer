import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-20">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEWA STRONA */}

        <div>

          <div className="inline-block px-4 py-2 rounded-full bg-[#EDE8DF] text-[#6D7A62] font-semibold mb-6">
            🌿 Konsultacje od 3 sierpnia
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-[#4B4338] leading-tight">
            Aleksandra Wejer
          </h1>

          <h2 className="text-3xl text-[#6D7A62] mt-5 font-semibold">
            Psycholog
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
    🌿 Umów pierwszą konsultację
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
    📞 510 777 469
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
    💬 WhatsApp
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

          </div>

        </div>

      </div>

    </section>
  );
}
