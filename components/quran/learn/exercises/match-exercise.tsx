import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function MatchExercise({
  exercise,
  disabled,
  onSolved,
}: {
  exercise: Exercise;
  disabled: boolean;
  onSolved: () => void;
}) {
  const pairs = exercise.pairs ?? [];

  const turkishShuffled = useMemo(
    () =>
      [...pairs]
        .sort(() => Math.random() - 0.5)
        .map(p => p.turkish),
    [pairs]
  );

  const [leftSel, setLeftSel] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);

  const matchedCount = matched.length / 2;

  const tryPair = (arabic: string, turkish: string) => {
    const ok = pairs.some(p => p.arabic === arabic && p.turkish === turkish);
    if (!ok) return;
    const key = `${arabic}|${turkish}`;
    if (matched.includes(arabic) || matched.includes(turkish)) return;
    const next = [...matched, arabic, turkish];
    setMatched(next);
    setLeftSel(null);
    if (next.length === pairs.length * 2) {
      onSolved();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {exercise.question}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {pairs.map(p => {
            const done = matched.includes(p.arabic);
            const active = leftSel === p.arabic;
            return (
              <button
                key={p.arabic}
                type="button"
                disabled={disabled || done}
                onClick={() =>
                  setLeftSel(prev => (prev === p.arabic ? null : p.arabic))
                }
                dir="rtl"
                className={cx(
                  "rounded-xl border px-2 py-3 text-center text-base transition-colors",
                  done &&
                    "border-emerald-500 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-100",
                  !done &&
                    active &&
                    "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-zinc-900",
                  !done &&
                    !active &&
                    "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                )}
              >
                {p.arabic}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {turkishShuffled.map((t, ti) => {
            const done = matched.includes(t);
            return (
              <button
                key={`${t}-${ti}`}
                type="button"
                disabled={disabled || done || !leftSel}
                onClick={() => {
                  if (!leftSel) return;
                  tryPair(leftSel, t);
                }}
                className={cx(
                  "rounded-xl border px-2 py-3 text-center text-sm transition-colors",
                  done &&
                    "border-emerald-500 bg-emerald-100 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-900/40 dark:text-emerald-100",
                  !done &&
                    "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        {matchedCount} / {pairs.length}
      </p>
    </div>
  );
}
