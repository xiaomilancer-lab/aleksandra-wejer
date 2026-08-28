import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import VisitScheduleList from "../components/visits/VisitScheduleList";
import PatientVaultGate from "../patients/PatientVaultGate";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import { getVisitOrganizerData } from "../services/visitOrganizerService";

export default async function SchedulePage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) {
    return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/schedule" /></Dashboard></AuthGuard>;
  }

  const { visits } = await getVisitOrganizerData();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());

  return <AuthGuard><Dashboard><VisitScheduleList initialVisits={visits} today={today} /></Dashboard></AuthGuard>;
}
