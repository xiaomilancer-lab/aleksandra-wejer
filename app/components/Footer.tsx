export default function Footer() {
  return (
    <footer className="border-t border-[#E5E2DB] bg-[#F8F5F0]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-14 lg:grid-cols-3">

          {/* LEWA KOLUMNA */}

          <div>

            <div className="inline-flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6D7A62]/10">

                <span className="text-xl">🌿</span>

              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#4B4338]">
                  Aleksandra Wejer
                </h3>

                <p className="text-sm font-medium tracking-wide text-[#6D7A62] uppercase">
                  Psycholog
                </p>

              </div>

            </div>

            <p className="mt-8 max-w-md leading-8 text-gray-600">
              Pomagam dzieciom, młodzieży, dorosłym oraz rodzinom
              odnaleźć spokój, zrozumienie i równowagę.
              Każde spotkanie rozpoczyna się od rozmowy.
            </p>

          </div>

          {/* ŚRODKOWA I PRAWA KOLUMNA W ETAPIE 2 */}

        </div>

      </div>
    </footer>
  );
}