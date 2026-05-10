import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconFlame, IconStarFilled } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import LearnLayout from "@/components/learn/layout";
import ElifbaTabPanel from "@/components/learn/elifba/elifba-tab-panel";
import WordBankView from "@/components/learn/word-bank/word-bank-view";
import CurriculumMap from "@/components/quran/learn/curriculum-map";
import { getXP, getStreak } from "@/lib/learn/progress";
import { ensureWordBank } from "@/lib/learn/word-fetcher";
import type { IWord } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

type LearnTab = "lessons" | "words" | "elif";

export default function LearnIndexPage() {
  const { t } = useTranslation("learn");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [tab, setTab] = useState<LearnTab>("lessons");
  const [wordBank, setWordBank] = useState<{
    words: IWord[];
    loading: boolean;
    error: boolean;
  }>({ words: [], loading: false, error: false });
  const wordsFirstVisitRef = useRef(false);

  useEffect(() => {
    setXp(getXP());
    setStreak(getStreak());
    setMounted(true);
  }, []);

  useEffect(() => {
    const q = router.query.tab;
    if (q === "words") setTab("words");
    else if (q === "elif") setTab("elif");
  }, [router.query.tab]);

  const setTabAndRoute = useCallback(
    (next: LearnTab) => {
      setTab(next);
      if (next === "lessons") {
        void router.replace({ pathname: "/learn" }, undefined, { shallow: true });
      } else if (next === "words") {
        void router.replace(
          { pathname: "/learn", query: { tab: "words" } },
          undefined,
          { shallow: true }
        );
      } else {
        void router.replace(
          { pathname: "/learn", query: { tab: "elif" } },
          undefined,
          { shallow: true }
        );
      }
    },
    [router]
  );

  useEffect(() => {
    if (tab !== "words" || wordsFirstVisitRef.current) return;
    wordsFirstVisitRef.current = true;
    void (async () => {
      setWordBank({ words: [], loading: true, error: false });
      const r = await ensureWordBank();
      setWordBank({
        words: r.words,
        loading: false,
        error: r.error && r.words.length === 0,
      });
    })();
  }, [tab]);

  const retryWords = useCallback(() => {
    void (async () => {
      setWordBank(s => ({ ...s, loading: true }));
      const r = await ensureWordBank({ force: true });
      setWordBank({
        words: r.words,
        loading: false,
        error: r.error && r.words.length === 0,
      });
    })();
  }, []);

  return (
    <LearnLayout>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5">
        <section className="-mx-5 mb-4 min-h-[180px] rounded-b-3xl bg-gradient-to-b from-violet-500 to-violet-700 px-8 pb-5 pt-8 text-white dark:from-violet-900 dark:to-zinc-900">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-xl font-bold tracking-tight">
              <span aria-hidden className="mr-1.5">
                🎓
              </span>
              {t("pageTitle")}
            </h1>
            <p className="max-w-[280px] text-sm font-medium text-white/90">
              {t("pageSubtitle")}
            </p>
            {mounted ? (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <IconFlame
                    size={16}
                    className="shrink-0 text-orange-300"
                    aria-hidden
                  />
                  <span>
                    {streak} {t("streakLabel")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <IconStarFilled
                    size={16}
                    className="shrink-0 text-amber-300"
                    aria-hidden
                  />
                  <span>
                    {xp} {t("xpLabel")}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setTabAndRoute("lessons")}
            className={cx(
              "rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
              tab === "lessons"
                ? "bg-violet-500 text-white dark:bg-violet-600"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <span aria-hidden className="mr-1">
              📚
            </span>
            {t("words.tabLessons")}
          </button>
          <button
            type="button"
            onClick={() => setTabAndRoute("words")}
            className={cx(
              "rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
              tab === "words"
                ? "bg-violet-500 text-white dark:bg-violet-600"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <span aria-hidden className="mr-1">
              🔤
            </span>
            {t("words.tabWords")}
          </button>
          <button
            type="button"
            onClick={() => setTabAndRoute("elif")}
            className={cx(
              "rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
              tab === "elif"
                ? "bg-violet-500 text-white dark:bg-violet-600"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <span className="font-arabic mr-1 text-base" dir="rtl" aria-hidden>
              ا
            </span>
            {t("elifba.tabElifba")}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "lessons" ? (
            <motion.div
              key="lessons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-6 pt-1"
            >
              <CurriculumMap />
            </motion.div>
          ) : null}
          {tab === "words" ? (
            <motion.div
              key="words"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-6 pt-1"
            >
              <WordBankView
                words={wordBank.words}
                loading={wordBank.loading}
                error={wordBank.error}
                onRetry={retryWords}
                onWordsUpdated={next =>
                  setWordBank(prev => ({ ...prev, words: next }))
                }
              />
            </motion.div>
          ) : null}
          {tab === "elif" ? (
            <motion.div
              key="elif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pb-6 pt-1"
            >
              <ElifbaTabPanel />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LearnLayout>
  );
}
