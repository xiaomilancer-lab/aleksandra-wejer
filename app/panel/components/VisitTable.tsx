import { supabaseAdmin } from "@/lib/supabase-admin";
import VisitTableClient from "./VisitTableClient";
import { getTemplates } from "../services/assistantService";

export default async function VisitTable() {
  const [{ data: visits, error }, templates] = await Promise.all([supabaseAdmin
    .from("bookings")
    .select("*")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true }), getTemplates()]);

  if (error) {
  return (
    <div className="rounded-2xl bg-red-50 p-6 text-red-600">
      Nie udało się pobrać wizyt.
    </div>
  );
}

return <VisitTableClient visits={visits ?? []} templates={templates} />;
}
