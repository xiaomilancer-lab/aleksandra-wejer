"use client";

import { CalendarClock, FilePlus2, Mail, NotebookPen, Play, Target, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Patient, PatientNote, PatientTask, Visit, VisitPlan } from "../../domain";
import StatusBadge from "../StatusBadge";
import type { PatientWorkspaceTab } from "./PatientTabs";

interface PatientSnapshotProps { patient: Patient; visits: Visit[]; notes: PatientNote[]; tasks: PatientTask[]; latestPlan: VisitPlan | null; onTabChange: (tab: PatientWorkspaceTab) => void; }

export default function PatientSnapshot({ patient, visits, notes, tasks, latestPlan, onTabChange }: PatientSnapshotProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const nextVisit = visits.filter((visit) => visit.visit_date >= today && visit.status !== "Odwołane").at(-1) ?? null;
  const lastVisit = visits.find((visit) => visit.visit_date < today || visit.status === "Zrealizowane") ?? null;
  const latestNote = notes[0] ?? null;
  const latestTask = tasks[0] ?? null;
  const latestStatus = visits[0]?.status ?? "Nie określono";

  return <section className="mt-6 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="flex items-center gap-4"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]"><UserRound size={30} aria-hidden="true" /></span><div><p className="text-sm text-gray-500">Szybki podgląd pacjenta</p><h2 className="mt-1 text-2xl font-bold text-[#2D4739]">{patient.name}</h2><p className="mt-1 text-sm text-gray-600">Wiek: nie podano · Wizyta nr {visits.length || "—"}</p></div></div><div><p className="mb-2 text-xs text-gray-500">Ostatni status wizyty</p><StatusBadge status={latestStatus} /></div></div><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><SnapshotItem icon={CalendarClock} title="Ostatnia wizyta" value={lastVisit ? new Date(`${lastVisit.visit_date}T00:00:00`).toLocaleDateString("pl-PL") : "Pierwsza wizyta pojawi się tutaj."} detail={latestNote?.content ?? "Brak wcześniejszej notatki."} /><SnapshotItem icon={Target} title="Aktualny cel terapii" value={latestPlan?.main_goal || "Cel terapii nie został jeszcze zapisany."} /><SnapshotItem icon={NotebookPen} title="Ostatnie zadanie domowe" value={latestTask?.title || "Pierwsze zadanie pojawi się tutaj."} detail={latestTask?.description} /><SnapshotItem icon={CalendarClock} title="Najbliższa wizyta" value={nextVisit ? `${new Date(`${nextVisit.visit_date}T00:00:00`).toLocaleDateString("pl-PL")} · ${nextVisit.visit_time}` : "Brak zaplanowanej wizyty."} detail={nextVisit?.location} /></div><div className="mt-6 border-t border-[#E5E1D8] pt-5"><p className="text-sm font-semibold text-[#2D4739]">Szybkie akcje</p><div className="mt-3 flex flex-wrap gap-2"><Action icon={NotebookPen} label="Nowa notatka" onClick={() => onTabChange("notes")} /><Action icon={Play} label="Rozpocznij wizytę" disabled={!nextVisit} onClick={() => { if (nextVisit) router.push(`/panel/visits/${nextVisit.id}/session`); }} /><Action icon={FilePlus2} label="Dodaj dokument" onClick={() => onTabChange("documents")} /><Action icon={Mail} label="Wyślij materiały" disabled onClick={() => undefined} /></div></div></section>;
}

function SnapshotItem({ icon: Icon, title, value, detail }: { icon: typeof CalendarClock; title: string; value: string; detail?: string | null }) { return <div className="rounded-2xl bg-[#F8F5F0] p-4"><div className="flex items-center gap-2 text-[#6D7A62]"><Icon size={17} aria-hidden="true" /><p className="text-xs font-semibold">{title}</p></div><p className="mt-3 text-sm font-semibold text-[#2D4739]">{value}</p>{detail && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{detail}</p>}</div>; }
function Action({ icon: Icon, label, onClick, disabled = false }: { icon: typeof NotebookPen; label: string; onClick: () => void; disabled?: boolean }) { return <button type="button" onClick={onClick} disabled={disabled} className="inline-flex items-center gap-2 rounded-xl border border-[#D5DCCF] bg-white px-3 py-2.5 text-sm font-semibold text-[#2D4739] transition hover:bg-[#EEF1EB] disabled:cursor-not-allowed disabled:text-gray-400"><Icon size={16} aria-hidden="true" />{label}</button>; }
