"use client";

import { useState } from "react";
import { Plus, MessageCircleQuestion } from "lucide-react";
import PublicPsycholkaGuide from "./PublicPsycholkaGuide";

const faqItems = [
  {
    question: "Czy pierwsza konsultacja zobowiązuje do kolejnych spotkań?",
    answer:
      "Nie. Pierwsza konsultacja służy poznaniu Twojej sytuacji, omówieniu trudności oraz wspólnemu określeniu możliwych kierunków dalszej pracy. Decyzję o kontynuowaniu spotkań zawsze podejmujesz samodzielnie.",
  },
  {
    question: "Jak długo trwa konsultacja?",
    answer:
      "Standardowa konsultacja trwa około 50 minut. W wyjątkowych sytuacjach czas spotkania może zostać wcześniej ustalony indywidualnie.",
  },
  {
    question: "Czy konsultacje są poufne?",
    answer:
      "Tak. Wszystkie spotkania objęte są tajemnicą zawodową psychologa oraz zasadami etyki. Dzięki temu możesz czuć się bezpiecznie i swobodnie podczas rozmowy.",
  },
  {
    question: "Czy mogę zgłosić się z dzieckiem?",
    answer:
      "Tak. Wspieram dzieci, młodzież oraz ich rodziców. Przebieg pierwszego spotkania zależy od wieku dziecka oraz charakteru zgłaszanego problemu.",
  },
  {
    question: "Jak umówić wizytę?",
    answer:
      "Możesz skorzystać z formularza kontaktowego, zadzwonić lub napisać wiadomość. Wspólnie ustalimy dogodny termin spotkania.",
  },
  {
    question: "Nie wiem, czy psycholog będzie odpowiednią osobą...",
    answer:
      "To bardzo częsta wątpliwość. Nie musisz wiedzieć wszystkiego przed pierwszym spotkaniem. Wspólnie zastanowimy się, jaka forma wsparcia będzie dla Ciebie najbardziej odpowiednia.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      data-scroll-anchor="faq"
      className="scroll-mt-24 bg-[#F8F5F0] py-24"
    >
      <div className="mx-auto max-w-4xl px-6">

        <PublicPsycholkaGuide message="Tu znajdziesz odpowiedzi na najczęstsze pytania." />

        <div className="mb-16 text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#D7E0D2] bg-white px-5 py-2 text-sm font-semibold text-[#6D7A62] shadow-sm">

            <MessageCircleQuestion size={18} />

            <span>Najczęściej zadawane pytania</span>

          </div>

          <h2 className="mt-8 text-4xl font-bold text-[#4B4338] lg:text-5xl">
            Masz pytania?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Przed pierwszą wizytą wiele osób zastanawia się,
            jak wygląda konsultacja.
            Poniżej znajdziesz odpowiedzi na pytania,
            które pojawiają się najczęściej.
          </p>

        </div>
                <div className="space-y-5">

          {faqItems.map((item, index) => {

            const isOpen = openIndex === index;

            return (

              <div
                key={item.question}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  transition-all
                  duration-300
                  ${
                    isOpen
                      ? "border-[#6D7A62]/30 bg-[#FCFBF8] shadow-xl"
                      : "border-[#E8E2D8] bg-white shadow-md hover:-translate-y-1 hover:shadow-lg"
                  }
                `}
              >

                <div
                  className={`
                    absolute
                    left-4
                    top-4
                    bottom-4
                    w-1
                    rounded-full
                    bg-[#6D7A62]
                    transition-all
                    duration-300
                    ${
                      isOpen
                        ? "opacity-100"
                        : "opacity-0"
                    }
                  `}
                />

                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-6 px-8 py-7 text-left"
                >

                  <span className="pr-4 text-lg font-semibold leading-7 text-[#4B4338]">
                    {item.question}
                  </span>

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#6D7A62]/10
                      text-[#6D7A62]
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "rotate-45 bg-[#6D7A62] text-white shadow-lg"
                          : "group-hover:bg-[#6D7A62]/20"
                      }
                    `}
                  >

                    <Plus size={24} strokeWidth={2} />

                  </div>

                </button>

                <div
                  className={`
                    grid
                    transition-all
                    duration-500
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >

                  <div className="overflow-hidden">

                    <div className="px-8 pb-8">

                      <div className="mb-6 ml-1 h-px bg-[#E8E2D8]" />

                      <p className="leading-8 text-gray-600">
                        {item.answer}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            );

          })}

        </div>
                <div className="mt-16">

          <div className="overflow-hidden rounded-[40px] border border-[#DDE6D8] bg-gradient-to-br from-[#FDFCF9] to-[#F6F8F4] p-12 shadow-xl">

            <div className="mx-auto max-w-2xl text-center">

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#6D7A62]/10 text-[#6D7A62]">

                <MessageCircleQuestion size={30} />

              </div>

              <h3 className="text-3xl font-bold text-[#4B4338]">
                Nadal masz pytania?
              </h3>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Każda sytuacja jest inna. Jeśli nie znalazłeś odpowiedzi,
                skontaktuj się ze mną. Chętnie odpowiem na Twoje pytania
                i wspólnie ustalimy najlepszą formę wsparcia.
              </p>

              <a
                href="#kontakt"
                className="
                  mt-8
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-[#6D7A62]
                  px-8
                  py-4
                  text-base
                  font-semibold
                  text-white
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-[#5E6955]
                  hover:shadow-2xl
                "
              >
                Umów konsultację
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
