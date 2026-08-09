import { existsSync } from "node:fs";
import { join } from "node:path";
import { notFound } from "next/navigation";
import AuthGuard from "../../components/AuthGuard";
import Dashboard from "../../components/Dashboard";
import PsycholkaGreetingPreview from "../../components/PsycholkaGreetingPreview";
import PsycholkaWidget from "../../components/PsychOLKAWidget";
import { publicJourneyAssets } from "../../psycholka/psycholkaAssets";
import { psycholkaConfig } from "../../psycholka/psycholkaConfig";
import type { PsycholkaContext } from "../../psycholka/psycholkaTypes";

export default function PsycholkaPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const contexts = Object.keys(psycholkaConfig) as PsycholkaContext[];
  const journey = publicJourneyAssets.map((asset) => ({ ...asset, exists: existsSync(join(process.cwd(), "public", asset.path.slice(1))) }));

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6D7A62]">Development only</p>
          <h1 className="mt-2 text-3xl font-bold text-[#2D4739]">PsychOLKA visual preview</h1>
          <p className="mt-3 text-sm text-gray-600">Podgląd kontekstów oraz bezpiecznych fallbacków assetów.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {contexts.map((context) => <section key={context} className="min-w-0 rounded-3xl border border-[#E5E1D8] bg-white p-5"><h2 className="font-semibold text-[#2D4739]">{context}</h2><div className="mt-4 flex min-h-36 items-center justify-center rounded-2xl bg-[#F8F5F0]"><PsycholkaWidget context={context} /></div></section>)}
          </div>
          <section className="mt-8 rounded-3xl border border-[#E5E1D8] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#2D4739]">PUBLIC JOURNEY MAP</h2>
            <p className="mt-2 text-sm text-gray-600">Plan dedykowanych assetów strony publicznej. Status jest sprawdzany lokalnie względem katalogu public.</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-b border-[#E5E1D8] text-xs uppercase tracking-[0.08em] text-[#55624D]"><tr><th className="px-3 py-3">Miejsce</th><th className="px-3 py-3">Action</th><th className="px-3 py-3">Asset</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Fallback</th></tr></thead>
                <tbody>{journey.map((asset) => <tr key={asset.action} className="border-b border-[#F0ECE5] last:border-0"><td className="px-3 py-3 font-semibold text-[#2D4739]">{asset.place}</td><td className="px-3 py-3 font-mono text-xs text-[#55624D]">{asset.action}</td><td className="px-3 py-3 font-mono text-xs text-gray-600">{asset.path}</td><td className="px-3 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${asset.exists ? "bg-[#EEF1EB] text-[#3E7C49]" : "bg-[#FFF9EE] text-[#7A6540]"}`}>{asset.exists ? "exists" : "missing"}</span></td><td className="px-3 py-3 text-xs text-gray-600">{asset.fallback}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
          <PsycholkaGreetingPreview />
        </div>
      </Dashboard>
    </AuthGuard>
  );
}
