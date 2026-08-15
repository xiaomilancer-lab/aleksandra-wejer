import { getPsychologistAuthorization } from "@/app/panel/server/requirePsychologist";
import { getMemberAuthorization } from "@/app/room/server/requireMember";

export async function GET() {
  const psychologist = await getPsychologistAuthorization();
  if (psychologist.kind === "authorized") {
    return Response.json(
      { loggedIn: true, destination: "/panel", role: "psychologist" },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const member = await getMemberAuthorization();
  if (member.kind === "authorized") {
    return Response.json(
      { loggedIn: true, destination: "/room", role: member.identity.role },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return Response.json(
    { loggedIn: false, destination: "/login", role: null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
