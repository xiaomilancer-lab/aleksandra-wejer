interface CalendarDayProps {
  day: number;
}

interface CalendarDayProps {
  day: number;
  selected: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  day,
  selected,
  onClick,
}: CalendarDayProps) {
  return (
    <button
  onClick={onClick}
      className={`
  flex
  h-14
  items-center
  justify-center
  rounded-xl
  border
  font-semibold
  transition

  ${
    selected
      ? "border-green-600 bg-green-600 text-white"
      : "border-gray-200 bg-white text-[#2D4739] hover:border-[#6D7A62] hover:bg-[#F8F5F0]"
  }
`}
    >
      {day}
    </button>
  );
}