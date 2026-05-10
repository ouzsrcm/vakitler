import { useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function SortExercise({
  exercise,
  disabled,
  wrongPhase,
  revealCorrect,
  onCheck,
}: {
  exercise: Exercise;
  disabled: boolean;
  wrongPhase: boolean;
  revealCorrect: boolean;
  onCheck: (correct: boolean) => void;
}) {
  const { t } = useTranslation("quran");
  const correct = (exercise.correctAnswer as string[]) ?? [];
  const pool = exercise.sortPool ?? [];

  const initialBank = useMemo(() => [...pool], [pool]);

  const [bank, setBank] = useState<string[]>(() => [...initialBank]);
  const [built, setBuilt] = useState<string[]>([]);

  const pickFromBank = (w: string, idx: number) => {
    if (disabled) return;
    setBank(prev => prev.filter((_, i) => i !== idx));
    setBuilt(prev => [...prev, w]);
  };

  const removeFromBuilt = (idx: number) => {
    if (disabled) return;
    const w = built[idx];
    if (!w) return;
    setBuilt(prev => prev.filter((_, i) => i !== idx));
    setBank(prev => [...prev, w]);
  };

  const handleCheck = () => {
    const ok =
      built.length === correct.length &&
      built.every((w, i) => w === correct[i]);
    onCheck(ok);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {exercise.question}
      </p>

      <div className="flex min-h-[52px] flex-wrap gap-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-3 dark:border-emerald-800 dark:bg-emerald-950/20">
        {built.length === 0 ? (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {t("learnSortTapHint")}
          </span>
        ) : (
          built.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={disabled}
              onClick={() => removeFromBuilt(i)}
              dir="rtl"
              className="rounded-lg border border-emerald-300 bg-white px-2 py-1.5 text-sm dark:border-emerald-700 dark:bg-zinc-900"
            >
              {w}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {bank.map((w, i) => (
          <button
            key={`${w}-bank-${i}`}
            type="button"
            disabled={disabled}
            onClick={() => pickFromBank(w, i)}
            dir="rtl"
            className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm hover:border-emerald-400 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:border-emerald-500"
          >
            {w}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={disabled || bank.length > 0}
        onClick={handleCheck}
        className="mt-auto rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 disabled:opacity-40"
      >
        {t("learnSortCheck")}
      </button>

      {wrongPhase && revealCorrect && (
        <p className="text-center text-xs text-red-700 dark:text-red-300" dir="rtl">
          {correct.join(" ")}
        </p>
      )}
    </div>
  );
}
