export const ZIKIR_SESSION_STORAGE_KEY = "VAKITLER_ZIKIR_SESSION";

export type ZikirSessionPersisted = {
  dhikrId: string;
  count: number;
  target: number;
  date: string;
};

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function readZikirSession(): ZikirSessionPersisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ZIKIR_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ZikirSessionPersisted;
    if (
      typeof parsed?.dhikrId !== "string" ||
      typeof parsed?.count !== "number" ||
      typeof parsed?.target !== "number" ||
      typeof parsed?.date !== "string"
    ) {
      return null;
    }
    if (parsed.date !== todayKey()) {
      window.localStorage.removeItem(ZIKIR_SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeZikirSession(
  session: Omit<ZikirSessionPersisted, "date">
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ZIKIR_SESSION_STORAGE_KEY,
      JSON.stringify({ ...session, date: todayKey() })
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearZikirSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ZIKIR_SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
