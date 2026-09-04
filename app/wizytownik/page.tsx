import { connection } from "next/server";
import { requirePsychologist } from "@/app/panel/server/requirePsychologist";
import WizytownikWorkspace from "./components/WizytownikWorkspace";
import { getJournalNotes, getJournalPatients, recordJournalAudit } from "./server/secureJournal";

type Props = { searchParams: Promise<{ patient?: string }> };

function warsawDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default async function WizytownikPage({ searchParams }: Props) {
  await connection();
  const identity = await requirePsychologist();
  const requestedPatient = (await searchParams).patient ?? "";
  let patients = [] as Awaited<ReturnType<typeof getJournalPatients>>;
  let notes = [] as Awaited<ReturnType<typeof getJournalNotes>>;
  let setupError: string | null = null;

  try {
    patients = await getJournalPatients();
    const selected = patients.find((patient) => patient.id === requestedPatient);
    if (selected) {
      notes = await getJournalNotes(selected.id, identity.userId);
      await recordJournalAudit(identity.userId, "history_viewed", selected.id);
    }
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Wizytownik nie jest jeszcze skonfigurowany.";
    if (patients.length === 0) {
      try {
        const { getPatients } = await import("@/app/panel/services/patientService");
        patients = (await getPatients()).map((patient) => ({ id: patient.id, name: patient.name, phone: patient.phone, email: patient.email, journalAlias: null, createdAt: patient.created_at }));
      } catch { /* The setup message is enough. */ }
    }
  }

  const selectedPatient = patients.find((patient) => patient.id === requestedPatient) ?? null;
  return <WizytownikWorkspace patients={patients} selectedPatient={selectedPatient} notes={notes} today={warsawDate()} setupError={setupError} />;
}
