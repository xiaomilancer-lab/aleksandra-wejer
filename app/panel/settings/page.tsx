import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import PsycholkaSettings from "../components/PsycholkaSettings";
export default function SettingsPage() { return <AuthGuard><Dashboard><div className="mx-auto max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Ustawienia</p><h1 className="mt-2 text-3xl font-bold text-[#2D4739]">Twoje ustawienia</h1><div className="mt-7"><PsycholkaSettings /></div></div></Dashboard></AuthGuard>; }
