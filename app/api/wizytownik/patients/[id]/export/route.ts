import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { getPsychologistApiAuthorization } from "@/app/panel/server/requirePsychologist";
import { getJournalNotes, getJournalPatient, recordJournalAudit } from "@/app/wizytownik/server/secureJournal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Context) {
  const authorization = await getPsychologistApiAuthorization(request);
  if (authorization.kind !== "authorized") {
    return Response.json({ message: authorization.kind === "forbidden" ? "Brak dostępu." : "Zaloguj się ponownie." }, { status: authorization.kind === "forbidden" ? 403 : 401, headers: { "Cache-Control": "private, no-store" } });
  }
  const { id } = await params;
  const url = new URL(request.url);
  if (url.searchParams.get("format") !== "docx") {
    return Response.json({ message: "Nieobsługiwany format." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }
  const [patient, notes] = await Promise.all([getJournalPatient(id), getJournalNotes(id, authorization.identity.userId)]);
  if (!patient) return Response.json({ message: "Nie znaleziono pacjenta." }, { status: 404, headers: { "Cache-Control": "private, no-store" } });

  const children: Paragraph[] = [
    new Paragraph({ text: "Wizytownik psychOLKI — dokument prywatny", heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun({ text: "Pacjent: ", bold: true }), new TextRun(patient.name)] }),
    ...(patient.journalAlias ? [new Paragraph({ children: [new TextRun({ text: "Pseudonim: ", bold: true }), new TextRun(patient.journalAlias)] })] : []),
    new Paragraph({ text: `Wygenerowano: ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}` }),
  ];
  for (const note of notes) {
    children.push(
      new Paragraph({ text: `${new Date(`${note.occurredOn}T12:00:00`).toLocaleDateString("pl-PL")} — ${note.title}`, heading: HeadingLevel.HEADING_1, pageBreakBefore: children.length > 4 }),
      ...docxSection("Przebieg wizyty", note.sessionSummary),
      ...docxSection("Najważniejsze tematy", note.keyTopics),
      ...docxSection("Obserwacje pomocne w dalszej pracy", note.observations),
      ...docxSection("Ustalenia i kolejny krok", note.nextSteps),
    );
  }
  children.push(new Paragraph({ children: [new TextRun({ text: "Poufne: przechowuj dokument na zaszyfrowanym urządzeniu.", italics: true, color: "666666" })] }));
  const document = new Document({ creator: "Wizytownik psychOLKI", title: "Historia notatek", sections: [{ properties: {}, children }] });
  const buffer = await Packer.toBuffer(document);
  await recordJournalAudit(authorization.identity.userId, "history_exported", patient.id);
  const stamp = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="wizytownik-${stamp}.docx"`,
      "Cache-Control": "private, no-store, max-age=0",
      Pragma: "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function docxSection(title: string, value: string) {
  if (!value) return [];
  return [new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }), ...value.split(/\r?\n/).map((line) => new Paragraph({ text: line || " " }))];
}
