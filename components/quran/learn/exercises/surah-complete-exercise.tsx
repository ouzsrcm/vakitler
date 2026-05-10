import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function SurahCompleteExercise({
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
  onSelect: (fragment: string) => void;
}) {
  const prefix = exercise.arabicPrefix ?? "";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {exercise.question}
      </p>

      <div
        className="rounded-2xl border border-violet-100 bg-violet-50/80 px-3 py-4 dark:border-zinc-600 dark:bg-zinc-800/80"
        dir="rtl"
      >
        <p className="text-center text-2xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50">
          {prefix}
          <span className="mx-1 text-emerald-500">⋯</span>
        </p>
      </div>

      <div className="grid gap-2">
        {(exercise.options ?? []).map(opt => {
          const isSel = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              dir="rtl"
              className={cx(
                "rounded-xl border px-3 py-3 text-left text-lg leading-snug transition-colors disabled:opacity-60",
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
