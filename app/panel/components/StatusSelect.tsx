"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function StatusSelect({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        mt-3
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        p-3
        text-[#2D4739]
      "
    >
      <option>Nowe</option>

      <option>Potwierdzone</option>

      <option>Zrealizowane</option>

      <option>Odwołane</option>

      <option>Nie pojawił się</option>
    </select>
  );
}