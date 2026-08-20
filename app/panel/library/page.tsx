import { connection } from "next/server";
import AuthGuard from "../components/AuthGuard";
import Dashboard from "../components/Dashboard";
import KnowledgeLibraryManager from "../components/library/KnowledgeLibraryManager";
import type { KnowledgeMaterial } from "../domain";
import { getKnowledgeMaterials } from "../services/knowledgeLibraryService";

export default async function KnowledgeLibraryPage() {
  await connection();
  let materials: KnowledgeMaterial[] = [];
  let privateLibraryAvailable = true;
  try {
    materials = await getKnowledgeMaterials();
  } catch (error) {
    privateLibraryAvailable = false;
    console.error("Prywatna biblioteka jest chwilowo niedostępna; uruchamiam bezpieczny katalog lokalny.", error);
  }
  return <AuthGuard><Dashboard><div className="mx-auto max-w-7xl"><KnowledgeLibraryManager materials={materials} privateLibraryAvailable={privateLibraryAvailable} /></div></Dashboard></AuthGuard>;
}
