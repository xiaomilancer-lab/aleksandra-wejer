import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PersonalGrowthDashboard from "../components/PersonalGrowthDashboard";
import { getPersonalGrowthData } from "../services/personalGrowthService";

export default async function GrowthPage() {
  await connection();
  const data = await getPersonalGrowthData();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><PersonalGrowthDashboard data={data} /></div></Dashboard></AuthGuard>;
}
