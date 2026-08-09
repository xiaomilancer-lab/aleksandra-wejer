import type { TimelineEvent } from "../../types/timeline";
import TimelineCard from "./TimelineCard";
import TimelineDate from "./TimelineDate";

interface TimelineGroupProps {
  date: string;
  events: TimelineEvent[];
}

export default function TimelineGroup({ date, events }: TimelineGroupProps) {
  return (
    <section>
      <TimelineDate date={date} />
      <div className="mt-4">{events.map((event, index) => <TimelineCard key={event.id} event={event} isLast={index === events.length - 1} />)}</div>
    </section>
  );
}
