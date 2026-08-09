import type { TimelineEvent } from "../../types/timeline";
import { groupTimelineByDay } from "../../utils/groupTimelineByDay";
import { sortTimeline } from "../../utils/sortTimeline";
import TimelineEmpty from "./TimelineEmpty";
import TimelineGroup from "./TimelineGroup";
import TimelineHeader from "./TimelineHeader";

interface PatientTimelineProps {
  events: TimelineEvent[];
}

export default function PatientTimeline({ events }: PatientTimelineProps) {
  const groupedEvents = groupTimelineByDay(sortTimeline(events));

  return (
    <section className="rounded-3xl border border-[#E5E1D8] bg-white p-6 shadow-[0_12px_35px_rgba(45,71,57,0.06)]">
      <TimelineHeader />
      {events.length === 0 ? (
        <TimelineEmpty />
      ) : (
        <div className="mt-6 space-y-7">
          {Object.entries(groupedEvents).map(([date, dayEvents]) => (
            <TimelineGroup key={date} date={date} events={dayEvents} />
          ))}
        </div>
      )}
    </section>
  );
}
