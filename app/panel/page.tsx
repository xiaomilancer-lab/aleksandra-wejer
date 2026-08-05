import Dashboard from "./components/Dashboard";
import VisitTable from "./components/VisitTable";
import Today from "./components/Today";
import Stats from "./components/Stats";

export default function PanelPage() {
  return (
    <Dashboard>
      <h1 className="text-4xl font-bold text-[#2D4739]">
        👋 Witaj Aleksandro
      </h1>

      <p className="mt-3 text-gray-600">
        To będzie centrum zarządzania gabinetem.
      </p>

      <Stats />

      <Today />

      <VisitTable />
    </Dashboard>
  );
}