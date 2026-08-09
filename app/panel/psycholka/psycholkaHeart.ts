export const psycholkaHeartMessages = [
  "Dobrze, że jesteś.",
  "Spokojnie.",
  "Krok po kroku.",
  "Miło Cię widzieć.",
  "Cieszę się, że tu jesteś.",
  "Dziękuję.",
  "Miłego dnia.",
  "Odpocznij chwilę.",
  "Wszystkiego nie trzeba zrobić od razu.",
] as const;

type HeartState = {
  lastMessage: string | null;
  lastShownAt: number | null;
  lastDismissedAt: number | null;
};

const storageKey = "psycholka-heart-message-v1";
const emptyState = (): HeartState => ({ lastMessage: null, lastShownAt: null, lastDismissedAt: null });

function readHeartState(): HeartState {
  try {
    const value = window.localStorage.getItem(storageKey);
    return value ? { ...emptyState(), ...JSON.parse(value) } as HeartState : emptyState();
  } catch {
    return emptyState();
  }
}

function saveHeartState(state: HeartState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function takePsycholkaHeartMessage(force = false) {
  const state = readHeartState();
  const now = Date.now();
  const blockedByDismissal = state.lastDismissedAt !== null && now - state.lastDismissedAt < 60 * 60_000;
  const blockedByFrequency = state.lastShownAt !== null && now - state.lastShownAt < 30 * 60_000;
  if (!force && (blockedByDismissal || blockedByFrequency)) return null;

  const available = psycholkaHeartMessages.filter((message) => message !== state.lastMessage);
  const message = available[Math.floor(Math.random() * available.length)]!;
  state.lastMessage = message;
  state.lastShownAt = now;
  saveHeartState(state);
  return message;
}

export function dismissPsycholkaHeartMessage() {
  const state = readHeartState();
  state.lastDismissedAt = Date.now();
  saveHeartState(state);
}
