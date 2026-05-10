import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function WordCardExercise({
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
  const arabic = exercise.pairs?.[0]?.arabic ?? "";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {exercise.question}
      </p>

      <div
        className="mx-auto rounded-2xl border border-emerald-200 bg-emerald-50/80 px-6 py-10 dark:border-emerald-800 dark:bg-emerald-950/40"
        dir="rtl"
      >
        <p className="text-center text-3xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50">
          {arabic}
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
              className={cx(
                "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors disabled:opacity-60",
                "border-emerald-100 bg-white hover:border-emerald-400 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:border-emerald-500",
                isSel &&
                  wrongPhase &&
                  "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30",
                isSel &&
                  !wrongPhase &&
                  disabled &&
                  "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30"
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
