export const LS_QURAN_LAST_AYAH = "VAKITLER_QURAN_AYAH";
export const LS_QURAN_NOTES = "VAKITLER_QURAN_NOTES";
export const LS_QURAN_READ_FONT = "VAKITLER_QURAN_READ_FONT";
export const LS_QURAN_FAVORITES = "VAKITLER_QURAN_FAVORITES";
export const LS_QURAN_LAST_PLAYED = "VAKITLER_QURAN_LAST_PLAYED";

export type LastPlayedPayload = {
  surahNumber: number;
  currentTime: number;
  savedAt: string;
};

export function readFavorites(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_QURAN_FAVORITES);
    if (!raw) return [];
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((n): n is number => typeof n === "number" && n >= 1 && n <= 114);
  } catch {
    return [];
  }
}

export function writeFavorites(ids: number[]) {
  try {
    localStorage.setItem(LS_QURAN_FAVORITES, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function readLastPlayed(): LastPlayedPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_QURAN_LAST_PLAYED);
    if (!raw) return null;
    const v = JSON.parse(raw) as unknown;
    if (
      v &&
      typeof v === "object" &&
      typeof (v as LastPlayedPayload).surahNumber === "number" &&
      typeof (v as LastPlayedPayload).currentTime === "number" &&
      typeof (v as LastPlayedPayload).savedAt === "string"
    ) {
      return v as LastPlayedPayload;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeLastPlayed(payload: LastPlayedPayload) {
  try {
    localStorage.setItem(LS_QURAN_LAST_PLAYED, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function clearLastPlayed() {
  try {
    localStorage.removeItem(LS_QURAN_LAST_PLAYED);
  } catch {
    /* ignore */
  }
}

export type LastAyahPayload = { surah: number; ayah: number };

export function readLastAyah(): LastAyahPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_QURAN_LAST_AYAH);
    if (!raw) return null;
    const v = JSON.parse(raw) as unknown;
    if (
      v &&
      typeof v === "object" &&
      "surah" in v &&
      "ayah" in v &&
      typeof (v as LastAyahPayload).surah === "number" &&
      typeof (v as LastAyahPayload).ayah === "number"
    ) {
      return v as LastAyahPayload;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeLastAyah(payload: LastAyahPayload) {
  try {
    localStorage.setItem(LS_QURAN_LAST_AYAH, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export type QuranNotesMap = Record<string, string>;

export function readNotes(): QuranNotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_QURAN_NOTES);
    if (!raw) return {};
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v as QuranNotesMap;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function writeNotes(map: QuranNotesMap) {
  try {
    localStorage.setItem(LS_QURAN_NOTES, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
