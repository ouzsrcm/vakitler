/** Quran read mode: font presets (px) and localStorage keys. */

import { LS_QURAN_READ_FONT } from "@/components/quran/storage";

export type QuranFontSizeKey = "sm" | "md" | "lg" | "xl";

export const QURAN_FONT_PX: Record<QuranFontSizeKey, number> = {
  sm: 18,
  md: 22,
  lg: 28,
  xl: 34,
};

export const LS_QURAN_FONT_SIZE = "VAKITLER_QURAN_FONT_SIZE";
export const LS_QURAN_SHOW_MEAL = "VAKITLER_QURAN_SHOW_MEAL";

export function scrollStorageKey(surahNo: number): string {
  return `VAKITLER_QURAN_SCROLL_${surahNo}`;
}

function parseFontKey(v: unknown): QuranFontSizeKey | null {
  if (v === "sm" || v === "md" || v === "lg" || v === "xl") return v;
  return null;
}

export function readFontSizeKey(): QuranFontSizeKey {
  if (typeof window === "undefined") return "md";
  try {
    const raw = localStorage.getItem(LS_QURAN_FONT_SIZE);
    const k = parseFontKey(raw);
    if (k) return k;
    const legacy = localStorage.getItem(LS_QURAN_READ_FONT);
    const n = legacy ? parseInt(legacy, 10) : NaN;
    if (Number.isFinite(n)) {
      const entries = Object.entries(QURAN_FONT_PX) as [QuranFontSizeKey, number][];
      let best: QuranFontSizeKey = "md";
      let bestDiff = Infinity;
      for (const [key, px] of entries) {
        const d = Math.abs(px - n);
        if (d < bestDiff) {
          bestDiff = d;
          best = key;
        }
      }
      return best;
    }
  } catch {
    /* ignore */
  }
  return "md";
}

export function writeFontSizeKey(key: QuranFontSizeKey) {
  try {
    localStorage.setItem(LS_QURAN_FONT_SIZE, key);
  } catch {
    /* ignore */
  }
}

export function readShowMeal(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(LS_QURAN_SHOW_MEAL);
    if (raw === null) return true;
    return raw === "1" || raw === "true";
  } catch {
    return true;
  }
}

export function writeShowMeal(show: boolean) {
  try {
    localStorage.setItem(LS_QURAN_SHOW_MEAL, show ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readScrollY(surahNo: number): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(scrollStorageKey(surahNo));
    const n = raw ? parseFloat(raw) : NaN;
    if (!Number.isFinite(n) || n < 0) return null;
    return n;
  } catch {
    return null;
  }
}

export function writeScrollY(surahNo: number, y: number) {
  try {
    localStorage.setItem(scrollStorageKey(surahNo), String(Math.round(y)));
  } catch {
    /* ignore */
  }
}
