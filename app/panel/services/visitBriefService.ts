import "server-only";

import type { FollowupReminder, KnowledgeMaterial, MoodEntry, PatientMemory, PatientNote, PatientTask, PatientTimelineEvent, ReflectionCard, Visit, VisitPlan } from "../domain";
import { getPatientNotes, getPatientTasks, getPatientVisits } from "./patientService";
import { getPinnedReflectionCards } from "./clinicalReflectionService";
import { getPinnedPatientMemory } from "./patientMemoryService";
import { getPatientTimeline } from "./patientService";
import { getVisitPlan } from "./visitPlanService";
import { getVisitKnowledgeMaterials } from "./knowledgeLibraryService";
import { getOpenFollowupRemindersForVisit } from "./followupReminderService";
import { getMoodEntries } from "./moodEntryService";

export interface VisitBriefData {
  visitNumber: number;
  firstReason: string | null;
  latestReason: string | null;
  previousVisit: Visit | null;
  latestNote: PatientNote | null;
  homeworkTasks: PatientTask[];
  visitsCount: number;
  notesCount: number;
  tasksCount: number;
  latestVisitStatus: string | null;
  pinnedReflections: ReflectionCard[];
  notes: PatientNote[];
  tasks: PatientTask[];
  hasNextVisit: boolean;
  pinnedMemory: PatientMemory[];
  timelineEvents: PatientTimelineEvent[];
  currentPlan: VisitPlan | null;
  visitMaterials: KnowledgeMaterial[];
  followupReminders: FollowupReminder[];
  moodEntries: MoodEntry[];
}

export async function getVisitBrief(patientId: string, currentVisitId: number): Promise<VisitBriefData> {
  const [visits, notes, tasks, pinnedReflections, pinnedMemory, timelineEvents, currentPlan, visitMaterials, followupReminders, moodEntries] = await Promise.all([
    getPatientVisits(patientId),
    getPatientNotes(patientId),
    getPatientTasks(patientId),
    getPinnedReflectionCards(patientId),
    getPinnedPatientMemory(patientId),
    getPatientTimeline(patientId),
    getVisitPlan(currentVisitId),
    getVisitKnowledgeMaterials(currentVisitId),
    getOpenFollowupRemindersForVisit(patientId, currentVisitId),
    getMoodEntries(patientId, 14),
  ]);
  const chronologicalVisits = [...visits].reverse();
  const currentVisitIndex = chronologicalVisits.findIndex((visit) => visit.id === currentVisitId);
  const previousVisit = currentVisitIndex > 0 ? chronologicalVisits[currentVisitIndex - 1] : null;
  const reasons = chronologicalVisits.map((visit) => visit.message?.trim()).filter((message): message is string => Boolean(message));

  return {
    visitNumber: currentVisitIndex >= 0 ? currentVisitIndex + 1 : visits.length,
    firstReason: reasons[0] ?? null,
    latestReason: reasons.at(-1) ?? null,
    previousVisit,
    latestNote: notes[0] ?? null,
    homeworkTasks: tasks.filter((task) => task.status !== "completed").slice(0, 3),
    visitsCount: visits.length,
    notesCount: notes.length,
    tasksCount: tasks.length,
    latestVisitStatus: visits[0]?.status ?? null,
    pinnedReflections,
    notes,
    tasks,
    hasNextVisit: visits.some((visit) => visit.id !== currentVisitId && visit.visit_date >= new Date().toISOString().slice(0, 10) && visit.status !== "Anulowane"),
    pinnedMemory,
    timelineEvents: timelineEvents.slice(0, 3),
    currentPlan,
    visitMaterials,
    followupReminders,
    moodEntries,
  };
}
