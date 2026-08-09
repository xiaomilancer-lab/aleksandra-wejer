"use client";

import { FilePlus2, FileText, Star } from "lucide-react";
import { useState } from "react";
import type { FollowupReminder, KnowledgeMaterial, Patient, PatientMemory as PatientMemoryItem, PatientNote, PatientTask, PatientTimelineEvent, ReflectionCard, Visit, VisitPlan, VisitReflection, VisitTemplate } from "../../domain";
import PatientNotes from "../patients/PatientNotes";
import PatientTasks from "../patients/PatientTasks";
import PatientTimelineFeed from "../patient-timeline/PatientTimeline";
import PatientActions from "./PatientActions";
import PatientProfileHeader from "./PatientProfileHeader";
import PatientStatistics from "./PatientStatistics";
import PatientTabs, { type PatientWorkspaceTab } from "./PatientTabs";
import PatientVisitHistory from "./PatientVisitHistory";
import PatientEmotionJourney from "./PatientEmotionJourney";
import PatientCaseSummary from "./PatientCaseSummary";
import PatientClinicalReflection from "./PatientClinicalReflection";
import PatientSnapshot from "./PatientSnapshot";
import PatientMemory from "./PatientMemory";
import PatientJourney from "./PatientJourney";
import FollowupReminderList from "../FollowupReminderList";

interface PatientProfileProps {
  patient: Patient;
  visits: Visit[];
  notes: PatientNote[];
  tasks: PatientTask[];
  timeline: PatientTimelineEvent[];
  templates: VisitTemplate[];
  reflections: VisitReflection[];
  reflectionCards: ReflectionCard[];
  latestPlan: VisitPlan | null;
  visitPlans: VisitPlan[];
  memory: PatientMemoryItem[];
  knowledgeMaterials: KnowledgeMaterial[];
  followupReminders: FollowupReminder[];
  createdAt: string;
  lastActivity: string;
  initialTab?: PatientWorkspaceTab;
}

export default function PatientProfile({
  patient,
  visits,
  notes,
  tasks,
  timeline,
  templates,
  reflections,
  reflectionCards,
  latestPlan,
  visitPlans,
  memory,
  knowledgeMaterials,
  followupReminders,
  createdAt,
  lastActivity,
  initialTab = "visits",
}: PatientProfileProps) {
  const [activeTab, setActiveTab] = useState<PatientWorkspaceTab>(initialTab);

  return (
    <>
      <PatientProfileHeader patient={patient} createdAt={createdAt} />
      <PatientSnapshot patient={patient} visits={visits} notes={notes} tasks={tasks} latestPlan={latestPlan} onTabChange={setActiveTab} />
      <PatientMemory patientId={patient.id} memory={memory} />
      <PatientStatistics
        visitsCount={visits.length}
        notesCount={notes.length}
        tasksCount={tasks.length}
        lastActivity={lastActivity}
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <PatientTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === "visits" && <PatientVisitHistory visits={visits} />}
            {activeTab === "notes" && <PatientNotes patientId={patient.id} notes={notes} templates={templates} />}
            {activeTab === "documents" && (
              <WorkspacePlaceholder title="Dokumenty" icon={FileText} actionLabel="Dodaj dokument" />
            )}
            {activeTab === "tasks" && <PatientTasks patientId={patient.id} tasks={tasks} />}
            {activeTab === "reviews" && (
              <WorkspacePlaceholder title="Opinie" icon={Star} actionLabel="Poproś o opinię" />
            )}
            {activeTab === "history" && <PatientTimelineFeed events={timeline} />}
            {activeTab === "journey" && <PatientEmotionJourney reflections={reflections} />}
            {activeTab === "summary" && <PatientCaseSummary visits={visits} tasks={tasks} timeline={timeline} plans={visitPlans} memory={memory} materials={knowledgeMaterials} reflections={reflectionCards} />}
            {activeTab === "reflection" && <PatientClinicalReflection patientId={patient.id} cards={reflectionCards} />}
            {activeTab === "patient-journey" && <PatientJourney patientId={patient.id} visits={visits} tasks={tasks} timeline={timeline} materials={knowledgeMaterials} />}
            {activeTab === "followups" && <FollowupReminderList patientId={patient.id} reminders={followupReminders} title="Historia Follow-up" showEmpty showResolved />}
          </div>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <PatientActions email={patient.email} />
        </aside>
      </div>
    </>
  );
}

function WorkspacePlaceholder({
  title,
  icon: Icon,
  actionLabel,
}: {
  title: string;
  icon: typeof FileText;
  actionLabel: string;
}) {
  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><Icon size={19} aria-hidden="true" /></span>
          <h2 className="font-bold text-[#2D4739]">{title}</h2>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#58644F]">
          <FilePlus2 size={17} aria-hidden="true" />
          {actionLabel}
        </button>
      </div>
      <p className="mt-6 rounded-2xl bg-[#F8F5F0] px-4 py-7 text-center text-sm text-gray-500">Wkrótce</p>
    </section>
  );
}
