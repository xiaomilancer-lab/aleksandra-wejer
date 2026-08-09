import type { TimelineEvent } from "../../types/timeline";
import TimelineIcon from "./TimelineIcon";

interface TimelineCardProps {
  event: TimelineEvent;
  isLast: boolean;
}

export default function TimelineCard({ event, isLast }: TimelineCardProps) {
  const time = new Date(event.created_at).toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && <div className="absolute bottom-0 left-5 top-10 w-px bg-[#E5E1D8]" />}
      <TimelineIcon type={event.event_type} />
      <div className="min-w-0 flex-1 rounded-2xl bg-[#F8F5F0] p-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3 className="font-semibold text-[#2D4739]">{event.title}</h3>
          <time dateTime={event.created_at} className="shrink-0 text-xs text-gray-500">{time}</time>
        </div>
        {event.description && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{event.description}</p>}
      </div>
    </article>
  );
}
