import surahs from "@/data/surahs";
import { CURRICULUM_SURAHS } from "@/data/learn-curriculum";
import type { IWord } from "./words";
import {
  WORD_BANK_STORAGE_KEY,
  WORD_BANK_TTL_MS,
  applyMasteryToWords,
  normalizeArabicKey,
} from "./words";

const WORDS_API = "https://api.acikkuran.com";

interface AcikRoot {
  latin?: string;
  arabic?: string;
}

interface AcikWordRow {
  arabic?: string;
  turkish?: string;
  root?: AcikRoot | null;
}

interface AcikWordsResponse {
  data?: AcikWordRow[];
}

export interface WordBankCachePayload {
  words: Omit<IWord, "mastery">[];
  cachedAt: string;
}

function surahVerseCount(surahNumber: number): number {
  return surahs.find(s => s.number === surahNumber)?.verses ?? 0;
}

function formatRoot(root: AcikRoot | null | undefined): string | undefined {
  if (!root) return undefined;
  const lat = (root.latin ?? "").trim();
  const ar = (root.arabic ?? "").trim();
  if (ar && lat) return `${ar} (${lat})`;
  if (ar) return ar;
  if (lat) return lat;
  return undefined;
}

async function fetchWordsForVerse(
  surahNumber: number,
  verseNo: number
): Promise<AcikWordRow[]> {
  const url = `${WORDS_API}/surah/${surahNumber}/verse/${verseNo}/words`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const body = (await res.json()) as AcikWordsResponse;
    const rows = body?.data;
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function mergeWordsFromSurah(
  acc: Map<string, { word: Omit<IWord, "mastery"> }>,
  surahNumber: number,
  rows: AcikWordRow[]
): void {
  for (const w of rows) {
    const arabic = (w.arabic ?? "").trim();
    const turkish = (w.turkish ?? "").trim();
    if (!arabic || !turkish) continue;
    const key = normalizeArabicKey(arabic);
    const root = formatRoot(w.root);
    const prev = acc.get(key);
    if (!prev) {
      acc.set(key, {
        word: {
          arabic,
          turkish,
          ...(root ? { root } : {}),
          surahNumbers: [surahNumber],
        },
      });
    } else {
      const nums = new Set(prev.word.surahNumbers);
      nums.add(surahNumber);
      prev.word.surahNumbers = Array.from(nums).sort((a, b) => a - b);
      if (!prev.word.root && root) prev.word.root = root;
    }
  }
}

export async function fetchCurriculumWordBankRaw(): Promise<
  Omit<IWord, "mastery">[]
> {
  const tasks = CURRICULUM_SURAHS.map(async surahNumber => {
    const n = surahVerseCount(surahNumber);
    const verseResults = await Promise.all(
      Array.from({ length: n }, (_, i) =>
        fetchWordsForVerse(surahNumber, i + 1)
      )
    );
    return { surahNumber, verseResults };
  });

  const bySurah = await Promise.all(tasks);
  const acc = new Map<string, { word: Omit<IWord, "mastery"> }>();

  for (const { surahNumber, verseResults } of bySurah) {
    for (const rows of verseResults) {
      mergeWordsFromSurah(acc, surahNumber, rows);
    }
  }

  return Array.from(acc.values()).map(x => x.word);
}

function parseCache(raw: string): WordBankCachePayload | null {
  try {
    const o = JSON.parse(raw) as WordBankCachePayload;
    if (!o || !Array.isArray(o.words) || typeof o.cachedAt !== "string")
      return null;
    return o;
  } catch {
    return null;
  }
}

export function readWordBankCache(): WordBankCachePayload | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(WORD_BANK_STORAGE_KEY);
  if (!raw) return null;
  return parseCache(raw);
}

export function cacheWordBankPayload(words: Omit<IWord, "mastery">[]): void {
  if (typeof window === "undefined") return;
  const payload: WordBankCachePayload = {
    words,
    cachedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(WORD_BANK_STORAGE_KEY, JSON.stringify(payload));
}

export function isCacheStale(cachedAtIso: string): boolean {
  const t = Date.parse(cachedAtIso);
  if (Number.isNaN(t)) return true;
  return Date.now() - t > WORD_BANK_TTL_MS;
}

/**
 * Kelime listesini döndürür (mastery ile birleşik).
 * Ağ: cache yok veya 24 saat geçtiyse veya force ise.
 */
export async function ensureWordBank(options?: {
  force?: boolean;
}): Promise<{ words: IWord[]; error: boolean }> {
  const force = options?.force ?? false;

  if (typeof window !== "undefined" && !force) {
    const cached = readWordBankCache();
    if (cached && !isCacheStale(cached.cachedAt)) {
      return { words: applyMasteryToWords(cached.words), error: false };
    }
  }

  try {
    const rawWords = await fetchCurriculumWordBankRaw();
    if (rawWords.length === 0) {
      const stale = typeof window !== "undefined" ? readWordBankCache() : null;
      if (stale?.words?.length) {
        return { words: applyMasteryToWords(stale.words), error: false };
      }
      return { words: [], error: true };
    }
    if (typeof window !== "undefined") {
      cacheWordBankPayload(rawWords);
    }
    return { words: applyMasteryToWords(rawWords), error: false };
  } catch {
    const cached = typeof window !== "undefined" ? readWordBankCache() : null;
    if (cached?.words?.length) {
      return { words: applyMasteryToWords(cached.words), error: false };
    }
    return { words: [], error: true };
  }
}
