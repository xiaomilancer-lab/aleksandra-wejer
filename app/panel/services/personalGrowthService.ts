import "server-only";

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { KnowledgeMaterial, VisitTemplate } from "../domain";
import { getKnowledgeMaterials } from "./knowledgeLibraryService";
import { getPatients } from "./patientService";
import { getFavoriteTemplates } from "./templateService";

export interface PersonalGrowthData {
  visitsCount: number;
  patientsCount: number;
  activeTherapiesCount: number;
  averageVisits: number;
  areas: Array<{ label: string; count: number }>;
  materialCounts: { conversationPlans: number; exercises: number; tests: number; checklists: number; library: number };
  favoriteTemplates: VisitTemplate[];
  recentMaterials: KnowledgeMaterial[];
}

function includesAny(material: KnowledgeMaterial, terms: string[]) {
  const searchable = [material.title, material.description, material.content, ...material.tags].join(" ").toLocaleLowerCase("pl-PL");
  return terms.some((term) => searchable.includes(term));
}

export async function getPersonalGrowthData(): Promise<PersonalGrowthData> {
  const [patients, materials, favoriteTemplates, visitsResult] = await Promise.all([
    getPatients(),
    getKnowledgeMaterials(),
    getFavoriteTemplates(),
    supabaseAdmin.from("bookings").select("id, patient_id, status").neq("record_kind", "test"),
  ]);
  if (visitsResult.error) throw visitsResult.error;

  const visits = visitsResult.data ?? [];
  const activePatientIds = new Set(visits.filter((visit) => visit.patient_id && ["Nowe", "Potwierdzone"].includes(visit.status)).map((visit) => visit.patient_id));
  const areaOrder = ["ADHD", "Spektrum autyzmu", "Lęki", "Mutyzm", "Pary", "Dzieci"];
  const areas = areaOrder.map((label) => ({ label, count: materials.filter((material) => material.category === label || material.tags.some((tag) => tag.toLocaleLowerCase("pl-PL").includes(label.toLocaleLowerCase("pl-PL")))).length })).filter((area) => area.count > 0);

  return {
    visitsCount: visits.length,
    patientsCount: patients.length,
    activeTherapiesCount: activePatientIds.size,
    averageVisits: patients.length ? Number((visits.length / patients.length).toFixed(1)) : 0,
    areas,
    materialCounts: {
      conversationPlans: materials.filter((material) => includesAny(material, ["plan rozmowy", "scenariusz rozmowy"])).length,
      exercises: materials.filter((material) => includesAny(material, ["ćwiczenie", "ćwiczeń"])).length,
      tests: materials.filter((material) => includesAny(material, ["test", "kwestionariusz"])).length,
      checklists: materials.filter((material) => includesAny(material, ["checklista", "lista kontrolna"])).length,
      library: materials.length,
    },
    favoriteTemplates: favoriteTemplates.slice(0, 4),
    recentMaterials: [...materials].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
  };
}
