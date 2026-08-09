import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import AvailabilityStudio from "../components/AvailabilityStudio";

export default function AvailabilityPage() {
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><AvailabilityStudio /></div></Dashboard></AuthGuard>;
}
