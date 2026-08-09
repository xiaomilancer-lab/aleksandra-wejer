import { notFound } from "next/navigation";
import { connection } from "next/server";
import AuthGuard from "../../../components/AuthGuard";
import VisitSession from "../../../components/VisitSession";
import { getVisitSessionData } from "../../../services/visitSessionService";

export default async function VisitSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const visitId = Number(id);
  if (!Number.isInteger(visitId) || visitId < 1) notFound();
  await connection();
  const data = await getVisitSessionData(visitId);
  if (!data) notFound();
  return <AuthGuard><VisitSession data={data} /></AuthGuard>;
}
