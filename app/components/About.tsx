import Image from "next/image";
import { Phone } from "lucide-react";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

export default function About() {
  return (
    <section id="omnie" data-scroll-anchor="omnie" className="scroll-mt-24 bg-white py-28">
      <div className="max-w-7xl mx-auto px-8">
        <PublicPsycholkaGuide action="meet_aleksandra" message="Chcesz poznać Aleksandrę? ❤️" />

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
            Wierzę, że każda historia zasługuje na uwagę, zrozumienie
            i bezpieczną przestrzeń do rozmowy.
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

            <div className="mt-8 space-y-5 text-lg leading-8 text-gray-600">
              <p>
                Jestem magistrem psychologii, absolwentką Wydziału Nauk Społecznych
                Uniwersytetu Gdańskiego. Ukończyłam specjalność z zakresu psychologii
                rodziny i od ponad 6 lat pracuję z dziećmi i młodzieżą, zdobywając
                doświadczenie m.in. w szkołach i przedszkolach. Wspieram również osoby
                dorosłe oraz rodziców mierzących się z wyzwaniami codziennego życia.
              </p>

              <p>
                Doświadczenie zawodowe rozwijałam także podczas praktyk w Centrum
                Leczenia Uzależnień oraz w prywatnym gabinecie psychologicznym.
              </p>

              <p>
                Prywatnie jestem mamą dwójki małych dzieci. Macierzyństwo każdego dnia
                przypomina mi, jak ważne w relacjach są bliskość, cierpliwość,
                zrozumienie i poczucie bezpieczeństwa.
              </p>

              <p>
                W pracy stawiam na empatię, autentyczność i indywidualne podejście.
                Chcę tworzyć przestrzeń, w której można spokojnie opowiedzieć o swoich
                trudnościach — bez oceniania i w swoim tempie.
              </p>

              <p>
                Psychologia jest dla mnie nie tylko zawodem, ale również pasją, dlatego
                stale poszerzam wiedzę i rozwijam swoje kompetencje.
              </p>

              <p>
                Jeśli czujesz, że potrzebujesz rozmowy, wsparcia lub chcesz lepiej
                zrozumieć siebie — zapraszam.
              </p>

              <p className="font-medium text-[#55624D]">
                Bo kiedy Ty czujesz się dobrze, łatwiej zadbać o wszystko, co dla Ciebie ważne.
              </p>
            </div>

          </div>

          {/* Prawa kolumna */}

          <div className="relative">

            <div className="hidden md:block absolute -inset-5 bg-[#F3EFE8] rounded-[40px] -rotate-2"></div>

            <div className="relative overflow-hidden rounded-[40px] shadow-2xl">

  <Image
  src="/images/about-aleksandra-v2.png"
  alt="Aleksandra Wejer podczas konsultacji"
  width={800}
  height={1000}
  className="w-full h-auto"
 />




</div>

<div className="hidden md:block">
              <div
                className="
                  absolute
                  bottom-5 right-2 md:bottom-3 md:right-4
                  w-60 md:w-72
                  rounded-3xl
                  bg-white/60
                  backdrop-blur-2xl
                  p-4 md:p-5
                  shadow-2xl
                "
              >
                <div className="flex items-center gap-3">
                  <Phone className="text-[#6D7A62]" size={20} />

                  <h4 className="text-base md:text-lg font-bold text-[#4B4338]">
                    Umów wizytę telefonicznie
                  </h4>
                </div>

                <div className="my-3 h-px bg-gray-200" />

                <div>
                  <p className="text-xs md:text-sm font-semibold text-[#4B4338]">
                    Arthro Cure Clinic
                  </p>

                  <p className="text-xs md:text-sm text-gray-600">
                    Starogard Gdański
                  </p>

                  <a
                    href="tel:+48508439666"
                    className="mt-1 block text-base font-bold text-[#6D7A62] hover:text-[#4B4338] transition-colors"
                  >
                    ☎ +48 508 439 666
                  </a>
                </div>

                <div className="my-4 h-px bg-gray-200" />

                <div>
                  <p className="text-xs md:text-sm font-semibold text-[#4B4338]">
                    Centrum Medyczno-Estetyczne
                    <br />
                    Zielińscy Premium
                  </p>

                  <p className="text-xs md:text-sm text-gray-600">
                    Nowa Wieś Rzeczna
                  </p>

                  <a
                    href="tel:+48510777469"
                    className="mt-1 block text-base font-bold text-[#6D7A62] hover:text-[#4B4338] transition-colors"
                  >
                    ☎ +48 510 777 469
                  </a>
                </div>

                <div className="my-5 h-px bg-gray-200" />

                <p className="hidden md:block text-xs leading-5 text-gray-500">
                  Możesz również skorzystać z formularza rezerwacji dostępnego
                  na tej stronie.
                </p>
              </div>
            </div>

            {/* Karta kontaktowa - Mobile */}

            <div className="block md:hidden mt-6">
              <div className="rounded-3xl border border-[#EFE8DD] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Phone className="text-[#6D7A62]" size={22} />

                  <h4 className="text-xl font-bold text-[#4B4338]">
                    Umów wizytę telefonicznie
                  </h4>
                </div>

                <div className="my-5 h-px bg-gray-200" />

                <div>
                  <p className="font-semibold text-[#4B4338]">
                    Arthro Cure Clinic
                  </p>

                  <p className="text-sm text-gray-600">
                    Starogard Gdański
                  </p>

                  <a
                    href="tel:+48508439666"
                    className="mt-2 block text-lg font-bold text-[#6D7A62] hover:text-[#4B4338] transition-colors"
                  >
                    ☎ +48 508 439 666
                  </a>
                </div>

                <div className="my-5 h-px bg-gray-200" />

                <div>
                  <p className="font-semibold text-[#4B4338]">
                    Centrum Medyczno-Estetyczne
                    <br />
                    Zielińscy Premium
                  </p>

                  <p className="text-sm text-gray-600">
                    Nowa Wieś Rzeczna
                  </p>

                  <a
                    href="tel:+48510777469"
                    className="mt-2 block text-lg font-bold text-[#6D7A62] hover:text-[#4B4338] transition-colors"
                  >
                    ☎ +48 510 777 469
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
