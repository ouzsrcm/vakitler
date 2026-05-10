export type ExerciseType =
  | "listen"
  | "word-card"
  | "fill-blank"
  | "match"
  | "sort";

export interface Exercise {
  type: ExerciseType;
  surahNumber: number;
  verseNumber?: number;
  question: string;
  correctAnswer: string | string[];
  options?: string[];
  pairs?: { arabic: string; turkish: string }[];
  audioUrl?: string;
  /** Sıralama: üstte gösterilecek karışık kelimeler */
  sortPool?: string[];
}

export interface LessonWord {
  verseNumber: number;
  arabic: string;
  turkish: string;
  sortIndex: number;
}

export interface LessonAyah {
  numberInSurah: number;
  arabic: string;
  mealTr: string;
}

export interface LessonData {
  surahNumber: number;
  ayahs: LessonAyah[];
  words: LessonWord[];
}

export interface ExerciseMessages {
  listen: string;
  wordCard: string;
  fillBlank: string;
  match: string;
  sort: string;
}
