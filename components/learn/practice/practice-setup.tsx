import { useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { CURRICULUM_SURAHS } from "@/data/learn-curriculum";
import surahs from "@/data/surahs";
import type { IWord } from "@/lib/learn/words";
import { shuffleArray } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

export type PracticeModeKind = "flashcard" | "multi" | "type";
export type CardCountChoice = 10 | 20 | "all";

export interface PracticeStartConfig {
  mode: PracticeModeKind;
  cardCount: CardCountChoice;
  /** Boş = tüm müfredat sureleri */
  selectedSurahs: number[];
  onlyUnlearned: boolean;
}

function buildDeck(
  allWords: IWord[],
  cfg: PracticeStartConfig
): IWord[] {
  let pool = [...allWords];
  if (cfg.onlyUnlearned) pool = pool.filter(w => w.mastery < 3);
  if (cfg.selectedSurahs.length > 0) {
    const set = new Set(cfg.selectedSurahs);
    pool = pool.filter(w => w.surahNumbers.some(s => set.has(s)));
  }
  pool = shuffleArray(pool);
  if (cfg.cardCount === "all") return pool;
  return pool.slice(0, cfg.cardCount);
}

export default function PracticeSetup({
  words,
  onStart,
}: {
  words: IWord[];
  onStart: (deck: IWord[], cfg: PracticeStartConfig) => void;
}) {
  const { t, lang } = useTranslation("learn");
  const [scopeAll, setScopeAll] = useState(true);
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const [onlyUnlearned, setOnlyUnlearned] = useState(false);
  const [cardCount, setCardCount] = useState<CardCountChoice>(10);
  const [mode, setMode] = useState<PracticeModeKind>("flashcard");

  const surahLabel = (num: number) => {
    const s = surahs.find(x => x.number === num);
    if (!s) return String(num);
    return lang === "tr" ? s.nameTr : s.nameEn;
  };

  const chosenSurahs = useMemo(
    () => CURRICULUM_SURAHS.filter(n => selected[n]),
    [selected]
  );

  const previewCount = useMemo(() => {
    const cfg: PracticeStartConfig = {
      mode,
      cardCount,
      selectedSurahs: scopeAll ? [] : chosenSurahs,
      onlyUnlearned,
    };
    return buildDeck(words, cfg).length;
  }, [words, mode, cardCount, scopeAll, chosenSurahs, onlyUnlearned]);

  const toggleSurah = (n: number) => {
    setSelected(prev => ({ ...prev, [n]: !prev[n] }));
  };

  const handleStart = () => {
    const cfg: PracticeStartConfig = {
      mode,
      cardCount,
      selectedSurahs: scopeAll ? [] : chosenSurahs,
      onlyUnlearned,
    };
    const deck = buildDeck(words, cfg);
    if (!deck.length) return;
    onStart(deck, cfg);
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("words.practiceScope")}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="scope"
            checked={scopeAll}
            onChange={() => setScopeAll(true)}
            className="accent-violet-600"
          />
          {t("words.practiceAllWords")}
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="scope"
            checked={!scopeAll}
            onChange={() => setScopeAll(false)}
            className="accent-violet-600"
          />
          {t("words.practiceBySurah")}
        </label>
        {!scopeAll ? (
          <div className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded-xl border border-violet-100 bg-violet-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            {CURRICULUM_SURAHS.map(n => (
              <label
                key={n}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200"
              >
                <input
                  type="checkbox"
                  checked={!!selected[n]}
                  onChange={() => toggleSurah(n)}
                  className="accent-violet-600"
                />
                {surahLabel(n)}
              </label>
            ))}
          </div>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        <input
          type="checkbox"
          checked={onlyUnlearned}
          onChange={() => setOnlyUnlearned(v => !v)}
          className="accent-violet-600"
        />
        {t("words.practiceUnlearnedOnly")}
      </label>

      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("words.practiceCardCount")}
        </p>
        <div className="flex flex-wrap gap-2">
          {([10, 20, "all"] as const).map(c => (
            <button
              key={String(c)}
              type="button"
              onClick={() => setCardCount(c)}
              className={cx(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                cardCount === c
                  ? "bg-violet-500 text-white dark:bg-violet-600"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              )}
            >
              {c === "all" ? t("words.cardsAll") : c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("words.practiceModeTitle")}
        </p>
        <div className="flex flex-col gap-2">
          {(
            [
              ["flashcard", "words.modeFlashcard"],
              ["multi", "words.modeMulti"],
              ["type", "words.modeType"],
            ] as const
          ).map(([k, tk]) => (
            <label
              key={k}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <input
                type="radio"
                name="pmode"
                checked={mode === k}
                onChange={() => setMode(k)}
                className="accent-violet-600"
              />
              {t(tk)}
            </label>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        {t("words.practicePreview", { count: previewCount })}
      </p>

      <button
        type="button"
        disabled={previewCount === 0}
        onClick={handleStart}
        className="w-full rounded-xl bg-violet-500 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
      >
        {t("words.practiceStart")}
      </button>
    </div>
  );
}
