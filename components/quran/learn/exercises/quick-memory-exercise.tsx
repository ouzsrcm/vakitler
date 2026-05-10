import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

const R = 50;
const CIRC = 2 * Math.PI * R;

export default function QuickMemoryExercise({
  exercise,
  disabled,
  wrongPhase,
  selected,
  onSelect,
}: {
  exercise: Exercise;
  disabled: boolean;
  wrongPhase: boolean;
  selected: string | null;
  onSelect: (meaning: string) => void;
}) {
  const { t } = useTranslation("learn");
  const arabic = exercise.flashArabic ?? exercise.pairs?.[0]?.arabic ?? "";
  const [phase, setPhase] = useState<"flash" | "quiz">("flash");
  const [tick, setTick] = useState(3);

  useEffect(() => {
    if (phase !== "flash") return;
    setTick(3);
    const t1 = window.setTimeout(() => setTick(2), 1000);
    const t2 = window.setTimeout(() => setTick(1), 2000);
    const t3 = window.setTimeout(() => setPhase("quiz"), 3000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [phase]);

  if (phase === "flash") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-4">
        <p className="text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {exercise.question}
        </p>

        <div className="relative flex flex-col items-center">
          <svg
            className="h-32 w-32 -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="8"
              className="stroke-zinc-200 dark:stroke-zinc-700"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className="stroke-violet-500"
              strokeDasharray={CIRC}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: CIRC }}
              transition={{ duration: 3, ease: "linear" }}
            />
          </svg>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl font-bold text-violet-600 dark:text-violet-400">
            {tick}
          </span>
        </div>

        <motion.div
          className="max-w-full px-2"
          dir="rtl"
          animate={{ filter: ["blur(0px)", "blur(0px)", "blur(6px)"], opacity: [1, 1, 0.25] }}
          transition={{ duration: 3, times: [0, 0.85, 1], ease: "easeIn" }}
        >
          <p className="text-center text-4xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50">
            {arabic}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {t("quickMemoryAsk")}
      </p>

      <div className="grid gap-2">
        {(exercise.options ?? []).map(opt => {
          const isSel = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
