import { notFound } from "next/navigation";
import { connection } from "next/server";
import AuthGuard from "../../../components/AuthGuard";
import VisitSession from "../../../components/VisitSession";
import Dashboard from "../../../components/Dashboard";
import { getVisitSessionData } from "../../../services/visitSessionService";
import { requirePsychologist } from "../../../server/requirePsychologist";
import { getPatientVaultState } from "../../../server/patientVault";
import PatientVaultGate from "../../../patients/PatientVaultGate";

export default async function VisitSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visitId = Number(id);
  if (!Number.isInteger(visitId) || visitId < 1) notFound();
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo={`/panel/visits/${visitId}/session`} /></Dashboard></AuthGuard>;
  const data = await getVisitSessionData(visitId);
  if (!data) notFound();
  return <AuthGuard><VisitSession data={data} /></AuthGuard>;
}
