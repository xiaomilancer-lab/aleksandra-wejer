import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";
import { getJournalNotes, getJournalPatient, recordJournalAudit } from "@/app/wizytownik/server/secureJournal";
import PrintControls from "./PrintControls";

type Props = { params: Promise<{ id: string }> };

export default async function JournalPrintPage({ params }: Props) {
  await connection();
  const { id } = await params;
  const identity = await requirePsychologist(`/wizytownik/patients/${id}/print`);
  const [patient, notes] = await Promise.all([getJournalPatient(id), getJournalNotes(id, identity.userId)]);
  if (!patient) notFound();
  await recordJournalAudit(identity.userId, "history_exported", patient.id);

  return <main className="min-h-screen bg-[#F3F3F0] p-4 text-[#17251D] print:bg-white print:p-0 sm:p-8"><div className="mx-auto max-w-4xl"><PrintControls /><article className="bg-white p-8 shadow-sm print:p-0 print:shadow-none sm:p-12"><header className="border-b-2 border-[#2D4739] pb-6"><p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6D7A62]">Wizytownik psychOLKI · dokument prywatny</p><h1 className="mt-2 text-3xl font-black">Historia notatek</h1><p className="mt-3 text-xl font-bold">{patient.name}{patient.journalAlias ? ` · „${patient.journalAlias}”` : ""}</p><p className="mt-2 text-sm text-gray-600">Wygenerowano: {new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}</p></header>{notes.length === 0 ? <p className="py-10 text-gray-600">Brak zapisanych notatek.</p> : <div>{notes.map((note) => <section key={note.id} className="break-inside-avoid border-b border-gray-200 py-7"><p className="text-sm font-bold text-[#6D7A62]">{new Date(`${note.occurredOn}T12:00:00`).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}</p><h2 className="mt-2 text-xl font-black">{note.title}</h2><Block title="Przebieg wizyty" value={note.sessionSummary} /><Block title="Najważniejsze tematy" value={note.keyTopics} /><Block title="Obserwacje pomocne w dalszej pracy" value={note.observations} /><Block title="Ustalenia i kolejny krok" value={note.nextSteps} /></section>)}</div>}<footer className="pt-6 text-xs leading-5 text-gray-500">Dokument zawiera poufne informacje. Przechowuj go na zaszyfrowanym urządzeniu i nie przesyłaj niezabezpieczonym kanałem.</footer></article></div></main>;
}

function Block({ title, value }: { title: string; value: string }) { if (!value) return null; return <div className="mt-5"><h3 className="text-xs font-black uppercase tracking-[0.08em] text-[#5C6C5B]">{title}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{value}</p></div>; }
