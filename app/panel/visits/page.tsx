import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import VisitOrganizer from "../components/visits/VisitOrganizer";
import { getVisitOrganizerData } from "../services/visitOrganizerService";
import { getPatients } from "../services/patientService";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import PatientVaultGate from "../patients/PatientVaultGate";

export default async function VisitsPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) {
    return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/visits" /></Dashboard></AuthGuard>;
  }
  const [data, patients] = await Promise.all([getVisitOrganizerData(), getPatients()]);
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><VisitOrganizer initialVisits={data.visits} classificationAvailable={data.classificationAvailable} patients={patients} /></div></Dashboard></AuthGuard>;
}
