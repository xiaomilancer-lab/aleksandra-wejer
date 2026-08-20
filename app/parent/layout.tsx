import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import SessionInactivityGuard from "@/app/components/security/SessionInactivityGuard";
import { requireMember } from "@/app/room/server/requireMember";

export default async function ParentLayout({ children }: { children: ReactNode }) {
  const member = await requireMember();
  if (member.role !== "parent") redirect("/room");
  return <><SessionInactivityGuard />{children}</>;
}
