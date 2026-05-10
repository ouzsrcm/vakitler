import useTranslation from "next-translate/useTranslation";
import type { FlashSessionStats } from "./flashcard-mode";

export default function PracticeResult({
  stats,
  onRepeatHard,
  onDone,
}: {
  stats: FlashSessionStats;
  onRepeatHard: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation("learn");
  const hasHard = stats.hardArabicKeys.length > 0;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("words.resultTitle")}
      </h2>
      <ul className="w-full space-y-2 text-left text-sm text-zinc-700 dark:text-zinc-200">
        <li className="flex justify-between gap-2">
          <span>{t("words.resultEasy")}</span>
          <span className="font-semibold">{stats.easy}</span>
        </li>
        <li className="flex justify-between gap-2">
          <span>{t("words.resultMedium")}</span>
          <span className="font-semibold">{stats.medium}</span>
        </li>
        <li className="flex justify-between gap-2">
          <span>{t("words.resultHard")}</span>
          <span className="font-semibold">{stats.hard}</span>
        </li>
      </ul>

      {hasHard ? (
        <>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("words.resultHardAgain")}
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onDone}
              className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              {t("words.resultNo")}
            </button>
            <button
              type="button"
              onClick={onRepeatHard}
              className="flex-1 rounded-xl bg-violet-500 py-3 text-sm font-bold text-white hover:bg-violet-600"
            >
              {t("words.resultYes")}
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={onDone}
          className="w-full rounded-xl bg-violet-500 py-3 text-sm font-bold text-white hover:bg-violet-600"
        >
          {t("words.resultClose")}
        </button>
      )}
    </div>
  );
}
