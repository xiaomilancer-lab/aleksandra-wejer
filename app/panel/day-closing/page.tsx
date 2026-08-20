import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import DayClosingView from "../components/DayClosingView";
import PsycholkaMemoryDayClosing from "../components/PsycholkaMemoryDayClosing";
import HeartMessageEngine from "../components/HeartMessageEngine";
import { getDayClosingSummary } from "../services/dashboardService";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import PatientVaultGate from "../patients/PatientVaultGate";

export default async function DayClosingPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/day-closing" /></Dashboard></AuthGuard>;
  const summary = await getDayClosingSummary();
  return <AuthGuard><Dashboard><PsycholkaMemoryDayClosing isComplete={summary.closureItems.length === 0} />{summary.closureItems.length === 0 && <div className="mx-auto max-w-3xl"><HeartMessageEngine eventKey="day-closing" trigger={summary.date} className="mb-4" /></div>}<DayClosingView summary={summary} /></Dashboard></AuthGuard>;
}
