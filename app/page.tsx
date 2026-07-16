export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <header className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

    <div className="flex items-center gap-4">

      <img
        src="/images/logo.png"
        className="w-14 h-14"
      />

      <div>

        <h1 className="font-bold text-xl text-[#4B4338]">
          Aleksandra Wejer
        </h1>

        <p className="text-gray-500 text-sm">
          Psycholog
        </p>

      </div>

    </div>

    <div className="flex gap-4">

      <a
        href="tel:510777469"
        className="bg-[#6D7A62] text-white px-6 py-3 rounded-xl hover:bg-[#55614C] transition"
      >
        📞 Zadzwoń
      </a>

    </div>

  </div>
</header>

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h1 className="text-6xl font-bold text-[#4B4338] leading-tight">
              Aleksandra Wejer
            </h1>

            <h2 className="text-3xl mt-4 text-[#6D7A62] font-semibold">
              Psycholog
            </h2>

            <p className="mt-8 text-xl text-gray-600 leading-9">

              Pomagam dzieciom, młodzieży, dorosłym,
              parom oraz rodzinom odnaleźć spokój,
              lepiej zrozumieć siebie
              i odzyskać równowagę.

            </p>

            <button
              className="
              mt-10
              bg-[#6D7A62]
              hover:bg-[#55614C]
              text-white
              text-xl
              px-10
              py-5
              rounded-2xl
              shadow-xl
              transition
              duration-300
              "
            >

              📅 Umów konsultację

            </button>

          </div>

          <div>

            <img
              src="/images/aleksandra.jpeg"
              className="rounded-3xl shadow-2xl"
            />

          </div>

        </div>

      </section>

    <section className="bg-white py-20">

  <div className="max-w-7xl mx-auto px-8">

    <h2 className="text-4xl font-bold text-center text-[#4B4338] mb-14">
      W czym mogę pomóc?
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

      {[
        ["🧒", "Dzieci"],
        ["🧑", "Młodzież"],
        ["👩", "Dorośli"],
        ["❤️", "Terapia par"],
        ["👨‍👩‍👧", "Terapia rodzinna"],
        ["🧠", "Konsultacje psychologiczne"],
      ].map(([emoji, title]) => (

        <div
          key={title}
          className="bg-[#F8F5F0] rounded-3xl p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
        >

          <div className="text-5xl mb-5">
            {emoji}
          </div>

          <h3 className="text-2xl font-bold text-[#4B4338]">
            {title}
          </h3>

        </div>

      ))}

    </div>

  </div>

</section>
    </main>
  );
}
