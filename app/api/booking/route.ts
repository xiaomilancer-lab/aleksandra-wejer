import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      selectedLocation,
      selectedDay,
      selectedTime,
      name,
      phone,
      email,
      message,
    } = await req.json();

    const visitDate = new Date(2026, 7, selectedDay);

    const formattedDate = visitDate.toLocaleDateString("pl-PL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const displayDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const data = await resend.emails.send({
      from: "Aleksandra Wejer <psycholog@aleksandrawejer.pl>",
      to: "psycholog@aleksandrawejer.pl",
      replyTo: email,
      subject: "📅 Nowa rezerwacja konsultacji",

      html: `
        <h2>📅 Nowa rezerwacja konsultacji</h2>

        <hr>

        <p><strong>👤 Pacjent:</strong><br>${name}</p>

        <p><strong>📞 Telefon:</strong><br>${phone}</p>

        <p><strong>✉️ E-mail:</strong><br>${email}</p>

        <hr>

        <p><strong>📍 Lokalizacja:</strong><br>${selectedLocation}</p>

        <p><strong>📅 Termin:</strong><br>${displayDate}</p>

        <p><strong>🕒 Godzina:</strong><br>${selectedTime}</p>

        <hr>

        <p><strong>📝 Opis:</strong></p>

        <p>${message ? message.replace(/\n/g, "<br>") : "Brak opisu."}</p>
      `,
    });

    return Response.json({
      success: true,
      id: data.data?.id,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Nie udało się wysłać rezerwacji.",
      },
      {
        status: 500,
      }
    );
  }
}