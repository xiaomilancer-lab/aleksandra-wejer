import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, phone, email, category, message } = await req.json();

    const data = await resend.emails.send({
      from: "Aleksandra Wejer <onboarding@resend.dev>",
      to: "alexandra.paszylk@wp.pl",
      subject: "🌿 Nowe zgłoszenie ze strony",
      html: `
        <h2>Nowe zgłoszenie ze strony</h2>

        <p><strong>Imię i nazwisko:</strong><br>${name}</p>

        <p><strong>Telefon:</strong><br>${phone}</p>

        <p><strong>E-mail:</strong><br>${email || "Nie podano"}</p>

        <p><strong>Dotyczy:</strong><br>${category}</p>

        <hr>

        <p><strong>Treść wiadomości:</strong></p>

        <p>${message.replace(/\n/g, "<br>")}</p>
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
        message: "Nie udało się wysłać wiadomości.",
      },
      {
        status: 500,
      }
    );
  }
}
