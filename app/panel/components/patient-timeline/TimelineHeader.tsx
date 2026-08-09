import { History } from "lucide-react";

export default function TimelineHeader() {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-xl bg-[#EEF1EB] p-2.5 text-[#6D7A62]"><History size={19} aria-hidden="true" /></span>
      <div><p className="text-sm text-gray-500">Przebieg współpracy</p><h2 className="font-bold text-[#2D4739]">Historia</h2></div>
    </div>
  );
}
