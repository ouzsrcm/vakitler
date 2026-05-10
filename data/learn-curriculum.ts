export type LearnLevel = 1 | 2 | 3;

export interface ILesson {
  surahNumber: number;
  level: LearnLevel;
  /** Tamamlanması gereken önceki sure numaraları (boş = önkoşul yok). */
  unlocksAfter: number[];
}

/** Kısa sureler — Duolingo tarzı müfredat */
export const LEARN_CURRICULUM: ILesson[] = [
  // Seviye 1
  { surahNumber: 114, level: 1, unlocksAfter: [] },
  { surahNumber: 113, level: 1, unlocksAfter: [] },
  { surahNumber: 112, level: 1, unlocksAfter: [] },
  { surahNumber: 108, level: 1, unlocksAfter: [] },
  // Seviye 2
  { surahNumber: 105, level: 2, unlocksAfter: [114, 113, 112, 108] },
  { surahNumber: 106, level: 2, unlocksAfter: [114, 113, 112, 108] },
  { surahNumber: 107, level: 2, unlocksAfter: [114, 113, 112, 108] },
  { surahNumber: 109, level: 2, unlocksAfter: [114, 113, 112, 108] },
  // Seviye 3
  { surahNumber: 103, level: 3, unlocksAfter: [105, 106, 107, 109] },
  { surahNumber: 99, level: 3, unlocksAfter: [105, 106, 107, 109] },
  { surahNumber: 100, level: 3, unlocksAfter: [105, 106, 107, 109] },
  { surahNumber: 101, level: 3, unlocksAfter: [105, 106, 107, 109] },
];

export function lessonForSurah(surahNumber: number): ILesson | undefined {
  return LEARN_CURRICULUM.find(l => l.surahNumber === surahNumber);
}

export function lessonsByLevel(level: LearnLevel): ILesson[] {
  return LEARN_CURRICULUM.filter(l => l.level === level);
}
