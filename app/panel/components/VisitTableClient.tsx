"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import VisitDrawer from "./VisitDrawer";
import Toast from "./Toast";
import StatusBadge from "./StatusBadge";
import type { Visit } from "../types/visit";
import type { AssistantTemplate } from "../domain";
import { updateBooking } from "../services/bookingService";

interface VisitTableClientProps {
  visits: Visit[];
  templates: AssistantTemplate[];
}

export default function VisitTableClient({
  visits,
  templates,
}: VisitTableClientProps) {

  const [drawerOpen, setDrawerOpen] = useState(true);

  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const [selectedStatus, setSelectedStatus] = useState("");

  const router = useRouter();

  const [showToast, setShowToast] = useState(false);

  const [saving, setSaving] = useState(false);

console.log("selectedVisit:", selectedVisit);

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow">

      <h2 className="mb-6 text-2xl font-bold text-[#2D4739]">
        📅 Wszystkie wizyty
      </h2>

      <div className="overflow-x-auto">

  <table className="w-full border-collapse">

    <thead>

      <tr className="border-b">

        <th className="p-3 text-left">Pacjent</th>

        <th className="p-3 text-left">Godzina</th>

        <th className="p-3 text-left">Status</th>

      </tr>

    </thead>

    <tbody>

      {visits.map((visit) => (

        <tr
          key={visit.id}
          onClick={() => {
  setSelectedVisit(visit);
  setSelectedStatus(visit.status);
  setDrawerOpen(true);
}}
          className="cursor-pointer border-b transition hover:bg-[#F8F5F0]"
        >

          <td className="p-3 font-semibold">
            {visit.name}
          </td>

          <td className="p-3">
            {visit.visit_time}
          </td>

          <td className="p-3">
            <StatusBadge status={visit.status} />
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

      <VisitDrawer
  visit={selectedVisit}
  selectedStatus={selectedStatus}
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  onStatusChange={(status) => {
    setSelectedStatus(status);
  }}
  onSave={async () => {

    if (!selectedVisit) return;

    setSaving(true);

    const result = await updateBooking(selectedVisit.id, selectedStatus);

console.log(result);

setShowToast(true);

setTimeout(() => {
  setDrawerOpen(false);

  router.refresh();

  setShowToast(false);
}, 1200);

setDrawerOpen(false);

router.refresh();

setSaving(false);

  }}
  saving={saving}
  templates={templates}
/>

<Toast
        show={showToast}
        message="Zmiany zapisane"
      />

    </div>
  );
}
