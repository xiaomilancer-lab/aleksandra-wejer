"use client";

import { BookOpen, CalendarClock, CalendarDays, CalendarHeart, ClipboardList, Flower2, FolderKanban, House, Menu, Settings, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/panel", label: "Pulpit", icon: CalendarDays },
  { href: "/panel/visits", label: "Wizyty", icon: ClipboardList },
  { href: "/panel/patients", label: "Pacjenci", icon: Users },
  { href: "/panel/users", label: "Użytkownicy", icon: UserRound },
  { href: "/panel/availability", label: "Grafik i dostępność", icon: CalendarClock },
  { href: "/panel/templates", label: "Szablony", icon: FolderKanban },
  { href: "/panel/library", label: "Biblioteka", icon: BookOpen },
  { href: "/panel/important-dates", label: "Ważne daty", icon: CalendarHeart },
  { href: "/panel/self-care", label: "Chwila dla siebie", icon: Flower2 },
  { href: "/panel/settings", label: "Ustawienia", icon: Settings },
  { href: "/", label: "Strona główna", icon: House },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header data-panel-mobile-header className="sticky top-0 z-40 flex w-full min-w-0 max-w-full items-center justify-between border-b border-[#E5E1D8] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="min-w-0"><p className="truncate font-bold text-[#2D4739]">Gabinet Aleksandry</p><p className="text-xs text-gray-500">Panel pracy</p></div>
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Otwórz menu panelu" aria-expanded={mobileOpen} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E1D8] text-[#2D4739]"><Menu size={22} aria-hidden="true" /></button>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" className="absolute inset-0 bg-[#1F3028]/45" aria-label="Zamknij menu panelu" onClick={() => setMobileOpen(false)} /><aside className="absolute inset-y-0 right-0 flex w-[min(88vw,340px)] flex-col overflow-y-auto bg-white p-5 shadow-2xl"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-[#2D4739]">Gabinet</h2><p className="mt-1 text-sm text-gray-500">Aleksandra Wejer</p></div><button type="button" onClick={() => setMobileOpen(false)} aria-label="Zamknij menu panelu" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E1D8] text-[#2D4739]"><X size={21} aria-hidden="true" /></button></div><nav className="mt-7 flex flex-1 flex-col gap-2">{navItems.map((item) => <NavLink key={item.href} {...item} active={isActivePath(pathname, item.href)} onClick={() => setMobileOpen(false)} />)}</nav><div className="mt-6"><LogoutButton /></div></aside></div>}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[#E5E1D8] bg-white p-6 shadow-sm lg:flex"><div><h2 className="text-2xl font-bold text-[#2D4739]">Gabinet</h2><p className="mt-2 text-sm text-gray-500">Aleksandra Wejer</p></div><nav className="mt-10 flex flex-1 flex-col gap-2">{navItems.map((item) => <NavLink key={item.href} {...item} active={isActivePath(pathname, item.href)} />)}<div className="mt-auto"><LogoutButton /></div></nav></aside>
    </>
  );
}

function NavLink({ href, label, icon: Icon, active, onClick }: (typeof navItems)[number] & { active: boolean; onClick?: () => void }) {
  return <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 ${active ? "bg-[#EEF1EB] text-[#2D4739]" : "text-[#2D4739] hover:bg-[#F8F5F0] hover:text-[#6D7A62]"}`}><Icon size={18} aria-hidden="true" />{label}</Link>;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return href === "/panel" ? pathname === href : pathname.startsWith(href);
}
