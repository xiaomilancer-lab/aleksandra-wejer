"use client";

import { Baby, CalendarHeart, Clapperboard, ExternalLink, Gift, Heart, MapPin, RefreshCw, Sparkles, Tags } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SelfCareCategory, SelfCareInspiration, selfCareInspirations } from "../../domain/selfCare";

const storageKey = "psycholka-self-care-favorites";
const favoritesChangedEvent = "psycholka-self-care-favorites-changed";
const filters: { id: SelfCareCategory; label: string }[] = [
  { id: "all", label: "Wszystko" },
  { id: "netflix", label: "Netflix" },
  { id: "cinema", label: "Kino" },
  { id: "family", label: "Z dziećmi" },
  { id: "places", label: "Miejsca" },
  { id: "events", label: "Wydarzenia" },
  { id: "gifts", label: "Prezenty" },
  { id: "deals", label: "Promocje" },
];

const icons = { netflix: Clapperboard, cinema: Clapperboard, family: Baby, places: MapPin, events: CalendarHeart, gifts: Gift, deals: Tags };

type CachedItem = {
  id: string;
  category: "attraction" | "event" | "restaurant" | "hotel" | "cinema" | "netflix" | "deal";
  title: string;
  eyebrow: string;
  description: string;
  note: string;
  sourceLabel: string | null;
  sourceUrl: string | null;
};

function toInspiration(item: CachedItem): SelfCareInspiration {
  const categories: Record<CachedItem["category"], SelfCareInspiration["category"]> = {
    attraction: "family",
    event: "events",
    restaurant: "places",
    hotel: "places",
    cinema: "cinema",
    netflix: "netflix",
    deal: "deals",
  };
  return { ...item, id: `live-${item.id}`, category: categories[item.category], live: true };
}

export default function SelfCareHub() {
  const [category, setCategory] = useState<SelfCareCategory>("all");
  const [liveItems, setLiveItems] = useState<SelfCareInspiration[]>([]);
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const storedFavorites = useSyncExternalStore(subscribeToFavorites, readFavorites, () => "[]");
  const favorites = useMemo(() => parseFavorites(storedFavorites), [storedFavorites]);

  const inspirations = useMemo(() => [...liveItems, ...selfCareInspirations], [liveItems]);
  const visible = useMemo(() => category === "all" ? inspirations : inspirations.filter((item) => item.category === category), [category, inspirations]);

  useEffect(() => {
    let active = true;
    void fetch("/api/panel/self-care", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((payload: { items?: CachedItem[]; refreshedAt?: string | null }) => {
        if (!active) return;
        setLiveItems(Array.isArray(payload.items) ? payload.items.map(toInspiration) : []);
        setRefreshedAt(payload.refreshedAt ?? null);
      })
      .catch(() => {
        if (active) setRefreshMessage("Tryb spokojny jest aktywny — pokazuję kolekcję offline.");
      });
    return () => { active = false; };
  }, []);

  const refreshWithAi = async () => {
    setRefreshing(true);
    setRefreshMessage(null);
    try {
      const response = await fetch("/api/panel/self-care", { method: "POST" });
      const payload = await response.json() as { items?: CachedItem[]; refreshedAt?: string | null; error?: string };
      if (!response.ok) throw new Error(payload.error || "Nie udało się odświeżyć kolekcji.");
      setLiveItems(Array.isArray(payload.items) ? payload.items.map(toInspiration) : []);
      setRefreshedAt(payload.refreshedAt ?? null);
      setRefreshMessage("Gotowe — nowości i promocje zostały odświeżone na Twoje życzenie. Pacjenci zobaczą tylko rodzinne inspiracje ze wspólnego cache.");
    } catch (error) {
      setRefreshMessage(error instanceof Error ? error.message : "PsychOLKA chwilowo odpoczywa. Kolekcja offline nadal działa.");
    } finally {
      setRefreshing(false);
    }
  };
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(favoritesChangedEvent));
  };

  return <div className="space-y-6">
    <section className="overflow-hidden rounded-[28px] border border-[#DDE4D8] bg-[#2D4739] p-6 text-white shadow-[0_18px_50px_rgba(45,71,57,0.14)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl"><div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"><Sparkles size={15} />PsychOLKA dla Aleksandry</div><h1 className="text-3xl font-bold sm:text-4xl">Chwila dla siebie 🌸</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">Filmy, seriale, rodzinne atrakcje, miejsca, wydarzenia i dobre okazje odświeżają się tylko wtedy, gdy klikniesz przycisk. Prezenty PsychOLKA również podpowiada wyłącznie na Twoje życzenie.</p></div>
        <div className="space-y-3 rounded-2xl bg-white/10 px-5 py-4 text-sm text-white/85">
          <div><p className="font-semibold text-white">Ręczne, oszczędne odświeżanie</p><p className="mt-1">{refreshedAt ? `Ostatnio: ${new Date(refreshedAt).toLocaleString("pl-PL")}` : "Kolekcja offline jest zawsze dostępna."}</p></div>
          <button type="button" disabled={refreshing} onClick={() => { void refreshWithAi(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-bold text-[#2D4739] disabled:cursor-wait disabled:opacity-70">
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} aria-hidden="true" />{refreshing ? "PsychOLKA szuka…" : "Odśwież nowości"}
          </button>
        </div>
      </div>
      {refreshMessage && <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm" role="status">{refreshMessage}</p>}
    </section>

    <section className="rounded-[24px] border border-[#E5E1D8] bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap gap-2" role="group" aria-label="Kategorie inspiracji">{filters.map((filter) => <button key={filter.id} type="button" onClick={() => setCategory(filter.id)} className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition ${category === filter.id ? "bg-[#6D7A62] text-white" : "bg-[#F8F5F0] text-[#2D4739] hover:bg-[#EEF1EB]"}`}>{filter.label}</button>)}</div></section>

    {category === "gifts" && <GiftAssistant />}

    <section><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-sm text-gray-500">Pierwsza spokojna kolekcja</p><h2 className="text-2xl font-bold text-[#2D4739]">Co może sprawić przyjemność?</h2></div>{favorites.length > 0 && <p className="text-sm font-semibold text-[#B05D6D]">Ulubione: {favorites.length}</p>}</div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <InspirationCard key={item.id} item={item} favorite={favorites.includes(item.id)} onFavorite={() => toggleFavorite(item.id)} />)}</div></section>

    <section className="rounded-[24px] border border-[#E8D39D] bg-[#FFF9E9] p-5 sm:p-6"><div className="flex gap-4"><span className="mt-0.5 rounded-2xl bg-white p-3 text-[#B7791F]"><Sparkles size={20} /></span><div><h2 className="font-bold text-[#2D4739]">Co dołoży mózg PsychOLKI?</h2><p className="mt-2 text-sm leading-6 text-gray-600">Świeże premiery Netflixa, koreańskie komedie romantyczne, repertuar kin, wydarzenia, restauracje, rodzinne atrakcje i promocje z prawdziwą datą ważności. Jeśli źródło lub AI będzie chwilowo niedostępne, ta kolekcja nadal zostanie widoczna.</p></div></div></section>
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

type GiftSuggestion = { title: string; description: string; budgetNote: string; sourceLabel: string; sourceUrl: string };
const giftOptions = {
  occasion: ["Urodziny", "Rocznica", "Święta", "Podziękowanie", "Bez okazji"],
  recipient: ["Partner / partnerka", "Dziecko", "Nastolatek / nastolatka", "Rodzic", "Przyjaciel / przyjaciółka"],
  budget: ["do 100 zł", "100–250 zł", "250–500 zł", "powyżej 500 zł"],
  interest: ["Książki i kultura", "Dom i wnętrza", "Moda", "Relaks i wellness", "Technologia", "Wspólne przeżycie", "Rodzinny wyjazd"],
} as const;

function GiftAssistant() {
  const [occasion, setOccasion] = useState<(typeof giftOptions.occasion)[number]>("Urodziny");
  const [recipient, setRecipient] = useState<(typeof giftOptions.recipient)[number]>("Partner / partnerka");
  const [budget, setBudget] = useState<(typeof giftOptions.budget)[number]>("100–250 zł");
  const [interest, setInterest] = useState<(typeof giftOptions.interest)[number]>("Wspólne przeżycie");
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const ask = async () => {
    setLoading(true); setMessage(null);
    try {
      const response = await fetch("/api/panel/gift-assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ occasion, recipient, budget, interest }) });
      const payload = await response.json() as { suggestions?: GiftSuggestion[]; error?: string };
      if (!response.ok) throw new Error(payload.error || "Nie udało się przygotować propozycji.");
      setSuggestions(Array.isArray(payload.suggestions) ? payload.suggestions : []);
      setMessage("Gotowe — propozycje powstały dopiero po Twoim kliknięciu.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "PsychOLKA chwilowo odpoczywa."); }
    finally { setLoading(false); }
  };

  return <section className="rounded-[24px] border border-[#E8D39D] bg-[#FFF9E9] p-5 shadow-sm sm:p-6">
    <div className="flex items-start gap-3"><span className="rounded-2xl bg-white p-3 text-[#B7791F]"><Gift size={21} /></span><div><p className="text-sm text-[#765D32]">Tylko na Twoje życzenie</p><h2 className="text-xl font-bold text-[#2D4739]">Podpowiedz prezent</h2><p className="mt-1 text-sm leading-6 text-gray-600">Ta funkcja nie uruchamia się automatycznie. Wybierasz wyłącznie neutralne kategorie — bez imion i danych osobowych.</p></div></div>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <GiftSelect label="Okazja" value={occasion} options={giftOptions.occasion} onChange={(value) => setOccasion(value as typeof occasion)} />
      <GiftSelect label="Dla kogo" value={recipient} options={giftOptions.recipient} onChange={(value) => setRecipient(value as typeof recipient)} />
      <GiftSelect label="Budżet" value={budget} options={giftOptions.budget} onChange={(value) => setBudget(value as typeof budget)} />
      <GiftSelect label="Kierunek" value={interest} options={giftOptions.interest} onChange={(value) => setInterest(value as typeof interest)} />
    </div>
    <button type="button" onClick={() => { void ask(); }} disabled={loading} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Sparkles size={17} />{loading ? "PsychOLKA szuka…" : suggestions.length ? "Pokaż inne propozycje" : "Podpowiedz prezenty"}</button>
    {message && <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-[#5D654F]" role="status">{message}</p>}
    {suggestions.length > 0 && <div className="mt-5 grid gap-3 lg:grid-cols-2">{suggestions.map((suggestion) => <article key={`${suggestion.title}-${suggestion.sourceUrl}`} className="rounded-2xl border border-[#E8DDBE] bg-white p-4"><h3 className="font-bold text-[#2D4739]">{suggestion.title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{suggestion.description}</p><p className="mt-3 rounded-xl bg-[#F8F5F0] px-3 py-2 text-xs text-[#765D32]">{suggestion.budgetNote}</p><a href={suggestion.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#2D4739]">{suggestion.sourceLabel}<ExternalLink size={15} /></a></article>)}</div>}
  </section>;
}

function GiftSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="text-sm font-semibold text-[#2D4739]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-[#D8D6CD] bg-white px-4 outline-none focus:border-[#6D7A62]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function InspirationCard({ item, favorite, onFavorite }: { item: SelfCareInspiration; favorite: boolean; onFavorite: () => void }) {
  const Icon = icons[item.category];
  return <article className="flex min-h-72 flex-col rounded-[24px] border border-[#E5E1D8] bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><Icon size={21} /></span><div className="flex items-center gap-2">{item.live && <span className="rounded-full bg-[#E7F4E8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#397047]">świeże</span>}<button type="button" onClick={onFavorite} aria-label={favorite ? `Usuń ${item.title} z ulubionych` : `Dodaj ${item.title} do ulubionych`} className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${favorite ? "bg-[#FCE8EC] text-[#B05D6D]" : "bg-[#F8F5F0] text-[#6D7A62] hover:bg-[#FCE8EC] hover:text-[#B05D6D]"}`}><Heart size={20} fill={favorite ? "currentColor" : "none"} /></button></div></div><p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8A7654]">{item.eyebrow}</p><h3 className="mt-2 text-xl font-bold text-[#2D4739]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p><div className="mt-auto space-y-3 pt-5"><p className="rounded-2xl bg-[#F8F5F0] px-4 py-3 text-xs leading-5 text-gray-500">{item.note}</p>{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D8DDD4] px-4 py-2.5 text-sm font-bold text-[#2D4739]">{item.sourceLabel || "Zobacz źródło"}<ExternalLink size={16} aria-hidden="true" /></a>}</div></article>;
}
