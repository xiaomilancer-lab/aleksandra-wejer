import { sendContactNotification } from "@/app/lib/bookingNotifications";

export async function POST(req: Request) {
  try {
    const { name, phone, email, category, message } = await req.json();

    if (typeof name !== "string" || typeof phone !== "string" || typeof email !== "string" || typeof category !== "string" || typeof message !== "string") {
      return Response.json({ success: false, message: "Nieprawidłowe dane wiadomości." }, { status: 400 });
    }

    const result = await sendContactNotification({ name, phone, email, category, message });
    if (!result.sent) {
      return Response.json({ success: false, message: "Nie udało się teraz wysłać wiadomości. Spróbuj ponownie za chwilę." }, { status: 503 });
    }

    return Response.json({
      success: true,
      id: result.id,
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
