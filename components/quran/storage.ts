export const LS_QURAN_LAST_AYAH = "VAKITLER_QURAN_AYAH";
export const LS_QURAN_NOTES = "VAKITLER_QURAN_NOTES";
export const LS_QURAN_READ_FONT = "VAKITLER_QURAN_READ_FONT";

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
