import { SearchX, UserRoundPlus } from "lucide-react";

interface EmptyPatientsProps {
  hasPatients?: boolean;
}

export default function EmptyPatients({ hasPatients = false }: EmptyPatientsProps) {
  const Icon = hasPatients ? SearchX : UserRoundPlus;
  const message = hasPatients
    ? "Nie znaleziono pacjentów pasujących do wyszukiwania."
    : "Nie masz jeszcze żadnych pacjentów.";

  return (
    <div className="mt-5 rounded-3xl border border-dashed border-[#D9DDD3] bg-white px-6 py-12 text-center">
      <span className="inline-flex rounded-2xl bg-[#EEF1EB] p-3 text-[#6D7A62]">
        <Icon size={24} aria-hidden="true" />
      </span>
      <p className="mt-4 font-semibold text-[#2D4739]">{message}</p>
    </div>
  );
}
