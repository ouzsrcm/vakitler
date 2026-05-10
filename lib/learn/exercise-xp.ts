import type { ExerciseType } from "./types";

/** Kolay: +10 | Orta: +15 | Zor: +20 */
export function xpForExerciseType(type: ExerciseType): 10 | 15 | 20 {
  switch (type) {
    case "listen":
    case "word-card":
    case "true-false":
      return 10;
    case "fill-blank":
    case "match":
    case "audio-match":
    case "surah-complete":
      return 15;
    case "sort":
    case "quick-memory":
    case "word-hunt":
      return 20;
  }
}
