"use client";

import { VISIT_STATUSES } from "../domain/status";

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
      {VISIT_STATUSES.map((status) => <option key={status}>{status}</option>)}
    </select>
  );
}
