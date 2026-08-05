import LogoutButton from "./LogoutButton";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold text-[#2D4739]">
        🌿 Gabinet
      </h2>

      <p className="mt-2 text-gray-500">
        Aleksandra Wejer
      </p>

      <nav className="mt-10 flex flex-1 flex-col">

        <div className="space-y-3">

          <button className="w-full rounded-xl bg-[#6D7A62] px-4 py-3 text-left font-semibold text-white">
            📅 Wizyty
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
            👥 Pacjenci
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
            📊 Statystyki
          </button>

          <button className="w-full rounded-xl px-4 py-3 text-left font-semibold text-[#2D4739] hover:bg-[#F8F5F0]">
            ⚙️ Ustawienia
          </button>

        </div>

        <div className="mt-auto">
          <LogoutButton />
        </div>

      </nav>

    </aside>
  );
}