import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import AccountSecuritySettings from "../components/AccountSecuritySettings";
import PsycholkaSettings from "../components/PsycholkaSettings";
import { requirePsychologist } from "../server/requirePsychologist";

export default async function SettingsPage() {
  const identity = await requirePsychologist();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-4xl"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Ustawienia</p><h1 className="mt-2 text-3xl font-bold text-[#2D4739]">Twoje ustawienia</h1><div className="mt-7"><PsycholkaSettings /><AccountSecuritySettings email={identity.email ?? ""} /></div></div></Dashboard></AuthGuard>;
}
