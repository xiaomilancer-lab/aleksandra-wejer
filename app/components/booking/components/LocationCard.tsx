import Image from "next/image";
import { Location } from "../types";

interface LocationCardProps {
  location: Location;
  selected: boolean;
  onSelect: () => void;
}

export default function LocationCard({
  location,
  selected,
  onSelect,
}: LocationCardProps) {
  return (
  <div
    onClick={onSelect}
    className={`overflow-hidden rounded-3xl border bg-white shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-2xl ${
      selected
        ? "border-green-600 ring-2 ring-green-200"
        : "border-gray-200"
    }`}
  >

      <div className="relative h-56 w-full">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="space-y-4 p-6">

        <div>
          <h3 className="text-xl font-semibold text-[#2D4739]">
            {location.name}
          </h3>

          <p className="mt-2 text-gray-600">
            {location.street}
            <br />
            {location.city}
          </p>
        </div>

        <div className="flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-green-500"></div>

          <span className="text-sm font-medium text-green-700">
            Dostępne terminy
          </span>

        </div>

        <button
  className={`w-full rounded-xl px-5 py-3 font-medium text-white transition-all duration-300 ${
    selected
      ? "bg-green-700 hover:bg-green-800"
      : "bg-[#6D7A62] hover:bg-[#5A6651]"
  }`}
>
  {selected ? "✓ Wybrano lokalizację" : "Wybierz lokalizację"}
</button>

      </div>

    </div>
  );
}