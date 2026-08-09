import {
  CalendarDays,
  FileText,
  Mail,
  NotebookText,
  Star,
  Target,
  UserRound,
} from "lucide-react";
import type { TimelineEventType } from "../../types/timeline";

interface TimelineIconProps {
  type: TimelineEventType;
}

const iconStyles: Record<TimelineEventType, { icon: typeof CalendarDays; color: string }> = {
  visit_created: { icon: CalendarDays, color: "bg-blue-100 text-blue-700" },
  visit_completed: { icon: CalendarDays, color: "bg-emerald-100 text-emerald-700" },
  status_changed: { icon: CalendarDays, color: "bg-sky-100 text-sky-700" },
  note_created: { icon: NotebookText, color: "bg-violet-100 text-violet-700" },
  note_updated: { icon: NotebookText, color: "bg-violet-100 text-violet-700" },
  task_created: { icon: Target, color: "bg-amber-100 text-amber-700" },
  task_completed: { icon: Target, color: "bg-emerald-100 text-emerald-700" },
  document_added: { icon: FileText, color: "bg-orange-100 text-orange-700" },
  review_sent: { icon: Star, color: "bg-yellow-100 text-yellow-700" },
  review_received: { icon: Star, color: "bg-yellow-100 text-yellow-700" },
  email_sent: { icon: Mail, color: "bg-cyan-100 text-cyan-700" },
  patient_created: { icon: UserRound, color: "bg-[#EEF1EB] text-[#6D7A62]" },
};

export default function TimelineIcon({ type }: TimelineIconProps) {
  const { icon: Icon, color } = iconStyles[type];

  return (
    <span className={`relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon size={19} aria-hidden="true" />
    </span>
  );
}
