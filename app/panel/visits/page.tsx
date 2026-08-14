import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import VisitOrganizer from "../components/visits/VisitOrganizer";
import { getVisitOrganizerData } from "../services/visitOrganizerService";
import { getPatients } from "../services/patientService";

export default async function VisitsPage() {
  await connection();
  const [data, patients] = await Promise.all([getVisitOrganizerData(), getPatients()]);
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><VisitOrganizer initialVisits={data.visits} classificationAvailable={data.classificationAvailable} patients={patients} /></div></Dashboard></AuthGuard>;
}
