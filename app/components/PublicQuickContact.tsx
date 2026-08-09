"use client";

import { MessageCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

export default function PublicQuickContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const canSubmit = name.trim().length > 2 && phone.replace(/\D/g, "").length >= 9 && message.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSending(true);
    setStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email: "", category: "Pierwsza wiadomość", message }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("Contact request failed");
      setName("");
      setPhone("");
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#2F6B5F] bg-white px-5 py-3 font-semibold text-[#2F6B5F] transition hover:bg-[#F3F8F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B5F] focus-visible:ring-offset-2"
      >
        <MessageCircle size={18} aria-hidden="true" />Wyślij wiadomość
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-3 rounded-2xl border border-[#DCE8E2] bg-white p-4 text-left shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Imię i nazwisko" className="min-h-11 rounded-xl border border-stone-200 px-3 text-sm text-[#23332F] outline-none placeholder:text-stone-500 focus:ring-2 focus:ring-[#6D7A62]" />
            <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Telefon" className="min-h-11 rounded-xl border border-stone-200 px-3 text-sm text-[#23332F] outline-none placeholder:text-stone-500 focus:ring-2 focus:ring-[#6D7A62]" />
          </div>
          <textarea required rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napisz krótko, w czym mogę pomóc." className="mt-3 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-[#23332F] outline-none placeholder:text-stone-500 focus:ring-2 focus:ring-[#6D7A62]" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className={`text-xs ${status === "error" ? "text-[#A34D55]" : "text-stone-500"}`}>
              {status === "success" ? "Dziękuję — wiadomość została wysłana." : status === "error" ? "Nie udało się wysłać wiadomości. Spróbuj ponownie." : "Odpowiadamy zazwyczaj w ciągu 24 godzin roboczych."}
            </p>
            <button type="submit" disabled={!canSubmit || isSending} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#6D7A62] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#55614C] disabled:cursor-not-allowed disabled:bg-stone-400"><Send size={16} aria-hidden="true" />{isSending ? "Wysyłanie…" : "Wyślij"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
