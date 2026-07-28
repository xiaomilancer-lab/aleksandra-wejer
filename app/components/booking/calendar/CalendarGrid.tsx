import { weekDays } from "./constants/weekDays";
import CalendarDay from "./CalendarDay";
import {
  generateMonthDays,
  getFirstDayOfMonth,
} from "./monthHelpers";
import { availableWeekDays } from "./constants/availableWeekDays";

interface CalendarGridProps {
  selectedLocation: string;
  selectedDay: number | null;
  setSelectedDay: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}

export default function CalendarGrid({
  selectedLocation,
  selectedDay,
  setSelectedDay,
}: CalendarGridProps) {
  const days = generateMonthDays(2026, 6);
  const firstDay = getFirstDayOfMonth(2026, 6);
  const allowedWeekDays =
  availableWeekDays[selectedLocation] ?? [];

  return (
    <>
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="rounded-xl bg-[#F8F5F0] py-3 text-center font-semibold text-[#2D4739]"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-3">
  {Array.from({ length: firstDay }).map((_, index) => (
    <div key={`empty-${index}`} />
  ))}

  {days.map((day) => {
    const weekDay = new Date(2026, 6, day).getDay();

    const available = allowedWeekDays.includes(weekDay);

    return (
      <CalendarDay
        key={day}
        day={day}
        available={available}
        selected={selectedDay === day}
        onClick={() => {
          if (available) {
            setSelectedDay(day);
          }
        }}
      />
    );
  })}
</div>
    </>
  );
}