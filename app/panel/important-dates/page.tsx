import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import ImportantDatesManager from "../components/important-dates/ImportantDatesManager";
import { getImportantDateOccurrences, getImportantDates } from "../services/importantDateService";

export default async function ImportantDatesPage() {
  await connection();
  const items = await getImportantDates();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><ImportantDatesManager initialOccurrences={getImportantDateOccurrences(items)} /></div></Dashboard></AuthGuard>;
}
