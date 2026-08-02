import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

    const visitDate = `2026-08-${String(selectedDay).padStart(2, "0")}`;

const displayDate = new Date(
  `${visitDate}T12:00:00`
).toLocaleDateString("pl-PL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const { data: existingBooking } = await supabaseAdmin
  .from("bookings")
  .select("id")
  .eq("visit_date", visitDate)
  .eq("visit_time", selectedTime)
  .maybeSingle();

if (existingBooking) {
  return Response.json(
    {
      success: false,
      message: "Wybrana godzina jest już zajęta.",
    },
    {
      status: 409,
    }
  );
} 

const { error: dbError } = await supabaseAdmin
  .from("bookings")
  .insert({
    location: selectedLocation,
    visit_date: visitDate,
    visit_time: selectedTime,
    name,
    phone,
    email,
    message,
    status: "Nowe",
  });

if (dbError) {
  console.error(dbError);

  return Response.json(
    {
      success: false,
      message: "Nie udało się zapisać rezerwacji.",
    },
    {
      status: 500,
    }
  );
}
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