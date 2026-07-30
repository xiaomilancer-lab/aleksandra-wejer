"use client";

import { useState } from "react";

interface StepFormProps {
  selectedLocation: string;
  selectedDay: number;
  selectedTime: string;
}

export default function StepForm({
  selectedLocation,
  selectedDay,
  selectedTime,
}: StepFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const visitDate = new Date(2026, 7, selectedDay);

const formattedDate = visitDate.toLocaleDateString("pl-PL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const displayDate =
  formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  async function handleBooking() {
  setLoading(true);

  try {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedLocation,
        selectedDay,
        selectedTime,
        name,
        phone,
        email,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Błąd wysyłania formularza.");
    }

    console.log("✅ Formularz wysłany poprawnie.");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  return (
    <section
      id="step-form"
      className="mt-12 rounded-3xl border border-[#EFE8DD] bg-white p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-[#4B4338]">
        Dane do kontaktu
      </h2>

      <p className="mt-2 text-gray-600">
        Wypełnij formularz, a Aleksandra skontaktuje się z Tobą w celu
        potwierdzenia terminu.
      </p>

      <div className="mt-6 rounded-2xl border border-[#E8E1D5] bg-[#F8F5F0] p-5">
  <h3 className="mb-3 text-lg font-semibold text-[#4B4338]">
    Wybrany termin konsultacji
  </h3>

  <div className="space-y-2 text-[#4B4338]">
    <p>
      <span className="font-semibold">📍 Lokalizacja:</span>{" "}
      {selectedLocation}
    </p>

    <p>
      <span className="font-semibold">📅 Termin:</span>{" "}
      {displayDate}
    </p>

    <p>
      <span className="font-semibold">🕒 Godzina:</span>{" "}
      {selectedTime}
    </p>
  </div>
</div>

      <div className="mt-8 space-y-5">

        <div>
          <label className="mb-2 block font-medium text-[#4B4338]">
            Imię i nazwisko
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jan Kowalski"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6D7A62]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#4B4338]">
            Telefon
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+48..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6D7A62]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#4B4338]">
            E-mail
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="adres@email.pl"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6D7A62]"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-[#4B4338]">
            Krótki opis (opcjonalnie)
          </label>

          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Kilka słów o tym, z czym chciałbyś/chciałabyś się zgłosić..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#6D7A62]"
          />
        </div>

        <button
          type="button"
onClick={handleBooking}
disabled={loading}
          className="w-full rounded-xl bg-[#6D7A62] py-4 text-lg font-semibold text-white transition hover:opacity-90"
        >
          {loading ? "Wysyłanie..." : "Umów wizytę"}
        </button>

      </div>
    </section>
  );
}