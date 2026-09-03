"use client";

import { BookOpen, Bot, CalendarClock, CalendarDays, CalendarHeart, ChartNoAxesCombined, CircleHelp, ClipboardList, Flower2, FolderKanban, House, Mail, Menu, Settings, UserRound, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

const primaryNavItems = [
  { href: "/panel", label: "Pulpit", icon: CalendarDays },
  { href: "/panel/schedule", label: "Terminarz", icon: CalendarHeart },
  { href: "/panel/visits", label: "Wizyty", icon: ClipboardList },
  { href: "/panel/statistics", label: "Statystyki", icon: ChartNoAxesCombined },
  { href: "/panel/patients", label: "Pacjenci", icon: Users },
  { href: "/panel/users", label: "Użytkownicy", icon: UserRound },
  { href: "/panel/inbox", label: "Skrzynka", icon: Mail },
  { href: "/panel/availability", label: "Grafik i dostępność", icon: CalendarClock },
  { href: "/panel/templates", label: "Szablony", icon: FolderKanban },
  { href: "/panel/library", label: "Biblioteka", icon: BookOpen },
  { href: "/panel/important-dates", label: "Ważne daty", icon: CalendarHeart },
  { href: "/panel/self-care", label: "Chwila dla siebie", icon: Flower2 },
  { href: "/panel/ai-chat", label: "Porozmawiaj z AI", icon: Bot },
  { href: "/panel/help", label: "Instrukcja", icon: CircleHelp },
  { href: "/panel/settings", label: "Ustawienia", icon: Settings },
] as const;

const homeNavItem = { href: "/", label: "Strona główna", icon: House } as const;
type NavItem = (typeof primaryNavItems)[number] | typeof homeNavItem;

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header data-panel-mobile-header className="sticky top-0 z-40 flex w-full min-w-0 max-w-full items-center justify-between border-b border-[#E5E1D8] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate font-bold text-[#2D4739]">Gabinet Aleksandry</p>
          <p className="text-xs text-gray-500">Panel pracy</p>
        </div>
        <div className="flex items-center gap-2">
          {pathname !== "/panel" && (
            <Link href="/panel" aria-label="Wróć do pulpitu" className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-[#E5E1D8] px-3 text-sm font-semibold text-[#2D4739]">
              <House size={20} aria-hidden="true" /><span className="hidden min-[390px]:inline">Pulpit</span>
            </Link>
          )}
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Otwórz menu panelu" aria-expanded={mobileOpen} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E5E1D8] text-[#2D4739]">
            <Menu size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-[#1F3028]/45" aria-label="Zamknij menu panelu" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-[min(88vw,340px)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="text-xl font-bold text-[#2D4739]">Gabinet</h2><p className="mt-1 text-sm text-gray-500">Aleksandra Wejer</p></div>
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Zamknij menu panelu" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5E1D8] text-[#2D4739]"><X size={21} aria-hidden="true" /></button>
            </div>
            <nav className="mt-7 flex flex-col gap-2">
              {primaryNavItems.map((item) => <NavLink key={item.href} {...item} active={isActivePath(pathname, item.href)} onClick={() => setMobileOpen(false)} />)}
            </nav>
            <div className="sticky bottom-0 mt-6 space-y-2 border-t border-[#E5E1D8] bg-white pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-4">
              <NavLink {...homeNavItem} active={false} onClick={() => setMobileOpen(false)} />
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-[#E5E1D8] bg-white p-6 shadow-sm lg:flex">
        <div><h2 className="text-2xl font-bold text-[#2D4739]">Gabinet</h2><p className="mt-2 text-sm text-gray-500">Aleksandra Wejer</p></div>
        <nav className="mt-8 flex flex-col gap-2">
          {primaryNavItems.map((item) => <NavLink key={item.href} {...item} active={isActivePath(pathname, item.href)} />)}
        </nav>
        <div className="sticky bottom-0 mt-6 space-y-2 border-t border-[#E5E1D8] bg-white pb-1 pt-4">
          <NavLink {...homeNavItem} active={false} />
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function NavLink({ href, label, icon: Icon, active, onClick }: NavItem & { active: boolean; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D7A62] focus-visible:ring-offset-2 ${active ? "bg-[#EEF1EB] text-[#2D4739]" : "text-[#2D4739] hover:bg-[#F8F5F0] hover:text-[#6D7A62]"}`}>
      <Icon size={18} aria-hidden="true" />{label}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return href === "/panel" ? pathname === href : pathname.startsWith(href);
}
