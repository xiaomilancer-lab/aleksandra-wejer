interface StepLocationProps {
  selectedLocation: string | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<string | null>>;
}
import LocationCard from "./components/LocationCard";
import { locations } from "./location";

export default function StepLocation({
  selectedLocation,
  setSelectedLocation,
}: StepLocationProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {locations.map((location) => (
        <LocationCard
  key={location.id}
  location={location}
  selected={selectedLocation === location.id}
  onSelect={() => setSelectedLocation(location.id)}
/>
      ))}
    </div>
  );
}