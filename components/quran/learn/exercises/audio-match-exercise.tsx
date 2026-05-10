import { useEffect, useRef } from "react";
import { IconRotateClockwise } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import type { Exercise } from "@/lib/learn/types";
import { cx } from "@/utils/helper";

export default function AudioMatchExercise({
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
  onSelect: (meal: string) => void;
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

  const replay = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    void el.play().catch(() => {});
  };

  return (
    <div className="relative flex flex-1 flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 pt-1 text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {exercise.question}
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={replay}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-800 transition-colors hover:bg-violet-100 disabled:opacity-40 dark:border-violet-700 dark:bg-violet-950/50 dark:text-violet-200 dark:hover:bg-violet-900/60"
          aria-label={t("listenAgain")}
        >
          <IconRotateClockwise size={14} />
          {t("listenAgain")}
        </button>
      </div>

      <audio ref={audioRef} className="hidden" preload="auto" />

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
                "rounded-xl border px-3 py-3 text-left text-sm leading-snug transition-colors disabled:opacity-60",
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
