import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import type { IWord, WordMastery } from "@/lib/learn/words";
import { setMasteryForArabic, shuffleArray } from "@/lib/learn/words";
import { cx } from "@/utils/helper";
import ExerciseShell from "@/components/quran/learn/exercise-shell";
import type { FlashSessionStats } from "./flashcard-mode";

function pickDecoys(all: IWord[], correct: IWord, n: number): string[] {
  const cand = shuffleArray(
    all.filter(w => w.arabic !== correct.arabic && w.turkish !== correct.turkish)
  );
  const uniq: string[] = [];
  for (const w of cand) {
    const t = w.turkish.trim();
    if (t && !uniq.includes(t)) uniq.push(t);
    if (uniq.length >= n) break;
  }
  let i = 0;
  while (uniq.length < n && cand.length > 0) {
    const w = cand[i % cand.length];
    const t = (w?.turkish ?? "").trim() || "?";
    const label = uniq.includes(t) ? `${t} (${i})` : t;
    uniq.push(label);
    i += 1;
  }
  return uniq.slice(0, n);
}

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

export default function MultiChoiceMode({
  deck,
  wordPool,
  onDone,
}: {
  deck: IWord[];
  wordPool: IWord[];
  onDone: (stats: FlashSessionStats) => void;
}) {
  const { t } = useTranslation("learn");
  const [queue, setQueue] = useState<IWord[]>(() => [...deck]);
  const [wrongOnCard, setWrongOnCard] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPhase, setWrongPhase] = useState(false);
  const [disabled, setDisabled] = useState(false);
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

  const options = useMemo(() => {
    if (!current) return [];
    const decoys = pickDecoys(wordPool, current, 3);
    return shuffleArray([current.turkish, ...decoys]);
  }, [current, wordPool]);

  if (!current) return null;

  const solvedCount = total - queue.length;

  const onSelect = (opt: string) => {
    if (disabled) return;
    if (opt === current.turkish) {
      setSelected(opt);
      setDisabled(true);
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
        setSelected(null);
        setDisabled(false);
        setFeedback("idle");
      }, 520);
    } else {
      setSelected(opt);
      setWrongPhase(true);
      setFeedback("wrong");
      setWrongOnCard(c => c + 1);
      window.setTimeout(() => {
        setWrongPhase(false);
        setSelected(null);
        setFeedback("idle");
        setQueue(q => {
          const [head, ...rest] = q;
          return [...rest, head];
        });
      }, 650);
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
          {t("words.multiPrompt")}
        </p>
        <div
          className="mx-auto rounded-2xl border border-violet-200 bg-violet-50/80 px-6 py-10 dark:border-zinc-600 dark:bg-zinc-800/80"
          dir="rtl"
        >
          <p className="text-center text-3xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50">
            {current.arabic}
          </p>
        </div>
        <div className="grid gap-2">
          {options.map((opt, idx) => {
            const isSel = selected === opt;
            return (
              <motion.button
                key={`${current.arabic}-${idx}-${opt}`}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(opt)}
                animate={
                  feedback === "wrong" && isSel
                    ? { x: [0, -10, 10, -10, 10, 0] }
                    : { x: 0 }
                }
                transition={{ duration: 0.45 }}
                className={cx(
                  "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors disabled:opacity-60",
                  "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700",
                  isSel &&
                    wrongPhase &&
                    "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30",
                  isSel &&
                    !wrongPhase &&
                    disabled &&
                    "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900"
                )}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
}
