"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVisitBriefAction } from "../actions/visitBriefActions";
import type { AssistantTemplate, ReflectionCard, Visit } from "../domain";
import type { VisitBriefData } from "../services/visitBriefService";
import FiveMinuteVisitBrief from "./FiveMinuteVisitBrief";
import FollowupReminderList from "./FollowupReminderList";
import MoodJourneyTimeline from "./MoodJourneyTimeline";
import PsychOLKAAssistantCard from "./PsychOLKAAssistantCard";
import SmartVisitPreparation from "./SmartVisitPreparation";
import StatusBadge from "./StatusBadge";
import VisitPlanCard from "./VisitPlanCard";

interface VisitBriefProps { visit: Visit; selectedStatus: string; templates?: AssistantTemplate[]; onShowDetails: () => void; focusMode?: boolean; }

export default function VisitBrief({ visit, selectedStatus, onShowDetails, focusMode = false }: VisitBriefProps) {
  const router = useRouter();
  const [brief, setBrief] = useState<VisitBriefData | null>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => { if (!visit.patient_id) return; let active = true; void getVisitBriefAction(visit.patient_id, visit.id).then((data) => { if (active) setBrief(data); }).catch(() => { if (active) setLoadError(true); }); return () => { active = false; }; }, [visit.id, visit.patient_id]);
  const workspace = (tab: string) => { if (visit.patient_id) router.push(`/panel/patients/${visit.patient_id}?tab=${tab}`); };

  return <div className="space-y-5"><section className="rounded-2xl bg-[#EEF1EB] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm text-[#55624D]">Visit Brief</p><h3 className="mt-1 text-xl font-bold text-[#2D4739]">{visit.name}</h3><p className="mt-1 text-sm text-gray-600">Wiek: nie podano · Wizyta nr {brief?.visitNumber ?? "—"}</p></div><StatusBadge status={selectedStatus} /></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3"><Value label="Data" value={new Date(`${visit.visit_date}T00:00:00`).toLocaleDateString("pl-PL")} /><Value label="Godzina" value={visit.visit_time} /><Value label="Lokalizacja" value={visit.location || "Nie podano"} /></div></section>{loadError && <p className="rounded-xl bg-[#FFF9EE] px-4 py-3 text-sm text-[#7A6540]">Podsumowanie pacjenta jest chwilowo niedostępne.</p>}{focusMode ? <FiveMinuteVisitBrief visit={visit} brief={brief} /> : <><SmartVisitPreparation visit={visit} brief={brief} />{visit.patient_id && <FollowupReminderList patientId={visit.patient_id} visitId={visit.id} reminders={brief?.followupReminders ?? []} />}{visit.patient_id && <MoodJourneyTimeline patientId={visit.patient_id} entries={brief?.moodEntries ?? []} />}{visit.patient_id && <PsychOLKAAssistantCard patientId={visit.patient_id} brief={brief} />}<Card title="Powód zgłoszenia" content={brief?.firstReason ?? visit.message ?? "Brak wiadomości pozostawionej podczas rejestracji."} /><Card title="Ostatnia wizyta" content={brief?.previousVisit ? `${brief.previousVisit.visit_date} · ${brief.latestNote?.content ?? "Brak krótkiej notatki."}` : "To pierwsza wizyta lub brak historii wizyt."} /><VisitPlanCard visit={visit} /><PinnedReflections cards={brief?.pinnedReflections ?? []} /><section className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Metric label="Wizyty" value={brief?.visitsCount ?? "—"} /><Metric label="Ostatni status" value={brief?.latestVisitStatus ?? "—"} /><Metric label="Notatki" value={brief?.notesCount ?? "—"} /><Metric label="Zadania" value={brief?.tasksCount ?? "—"} /></section><section className="rounded-2xl bg-[#F8F5F0] p-5"><h3 className="font-bold">Szybkie akcje</h3><div className="mt-4 grid grid-cols-2 gap-2 text-sm"><Action label="Dodaj notatkę" onClick={() => workspace("notes")} /><Action label="Dodaj zadanie" onClick={() => workspace("tasks")} /><Action label="Dodaj dokument" onClick={() => workspace("documents")} /><Action label="Zmień status wizyty" onClick={onShowDetails} /></div></section></>}</div>;
}
function Card({ title, content }: { title: string; content: string }) { return <section className="rounded-2xl bg-[#F8F5F0] p-5"><h3 className="font-bold">{title}</h3><p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{content}</p></section>; }
function Value({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-gray-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>; }
function Metric({ label, value }: { label: string | number; value: string | number }) { return <div className="rounded-xl bg-[#EEF1EB] p-3"><p className="text-xs text-[#55624D]">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>; }
function Action({ label, onClick }: { label: string; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-xl bg-white px-3 py-2.5 text-left font-semibold transition hover:bg-[#EEF1EB]">{label}</button>; }
function PinnedReflections({ cards }: { cards: ReflectionCard[] }) { if (!cards.length) return null; return <section className="rounded-2xl border border-[#D5DCCF] bg-[#EEF1EB] p-5"><h3 className="font-bold">Przypięte refleksje</h3><div className="mt-4 space-y-3">{cards.map((card) => <Card key={card.id} title={card.title} content={card.content || "Brak treści."} />)}</div></section>; }
