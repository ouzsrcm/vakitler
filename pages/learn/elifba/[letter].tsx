import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";
import LearnLayout from "@/components/learn/layout";
import LetterDetailContent from "@/components/learn/elifba/letter-detail";
import { letterBySlug, letterNeighbors } from "@/data/arabic-alphabet";
import {
  cycleElifbaMastery,
  getElifbaMastery,
  type ElifbaMastery,
} from "@/lib/learn/elifba-progress";

export default function ElifbaLetterPage() {
  const { t } = useTranslation("learn");
  const router = useRouter();
  const raw = router.query.letter;
  const slug = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  const letter = slug ? letterBySlug(slug) : undefined;
  const [mastery, setMastery] = useState<ElifbaMastery>(0);

  useEffect(() => {
    if (!letter) return;
    setMastery(getElifbaMastery(letter.slug));
  }, [letter]);

  const toggleMastery = useCallback(() => {
    if (!letter) return;
    const next = cycleElifbaMastery(letter.slug);
    setMastery(next);
  }, [letter]);

  if (router.isReady && (!slug || !letter)) {
    return (
      <LearnLayout>
        <div className="mx-auto max-w-md px-5 py-10 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("elifba.invalidLetter")}
          </p>
          <Link
            href="/learn?tab=elif"
            className="mt-4 inline-block text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400"
          >
            {t("elifba.backToElifba")}
          </Link>
        </div>
      </LearnLayout>
    );
  }

  if (!letter) {
    return (
      <LearnLayout>
        <div className="mx-auto max-w-md px-5 py-10 text-center text-sm">
          {t("loading")}
        </div>
      </LearnLayout>
    );
  }

  const { prev, next } = letterNeighbors(letter.slug);

  return (
    <LearnLayout>
      <Head>
        <title>
          {letter.name} · {letter.arabic}
        </title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-4">
        <header className="mb-4 flex items-center justify-between gap-2">
          <Link
            href="/learn?tab=elif"
            className="inline-flex shrink-0 items-center gap-1 text-sm text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200"
          >
            <IconChevronLeft size={18} />
            {t("elifba.back")}
          </Link>
          <h1 className="min-w-0 flex-1 text-center text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {letter.name} ·{" "}
            <span className="font-arabic" dir="rtl">
              {letter.arabic}
            </span>
          </h1>
          <motion.button
            type="button"
            onClick={toggleMastery}
            whileTap={{ scale: 0.92 }}
            className="shrink-0 rounded-full border border-violet-200 bg-white p-2 text-violet-600 shadow-sm hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-violet-300 dark:hover:bg-zinc-700"
            aria-label={t("elifba.masteryToggle")}
          >
            {mastery >= 3 ? (
              <IconStarFilled
                size={22}
                className="text-violet-500 dark:text-violet-400"
              />
            ) : (
              <IconStar size={22} className="text-zinc-500 dark:text-zinc-400" />
            )}
          </motion.button>
        </header>

        <LetterDetailContent
          letter={letter}
          mastery={mastery}
          onMasteryToggle={toggleMastery}
        />

        <div className="h-16 shrink-0" aria-hidden />

        <nav className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto flex max-w-md justify-between gap-2 border-t border-violet-100 bg-white/95 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95">
          {prev ? (
            <Link
              href={`/learn/elifba/${prev.slug}`}
              className="flex min-w-0 flex-1 items-center gap-1 rounded-xl border border-violet-100 px-3 py-2 text-xs font-semibold text-violet-800 dark:border-zinc-600 dark:text-violet-200"
            >
              <IconChevronLeft size={16} />
              <span className="truncate">
                {prev.name} ({prev.order})
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/learn/elifba/${next.slug}`}
              className="flex min-w-0 flex-1 items-center justify-end gap-1 rounded-xl border border-violet-100 px-3 py-2 text-xs font-semibold text-violet-800 dark:border-zinc-600 dark:text-violet-200"
            >
              <span className="truncate">
                {next.name} ({next.order})
              </span>
              <IconChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </div>
    </LearnLayout>
  );
}
