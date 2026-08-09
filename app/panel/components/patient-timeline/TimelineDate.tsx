interface TimelineDateProps {
  date: string;
}

export default function TimelineDate({ date }: TimelineDateProps) {
  return (
    <time dateTime={date} className="text-sm font-semibold capitalize text-[#2D4739]">
      {new Date(`${date}T12:00:00`).toLocaleDateString("pl-PL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </time>
  );
}
