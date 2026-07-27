import { weekDays } from "./constants/weekDays";

export default function CalendarGrid() {
  return (
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
  );
}