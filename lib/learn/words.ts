export type WordMastery = 0 | 1 | 2 | 3;

export interface IWord {
  arabic: string;
  turkish: string;
  root?: string;
  surahNumbers: number[];
  mastery: WordMastery;
}

export const WORD_BANK_STORAGE_KEY = "VAKITLER_WORD_BANK";
export const WORD_MASTERY_STORAGE_KEY = "VAKITLER_WORD_MASTERY";

export const WORD_BANK_TTL_MS = 24 * 60 * 60 * 1000;

/** Arapça kelimeyi mastery map anahtarı için normalize eder. */
export function normalizeArabicKey(arabic: string): string {
  return arabic
    .trim()
    .normalize("NFC")
    .replace(/\u0640/g, ""); // tatweel
}

export function loadMasteryMap(): Record<string, WordMastery> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(WORD_MASTERY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, WordMastery> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const n = Number(v);
      if (n === 0 || n === 1 || n === 2 || n === 3) out[k] = n;
    }
    return out;
  } catch {
    return {};
  }
}

export function getMasteryForArabic(arabic: string): WordMastery {
  const key = normalizeArabicKey(arabic);
  return loadMasteryMap()[key] ?? 0;
}

export function setMasteryForArabic(arabic: string, mastery: WordMastery): void {
  if (typeof window === "undefined") return;
  const key = normalizeArabicKey(arabic);
  const map = loadMasteryMap();
  map[key] = mastery;
  window.localStorage.setItem(WORD_MASTERY_STORAGE_KEY, JSON.stringify(map));
}

export function applyMasteryToWords(
  words: Omit<IWord, "mastery">[]
): IWord[] {
  return words.map(w => ({
    ...w,
    mastery: getMasteryForArabic(w.arabic),
  }));
}

export function normalizeTurkishAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .normalize("NFC");
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
