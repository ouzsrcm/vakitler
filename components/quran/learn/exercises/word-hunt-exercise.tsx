import { useState } from "react";
import { motion } from "framer-motion";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function WordHuntExercise({
  exercise,
  disabled,
  onCorrect,
  onWrongTap,
}: {
  exercise: Exercise;
  disabled: boolean;
  onCorrect: () => void;
  onWrongTap: () => void;
}) {
  const cards = exercise.wordHuntCards ?? [];
  const lines = exercise.question.split("\n");
  const prompt = lines[0] ?? exercise.question;
  const hintMeaning = lines.slice(1).join("\n");

  const [wrongIx, setWrongIx] = useState<number | null>(null);
  const [correctPulse, setCorrectPulse] = useState(false);

  const mergedDisabled = disabled || correctPulse;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {prompt}
        </p>
        {hintMeaning ? (
          <p className="mt-2 text-lg font-bold text-violet-700 dark:text-violet-400">
            {hintMeaning}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cards.map((c, i) => (
          <motion.button
            key={`${c.arabic}-${i}`}
            type="button"
            disabled={mergedDisabled}
            dir="rtl"
            animate={
              wrongIx === i
                ? { x: [0, -8, 8, -8, 8, 0] }
                : correctPulse && c.correct
                  ? { scale: [1, 1.08, 1.05] }
                  : {}
            }
            transition={
              wrongIx === i
                ? { duration: 0.38 }
                : { duration: 0.35 }
            }
            onClick={() => {
              if (mergedDisabled) return;
              if (c.correct) {
                setCorrectPulse(true);
                window.setTimeout(() => onCorrect(), 320);
              } else {
                setWrongIx(i);
                onWrongTap();
                window.setTimeout(() => setWrongIx(null), 420);
              }
            }}
            className={cx(
              "min-h-[72px] rounded-xl border px-2 py-3 text-base font-medium transition-colors",
              "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700",
              wrongIx === i &&
                "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900",
              correctPulse &&
                c.correct &&
                "border-emerald-500 bg-emerald-50 shadow-md dark:border-emerald-500 dark:bg-emerald-900",
              mergedDisabled && !c.correct && wrongIx !== i && "opacity-40"
            )}
          >
            {c.arabic}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
