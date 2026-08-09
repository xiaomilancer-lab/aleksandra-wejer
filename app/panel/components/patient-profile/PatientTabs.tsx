"use client";

export type PatientWorkspaceTab = "visits" | "notes" | "documents" | "tasks" | "reviews" | "history" | "journey" | "summary" | "reflection" | "patient-journey" | "followups";

interface PatientTabsProps {
  activeTab: PatientWorkspaceTab;
  onTabChange: (tab: PatientWorkspaceTab) => void;
}

const tabs: { id: PatientWorkspaceTab; label: string }[] = [
  { id: "visits", label: "Wizyty" },
  { id: "notes", label: "Notatki" },
  { id: "documents", label: "Dokumenty" },
  { id: "tasks", label: "Zadania" },
  { id: "reviews", label: "Opinie" },
  { id: "history", label: "Historia" },
  { id: "journey", label: "🌿 Przebieg terapii" },
  { id: "summary", label: "Historia współpracy" },
  { id: "reflection", label: "🌿 Refleksja" },
  { id: "patient-journey", label: "Moja droga" },
  { id: "followups", label: "Follow-up" },
];

export default function PatientTabs({ activeTab, onTabChange }: PatientTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-[#E5E1D8]">
      <div className="flex min-w-max gap-1" role="tablist" aria-label="Obszary pracy pacjenta">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "border-[#6D7A62] text-[#2D4739]"
                : "border-transparent text-gray-500 hover:text-[#2D4739]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
