const services = [
  {
    emoji: "🧒",
    title: "Dzieci",
    description:
      "Pomoc w trudnościach emocjonalnych, budowaniu poczucia bezpieczeństwa oraz wspieraniu prawidłowego rozwoju dziecka.",
  },
  {
    emoji: "🧑",
    title: "Młodzież",
    description:
      "Wsparcie nastolatków w radzeniu sobie ze stresem, emocjami, relacjami oraz budowaniu pewności siebie.",
  },
  {
    emoji: "👩",
    title: "Dorośli",
    description:
      "Pomoc w kryzysach życiowych, trudnościach emocjonalnych, stresie oraz odzyskiwaniu wewnętrznej równowagi.",
  },
  {
    emoji: "❤️",
    title: "Pary",
    description:
      "Wsparcie w poprawie komunikacji, odbudowie zaufania oraz wspólnym poszukiwaniu rozwiązań.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Rodziny",
    description:
      "Pomoc w budowaniu lepszych relacji rodzinnych, rozwiązywaniu konfliktów i wzajemnym zrozumieniu.",
  },
  {
    emoji: "🧠",
    title: "Konsultacje psychologiczne",
    description:
      "Pierwsze spotkanie pozwalające spokojnie omówić sytuację i wspólnie zastanowić się nad dalszym wsparciem.",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62]">
            OBSZARY WSPARCIA
          </p>

          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#4B4338]">
            W czym mogę pomóc?
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            Każda historia jest inna.
            W swojej pracy staram się stworzyć spokojną,
            bezpieczną przestrzeń do rozmowy,
            zrozumienia oraz wspólnego poszukiwania najlepszych rozwiązań.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service) => (

            <div
              key={service.title}
              className="
              bg-[#F8F5F0]
              rounded-3xl
              p-8
              shadow-lg
              hover:-translate-y-2
              hover:shadow-2xl
              transition-all
              duration-300
              "
            >

              <div className="text-5xl mb-6">
                {service.emoji}
              </div>

              <h3 className="text-2xl font-bold text-[#4B4338]">
                {service.title}
              </h3>

              <p className="mt-5 text-gray-600 leading-7">
                {service.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}