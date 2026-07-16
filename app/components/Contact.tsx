"use client";

import { useState, type FormEvent } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Dorosły");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          category,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Błąd wysyłania.");
      }

      setSuccess(true);

      setName("");
      setPhone("");
      setEmail("");
      setCategory("Dorosły");
      setMessage("");
    } catch (err) {
      setError(
        "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="kontakt"
      className="bg-[#F8F5F0] py-24"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl p-12">

        <div className="text-center">

          <p className="uppercase tracking-[0.35em] text-sm font-semibold text-[#6D7A62]">
            PIERWSZY KROK
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[#4B4338]">
            Umów pierwszą konsultację
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Nie musisz od razu podejmować decyzji o rozpoczęciu konsultacji.
            Jeżeli masz pytania lub chciałbyś umówić pierwsze spotkanie,
            zostaw wiadomość.
            Skontaktuję się z Tobą i wspólnie ustalimy dogodny termin.
          </p>

        </div>

        {success && (
          <div className="mt-8 rounded-2xl bg-green-100 border border-green-300 p-6 text-center">

            <h3 className="text-2xl font-bold text-green-700">
              🌿 Dziękuję za wiadomość!
            </h3>

            <p className="mt-3 text-gray-700">
              Skontaktuję się z Tobą tak szybko,
              jak będzie to możliwe.
            </p>

          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl bg-red-100 border border-red-300 p-5 text-center text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-14 space-y-6"
        >

          <input
            type="text"
            placeholder="Imię i nazwisko"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6D7A62]"
          />

          <input
            type="tel"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6D7A62]"
          />

          <input
            type="email"
            placeholder="Adres e-mail (opcjonalnie)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6D7A62]"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none focus:ring-2 focus:ring-[#6D7A62]"
          >
            <option>Dziecko</option>
            <option>Nastolatek</option>
            <option>Dorosły</option>
            <option>Para</option>
            <option>Rodzina</option>
          </select>

          <textarea
            rows={6}
            placeholder="Krótko opisz, z czym chciałbyś/chciałabyś się zgłosić."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg outline-none resize-none focus:ring-2 focus:ring-[#6D7A62]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6D7A62] hover:bg-[#55614C] transition text-white text-xl font-semibold py-5 rounded-2xl shadow-xl disabled:opacity-70"
          >
            {loading ? "⏳ Wysyłanie..." : "🌿 Wyślij zgłoszenie"}
          </button>

        </form>

        <div className="mt-10 text-center text-gray-500 text-sm leading-7">

          🔒 Twoje dane są bezpieczne.

          <br />

          Zostaną wykorzystane wyłącznie w celu kontaktu dotyczącego konsultacji.

        </div>

      </div>
    </section>
  );
}
