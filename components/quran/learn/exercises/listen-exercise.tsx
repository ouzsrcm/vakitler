import { useEffect, useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function ListenExercise({
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
  onSelect: (label: string) => void;
}) {
  const { t } = useTranslation("learn");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !exercise.audioUrl) return;
    el.src = exercise.audioUrl;
    el.currentTime = 0;
    void el.play().catch(() => {});
  }, [exercise.audioUrl]);

  const opts = exercise.options ?? [];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {exercise.question}
      </p>

      <audio ref={audioRef} className="hidden" preload="auto" />

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          void audioRef.current?.play();
        }}
        className="mx-auto rounded-full border border-violet-300 bg-violet-50 px-5 py-2 text-sm font-medium text-violet-800 transition-colors hover:bg-violet-100 disabled:opacity-50 dark:border-violet-600 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-900/60"
      >
        {t("listenAgain")}
      </button>

      <div className="mt-2 grid gap-2">
        {opts.map(opt => {
          const lines = opt.split("\n");
          const line1 = lines[0] ?? opt;
          const line2 = lines.slice(1).join("\n");
          const isSel = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(opt)}
              className={cx(
                "rounded-xl border px-3 py-3 text-left text-sm transition-colors disabled:opacity-60",
                "border-violet-200 bg-white hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-900 dark:hover:bg-zinc-700",
                isSel &&
                  wrongPhase &&
                  "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900",
                isSel &&
                  !wrongPhase &&
                  disabled &&
                  "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900"
              )}
            >
              <span className="block font-medium text-zinc-800 dark:text-zinc-100">
                {line1}
              </span>
              {line2 ? (
                <span className="mt-1 block text-lg text-zinc-700 dark:text-zinc-200" dir="rtl">
                  {line2}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
