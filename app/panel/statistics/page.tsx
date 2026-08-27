import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PracticeStatistics from "../components/statistics/PracticeStatistics";
import PatientVaultGate from "../patients/PatientVaultGate";
import { getPatientVaultState } from "../server/patientVault";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPracticeStatisticsData } from "../services/practiceStatisticsService";

export default async function StatisticsPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);
  if (!vault.unlocked) return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} returnTo="/panel/statistics" /></Dashboard></AuthGuard>;
  const data = await getPracticeStatisticsData();

  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><header className="mb-6 rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)] sm:p-8"><p className="text-sm text-gray-500">Spokojny obraz pracy gabinetu</p><h1 className="mt-1 text-3xl font-bold text-[#2D4739]">Statystyki i kwoty</h1><p className="mt-2 max-w-3xl text-gray-600">Miesięczne i roczne podsumowania wizyt, odwołań, gabinetów oraz orientacyjnych kwot wpisanych przy wizytach.</p></header><PracticeStatistics data={data} /></div></Dashboard></AuthGuard>;
}
