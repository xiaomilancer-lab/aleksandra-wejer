interface CalendarDayProps {
  day: number;
  available: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  day,
  available,
  selected,
  onClick,
}: CalendarDayProps) {
  return (
    <button
  disabled={!available}
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
    !available
      ? "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-400"
      : selected
      ? "border-green-600 bg-green-600 text-white"
      : "border-gray-200 bg-white text-[#2D4739] hover:border-[#6D7A62] hover:bg-[#F8F5F0]"
  }
`}
    >
      {day}
    </button>
  );
}