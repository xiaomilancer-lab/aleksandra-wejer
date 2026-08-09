import type { TimelineEvent } from "../types/timeline";

export function sortTimeline(events: TimelineEvent[]): TimelineEvent[] {
  return [...events].sort(
    (first, second) =>
      new Date(second.created_at).getTime() - new Date(first.created_at).getTime()
  );
}
