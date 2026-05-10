import { LEARN_CURRICULUM, lessonForSurah } from "@/data/learn-curriculum";

const KEY_PROGRESS = "VAKITLER_LEARN_PROGRESS";
const KEY_XP = "VAKITLER_LEARN_XP";
const KEY_STREAK = "VAKITLER_LEARN_STREAK";

export interface LessonProgressEntry {
  stars: 0 | 1 | 2 | 3;
  xp: number;
  completedAt: string;
}

export interface LearnProgressMap {
  [surahNumber: string]: LessonProgressEntry;
}

export interface StreakState {
  count: number;
  lastDate: string;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function safeParseProgress(raw: string | null): LearnProgressMap {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as LearnProgressMap;
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function getProgress(): LearnProgressMap {
  if (typeof window === "undefined") return {};
  return safeParseProgress(localStorage.getItem(KEY_PROGRESS));
}

export function getLessonProgress(surahNo: number): LessonProgressEntry | null {
  const p = getProgress();
  const e = p[String(surahNo)];
  return e ?? null;
}

export function isLessonCompleted(surahNo: number): boolean {
  const e = getLessonProgress(surahNo);
  return !!e && e.stars > 0;
}

export function getXP(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY_XP);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(KEY_STREAK);
  if (!raw) return 0;
  try {
    const s = JSON.parse(raw) as StreakState;
    if (!s || typeof s.count !== "number" || typeof s.lastDate !== "string") {
      return 0;
    }
    const today = todayISO();
    const y = yesterdayISO();
    if (s.lastDate === today || s.lastDate === y) {
      return s.count;
    }
    return 0;
  } catch {
    return 0;
  }
}

function readStreakState(): StreakState {
  if (typeof window === "undefined") return { count: 0, lastDate: "" };
  const raw = localStorage.getItem(KEY_STREAK);
  if (!raw) return { count: 0, lastDate: "" };
  try {
    const s = JSON.parse(raw) as StreakState;
    if (!s || typeof s.count !== "number" || typeof s.lastDate !== "string") {
      return { count: 0, lastDate: "" };
    }
    return s;
  } catch {
    return { count: 0, lastDate: "" };
  }
}

/** Seriyi güncelle; bugünün ilk tamamlamada bir artır (veya sıfırla). */
function bumpStreak(): void {
  const today = todayISO();
  const yest = yesterdayISO();
  let prev = readStreakState();

  if (prev.lastDate === today) {
    return;
  }

  let nextCount = 1;
  if (prev.lastDate === yest) {
    nextCount = prev.count + 1;
  }

  const next: StreakState = { count: nextCount, lastDate: today };
  localStorage.setItem(KEY_STREAK, JSON.stringify(next));
}

export function isUnlocked(surahNo: number): boolean {
  const lesson = lessonForSurah(surahNo);
  if (!lesson) return false;
  if (lesson.unlocksAfter.length === 0) return true;
  return lesson.unlocksAfter.every(req => isLessonCompleted(req));
}

let lastLessonSave: { surah: number; xp: number; t: number } | null = null;

export function saveLesson(
  surahNo: number,
  stars: 0 | 1 | 2 | 3,
  lessonXp: number
): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (
    lastLessonSave &&
    lastLessonSave.surah === surahNo &&
    lastLessonSave.xp === lessonXp &&
    now - lastLessonSave.t < 750
  ) {
    return;
  }
  lastLessonSave = { surah: surahNo, xp: lessonXp, t: now };

  const progress = safeParseProgress(localStorage.getItem(KEY_PROGRESS));
  const key = String(surahNo);
  const prev = progress[key];
  const nextStars =
    prev && prev.stars > stars ? (prev.stars as 0 | 1 | 2 | 3) : stars;

  progress[key] = {
    stars: nextStars,
    xp: lessonXp,
    completedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));

  const total = getXP() + lessonXp;
  localStorage.setItem(KEY_XP, String(total));

  if (stars >= 1) {
    bumpStreak();
  }
}

/** Müfredattaki kilit: önceki seviye tamamlanmadan üst seviye kapalı. */
export function isLevelLocked(level: 1 | 2 | 3): boolean {
  const lessonsInLevel = LEARN_CURRICULUM.filter(l => l.level === level);
  if (lessonsInLevel.length === 0) return false;
  const first = lessonsInLevel[0];
  if (first.unlocksAfter.length === 0) return false;
  return !first.unlocksAfter.every(isLessonCompleted);
}
