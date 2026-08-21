import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import AuthGuard from "../../components/AuthGuard";
import Dashboard from "../../components/Dashboard";
import PatientProfile from "../../components/patient-profile/PatientProfile";
import {
  getPatientById,
  getPatientNotes,
  getPatientTasks,
  getPatientTimeline,
  getPatientVisits,
} from "../../services/patientService";
import { getTemplates } from "../../services/templateService";
import { getPatientReflections } from "../../services/reflectionService";
import { getReflectionCards } from "../../services/clinicalReflectionService";
import { getLatestPatientVisitPlan, getPatientVisitPlans } from "../../services/visitPlanService";
import { getPatientMemory } from "../../services/patientMemoryService";
import { getKnowledgeMaterialsForVisits } from "../../services/knowledgeLibraryService";
import { getPatientFollowupReminders } from "../../services/followupReminderService";
import { formatDate } from "../../utils/formatDate";
import { requirePsychologist } from "../../server/requirePsychologist";
import { getPatientVaultState } from "../../server/patientVault";
import PatientVaultGate from "../PatientVaultGate";

interface PatientPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function PatientPage({ params, searchParams }: PatientPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab = tab === "notes" || tab === "tasks" || tab === "documents" || tab === "summary" || tab === "reflection" || tab === "patient-journey" || tab === "followups" ? tab : "visits";

  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) {
    return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo={`/panel/patients/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : ""}`} /></Dashboard></AuthGuard>;
  }
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const optional = <T,>(promise: Promise<T>, fallback: T) => promise.catch(() => fallback);
  const [visits, notes, tasks, timeline, templates, reflections, reflectionCards, latestPlan, memory, visitPlans, followupReminders] = await Promise.all([
    optional(getPatientVisits(id), []),
    optional(getPatientNotes(id), []),
    optional(getPatientTasks(id), []),
    optional(getPatientTimeline(id), []),
    optional(getTemplates(), []),
    optional(getPatientReflections(id), []),
    optional(getReflectionCards(id), []),
    optional(getLatestPatientVisitPlan(id), null),
    optional(getPatientMemory(id), []),
    optional(getPatientVisitPlans(id), []),
    optional(getPatientFollowupReminders(id), []),
  ]);
  const knowledgeMaterials = await optional(getKnowledgeMaterialsForVisits(visits.map((visit) => visit.id)), []);

  const createdAt = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(patient.created_at));
  const lastActivity = visits[0]
    ? formatDate(visits[0].visit_date)
    : "Brak aktywności";

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/panel/patients" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-[#D5DCCF] bg-white px-4 py-3 font-semibold text-[#2D4739] transition hover:bg-[#F8F5F0]"><ArrowLeft size={19} aria-hidden="true" />Powrót do listy</Link></div>

          <div className="mt-5">
            <PatientProfile
              patient={patient}
              visits={visits}
              notes={notes}
              tasks={tasks}
              timeline={timeline}
              templates={templates}
              reflections={reflections}
              reflectionCards={reflectionCards}
              latestPlan={latestPlan}
              visitPlans={visitPlans}
              memory={memory}
              knowledgeMaterials={knowledgeMaterials}
              followupReminders={followupReminders}
              createdAt={createdAt}
              lastActivity={lastActivity}
              initialTab={initialTab}
            />
          </div>
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
