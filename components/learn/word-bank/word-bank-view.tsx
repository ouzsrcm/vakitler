import { useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { CURRICULUM_SURAHS } from "@/data/learn-curriculum";
import type { IWord } from "@/lib/learn/words";
import { cx } from "@/utils/helper";
import WordCardRow from "./word-card-row";
import WordDetailModal from "./word-detail-modal";
import WordFilterBar from "./word-filter-bar";
import WordStatsHeader from "./word-stats-header";

type SortMode = "alpha" | "surah" | "mastery";

function curriculumOrder(n: number): number {
  const i = CURRICULUM_SURAHS.indexOf(n);
  return i === -1 ? 999 : i;
}

export default function WordBankView({
  words,
  loading,
  error,
  onRetry,
  onWordsUpdated,
}: {
  words: IWord[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onWordsUpdated: (next: IWord[]) => void;
}) {
  const { t, lang } = useTranslation("learn");
  const [filterSurah, setFilterSurah] = useState<number | null>(null);
  const [sort, setSort] = useState<SortMode>("surah");
  const [detail, setDetail] = useState<IWord | null>(null);

  const filtered = useMemo(() => {
    if (filterSurah === null) return words;
    return words.filter(w => w.surahNumbers.includes(filterSurah));
  }, [words, filterSurah]);

  const sorted = useMemo(() => {
    const a = [...filtered];
    if (sort === "alpha") {
      a.sort((x, y) =>
        x.turkish.localeCompare(y.turkish, lang === "tr" ? "tr" : "en", {
          sensitivity: "base",
        })
      );
    } else if (sort === "surah") {
      a.sort((x, y) => {
        const mx = Math.min(...x.surahNumbers.map(curriculumOrder));
        const my = Math.min(...y.surahNumbers.map(curriculumOrder));
        if (mx !== my) return mx - my;
        return x.arabic.localeCompare(y.arabic, "ar");
      });
    } else {
      a.sort((x, y) => {
        if (x.mastery !== y.mastery) return x.mastery - y.mastery;
        return x.turkish.localeCompare(y.turkish, lang === "tr" ? "tr" : "en");
      });
    }
    return a;
  }, [filtered, sort, lang]);

  const learned = useMemo(
    () => words.filter(w => w.mastery === 3).length,
    [words]
  );

  const handleMasteryInModal = (w: IWord) => {
    const next = words.map(x =>
      x.arabic === w.arabic ? { ...x, mastery: w.mastery } : x
    );
    onWordsUpdated(next);
    setDetail(w);
  };

  if (error && !words.length) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          {t("words.loadError")}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <WordStatsHeader total={words.length} learned={learned} />

      {loading && !words.length ? (
        <p className="py-8 text-center text-sm text-zinc-500">{t("loading")}</p>
      ) : null}

      {error && words.length ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-center text-xs font-medium text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100">
          {t("words.staleWarning")}
        </div>
      ) : null}

      {!loading || words.length ? (
        <>
          <WordFilterBar activeSurah={filterSurah} onChange={setFilterSurah} />

          <div className="flex items-center justify-end gap-1 text-xs font-semibold">
            <span className="mr-2 text-zinc-400">{t("words.sortLabel")}</span>
            {(
              [
                ["alpha", "words.sortAlpha"],
                ["surah", "words.sortSurah"],
                ["mastery", "words.sortDifficulty"],
              ] as const
            ).map(([key, tk]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cx(
                  "rounded-full px-2 py-1 transition-colors",
                  sort === key
                    ? "bg-violet-500 text-white dark:bg-violet-600"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                )}
              >
                {t(tk)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 pb-4">
            {sorted.map((w, i) => (
              <WordCardRow
                key={`${w.arabic}-${i}`}
                word={w}
                onOpen={setDetail}
              />
            ))}
          </div>
        </>
      ) : null}

      <WordDetailModal
        word={detail}
        open={!!detail}
        onClose={() => setDetail(null)}
        onMasteryChange={handleMasteryInModal}
      />
    </div>
  );
}
