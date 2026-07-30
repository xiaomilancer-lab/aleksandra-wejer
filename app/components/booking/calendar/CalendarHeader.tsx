const monthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];

interface CalendarHeaderProps {
  month: number;
  year: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
}

export default function CalendarHeader({
  month,
  year,
  onPrevious,
  onNext,
  canGoPrevious,
}: CalendarHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className="rounded-xl border border-gray-200 px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ←
      </button>

      <h3 className="text-2xl font-bold text-[#2D4739]">
        {monthNames[month]} {year}
      </h3>

      <button
        onClick={onNext}
        className="rounded-xl border border-gray-200 px-4 py-2 transition hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}