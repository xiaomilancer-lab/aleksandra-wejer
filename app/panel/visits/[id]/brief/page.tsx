import { notFound } from "next/navigation";
import { connection } from "next/server";
import AuthGuard from "../../../components/AuthGuard";
import Dashboard from "../../../components/Dashboard";
import VisitBrief from "../../../components/VisitBrief";
import { getVisitSessionData } from "../../../services/visitSessionService";

export default async function VisitBriefPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ full?: string }> }) {
  await connection(); const [{ id }, { full }] = await Promise.all([params, searchParams]); const visitId = Number(id); if (!Number.isInteger(visitId) || visitId < 1) notFound(); const data = await getVisitSessionData(visitId); if (!data) notFound();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-4xl"><VisitBrief visit={data.visit} selectedStatus={data.visit.status} onShowDetails={() => undefined} focusMode={full !== "1"} /></div></Dashboard></AuthGuard>;
}
