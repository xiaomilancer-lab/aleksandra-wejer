import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import SelfCareHub from "../components/self-care/SelfCareHub";

export default function SelfCarePage() {
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><SelfCareHub /></div></Dashboard></AuthGuard>;
}
