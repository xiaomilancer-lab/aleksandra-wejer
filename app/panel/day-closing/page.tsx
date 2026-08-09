import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import DayClosingView from "../components/DayClosingView";
import PsycholkaMemoryDayClosing from "../components/PsycholkaMemoryDayClosing";
import HeartMessageEngine from "../components/HeartMessageEngine";
import { getDayClosingSummary } from "../services/dashboardService";

export default async function DayClosingPage() {
  await connection();
  const summary = await getDayClosingSummary();
  return <AuthGuard><Dashboard><PsycholkaMemoryDayClosing isComplete={summary.closureItems.length === 0} />{summary.closureItems.length === 0 && <div className="mx-auto max-w-3xl"><HeartMessageEngine eventKey="day-closing" trigger={summary.date} className="mb-4" /></div>}<DayClosingView summary={summary} /></Dashboard></AuthGuard>;
}
