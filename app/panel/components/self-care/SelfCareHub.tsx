"use client";

import { CalendarHeart, Clapperboard, Gift, Heart, MapPin, Sparkles, Tags } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { SelfCareCategory, SelfCareInspiration, selfCareInspirations } from "../../domain/selfCare";

const storageKey = "psycholka-self-care-favorites";
const favoritesChangedEvent = "psycholka-self-care-favorites-changed";
const filters: { id: SelfCareCategory; label: string }[] = [
  { id: "all", label: "Wszystko" },
  { id: "netflix", label: "Netflix" },
  { id: "cinema", label: "Kino" },
  { id: "places", label: "Miejsca" },
  { id: "events", label: "Wydarzenia" },
  { id: "gifts", label: "Prezenty" },
  { id: "deals", label: "Promocje" },
];

const icons = { netflix: Clapperboard, cinema: Clapperboard, places: MapPin, events: CalendarHeart, gifts: Gift, deals: Tags };

export default function SelfCareHub() {
  const [category, setCategory] = useState<SelfCareCategory>("all");
  const storedFavorites = useSyncExternalStore(subscribeToFavorites, readFavorites, () => "[]");
  const favorites = useMemo(() => parseFavorites(storedFavorites), [storedFavorites]);

  const visible = useMemo(() => category === "all" ? selfCareInspirations : selfCareInspirations.filter((item) => item.category === category), [category]);
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(favoritesChangedEvent));
  };

  return <div className="space-y-6">
    <section className="overflow-hidden rounded-[28px] border border-[#DDE4D8] bg-[#2D4739] p-6 text-white shadow-[0_18px_50px_rgba(45,71,57,0.14)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"><Sparkles size={15} />PsychOLKA dla Aleksandry</div><h1 className="text-3xl font-bold sm:text-4xl">Chwila dla siebie 🌸</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Filmy, seriale, miejsca, wydarzenia, prezenty i dobre okazje — krótko, spokojnie i bez szukania po całym internecie.</p></div><div className="rounded-2xl bg-white/10 px-5 py-4 text-sm text-white/85"><p className="font-semibold text-white">Tryb spokojny działa</p><p className="mt-1">Brak AI nie wyłącza tej zakładki.</p></div></div>
    </section>

    <section className="rounded-[24px] border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap gap-2" role="group" aria-label="Kategorie inspiracji">{filters.map((filter) => <button key={filter.id} type="button" onClick={() => setCategory(filter.id)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition ${category === filter.id ? "bg-[#6D7A62] text-white" : "bg-[#F8F5F0] text-[#2D4739] hover:bg-[#EEF1EB]"}`}>{filter.label}</button>)}</div></section>

    <section><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm text-gray-500">Pierwsza spokojna kolekcja</p><h2 className="text-2xl font-bold text-[#2D4739]">Co może sprawić przyjemność?</h2></div>{favorites.length > 0 && <p className="text-sm font-semibold text-[#B05D6D]">Ulubione: {favorites.length}</p>}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <InspirationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />)}</div></section>

    <section className="rounded-[24px] border border-[#E8D39D] bg-[#FFF9E9] p-5 sm:p-6"><div className="flex gap-4"><span className="mt-0.5 rounded-2xl bg-white p-3 text-[#B7791F]"><Sparkles size={20} /></span><div><h2 className="font-bold text-[#2D4739]">Co dołoży mózg PsychOLKI?</h2><p className="mt-2 text-sm leading-6 text-gray-600">Świeże premiery Netflixa, koreańskie komedie romantyczne, repertuar kin, wydarzenia, restauracje i promocje z prawdziwą datą ważności. Jeśli źródło lub AI będzie chwilowo niedostępne, ta kolekcja nadal zostanie widoczna.</p></div></div></section>
  </div>;
}

function subscribeToFavorites(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(favoritesChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(favoritesChangedEvent, onStoreChange);
  };
}

function readFavorites() {
  return localStorage.getItem(storageKey) ?? "[]";
}

function parseFavorites(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

function InspirationCard({ item, favorite, onFavorite }: { item: SelfCareInspiration; favorite: boolean; onFavorite: () => void }) {
  const Icon = icons[item.category];
  return <article className="flex min-h-72 flex-col rounded-[24px] border border-[#E5E1D8] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={21} /></span><button type="button" onClick={onFavorite} aria-label={favorite ? `Usuń ${item.title} z ulubionych` : `Dodaj ${item.title} do ulubionych`} className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${favorite ? "bg-[#FCE8EC] text-[#B05D6D]" : "bg-[#F8F5F0] text-[#6D7A62] hover:bg-[#FCE8EC] hover:text-[#B05D6D]"}`}><Heart size={20} fill={favorite ? "currentColor" : "none"} /></button></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8A7654]">{item.eyebrow}</p><h3 className="mt-2 text-xl font-bold text-[#2D4739]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p><div className="mt-auto pt-5"><p className="rounded-2xl bg-[#F8F5F0] px-4 py-3 text-xs leading-5 text-gray-500">{item.note}</p></div></article>;
}
