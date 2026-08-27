import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PatientList from "../components/patients/PatientList";
import type { Patient } from "../domain";
import { getPatients } from "../services/patientService";
import { requirePsychologist } from "../server/requirePsychologist";
import { getPatientVaultState } from "../server/patientVault";
import PatientVaultGate from "./PatientVaultGate";

export default async function PatientsPage() {
  await connection();
  const identity = await requirePsychologist();
  const vault = await getPatientVaultState(identity.userId);

  if (!vault.unlocked) {
    return <AuthGuard><Dashboard><PatientVaultGate configured={vault.configured} lockedUntil={vault.lockedUntil} /></Dashboard></AuthGuard>;
  }

  let patients: Patient[] = [];
  let loadError = false;

  try {
    patients = await getPatients();
  } catch {
    loadError = true;
  }

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl"><div><h1 className="text-4xl font-bold text-[#2D4739]">Pacjenci</h1><p className="mt-3 text-gray-600">Twórz karty, przypisuj wizyty i zapisuj tylko informacje pomocne w dalszej pracy.</p></div>

        {loadError ? (
          <div className="mt-8 rounded-3xl border border-[#E5E1D8] bg-[#FFF9EE] p-6 text-[#7A6540]">
            Lista pacjentów jest chwilowo niedostępna. Spróbuj ponownie za moment.
          </div>
        ) : (
          <PatientList patients={patients} />
        )}
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
