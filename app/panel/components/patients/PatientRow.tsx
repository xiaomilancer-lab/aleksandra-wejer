"use client";

import { Mail, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Patient } from "../../types/patient";

interface PatientRowProps {
  patient: Patient;
}

export default function PatientRow({ patient }: PatientRowProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/panel/patients/${patient.id}`)}
      className="grid w-full gap-4 border-b border-[#EDEAE4] px-6 py-5 text-left last:border-b-0 hover:bg-[#FAFBF8] focus:outline-none focus-visible:bg-[#FAFBF8] md:grid-cols-[1.2fr_1fr_1fr] md:items-center"
    >
      <div className="flex items-center gap-3 font-semibold text-[#2D4739]">
        <span className="rounded-xl bg-[#EEF1EB] p-2 text-[#6D7A62]">
          <UserRound size={18} aria-hidden="true" />
        </span>
        {patient.name}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={16} className="text-[#6D7A62]" aria-hidden="true" />
        {patient.phone ?? "Brak telefonu"}
      </div>
      <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
        <Mail size={16} className="shrink-0 text-[#6D7A62]" aria-hidden="true" />
        <span className="truncate">{patient.email ?? "Brak e-maila"}</span>
      </div>
    </button>
  );
}
