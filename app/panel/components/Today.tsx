import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function Today() {
  const today = new Date().toISOString().split("T")[0];

  const { data: visits } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .eq("visit_date", today)
    .order("visit_time");

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold text-[#2D4739]">
        📅 Dzisiejsze wizyty
      </h2>

      <div className="mt-6 space-y-4">

        {visits?.length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow">
            Brak wizyt.
          </div>
        )}

        {visits?.map((visit) => (
          <div
            key={visit.id}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <div className="text-xl font-bold">

              {visit.visit_time}

            </div>

            <div className="mt-2 text-lg">

              {visit.name}

            </div>

            <div className="text-gray-500">

              {visit.phone}

            </div>

            <div className="mt-2 text-sm text-[#6D7A62]">

              {visit.location}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}