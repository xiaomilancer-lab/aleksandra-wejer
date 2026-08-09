import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PatientList from "../components/patients/PatientList";
import type { Patient } from "../domain";
import { getPatients } from "../services/patientService";

export default async function PatientsPage() {
  await connection();

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
        <h1 className="text-4xl font-bold text-[#2D4739]">Pacjenci</h1>
        <p className="mt-3 text-gray-600">W tym miejscu znajdziesz wszystkie karty pacjentów.</p>

        {loadError ? (
          <div className="mt-8 rounded-3xl border border-[#E5E1D8] bg-[#FFF9EE] p-6 text-[#7A6540]">
            Lista pacjentów jest chwilowo niedostępna. Spróbuj ponownie za moment.
          </div>
        ) : (
          <PatientList patients={patients} />
        )}
      </Dashboard>
    </AuthGuard>
  );
}
