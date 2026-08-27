"use client";

import { AlertTriangle, Bot, MessageSquarePlus, Send, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  aiChatIntents,
  materialAgeGroups,
  materialObjectives,
  materialTopics,
  type AiChatIntent,
  type MaterialAgeGroup,
  type MaterialObjective,
  type MaterialTopic,
} from "../../domain";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  title: string;
  ageGroup: MaterialAgeGroup;
  topic: MaterialTopic;
  objective: MaterialObjective;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "psycholka-ai-conversations-v1";
const MAX_LOCAL_CONVERSATIONS = 40;

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createConversation(): Conversation {
  const now = new Date().toISOString();
  return {
    id: createId(),
    title: "Nowa rozmowa",
    ageGroup: materialAgeGroups[1],
    topic: materialTopics[0],
    objective: materialObjectives[4],
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function isAllowed<T extends readonly string[]>(items: T, value: unknown): value is T[number] {
  return typeof value === "string" && items.includes(value);
}

function readStoredConversations(): Conversation[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Conversation => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<Conversation>;
      return typeof candidate.id === "string" && typeof candidate.title === "string"
        && typeof candidate.createdAt === "string" && typeof candidate.updatedAt === "string"
        && isAllowed(materialAgeGroups, candidate.ageGroup)
        && isAllowed(materialTopics, candidate.topic)
        && isAllowed(materialObjectives, candidate.objective)
        && Array.isArray(candidate.messages)
        && candidate.messages.every((message) => message && typeof message.id === "string"
          && (message.role === "user" || message.role === "assistant")
          && typeof message.content === "string" && typeof message.createdAt === "string");
    }).slice(0, MAX_LOCAL_CONVERSATIONS);
  } catch {
    return [];
  }
}

export default function PsychologyAiChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [intent, setIntent] = useState<AiChatIntent>(aiChatIntents[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredConversations();
      const initial = stored.length ? stored : [createConversation()];
      setConversations(initial);
      setActiveId(initial[0].id);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_LOCAL_CONVERSATIONS)));
  }, [conversations, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? conversations[0],
    [activeId, conversations],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeConversation?.messages.length, loading]);

  const updateConversation = (patch: Partial<Pick<Conversation, "ageGroup" | "topic" | "objective">>) => {
    if (!activeConversation || activeConversation.messages.length > 0) return;
    setConversations((current) => current.map((conversation) => conversation.id === activeConversation.id ? { ...conversation, ...patch } : conversation));
  };

  const newConversation = () => {
    const conversation = createConversation();
    setConversations((current) => [conversation, ...current].slice(0, MAX_LOCAL_CONVERSATIONS));
    setActiveId(conversation.id);
    setIntent(aiChatIntents[0]);
    setError(null);
  };

  const deleteConversation = (id: string) => {
    if (!window.confirm("Trwale usunąć tę rozmowę z tego urządzenia?")) return;
    const remaining = conversations.filter((conversation) => conversation.id !== id);
    if (remaining.length) {
      setConversations(remaining);
      if (activeId === id) setActiveId(remaining[0].id);
    } else {
      const replacement = createConversation();
      setConversations([replacement]);
      setActiveId(replacement.id);
    }
    setError(null);
  };

  const ask = async (selectedIntent: AiChatIntent = intent) => {
    if (!activeConversation || loading) return;

    const now = new Date().toISOString();
    const conversationId = activeConversation.id;
    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: `${selectedIntent}\n${activeConversation.ageGroup} · ${activeConversation.topic} · ${activeConversation.objective}`,
      createdAt: now,
    };
    setError(null);
    setLoading(true);
    setConversations((current) => current.map((conversation) => conversation.id === conversationId ? {
      ...conversation,
      title: conversation.messages.length === 0 ? conversation.topic : conversation.title,
      messages: [...conversation.messages, userMessage],
      updatedAt: now,
    } : conversation));

    try {
      const response = await fetch("/api/panel/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageGroup: activeConversation.ageGroup,
          topic: activeConversation.topic,
          objective: activeConversation.objective,
          intent: selectedIntent,
        }),
      });
      const payload = await response.json() as { answer?: string; error?: string };
      if (!response.ok || !payload.answer) throw new Error(payload.error || "Nie udało się uzyskać odpowiedzi.");

      const assistantMessage: ChatMessage = { id: createId(), role: "assistant", content: payload.answer, createdAt: new Date().toISOString() };
      setConversations((current) => current.map((conversation) => conversation.id === conversationId ? {
        ...conversation,
        messages: [...conversation.messages, assistantMessage],
        updatedAt: assistantMessage.createdAt,
      } : conversation));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "PsychOLKA AI chwilowo nie odpowiada.");
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated || !activeConversation) {
    return <div className="mx-auto max-w-7xl rounded-3xl border border-[#E5E1D8] bg-white p-8 text-center text-[#647067]">Przygotowuję bezpieczną rozmowę…</div>;
  }

  const configurationLocked = activeConversation.messages.length > 0;

  return <div className="mx-auto max-w-7xl space-y-5">
    <header className="rounded-3xl border border-[#DCE4D7] bg-[#2D4739] p-6 text-white shadow-[0_18px_50px_rgba(45,71,57,0.14)] sm:p-8">
      <div className="flex items-start gap-4"><span className="rounded-2xl bg-white/10 p-3"><Bot size={25} aria-hidden="true" /></span><div><p className="text-sm text-white/70">Awaryjne wsparcie wiedzą</p><h1 className="mt-1 text-3xl font-bold sm:text-4xl">Porozmawiaj z AI</h1><p className="mt-3 max-w-3xl leading-7 text-white/80">Neutralne pytania, uporządkowanie wiedzy i pomysły psychoedukacyjne. Odpowiedź AI zawsze wymaga zawodowej oceny Aleksandry.</p></div></div>
    </header>

    <section className="sticky top-[76px] z-20 rounded-2xl border-2 border-[#D99A3D] bg-[#FFF4DD] p-4 shadow-sm lg:top-3" role="note">
      <div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-[#9A5C00]" size={23} aria-hidden="true" /><div><p className="font-extrabold uppercase tracking-[0.08em] text-[#704400]">Nie podawaj prawdziwych danych pacjenta</p><p className="mt-1 text-sm leading-6 text-[#704F1E]">Ta wersja nie ma pola swobodnego opisu. Do AI trafiają wyłącznie neutralne wybory z poniższych list — bez imienia, kontaktu, notatek i historii osoby.</p></div></div>
    </section>

    <div className="grid min-h-[650px] gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-[#E5E1D8] bg-white p-4 shadow-sm">
        <button type="button" onClick={newConversation} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-4 py-3 font-bold text-white"><MessageSquarePlus size={19} />Nowa rozmowa</button>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7B847E]"><ShieldCheck size={15} />Historia tylko na tym urządzeniu</div>
        <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto pr-1 lg:max-h-[560px]">
          {conversations.map((conversation) => <div key={conversation.id} className={`flex items-center gap-2 rounded-xl border p-2 ${conversation.id === activeConversation.id ? "border-[#B8C4B2] bg-[#EEF1EB]" : "border-transparent hover:bg-[#F8F5F0]"}`}>
            <button type="button" onClick={() => { setActiveId(conversation.id); setError(null); }} className="min-w-0 flex-1 px-2 py-1 text-left"><span className="block truncate text-sm font-semibold text-[#2D4739]">{conversation.title}</span><span className="mt-1 block text-xs text-gray-500">{new Date(conversation.updatedAt).toLocaleString("pl-PL")}</span></button>
            <button type="button" onClick={() => deleteConversation(conversation.id)} aria-label={`Usuń rozmowę ${conversation.title}`} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#9A5C5C] hover:bg-[#FCEBEC]"><Trash2 size={17} aria-hidden="true" /></button>
          </div>)}
        </div>
      </aside>

      <section className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#E5E1D8] bg-white shadow-sm">
        <div className="border-b border-[#E5E1D8] p-5">
          <h2 className="font-bold text-[#2D4739]">Bezpieczne ustawienia rozmowy</h2>
          <p className="mt-1 text-xs text-gray-500">Po pierwszym pytaniu ustawienia zostaną zablokowane. Aby zmienić temat, rozpocznij nową rozmowę.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Select label="Grupa" value={activeConversation.ageGroup} options={materialAgeGroups} disabled={configurationLocked} onChange={(value) => updateConversation({ ageGroup: value as MaterialAgeGroup })} />
            <Select label="Temat" value={activeConversation.topic} options={materialTopics} disabled={configurationLocked} onChange={(value) => updateConversation({ topic: value as MaterialTopic })} />
            <Select label="Cel" value={activeConversation.objective} options={materialObjectives} disabled={configurationLocked} onChange={(value) => updateConversation({ objective: value as MaterialObjective })} />
          </div>
        </div>

        <div className="min-h-[320px] flex-1 space-y-4 overflow-y-auto bg-[#FBFAF7] p-4 sm:p-6">
          {activeConversation.messages.length === 0 && <div className="mx-auto max-w-2xl py-8 text-center"><span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1EB] text-[#6D7A62]"><Bot size={26} /></span><h2 className="mt-4 text-xl font-bold text-[#2D4739]">Wybierz kierunek pierwszej odpowiedzi</h2><p className="mt-2 text-sm leading-6 text-gray-600">Każdy przycisk tworzy wyłącznie neutralne, anonimowe pytanie.</p><div className="mt-5 grid gap-2">{aiChatIntents.map((item) => <button key={item} type="button" onClick={() => { setIntent(item); void ask(item); }} disabled={loading} className="rounded-2xl border border-[#E5E1D8] bg-white px-4 py-3 text-left text-sm font-semibold text-[#465449] hover:border-[#B8C4B2] disabled:opacity-60">{item}</button>)}</div></div>}
          {activeConversation.messages.map((message) => <article key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 sm:max-w-[82%] ${message.role === "user" ? "bg-[#2D4739] text-white" : "border border-[#E5E1D8] bg-white text-[#36443B]"}`}><p className="whitespace-pre-wrap break-words">{message.content}</p></div></article>)}
          {loading && <div className="flex justify-start"><div className="rounded-2xl border border-[#E5E1D8] bg-white px-4 py-3 text-sm text-gray-500">PsychOLKA układa odpowiedź…</div></div>}
          <div ref={bottomRef} />
        </div>

        {activeConversation.messages.length > 0 && <div className="border-t border-[#E5E1D8] bg-white p-4 sm:p-5">
          {error && <p className="mb-3 rounded-xl border border-[#F0CACA] bg-[#FFF1F1] px-4 py-3 text-sm text-[#8B3D3D]" role="alert">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end"><Select label="Kolejne pytanie" value={intent} options={aiChatIntents} disabled={loading} onChange={(value) => setIntent(value as AiChatIntent)} /><button type="button" onClick={() => { void ask(); }} disabled={loading} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D7A62] px-5 py-3 font-bold text-white disabled:bg-gray-300"><Send size={18} />{loading ? "Czekaj…" : "Zapytaj"}</button></div>
        </div>}
      </section>
    </div>
  </div>;
}

function Select({ label, value, options, disabled, onChange }: { label: string; value: string; options: readonly string[]; disabled: boolean; onChange: (value: string) => void }) {
  return <label className="min-w-0 flex-1 text-sm font-semibold text-[#2D4739]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="mt-2 min-h-12 w-full rounded-xl border border-[#C9D1C5] bg-white px-3 text-[#263E32] outline-none focus:border-[#6D7A62] disabled:bg-[#F1F1ED] disabled:text-[#677168]">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
