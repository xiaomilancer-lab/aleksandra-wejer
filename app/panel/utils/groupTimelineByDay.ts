import type { TimelineEvent } from "../types/timeline";

export function groupTimelineByDay(
  events: TimelineEvent[]
): Record<string, TimelineEvent[]> {
  return events.reduce<Record<string, TimelineEvent[]>>((groups, event) => {
    const dateKey = event.created_at.slice(0, 10);
    groups[dateKey] ??= [];
    groups[dateKey].push(event);
    return groups;
  }, {});
}
