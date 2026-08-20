import { sendContactNotification } from "@/app/lib/bookingNotifications";
import { acceptsPublicJson, cleanOptionalText, cleanRequiredText, isValidEmail, isValidPhone, PUBLIC_INPUT_LIMITS } from "@/app/api/_shared/publicInput";

export async function POST(req: Request) {
  try {
    if (!acceptsPublicJson(req)) return Response.json({ success: false, message: "Nieprawidłowe dane wiadomości." }, { status: 400 });
    const body = await req.json().catch(() => null) as Record<string, unknown> | null;
    const name = cleanRequiredText(body?.name, PUBLIC_INPUT_LIMITS.name);
    const phone = cleanRequiredText(body?.phone, PUBLIC_INPUT_LIMITS.phone);
    const email = cleanOptionalText(body?.email, PUBLIC_INPUT_LIMITS.email);
    const category = cleanRequiredText(body?.category, PUBLIC_INPUT_LIMITS.category);
    const message = cleanRequiredText(body?.message, PUBLIC_INPUT_LIMITS.message);

    if (!name || !phone || email === null || !category || !message || !isValidPhone(phone) || !isValidEmail(email)) {
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
