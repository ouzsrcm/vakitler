import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import LearnLayout from "@/components/learn/layout";
import FlashcardMode from "@/components/learn/practice/flashcard-mode";
import type { FlashSessionStats } from "@/components/learn/practice/flashcard-mode";
import MultiChoiceMode from "@/components/learn/practice/multi-choice-mode";
import PracticeResult from "@/components/learn/practice/practice-result";
import PracticeSetup, {
  type PracticeModeKind,
  type PracticeStartConfig,
} from "@/components/learn/practice/practice-setup";
import TypeMode from "@/components/learn/practice/type-mode";
import { ensureWordBank } from "@/lib/learn/word-fetcher";
import type { IWord } from "@/lib/learn/words";
import { shuffleArray } from "@/lib/learn/words";

type Phase = "load" | "setup" | "run" | "result";

export default function WordPracticePage() {
  const { t } = useTranslation("learn");
  const [words, setWords] = useState<IWord[]>([]);
  const [loadErr, setLoadErr] = useState(false);
  const [phase, setPhase] = useState<Phase>("load");
  const [deck, setDeck] = useState<IWord[]>([]);
  const [runMode, setRunMode] = useState<PracticeModeKind>("flashcard");
  const [lastStats, setLastStats] = useState<FlashSessionStats | null>(null);

  const syncWords = useCallback(async (force: boolean) => {
    const r = await ensureWordBank({ force });
    setWords(r.words);
    setLoadErr(r.error && r.words.length === 0);
  }, []);

  const loadWords = useCallback(
    async (force: boolean) => {
      setPhase("load");
      await syncWords(force);
      setPhase("setup");
    },
    [syncWords]
  );

  useEffect(() => {
    void loadWords(false);
  }, [loadWords]);

  const startRun = (d: IWord[], cfg: PracticeStartConfig) => {
    setDeck(d);
    setRunMode(cfg.mode);
    setPhase("run");
  };

  const finishRun = (s: FlashSessionStats) => {
    setLastStats(s);
    setPhase("result");
  };

  const repeatHard = () => {
    if (!lastStats?.hardArabicKeys.length) return;
    const keySet = new Set(lastStats.hardArabicKeys);
    const next = shuffleArray(words.filter(w => keySet.has(w.arabic)));
    if (!next.length) {
      setPhase("setup");
      return;
    }
    setDeck(next);
    setRunMode("flashcard");
    setPhase("run");
  };

  const backToBank = () => {
    setLastStats(null);
    setPhase("setup");
    void syncWords(false);
  };

  return (
    <LearnLayout>
      <Head>
        <title>{t("words.practicePageTitle")}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-4">
        <div className="mb-4">
          <Link
            href="/learn?tab=words"
            className="inline-flex items-center gap-1 text-sm text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200"
          >
            <IconChevronLeft size={16} />
            {t("words.backToBank")}
          </Link>
        </div>

        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("words.practicePageTitle")}
        </h1>

        {phase === "load" ? (
          <p className="py-12 text-center text-sm text-zinc-500">{t("loading")}</p>
        ) : null}

        {loadErr && phase === "setup" ? (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-6 text-center dark:border-red-900/40 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {t("words.loadError")}
            </p>
            <button
              type="button"
              onClick={() => void loadWords(true)}
              className="mt-4 rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white"
            >
              {t("retry")}
            </button>
          </div>
        ) : null}

        {!loadErr && phase === "setup" ? (
          <PracticeSetup words={words} onStart={startRun} />
        ) : null}

        {phase === "run" && runMode === "flashcard" ? (
          <FlashcardMode deck={deck} onDone={finishRun} />
        ) : null}

        {phase === "run" && runMode === "multi" ? (
          <MultiChoiceMode
            deck={deck}
            wordPool={words}
            onDone={finishRun}
          />
        ) : null}

        {phase === "run" && runMode === "type" ? (
          <TypeMode deck={deck} onDone={finishRun} />
        ) : null}

        {phase === "result" && lastStats ? (
          <PracticeResult
            stats={lastStats}
            onRepeatHard={repeatHard}
            onDone={backToBank}
          />
        ) : null}
      </div>
    </LearnLayout>
  );
}
