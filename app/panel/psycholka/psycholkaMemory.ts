export type PsycholkaMemorySnapshot = {
  panelOpenCount: number;
  consecutiveDays: number;
  completedDays: number;
  welcomeClickCount: number;
  lastPanelOpenDate: string | null;
  lastCompletedDayDate: string | null;
  lastMemoryMessageDate: string | null;
};

const storageKey = "psycholka-memory-v1";

const emptyMemory = (): PsycholkaMemorySnapshot => ({
  panelOpenCount: 0,
  consecutiveDays: 0,
  completedDays: 0,
  welcomeClickCount: 0,
  lastPanelOpenDate: null,
  lastCompletedDayDate: null,
  lastMemoryMessageDate: null,
});

function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function previousDay(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() - 1);
  return value.toISOString().slice(0, 10);
}

export function getPsycholkaMemory(): PsycholkaMemorySnapshot {
  try {
    const value = window.localStorage.getItem(storageKey);
    if (!value) return emptyMemory();
    return { ...emptyMemory(), ...JSON.parse(value) } as PsycholkaMemorySnapshot;
  } catch {
    return emptyMemory();
  }
}

function savePsycholkaMemory(memory: PsycholkaMemorySnapshot) {
  window.localStorage.setItem(storageKey, JSON.stringify(memory));
  return memory;
}

export function recordPsycholkaPanelOpen(now = new Date()) {
  const memory = getPsycholkaMemory();
  const today = dayKey(now);
  const isNewDay = memory.lastPanelOpenDate !== today;

  if (isNewDay) {
    memory.consecutiveDays = memory.lastPanelOpenDate === previousDay(today) ? memory.consecutiveDays + 1 : 1;
    memory.lastPanelOpenDate = today;
  }
  memory.panelOpenCount += 1;
  savePsycholkaMemory(memory);
  return { memory, isNewDay, today };
}

export function recordPsycholkaCompletedDay(now = new Date()) {
  const memory = getPsycholkaMemory();
  const today = dayKey(now);
  if (memory.lastCompletedDayDate !== today) {
    memory.completedDays += 1;
    memory.lastCompletedDayDate = today;
    savePsycholkaMemory(memory);
  }
  return memory;
}

export function recordPsycholkaWelcomeClick() {
  const memory = getPsycholkaMemory();
  memory.welcomeClickCount += 1;
  return savePsycholkaMemory(memory);
}

export function takePsycholkaMemoryMessage(memory: PsycholkaMemorySnapshot, isNewDay: boolean, today: string) {
  if (!isNewDay || memory.lastMemoryMessageDate === today) return null;

  let message: string | null = null;
  if (memory.consecutiveDays === 10) message = "To już nasz 10 wspólny dzień. ❤️";
  else if (memory.consecutiveDays > 1 && memory.consecutiveDays % 10 === 0) message = "To już kolejny dzień pomagania.";
  else if (memory.consecutiveDays > 1 && [...today].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 5 === 0) message = "Dziękuję, że wracasz.";

  if (!message) return null;
  memory.lastMemoryMessageDate = today;
  savePsycholkaMemory(memory);
  return message;
}

export function resetPsycholkaMemoryForPreview() {
  window.localStorage.removeItem(storageKey);
  return emptyMemory();
}
