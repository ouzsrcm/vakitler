import { useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import type { IWord, WordMastery } from "@/lib/learn/words";
import {
  normalizeTurkishAnswer,
  setMasteryForArabic,
} from "@/lib/learn/words";
import { cx } from "@/utils/helper";
import ExerciseShell from "@/components/quran/learn/exercise-shell";
import type { FlashSessionStats } from "./flashcard-mode";

function masteryFromAttempts(wrong: number): WordMastery {
  if (wrong === 0) return 3;
  if (wrong === 1) return 2;
  return 1;
}

function bucketFromWrong(wrong: number): "easy" | "medium" | "hard" {
  if (wrong === 0) return "easy";
  if (wrong === 1) return "medium";
  return "hard";
}

export default function TypeMode({
  deck,
  onDone,
}: {
  deck: IWord[];
  onDone: (stats: FlashSessionStats) => void;
}) {
  const { t } = useTranslation("learn");
  const [queue, setQueue] = useState<IWord[]>(() => [...deck]);
  const [wrongOnCard, setWrongOnCard] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [stats, setStats] = useState<FlashSessionStats>({
    easy: 0,
    medium: 0,
    hard: 0,
    hardArabicKeys: [],
  });
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const current = queue[0];
  const total = deck.length;

  if (!current) return null;

  const solvedCount = total - queue.length;

  const check = () => {
    if (feedback !== "idle") return;
    const ok =
      normalizeTurkishAnswer(value) ===
      normalizeTurkishAnswer(current.turkish);
    if (ok) {
      setFeedback("correct");
      const w = wrongOnCard;
      setMasteryForArabic(current.arabic, masteryFromAttempts(w));
      const bucket = bucketFromWrong(w);
      const prev = statsRef.current;
      const nextStats: FlashSessionStats = {
        easy: prev.easy + (bucket === "easy" ? 1 : 0),
        medium: prev.medium + (bucket === "medium" ? 1 : 0),
        hard: prev.hard + (bucket === "hard" ? 1 : 0),
        hardArabicKeys:
          bucket === "hard"
            ? [...prev.hardArabicKeys, current.arabic]
            : prev.hardArabicKeys,
      };
      statsRef.current = nextStats;
      setStats(nextStats);
      window.setTimeout(() => {
        setQueue(prev => {
          const [, ...rest] = prev;
          if (rest.length === 0) {
            window.queueMicrotask(() => onDone(nextStats));
          }
          return rest;
        });
        setWrongOnCard(0);
        setValue("");
        setFeedback("idle");
      }, 480);
    } else {
      setFeedback("wrong");
      setWrongOnCard(c => c + 1);
      window.setTimeout(() => setFeedback("idle"), 500);
    }
  };

  return (
    <ExerciseShell
      currentIndex={solvedCount}
      total={total}
      feedback={feedback}
      exitHref="/learn?tab=words"
    >
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("words.typePrompt")}
        </p>
        <div
          className="mx-auto rounded-2xl border border-violet-200 bg-violet-50/80 px-6 py-8 dark:border-zinc-600 dark:bg-zinc-800/80"
          dir="rtl"
        >
          <p className="text-center text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {current.arabic}
          </p>
        </div>
        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {t("words.typeLabel")}
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="mt-1 w-full rounded-xl border border-violet-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </label>
        <button
          type="button"
          onClick={check}
          disabled={feedback !== "idle" || !value.trim()}
          className={cx(
            "rounded-xl bg-violet-500 py-3 text-sm font-bold text-white hover:bg-violet-600 disabled:opacity-50"
          )}
        >
          {t("words.typeCheck")}
        </button>
      </div>
    </ExerciseShell>
  );
}
