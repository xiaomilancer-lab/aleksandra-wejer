import Link from "next/link";
import { ArrowLeft, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { requireMember } from "@/app/room/server/requireMember";
import { getPublishedFamilyContent, type FamilyContentItem } from "@/lib/family-content-cache";

export const dynamic = "force-dynamic";

const labels: Record<FamilyContentItem["category"], string> = {
  attraction: "Rodzinna atrakcja",
  event: "Wydarzenie",
  restaurant: "Miejsce na wspólne wyjście",
  hotel: "Rodzinny wyjazd",
  cinema: "Kino",
  netflix: "Domowy seans",
  deal: "Promocja dla Aleksandry",
};

export default async function ExplorePage() {
  await requireMember();

  let items: FamilyContentItem[] = [];
  try {
    items = (await getPublishedFamilyContent()).filter((item) => item.category !== "deal");
  } catch {
    // The room remains useful even when the shared cache is temporarily unavailable.
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] p-4 text-[#2D4739] sm:p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-7">
          <Link href="/room" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-bold hover:bg-[#F8F5F0]">
            <ArrowLeft size={18} aria-hidden="true" />Wróć do pokoju
          </Link>
          <div className="mt-5 flex items-start gap-4">
            <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Sparkles size={23} aria-hidden="true" /></span>
            <div>
              <p className="text-sm text-gray-500">Wspólny pakiet rodzinnych inspiracji</p>
              <h1 className="mt-1 text-3xl font-bold">Co warto zrobić?</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">PsychOLKA wybiera propozycje raz, a później spokojnie udostępnia je wszystkim pokojom. Otwarcie tej strony nie uruchamia AI i nie zużywa dodatkowych środków.</p>
            </div>
          </div>
        </header>

        {items.length === 0 ? (
          <section className="rounded-3xl border border-[#E8D6B8] bg-[#FFF9EE] p-6">
            <h2 className="text-xl font-bold">PsychOLKA zbiera nowe inspiracje 🌸</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F5732]">Wróć tutaj za jakiś czas. Pokój i wszystkie pozostałe funkcje działają normalnie.</p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="flex min-h-64 flex-col rounded-3xl border border-[#E5E1D8] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF1EB] px-3 py-2 text-xs font-bold text-[#607058]"><MapPin size={15} aria-hidden="true" />{labels[item.category]}</span>
                  {item.isExpired && <span className="text-xs font-semibold text-[#8A7654]">sprawdź aktualność</span>}
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8A7654]">{item.eyebrow}</p>
                <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
                <div className="mt-auto space-y-3 pt-5">
                  <p className="rounded-2xl bg-[#F8F5F0] px-4 py-3 text-xs leading-5 text-gray-600">{item.note}</p>
                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2.5 text-sm font-bold hover:bg-[#F8F5F0]">
                      {item.sourceLabel || "Sprawdź szczegóły"}<ExternalLink size={16} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
