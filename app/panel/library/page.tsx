import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import KnowledgeLibraryManager from "../components/library/KnowledgeLibraryManager";
import { getKnowledgeMaterials } from "../services/knowledgeLibraryService";

export default async function KnowledgeLibraryPage() {
  await connection();
  const materials = await getKnowledgeMaterials();
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><KnowledgeLibraryManager materials={materials} /></div></Dashboard></AuthGuard>;
}
