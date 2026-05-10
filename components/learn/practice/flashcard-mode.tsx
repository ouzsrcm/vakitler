import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { IconEye, IconX } from "@tabler/icons-react";
import type { IWord, WordMastery } from "@/lib/learn/words";
import { setMasteryForArabic } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

export type FlashRating = "hard" | "medium" | "easy";

export interface FlashSessionStats {
  easy: number;
  medium: number;
  hard: number;
  hardArabicKeys: string[];
}

export default function FlashcardMode({
  deck,
  onDone,
}: {
  deck: IWord[];
  onDone: (stats: FlashSessionStats) => void;
}) {
  const { t } = useTranslation("learn");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState<FlashSessionStats>({
    easy: 0,
    medium: 0,
    hard: 0,
    hardArabicKeys: [],
  });
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const total = deck.length;
  const current = deck[index];

  const finishRating = (rating: FlashRating) => {
    if (!current || !flipped) return;
    const mastery: WordMastery =
      rating === "hard" ? 1 : rating === "medium" ? 2 : 3;
    setMasteryForArabic(current.arabic, mastery);

    const prev = statsRef.current;
    const nextStats: FlashSessionStats = {
      easy: prev.easy + (rating === "easy" ? 1 : 0),
      medium: prev.medium + (rating === "medium" ? 1 : 0),
      hard: prev.hard + (rating === "hard" ? 1 : 0),
      hardArabicKeys:
        rating === "hard"
          ? [...prev.hardArabicKeys, current.arabic]
          : prev.hardArabicKeys,
    };
    statsRef.current = nextStats;
    setStats(nextStats);

    window.setTimeout(() => {
      setIndex(i => {
        if (i + 1 >= total) {
          window.queueMicrotask(() => onDone(nextStats));
          return i;
        }
        setFlipped(false);
        return i + 1;
      });
    }, 300);
  };

  if (!current || total === 0) return null;

  const pct = Math.round(((index + 1) / total) * 100);

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {t("words.flashProgress", { current: index + 1, total })}
        </p>
        <Link
          href="/learn?tab=words"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white text-zinc-600 transition-colors hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label={t("words.exitPractice")}
        >
          <IconX size={20} />
        </Link>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-violet-500 transition-[width] duration-300 dark:bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.28 }}
          className="flex flex-1 flex-col"
        >
          <div
            className="relative mx-auto w-full max-w-sm flex-1 [perspective:1200px]"
            style={{ minHeight: 280 }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              className="relative min-h-[260px] w-full [transform-style:preserve-3d]"
            >
              <div
                className={cx(
                  "absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
                  "[backface-visibility:hidden]",
                  flipped && "pointer-events-none"
                )}
              >
                <p
                  className="mb-8 text-center text-3xl font-semibold leading-relaxed text-zinc-900 dark:text-zinc-50"
                  dir="rtl"
                >
                  {current.arabic}
                </p>
                <button
                  type="button"
                  onClick={() => setFlipped(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600"
                >
                  <IconEye size={18} aria-hidden />
                  {t("words.showMeaning")}
                </button>
              </div>

              <div
                className={cx(
                  "absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800",
                  "[backface-visibility:hidden] [transform:rotateY(180deg)]",
                  !flipped && "pointer-events-none"
                )}
              >
                <p
                  className="mb-2 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
                  dir="rtl"
                >
                  {current.arabic}
                </p>
                <div className="mb-4 h-px w-24 bg-violet-200 dark:bg-violet-800" />
                <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {current.turkish}
                </p>
                <p className="mt-6 mb-3 text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {t("words.howWasIt")}
                </p>
                <div className="flex w-full max-w-xs flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => finishRating("hard")}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
                  >
                    {t("words.rateHard")}
                  </button>
                  <button
                    type="button"
                    onClick={() => finishRating("medium")}
                    className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100"
                  >
                    {t("words.rateMedium")}
                  </button>
                  <button
                    type="button"
                    onClick={() => finishRating("easy")}
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100"
                  >
                    {t("words.rateEasy")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
