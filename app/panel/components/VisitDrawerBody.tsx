import type { Visit } from "../types/visit";
import { formatDate } from "../utils/formatDate";
import StatusSelect from "./StatusSelect";
import VisitAssistantPreparation from "./VisitAssistantPreparation";
import VisitReflectionForm from "./VisitReflectionForm";
import VisitBrief from "./VisitBrief";
import type { AssistantTemplate } from "../domain";
import { useState } from "react";

interface Props {
  visit: Visit | null;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  templates: AssistantTemplate[];
}

export default function VisitDrawerBody({
  visit,
  selectedStatus,
  onStatusChange,
  templates,
}: Props) {
  const [activeTab, setActiveTab] = useState<"brief" | "details" | "preparation">("brief");

  if (!visit) {
    return (
      <div className="p-6 text-gray-500">
        Wybierz wizytę z tabeli.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex border-b border-[#E5E1D8]">
        <button type="button" onClick={() => setActiveTab("brief")} className={`border-b-2 px-3 py-2 text-sm font-semibold ${activeTab === "brief" ? "border-[#6D7A62] text-[#2D4739]" : "border-transparent text-gray-500"}`}>Brief</button>
        <button type="button" onClick={() => setActiveTab("details")} className={`border-b-2 px-3 py-2 text-sm font-semibold ${activeTab === "details" ? "border-[#6D7A62] text-[#2D4739]" : "border-transparent text-gray-500"}`}>Szczegóły</button>
        <button type="button" onClick={() => setActiveTab("preparation")} className={`border-b-2 px-3 py-2 text-sm font-semibold ${activeTab === "preparation" ? "border-[#6D7A62] text-[#2D4739]" : "border-transparent text-gray-500"}`}>🌿 Przygotowanie</button>
      </div>
      {activeTab === "brief" ? <VisitBrief visit={visit} selectedStatus={selectedStatus} templates={templates} onShowDetails={() => setActiveTab("details")} /> : activeTab === "preparation" ? <VisitAssistantPreparation key={visit.id} visit={visit} templates={templates} /> : <div className="space-y-6">

      <div className="rounded-2xl bg-[#F8F5F0] p-5">

        <h3 className="font-bold text-[#2D4739]">
          👤 Pacjent
        </h3>

        <div className="mt-4 space-y-2">

          <p>
            <strong>{visit.name}</strong>
          </p>

          <p>📞 {visit.phone}</p>

          <p>📧 {visit.email}</p>

        </div>

      </div>

      <div className="rounded-2xl bg-[#F8F5F0] p-5">

        <h3 className="font-bold text-[#2D4739]">
          📅 Termin
        </h3>

        <div className="mt-4 space-y-2">

          <p>
            {formatDate(visit.visit_date)}
          </p>

          <p>🕒 {visit.visit_time}</p>

          <p>📍 {visit.location}</p>

        </div>

        <div className="rounded-2xl bg-[#F8F5F0] p-5">

  <h3 className="font-bold text-[#2D4739]">
    ✅ Status wizyty
  </h3>

  <StatusSelect
  value={selectedStatus}
  onChange={onStatusChange}
/>

</div>

      </div>

      <div className="rounded-2xl bg-[#F8F5F0] p-5">

        <h3 className="font-bold text-[#2D4739]">
          📝 Opis zgłoszenia
        </h3>

        <p className="mt-4 whitespace-pre-wrap text-gray-700">
          {visit.message || "Brak opisu."}
        </p>

      </div>

      {selectedStatus === "Zrealizowane" && <VisitReflectionForm key={visit.id} visit={visit} />}

      {selectedStatus === "Zrealizowane" && (
        <div className="rounded-2xl bg-[#F8F5F0] p-5">

          <h3 className="font-bold text-[#2D4739]">
            ⭐ Opinia po wizycie
          </h3>

          <div className="mt-4 space-y-4">

            <p className="text-gray-700">
              Status: <span className="font-semibold">Nie wysłano</span>
            </p>

            <p className="text-sm text-gray-600">
              Po zakończonej terapii lub konsultacji możesz wysłać pacjentowi
              wiadomość z prośbą o ocenę wizyty.
            </p>

            <div className="space-y-3">

              <button
                type="button"
                onClick={() => {
                  // TODO: Send Google review request.
                }}
                className="w-full rounded-xl bg-[#6D7A62] px-4 py-3 text-left font-semibold text-white transition hover:bg-[#58644F]"
              >
                ⭐ Poproś o opinię Google
              </button>

              <button
                type="button"
                onClick={() => {
                  // TODO: Send feedback form.
                }}
                className="w-full rounded-xl bg-white px-4 py-3 text-left font-semibold text-[#2D4739] transition hover:bg-[#EFE9DF]"
              >
                💬 Wyślij formularz opinii
              </button>

            </div>

          </div>

        </div>
      )}

      </div>}
    </div>
  );
}
