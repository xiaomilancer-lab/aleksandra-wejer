import { CalendarDays, FileText, Heart, NotebookText, Star, Target } from "lucide-react";

interface PatientStatisticsProps {
  visitsCount: number;
  notesCount: number;
  tasksCount: number;
  lastActivity: string;
}

const statDefinitions = [
  { label: "Liczba wizyt", icon: CalendarDays },
  { label: "Liczba notatek", icon: NotebookText },
  { label: "Dokumenty", icon: FileText },
  { label: "Zadania", icon: Target },
  { label: "Opinie", icon: Star },
  { label: "Ostatnia aktywność", icon: Heart },
];

export default function PatientStatistics({
  visitsCount,
  notesCount,
  tasksCount,
  lastActivity,
}: PatientStatisticsProps) {
  const values = [String(visitsCount), String(notesCount), "0", String(tasksCount), "0", lastActivity];

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {statDefinitions.map(({ label, icon: Icon }, index) => (
        <section key={label} className="rounded-2xl border border-[#E5E1D8] bg-white p-5 shadow-[0_8px_24px_rgba(45,71,57,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className={`mt-2 font-bold tracking-tight text-[#2D4739] ${index === 5 ? "text-base" : "text-3xl"}`}>
                {values[index]}
              </p>
            </div>
            <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]">
              <Icon size={18} aria-hidden="true" />
            </span>
          </div>
        </section>
      ))}
    </div>
  );
}
