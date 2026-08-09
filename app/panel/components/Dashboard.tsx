import Sidebar from "./Sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({
  children,
}: DashboardProps) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col lg:flex-row">

      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">

        {children}

      </main>

    </div>
  );
}
