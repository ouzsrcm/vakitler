export type ElifbaMastery = 0 | 1 | 2 | 3;

export const ELIFBA_MASTERY_KEY = "VAKITLER_ELIFBA_MASTERY";

export function loadElifbaMastery(): Record<string, ElifbaMastery> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ELIFBA_MASTERY_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, ElifbaMastery> = {};
    for (const [k, v] of Object.entries(o)) {
      const n = Number(v);
      if (n === 0 || n === 1 || n === 2 || n === 3) out[k] = n;
    }
    return out;
  } catch {
    return {};
  }
}

export function getElifbaMastery(slug: string): ElifbaMastery {
  return loadElifbaMastery()[slug] ?? 0;
}

export function setElifbaMastery(slug: string, value: ElifbaMastery): void {
  if (typeof window === "undefined") return;
  const map = loadElifbaMastery();
  map[slug] = value;
  window.localStorage.setItem(ELIFBA_MASTERY_KEY, JSON.stringify(map));
}

/** Doğru cevapta +1, tavan 3 */
export function bumpElifbaMastery(
  slug: string
): { prev: ElifbaMastery; next: ElifbaMastery } {
  const prev = getElifbaMastery(slug);
  const next = Math.min(3, prev + 1) as ElifbaMastery;
  setElifbaMastery(slug, next);
  return { prev, next };
}

export function cycleElifbaMastery(slug: string): ElifbaMastery {
  const cur = getElifbaMastery(slug);
  const next = (((cur + 1) % 4) | 0) as ElifbaMastery;
  setElifbaMastery(slug, next);
  return next;
}

export function countLearnedLetters(slugs: readonly string[]): number {
  const m = loadElifbaMastery();
  return slugs.filter(s => (m[s] ?? 0) >= 3).length;
}
