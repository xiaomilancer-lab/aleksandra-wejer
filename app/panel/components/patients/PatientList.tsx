"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Patient } from "../../types/patient";
import EmptyPatients from "./EmptyPatients";
import PatientRow from "./PatientRow";

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pl-PL");

    if (!normalizedQuery) {
      return patients;
    }

    return patients.filter((patient) =>
      [patient.name, patient.phone ?? "", patient.email ?? ""].some((value) =>
        value.toLocaleLowerCase("pl-PL").includes(normalizedQuery)
      )
    );
  }, [patients, query]);

  return (
    <div className="mt-8">
      <label className="relative block">
        <span className="sr-only">Szukaj pacjenta</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} aria-hidden="true" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Szukaj pacjenta..." className="w-full rounded-2xl border border-[#E5E1D8] bg-white py-3.5 pl-11 pr-4 text-[#2D4739] outline-none transition focus:border-[#6D7A62] focus:ring-4 focus:ring-[#EEF1EB]" />
      </label>

      {filteredPatients.length === 0 ? <EmptyPatients hasPatients={patients.length > 0} /> : (
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
          {filteredPatients.map((patient) => <PatientRow key={patient.id} patient={patient} />)}
        </div>
      )}
    </div>
  );
}
