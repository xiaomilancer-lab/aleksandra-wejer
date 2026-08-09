import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import VisitTemplateManager from "../components/templates/VisitTemplateManager";
import { getFavoriteTemplates, getTemplates } from "../services/templateService";

export default async function TemplatesPage() {
  await connection();
  const [templates, favoriteTemplates] = await Promise.all([getTemplates(), getFavoriteTemplates()]);

  return (
    <AuthGuard>
      <Dashboard>
        <div className="mx-auto max-w-7xl"><VisitTemplateManager templates={templates} favoriteTemplates={favoriteTemplates} /></div>
      </Dashboard>
    </AuthGuard>
  );
}
