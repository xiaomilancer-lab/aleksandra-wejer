"use client";

import VisitDrawerHeader from "./VisitDrawerHeader";
import VisitDrawerBody from "./VisitDrawerBody";
import VisitDrawerFooter from "./VisitDrawerFooter";
import type { Visit } from "../types/visit";
import type { AssistantTemplate } from "../domain";

interface VisitDrawerProps {
  open: boolean;
  onClose: () => void;
  visit: Visit | null;
  selectedStatus: string;
  onSave: () => void;
  saving: boolean;
  onStatusChange: (status: string) => void;
  templates: AssistantTemplate[];
}

export default function VisitDrawer({
  open,
  onClose,
  visit,
  selectedStatus,
  onSave,
  saving,
  onStatusChange,
  templates,
}: VisitDrawerProps) {

  console.log("VisitDrawer:", visit);

  return (
    <div
      className={`
        fixed
        top-0
        right-0
        h-screen
        w-[500px]
        bg-white
        flex
        flex-col
        shadow-2xl
        border-l
        border-gray-200
        transition-transform
        duration-300
        z-50
        ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
    >
      <VisitDrawerHeader onClose={onClose} />

      <div className="min-h-0 flex-1 overflow-y-auto">
      <VisitDrawerBody
    key={visit?.id ?? "empty"}
    visit={visit}
    selectedStatus={selectedStatus}
    onStatusChange={onStatusChange}
    templates={templates}
/>

      <VisitDrawerFooter
  onSave={onSave}
  saving={saving}
/>
      </div>
      
    </div>
  );
}
