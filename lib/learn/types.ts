export type ExerciseType =
  | "listen"
  | "word-card"
  | "fill-blank"
  | "match"
  | "sort"
  | "true-false"
  | "audio-match"
  | "quick-memory"
  | "surah-complete"
  | "word-hunt";

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
  /** Bu egzersiz için kazanılan XP (doğru veya yanlış sonrası devam) */
  xpReward: 10 | 15 | 20;
  /** Tip 6: meal gerçekten bu sureye mi ait */
  belongsToSurah?: boolean;
  /** Tip 8–10: gösterim / seçenek için */
  flashArabic?: string;
  /** Tip 10 */
  wordHuntCards?: { arabic: string; correct: boolean }[];
  /** Tip 9 */
  arabicPrefix?: string;
}

export interface LessonWord {
  verseNumber: number;
  arabic: string;
  turkish: string;
  sortIndex: number;
}

export interface LessonAyah {
  numberInSurah: number;
  /** api.alquran.cloud ayah.number — ayet ses dosyası için */
  globalAyahNumber: number;
  arabic: string;
  mealTr: string;
}

export interface LessonData {
  surahNumber: number;
  ayahs: LessonAyah[];
  words: LessonWord[];
  /** Tip 6 için başka surelerden örnek Türkçe meal parçaları */
  decoyMealsTr: string[];
}

export interface ExerciseMessages {
  listen: string;
  wordCard: string;
  fillBlank: string;
  match: string;
  sort: string;
  trueFalse: string;
  audioMatch: string;
  quickMemory: string;
  surahComplete: string;
  wordHunt: string;
}
