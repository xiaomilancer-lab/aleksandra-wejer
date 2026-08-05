import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function Stats() {
  const today = new Date().toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowString = tomorrow.toISOString().split("T")[0];

  const { count: todayCount } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("visit_date", today);

  const { count: tomorrowCount } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("visit_date", tomorrowString);

  const { count: totalCount } = await supabaseAdmin
    .from("bookings")
    .select("*", { count: "exact", head: true });

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm text-gray-500">
          📅 Dzisiaj
        </div>

        <div className="mt-2 text-4xl font-bold text-[#2D4739]">
          {todayCount ?? 0}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm text-gray-500">
          📆 Jutro
        </div>

        <div className="mt-2 text-4xl font-bold text-[#2D4739]">
          {tomorrowCount ?? 0}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="text-sm text-gray-500">
          👥 Wszystkie wizyty
        </div>

        <div className="mt-2 text-4xl font-bold text-[#2D4739]">
          {totalCount ?? 0}
        </div>
      </div>

    </div>
  );
}