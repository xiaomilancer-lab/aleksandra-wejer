interface CalendarHeaderProps {
  month: string;
  year: number;
}

export default function CalendarHeader({
  month,
  year,
}: CalendarHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <button
        className="rounded-xl border border-gray-200 px-4 py-2 transition hover:bg-gray-100"
      >
        ←
      </button>

      <h3 className="text-2xl font-bold text-[#2D4739]">
        {month} {year}
      </h3>

      <button
        className="rounded-xl border border-gray-200 px-4 py-2 transition hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}