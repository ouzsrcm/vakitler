import useTranslation from "next-translate/useTranslation";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function TrueFalseExercise({
  exercise,
  disabled,
  wrongPhase,
  selected,
  onPick,
}: {
  exercise: Exercise;
  disabled: boolean;
  wrongPhase: boolean;
  selected: string | null;
  onPick: (v: "yes" | "no") => void;
}) {
  const { t } = useTranslation("learn");
  const parts = exercise.question.split("\n");
  const prompt = parts[0] ?? exercise.question;
  const meal = parts.slice(1).join("\n");

  const btn = (val: "yes" | "no", label: string) => {
    const key = val;
    const isSel = selected === key;
    return (
      <button
        key={val}
        type="button"
        disabled={disabled}
        onClick={() => onPick(val)}
        className={cx(
          "flex min-h-[56px] flex-1 items-center justify-center rounded-2xl border-2 px-4 py-4 text-lg font-bold transition-colors disabled:opacity-50",
          "border-violet-200 bg-white text-zinc-800 hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-700",
          isSel &&
            wrongPhase &&
            "ring-2 ring-red-500 ring-offset-2 dark:ring-offset-zinc-900",
          isSel &&
            !wrongPhase &&
            disabled &&
            "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900"
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-5">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {prompt}
      </p>
      <p className="rounded-xl border border-violet-100 bg-white px-3 py-4 text-center text-sm leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
        {meal}
      </p>
      <div className="flex gap-3">
        {btn("yes", t("tfYes"))}
        {btn("no", t("tfNo"))}
      </div>
    </div>
  );
}
