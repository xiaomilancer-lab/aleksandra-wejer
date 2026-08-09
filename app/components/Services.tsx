import {
  Baby,
  GraduationCap,
  User,
  HeartHandshake,
  Users,
  Brain,
} from "lucide-react";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

const services = [
  {
    icon: Baby,
    title: "Dzieci",
    description:
      "Pomagam dzieciom lepiej rozumieć własne emocje, radzić sobie z trudnościami w szkole, budować poczucie bezpieczeństwa oraz rozwijać zdrowe relacje z otoczeniem.",
    list: [
      "Trudności emocjonalne",
      "Lęk i niepewność",
      "Problemy szkolne",
      "Relacje z rówieśnikami",
    ],
  },
  {
    icon: GraduationCap,
    title: "Młodzież",
    description:
      "Wspieram nastolatków w radzeniu sobie ze stresem, presją otoczenia, trudnymi emocjami oraz budowaniu pewności siebie i własnej tożsamości.",
    list: [
      "Stres",
      "Niska samoocena",
      "Relacje",
      "Trudne emocje",
    ],
  },
  {
    icon: User,
    title: "Dorośli",
    description:
      "Pomagam osobom przeżywającym kryzysy życiowe, przewlekły stres, trudności emocjonalne oraz problemy w relacjach i codziennym funkcjonowaniu.",
    list: [
      "Kryzysy życiowe",
      "Stres",
      "Wypalenie",
      "Trudności w relacjach",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Pary",
    description:
      "Wspieram pary w poprawie komunikacji, odbudowie zaufania oraz wspólnym poszukiwaniu rozwiązań podczas trudniejszych etapów związku.",
    list: [
      "Komunikacja",
      "Konflikty",
      "Zaufanie",
      "Bliskość",
    ],
  },
  {
    icon: Users,
    title: "Rodziny",
    description:
      "Pomagam rodzinom lepiej się rozumieć, rozwiązywać konflikty oraz budować atmosferę opartą na wzajemnym szacunku i bezpieczeństwie.",
    list: [
      "Konflikty",
      "Relacje rodzinne",
      "Wychowanie",
      "Wsparcie rodziny",
    ],
  },
  {
    icon: Brain,
    title: "Konsultacje psychologiczne",
    description:
      "Pierwsze spotkanie to spokojna rozmowa, poznanie Twojej sytuacji oraz wspólne ustalenie najlepszej formy dalszego wsparcia.",
    list: [
      "Pierwsza konsultacja",
      "Rozpoznanie potrzeb",
      "Plan wsparcia",
      "Bezpieczna rozmowa",
    ],
  },
];

export default function Services() {
  return (
    <section id="oferta" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-8">
        <PublicPsycholkaGuide action="help_path" message="Zobacz, w czym Aleksandra może Ci pomóc." />

        <div className="text-center mb-16">

          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62]">
            JAK MOGĘ POMÓC?
          </p>

          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[#4B4338]">
            Wsparcie dopasowane do Twoich potrzeb
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            Każda historia jest inna i zasługuje na indywidualne podejście.
            Tworzę bezpieczną przestrzeń do rozmowy, zrozumienia emocji oraz
            wspólnego poszukiwania najlepszych rozwiązań.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service) => {

            const Icon = service.icon;

            return (

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
                border
                border-transparent
                hover:border-[#D8D2C7]
                "
              >

                <div
                  className="
                  mb-7
                  inline-flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#6D7A62]
                  text-white
                  shadow-lg
                  "
                >
                  <Icon size={30} strokeWidth={2.2} />
                </div>

                <h3 className="text-2xl font-bold text-[#4B4338]">
                  {service.title}
                </h3>

                <p className="mt-5 text-gray-600 leading-7">
                  {service.description}
                </p>

                <div className="mt-7 space-y-3">

                  {service.list.map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >

                      <div className="w-2 h-2 rounded-full bg-[#6D7A62]" />

                      <span className="text-sm text-[#4B4338]">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

        <div
          className="
          mt-20
          rounded-[36px]
          bg-[#F8F5F0]
          p-10
          shadow-xl
          text-center
          "
        >

          <h3 className="text-3xl font-bold text-[#4B4338]">
            Nie masz pewności, czy mogę Ci pomóc?
          </h3>

          <p className="mt-6 max-w-2xl mx-auto text-gray-600 leading-8">
            Nie musisz znać odpowiedzi na wszystkie pytania przed pierwszym
            spotkaniem. Jeśli zastanawiasz się, czy konsultacja będzie
            odpowiednia w Twojej sytuacji, zapraszam do kontaktu.
            Wspólnie ustalimy najlepszą drogę dalszego wsparcia.
          </p>

          <a
            href="#kontakt"
            className="
            inline-flex
            items-center
            justify-center
            mt-8
            rounded-2xl
            bg-[#6D7A62]
            px-8
            py-4
            text-lg
            font-semibold
            text-white
            shadow-xl
            transition
            hover:bg-[#56614C]
            "
          >
            Umów konsultację
          </a>

        </div>

      </div>
    </section>
  );
}
