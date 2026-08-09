"use client";

import { CalendarPlus, Heart, Mail, Phone, X } from "lucide-react";
import { useState } from "react";
import type { FollowupSuggestion } from "../domain";
import DashboardCard from "./DashboardCard";

export default function DashboardFollowUp({ suggestions }: { suggestions: FollowupSuggestion[] }) {
  const [hiddenSuggestionIds, setHiddenSuggestionIds] = useState<Set<string>>(new Set());
  const visibleSuggestions = suggestions.filter((suggestion) => !hiddenSuggestionIds.has(suggestion.id));
  const hideSuggestion = (suggestionId: string) => setHiddenSuggestionIds((current) => new Set(current).add(suggestionId));

  return <DashboardCard><div className="flex items-center gap-3"><span className="rounded-2xl bg-[#FBE8E8] p-3 text-[#BF4D4D]"><Heart size={20} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Przypomnienia dla psychologa</p><h2 className="font-bold text-[#2D4739]">Follow-up</h2></div></div>{visibleSuggestions.length === 0 ? <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-5 py-7 text-center text-sm text-gray-500">Gdy pacjent będzie wymagał kontaktu, sugestia pojawi się tutaj.</p> : <div className="mt-5 space-y-4">{visibleSuggestions.map((suggestion) => <article key={suggestion.id} className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-[#2D4739]">{suggestion.patientName}</p><p className="mt-1 text-sm text-gray-600">Ostatnia wizyta: {new Date(`${suggestion.lastVisitDate}T00:00:00`).toLocaleDateString("pl-PL")} · {suggestion.daysSinceVisit} dni temu</p><p className="mt-2 text-sm font-medium text-[#6D7A62]">{suggestion.reason}</p></div><button type="button" onClick={() => hideSuggestion(suggestion.id)} aria-label={`Ukryj sugestię dla ${suggestion.patientName}`} className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-[#2D4739]"><X size={17} aria-hidden="true" /></button></div><div className="mt-4 grid grid-cols-3 gap-2"><PlaceholderAction label="Wyślij e-mail" icon={Mail} /><PlaceholderAction label="Zadzwoń" icon={Phone} /><PlaceholderAction label="Umów wizytę" icon={CalendarPlus} /></div></article>)}</div>}<p className="mt-5 text-xs text-gray-500">TODO: przyszłe automatyczne przypomnienia wymagają osobnego mechanizmu wysyłki oraz zgód komunikacyjnych. Sugestie nie wysyłają wiadomości automatycznie.</p></DashboardCard>;
}

function PlaceholderAction({ label, icon: Icon }: { label: string; icon: typeof Mail }) { return <button type="button" onClick={() => { /* TODO: Connect a deliberate, therapist-confirmed contact flow. */ }} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-white px-2 py-2 text-center text-xs font-semibold text-[#2D4739] transition hover:bg-[#EEF1EB]"><Icon size={14} aria-hidden="true" />{label}</button>; }
