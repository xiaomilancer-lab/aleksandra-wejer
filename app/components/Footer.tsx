import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const navigationItems: ReadonlyArray<{ label: string; href: string; visibility?: string }> = [
  { label: "Start", href: "#start" },
  { label: "O mnie", href: "#omnie", visibility: "hidden md:flex" },
  { label: "O mnie", href: "#mobile-aleksandra", visibility: "flex md:hidden" },
  { label: "Oferta", href: "#oferta", visibility: "hidden md:flex" },
  { label: "Oferta", href: "#mobile-pomoc", visibility: "flex md:hidden" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt", visibility: "hidden md:flex" },
  { label: "Kontakt", href: "#kontakt-mobile", visibility: "flex md:hidden" },
];

export default function Footer() {
  return (
    <footer id="kontakt-mobile" className="scroll-mt-24 border-t border-[#E5E2DB] bg-[#F8F5F0]">
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
              Wierzę, że dobra pomoc zaczyna się od uważnej rozmowy,
              bez pośpiechu i gotowych ocen. Wspólnie szukamy rozwiązań,
              które są możliwe i ważne w codziennym życiu.
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

              {navigationItems.map((item) => <a key={`${item.label}-${item.href}`} href={item.href} className={`group items-center justify-between text-gray-600 transition-colors hover:text-[#6D7A62] ${item.visibility ?? "flex"}`}>
                <span>{item.label}</span>
                <ArrowUpRight size={18} className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </a>)}

            </nav>

          </div>
                  </div>

        <div className="mt-16 border-t border-[#E5E2DB] pt-8">

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">

            <p>
              © 2026 Aleksandra Wejer. Wszelkie prawa zastrzeżone.
            </p>

            <p className="text-xs text-gray-400">Z miłością zrobił Mężuś ❤️</p>

          </div>

        </div>

      </div>

    </footer>
  );
}
