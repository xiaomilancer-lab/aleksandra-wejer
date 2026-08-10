"use client";

import Image from "next/image";
import { Baby, GraduationCap, HeartHandshake, Puzzle, User, Users } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PsycholkaAssets } from "@/public/psycholka";

const categories = [
  {
    id: "dzieci",
    title: "Dzieci",
    icon: Baby,
    image: PsycholkaAssets.children,
    intro: "Dla dzieci ważne jest bezpieczne miejsce, w którym można mówić o emocjach we własnym tempie.",
    problems: ["trudne emocje", "lęk i niepewność", "trudności szkolne", "relacje z rówieśnikami"],
    approach: "Spotkania dopasowuję do wieku i potrzeb dziecka. Współpracuję także z rodzicami, aby wspólnie lepiej rozumieć sytuację i znaleźć spokojne, możliwe do wdrożenia kroki.",
  },
  {
    id: "mlodziez",
    title: "Nastolatki",
    icon: GraduationCap,
    image: PsycholkaAssets.ideas.idea,
    intro: "Dorastanie bywa intensywne — rozmowa może pomóc uporządkować to, co teraz najważniejsze.",
    problems: ["stres i presja", "niska samoocena", "relacje", "trudne emocje"],
    approach: "Daję młodej osobie przestrzeń do rozmowy bez oceniania i pośpiechu. Wspólnie przyglądamy się temu, co pomaga odzyskać poczucie wpływu, bezpieczeństwa i własnego głosu.",
  },
  {
    id: "dorosli",
    title: "Dorośli",
    icon: User,
    image: PsycholkaAssets.lifestyle.coffee,
    intro: "Nie trzeba mieć gotowej odpowiedzi ani dokładnie wiedzieć, od czego zacząć.",
    problems: ["kryzysy życiowe", "przewlekły stres", "wypalenie", "trudności w relacjach"],
    approach: "Rozpoczynamy od spokojnego poznania Twojej sytuacji. Indywidualne spojrzenie pozwala dobrać tempo i kierunek rozmowy do tego, co jest dla Ciebie ważne właśnie teraz.",
  },
  {
    id: "pary",
    title: "Pary",
    icon: HeartHandshake,
    image: PsycholkaAssets.couples,
    intro: "W trudniejszym momencie związku warto znaleźć przestrzeń na rozmowę, w której obie strony są usłyszane.",
    problems: ["komunikacja", "konflikty", "zaufanie", "bliskość"],
    approach: "Pomagam parom przyjrzeć się temu, co dzieje się między nimi, bez szukania winnego. Celem jest lepsze rozumienie siebie nawzajem i szukanie rozwiązań, które są możliwe dla obojga.",
  },
  {
    id: "rodziny",
    title: "Rodziny",
    icon: Users,
    image: PsycholkaAssets.work,
    intro: "Rodzinne trudności rzadko dotyczą tylko jednej osoby — wspólna perspektywa może wiele wyjaśnić.",
    problems: ["konflikty", "relacje rodzinne", "wychowanie", "zmiany w rodzinie"],
    approach: "Podczas spotkań przyglądamy się potrzebom i relacjom całej rodziny. Z uważnością szukamy sposobów na więcej wzajemnego zrozumienia, bezpieczeństwa i współpracy.",
  },
] as const;

type Category = (typeof categories)[number];

function CategoryContent({ category }: { category: Category }) {
  return <article className="grid gap-5 rounded-3xl border border-[#D5DCCF] bg-[#FCFDFB] p-5 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-7 lg:grid-cols-[160px_1fr] lg:items-center">
    <div className="flex justify-center"><Image src={category.image} alt="" width={180} height={180} className="h-32 w-32 object-contain sm:h-36 sm:w-36" /></div>
    <div>
      <div className="flex items-center gap-2"><Puzzle size={18} className="text-[#6D7A62]" aria-hidden="true" /><h3 className="text-2xl font-bold text-[#2D4739]">Wsparcie dla: {category.title.toLocaleLowerCase("pl-PL")}</h3></div>
      <p className="mt-3 leading-7 text-gray-700">{category.intro}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Przykładowe obszary rozmowy">
        {category.problems.map((problem) => <li key={problem} className="rounded-full bg-[#EEF1EB] px-3 py-1.5 text-sm font-medium text-[#55624D]">{problem}</li>)}
      </ul>
      <p className="mt-5 leading-7 text-gray-600">{category.approach}</p>
      <a href="#kalendarz" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#E63946] px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#CC2F3C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5C7CB]">Umów konsultację</a>
    </div>
  </article>;
}

export default function HelpAccordion() {
  const [openId, setOpenId] = useState<Category["id"] | null>(null);
  const contentId = useId();
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const active = categories.find((category) => category.id === openId) ?? null;

  useEffect(() => {
    if (!openId || !window.matchMedia("(max-width: 639px)").matches) return;
    const item = itemRefs.current[openId];
    if (!item) return;

    const timer = window.setTimeout(() => {
      const bounds = item.getBoundingClientRect();
      if (bounds.bottom > window.innerHeight - 24) {
        item.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "nearest",
        });
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [openId]);

  const toggleCategory = (id: Category["id"]) => setOpenId((current) => current === id ? null : id);

  return <div>
    <div className="space-y-3 sm:hidden">
      {categories.map((category) => {
        const Icon = category.icon;
        const isOpen = category.id === openId;
        return <div key={category.id} ref={(element) => { itemRefs.current[category.id] = element; }}>
          <button type="button" aria-expanded={isOpen} aria-controls={`${contentId}-${category.id}`} onClick={() => toggleCategory(category.id)} className={`group flex min-h-28 w-full items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8] ${isOpen ? "border-[#6D7A62] bg-[#EEF1EB] shadow-sm" : "border-[#E5E1D8] bg-white hover:border-[#B7C5B0] hover:shadow-md"}`}>
            <Image src={category.image} alt="" width={72} height={72} className="h-14 w-14 shrink-0 object-contain" />
            <span className="min-w-0"><Icon size={16} className="mb-1 text-[#6D7A62]" aria-hidden="true" /><span className="block font-semibold text-[#2D4739]">{category.title}</span></span>
          </button>
          <div id={`${contentId}-${category.id}`} className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">{isOpen && <CategoryContent category={category} />}</div>
          </div>
        </div>;
      })}
    </div>

    <div className="hidden sm:block">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => {
          const Icon = category.icon;
          const isOpen = category.id === openId;
          return <button key={category.id} type="button" aria-expanded={isOpen} aria-controls={contentId} onClick={() => toggleCategory(category.id)} className={`group flex min-h-28 items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#DDE5D8] ${isOpen ? "border-[#6D7A62] bg-[#EEF1EB] shadow-sm" : "border-[#E5E1D8] bg-white hover:-translate-y-0.5 hover:border-[#B7C5B0] hover:shadow-md"}`}>
            <Image src={category.image} alt="" width={72} height={72} className="h-14 w-14 shrink-0 object-contain" />
            <span className="min-w-0"><Icon size={16} className="mb-1 text-[#6D7A62]" aria-hidden="true" /><span className="block font-semibold text-[#2D4739]">{category.title}</span></span>
          </button>;
        })}
      </div>
      <div id={contentId} className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out motion-reduce:transition-none ${active ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{active && <CategoryContent category={active} />}</div>
      </div>
    </div>
  </div>;
}
