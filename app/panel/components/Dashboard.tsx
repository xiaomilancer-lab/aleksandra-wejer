import Sidebar from "./Sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({
  children,
}: DashboardProps) {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-10">

        {children}

      </main>

    </div>
  );
}