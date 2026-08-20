import { notFound } from "next/navigation";
import { connection } from "next/server";
import AuthGuard from "../../../components/AuthGuard";
import Dashboard from "../../../components/Dashboard";
import VisitBrief from "../../../components/VisitBrief";
import UnlinkedVisitDetails from "../../../components/visits/UnlinkedVisitDetails";
import { getVisitSessionData } from "../../../services/visitSessionService";
import { getOrganizerVisitById } from "../../../services/visitOrganizerService";
import { requirePsychologist } from "../../../server/requirePsychologist";
import { getPatientVaultState } from "../../../server/patientVault";
import PatientVaultGate from "../../../patients/PatientVaultGate";

export default async function VisitBriefPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ full?: string }> }) {
  await connection(); const [{ id }, { full }] = await Promise.all([params, searchParams]); const visitId = Number(id); if (!Number.isInteger(visitId) || visitId < 1) notFound();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo={`/panel/visits/${visitId}/brief${full === "1" ? "?full=1" : ""}`} /></Dashboard></AuthGuard>;
  const visit = await getOrganizerVisitById(visitId); if (!visit) notFound();
  if (!visit.patient_id) return <AuthGuard><Dashboard><div className="mx-auto max-w-4xl"><UnlinkedVisitDetails visit={visit} /></div></Dashboard></AuthGuard>;
  let data: Awaited<ReturnType<typeof getVisitSessionData>> = null;
  try {
    data = await getVisitSessionData(visitId);
  } catch {
    data = null;
  }
  if (!data) return <AuthGuard><Dashboard><div className="mx-auto max-w-4xl"><UnlinkedVisitDetails visit={visit} clinicalDataUnavailable /></div></Dashboard></AuthGuard>;
  return <AuthGuard><Dashboard><div className="mx-auto max-w-4xl"><VisitBrief visit={data.visit} selectedStatus={data.visit.status} onShowDetails={() => undefined} focusMode={full !== "1"} /></div></Dashboard></AuthGuard>;
}
