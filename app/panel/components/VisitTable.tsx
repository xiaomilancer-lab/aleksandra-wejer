import { supabaseAdmin } from "@/lib/supabase-admin";

export default async function VisitTable() {
  const { data: visits, error } = await supabaseAdmin
    .from("bookings")
    .select("*")
    .order("visit_date", { ascending: true })
    .order("visit_time", { ascending: true });

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-600">
        Nie udało się pobrać wizyt.
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold text-[#2D4739]">
        📅 Wszystkie wizyty
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="border-b">

              <th className="p-3 text-left">#</th>

              <th className="p-3 text-left">Data</th>

              <th className="p-3 text-left">Godzina</th>

              <th className="p-3 text-left">Pacjent</th>

              <th className="p-3 text-left">Telefon</th>

              <th className="p-3 text-left">Lokalizacja</th>

              <th className="p-3 text-left">Status</th>

            </tr>

          </thead>

          <tbody>

            {visits?.map((visit, index) => (
              <tr
  key={visit.id}
  className="cursor-pointer border-b transition hover:bg-[#F8F5F0]"
>

<td className="p-3 text-center">
  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#6D7A62] text-sm font-bold text-white">
    {index + 1}
  </div>
</td>


                <td className="p-3">
  <div className="font-semibold capitalize">
    {new Date(`${visit.visit_date}T12:00:00`).toLocaleDateString("pl-PL", {
      weekday: "long",
    })}
  </div>

  <div className="text-sm text-gray-500">
    {new Date(`${visit.visit_date}T12:00:00`).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </div>
</td>

                <td className="p-3 text-xl font-bold text-[#2D4739]">
  {visit.visit_time}
</td>

                <td className="p-3 font-semibold">
                  {visit.name}
                </td>

                <td className="p-3">
                  {visit.phone}
                </td>

                <td className="p-3">
                  {visit.location}
                </td>

                <td className="p-3">
  <span
    className={`rounded-full px-3 py-1 text-sm font-semibold
      ${
        visit.status === "Nowe"
          ? "bg-blue-100 text-blue-700"
          : visit.status === "Potwierdzone"
          ? "bg-green-100 text-green-700"
          : visit.status === "Odwołane"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }`}
  >
    {visit.status}
  </span>
</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}