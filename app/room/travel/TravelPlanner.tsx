"use client";

import { Bus, Car, Check, Copy, ExternalLink, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";

const destinations = [
  { id: "zielinscy", name: "Centrum Medyczno-Estetyczne Zielińscy Premium", address: "Kasztanowa 1, Nowa Wieś Rzeczna", availability: "Wszystkie dni poza wtorkiem" },
  { id: "arthro", name: "Arthro Cure Clinic", address: "Al. Jana Pawła II 1/U9, Starogard Gdański", availability: "Tylko we wtorki" },
] as const;

type DestinationId = (typeof destinations)[number]["id"];

export default function TravelPlanner() {
  const [selectedId, setSelectedId] = useState<DestinationId>("zielinscy");
  const [copied, setCopied] = useState(false);
  const selected = destinations.find((destination) => destination.id === selectedId) ?? destinations[0];
  const routes = useMemo(() => ({
    driving: buildDirectionsUrl(selected.address, "driving"),
    transit: buildDirectionsUrl(selected.address, "transit"),
  }), [selected.address]);

  async function copyAddress() {
    await navigator.clipboard.writeText(selected.address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
      <div className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><MapPin size={22} aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Najpierw wybierz</p><h2 className="text-xl font-bold">Dokąd jedziesz?</h2></div>
        </div>
        <div className="mt-5 grid gap-3">
          {destinations.map((destination) => (
            <button key={destination.id} type="button" onClick={() => setSelectedId(destination.id)} className={`rounded-2xl border p-4 text-left transition ${selectedId === destination.id ? "border-[#6D7A62] bg-[#EEF1EB]" : "border-[#E5E1D8] hover:bg-[#F8F5F0]"}`}>
              <span className="flex items-start justify-between gap-3"><strong>{destination.name}</strong>{selectedId === destination.id && <Check size={18} className="shrink-0" aria-hidden="true" />}</span>
              <span className="mt-2 block text-sm leading-6 text-gray-600">{destination.address}</span>
              <span className="mt-2 block text-sm font-semibold text-[#55624D]">Przyjęcia: {destination.availability}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={copyAddress} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#D5DCCF] px-4 py-2 text-sm font-semibold">
          {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copied ? "Adres skopiowany" : "Kopiuj adres"}
        </button>
      </div>

      <div className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]"><ShieldCheck size={22} aria-hidden="true" /></span>
          <div><p className="text-sm text-gray-500">Wybierz sposób</p><h2 className="text-xl font-bold">Jak chcesz dojechać?</h2></div>
        </div>
        <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-4 text-sm leading-6 text-gray-600">Po otwarciu Map to telefon zapyta o zgodę na użycie bieżącej lokalizacji. PsychOLKA jej nie widzi i nie zapisuje.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <RouteLink href={routes.driving} icon={Car} label="Samochodem" />
          <RouteLink href={routes.transit} icon={Bus} label="Komunikacją" />
        </div>
        <a href="https://m.bolt.eu/" target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#D5DCCF] px-5 py-3 font-semibold">
          <Smartphone size={18} aria-hidden="true" /> Otwórz Bolt <ExternalLink size={16} aria-hidden="true" />
        </a>
        <p className="mt-3 text-xs leading-5 text-gray-500">W aplikacji Bolt wybierz skopiowany adres jako cel. Dostępność przejazdu zależy od miejsca i chwili zamówienia.</p>
      </div>
    </section>
  );
}

function RouteLink({ href, icon: Icon, label }: { href: string; icon: typeof Car; label: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#2D4739] px-4 py-3 font-semibold text-white"><Icon size={18} aria-hidden="true" />{label}<ExternalLink size={15} aria-hidden="true" /></a>;
}

function buildDirectionsUrl(address: string, travelMode: "driving" | "transit") {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", address);
  url.searchParams.set("travelmode", travelMode);
  return url.toString();
}
