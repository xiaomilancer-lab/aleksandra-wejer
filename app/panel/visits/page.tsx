import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import VisitOrganizer from "../components/visits/VisitOrganizer";
import { getVisitOrganizerData } from "../services/visitOrganizerService";

export default async function VisitsPage() {
  await connection();
  const data = await getVisitOrganizerData();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><VisitOrganizer initialVisits={data.visits} classificationAvailable={data.classificationAvailable} /></div></Dashboard></AuthGuard>;
}
