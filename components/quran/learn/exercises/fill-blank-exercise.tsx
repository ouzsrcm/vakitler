import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function FillBlankExercise({
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
  onSelect: (word: string) => void;
}) {
  const qParts = exercise.question.split("\n");
  const prompt = qParts[0] ?? "";
  const masked = qParts.slice(1).join("\n");

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {prompt}
      </p>
      <p className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-4 text-center text-sm leading-relaxed text-zinc-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-zinc-100">
        {masked}
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
