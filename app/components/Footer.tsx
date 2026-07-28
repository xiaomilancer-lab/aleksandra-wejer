import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E2DB] bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-16 lg:grid-cols-3">

          {/* LEWA KOLUMNA */}

          <div>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6D7A62]/10">

                <span className="text-2xl font-bold text-[#6D7A62]">
                  AW
                </span>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#4B4338]">
                  Aleksandra Wejer
                </h3>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6D7A62]">
                  Psycholog
                </p>

              </div>

            </div>

            <p className="mt-8 max-w-md leading-8 text-gray-600">
              Pomagam dzieciom, młodzieży, dorosłym oraz rodzinom
              odnaleźć spokój, zrozumienie i równowagę.
              Każde spotkanie rozpoczyna się od rozmowy
              i wspólnego poszukiwania najlepszych rozwiązań.
            </p>

          </div>

          {/* KONTAKT */}

          <div>

            <h4 className="text-lg font-semibold text-[#4B4338]">
              Kontakt
            </h4>

            <div className="mt-8 space-y-6">

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-[#6D7A62]/10 p-3 text-[#6D7A62]">
                  <MapPin size={20} />
                </div>

                <div>

                  <p className="font-medium text-[#4B4338]">
                    Gabinet
                  </p>

                  <p className="mt-1 leading-7 text-gray-600">
                    Starogard Gdański • Nowa Wieś Rzeczna
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <div className="rounded-xl bg-[#6D7A62]/10 p-3 text-[#6D7A62]">
                  <Phone size={20} />
                </div>

                <div>

                  <p className="font-medium text-[#4B4338]">
                    Telefon
                  </p>

                  <a
                    href="tel:+48510777469"
                    className="mt-1 inline-block text-gray-600 transition-colors hover:text-[#6D7A62]"
                  >
                    +48 510 777 469
                  </a>

                </div>

              </div>
                            <div className="flex items-start gap-4">

                <div className="rounded-xl bg-[#6D7A62]/10 p-3 text-[#6D7A62]">
                  <Mail size={20} />
                </div>

                <div>

                  <p className="font-medium text-[#4B4338]">
                    E-mail
                  </p>

                  <a
                    href="mailto:psycholog@aleksandrawejer.pl"
                    className="mt-1 inline-block text-gray-600 transition-colors hover:text-[#6D7A62]"
                  >
                    psycholog@aleksandrawejer.pl
                  </a>

                </div>

              </div>

            </div>

          </div>

          {/* NAWIGACJA */}

          <div>

            <h4 className="text-lg font-semibold text-[#4B4338]">
              Nawigacja
            </h4>

            <nav className="mt-8 flex flex-col gap-5">

              <a
                href="#start"
                className="group flex items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62]"
              >
                <span>Start</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                />
              </a>

              <a
                href="#omnie"
                className="group flex items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62]"
              >
                <span>O mnie</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                />
              </a>

              <a
                href="#oferta"
                className="group flex items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62]"
              >
                <span>Oferta</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                />
              </a>

              <a
                href="#faq"
                className="group flex items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62]"
              >
                <span>FAQ</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                />
              </a>

              <a
                href="#kontakt"
                className="group flex items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62]"
              >
                <span>Kontakt</span>
                <ArrowUpRight
                  size={18}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                />
              </a>

            </nav>

          </div>
                  </div>

        <div className="mt-16 border-t border-[#E5E2DB] pt-8">

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">

            <p>
              © 2026 Aleksandra Wejer. Wszelkie prawa zastrzeżone.
            </p>

            <a
              href="https://3d-projekt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 transition-colors hover:text-[#6D7A62]"
            >
              <span>Projekt i wykonanie</span>

              <span className="font-semibold text-[#4B4338] transition-colors group-hover:text-[#6D7A62]">
                3D-Projekt.com
              </span>

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />

            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}