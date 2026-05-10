import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { ARABIC_LETTERS, type ILetter } from "@/data/arabic-alphabet";
import { bumpElifbaMastery } from "@/lib/learn/elifba-progress";
import { shuffleArray } from "@/lib/learn/words";
import { cx } from "@/utils/helper";
import ElifbaPracticeShell from "../elifba-practice-shell";
import type { ElifbaRunStats } from "../elifba-practice-result";

function otherNames(cur: ILetter, n: number): string[] {
  const pool = shuffleArray(
    ARABIC_LETTERS.filter(l => l.slug !== cur.slug).map(l => l.name)
  );
  return pool.slice(0, n);
}

export default function LetterNameExercise({
  deck,
  onExit,
  onFinish,
}: {
  deck: ILetter[];
  onExit: () => void;
  onFinish: (stats: ElifbaRunStats) => void;
}) {
  const { t } = useTranslation("learn");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPhase, setWrongPhase] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const statsRef = useRef<ElifbaRunStats>({
    correct: 0,
    wrong: 0,
    newlyMasteredSlugs: [],
  });

  const current = deck[index];
  const total = deck.length;

  const options = useMemo(() => {
    if (!current) return [];
    return shuffleArray([current.name, ...otherNames(current, 3)]);
  }, [current]);

  const recordNewMaster = (slug: string) => {
    if (!statsRef.current.newlyMasteredSlugs.includes(slug)) {
      statsRef.current.newlyMasteredSlugs.push(slug);
    }
  };

  const onPick = (name: string) => {
    if (!current || disabled) return;
    if (name === current.name) {
      setSelected(name);
      setDisabled(true);
      setFeedback("correct");
      const { prev, next } = bumpElifbaMastery(current.slug);
      if (next === 3 && prev < 3) recordNewMaster(current.slug);
      statsRef.current.correct += 1;
      window.setTimeout(() => {
        if (index + 1 >= total) {
          onFinish({ ...statsRef.current });
          return;
        }
        setIndex(i => i + 1);
        setSelected(null);
        setDisabled(false);
        setFeedback("idle");
      }, 420);
    } else {
      setSelected(name);
      setWrongPhase(true);
      setFeedback("wrong");
      statsRef.current.wrong += 1;
      window.setTimeout(() => {
        setWrongPhase(false);
        setSelected(null);
        setFeedback("idle");
      }, 500);
    }
  };

  if (!current) return null;

  return (
    <ElifbaPracticeShell
      currentIndex={index}
      total={total}
      onExit={onExit}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, x: 280 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-4"
        >
          <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {t("elifba.exNamePrompt")}
          </p>
          <div
            className={cx(
              "rounded-2xl border p-8 text-center transition-colors duration-300",
              feedback === "correct" &&
                "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/40",
              feedback === "wrong" &&
                "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/30",
              feedback === "idle" &&
                "border-violet-100 bg-white dark:border-zinc-700 dark:bg-zinc-800"
            )}
          >
            <p
              className="font-arabic text-7xl font-bold text-zinc-900 dark:text-zinc-50"
              dir="rtl"
            >
              {current.arabic}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {options.map((opt, idx) => {
              const isSel = selected === opt;
              return (
                <motion.button
                  key={`${current.slug}-${idx}-${opt}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(opt)}
                  animate={
                    feedback === "wrong" && isSel
                      ? { x: [0, -8, 8, -8, 8, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.45 }}
                  className={cx(
                    "rounded-xl border px-2 py-3 text-sm font-semibold transition-colors disabled:opacity-60",
                    "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700",
                    isSel &&
                      wrongPhase &&
                      "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30",
                    isSel &&
                      !wrongPhase &&
                      disabled &&
                      "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/40"
                  )}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </ElifbaPracticeShell>
  );
}
