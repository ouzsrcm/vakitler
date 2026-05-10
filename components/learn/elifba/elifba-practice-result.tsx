import useTranslation from "next-translate/useTranslation";

export interface ElifbaRunStats {
  correct: number;
  wrong: number;
  newlyMasteredSlugs: string[];
}

export default function ElifbaPracticeResult({
  stats,
  onDone,
}: {
  stats: ElifbaRunStats;
  onDone: () => void;
}) {
  const { t } = useTranslation("learn");
  const nNew = stats.newlyMasteredSlugs.length;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-violet-100 bg-white p-8 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("elifba.resultTitle")}
      </h2>
      <ul className="w-full space-y-2 text-left text-sm text-zinc-700 dark:text-zinc-200">
        <li className="flex justify-between gap-2">
          <span>{t("elifba.resultCorrect")}</span>
          <span className="font-semibold">{stats.correct}</span>
        </li>
        <li className="flex justify-between gap-2">
          <span>{t("elifba.resultWrong")}</span>
          <span className="font-semibold">{stats.wrong}</span>
        </li>
      </ul>
      {nNew > 0 ? (
        <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
          {t("elifba.resultNewLearned", { count: nNew })}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onDone}
        className="w-full rounded-xl bg-violet-500 py-3 text-sm font-bold text-white hover:bg-violet-600"
      >
        {t("elifba.resultClose")}
      </button>
    </div>
  );
}
