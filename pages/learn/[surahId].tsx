import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import { IconChevronLeft } from "@tabler/icons-react";
import LearnLayout from "@/components/learn/layout";
import Container from "@/components/container";
import { lessonForSurah } from "@/data/learn-curriculum";
import surahs from "@/data/surahs";
import { fetchLessonData } from "@/lib/learn/fetch-lesson-data";
import { generateExercises } from "@/lib/learn/exercise-generator";
import type { Exercise } from "@/lib/learn/types";
import { quranProvider, RECITERS } from "@/lib/quran";
import { isLessonCompleted, isUnlocked, saveLesson } from "@/lib/learn/progress";
import ExerciseShell from "@/components/quran/learn/exercise-shell";
import LessonResult from "@/components/quran/learn/lesson-result";
import ListenExercise from "@/components/quran/learn/exercises/listen-exercise";
import WordCardExercise from "@/components/quran/learn/exercises/word-card-exercise";
import FillBlankExercise from "@/components/quran/learn/exercises/fill-blank-exercise";
import MatchExercise from "@/components/quran/learn/exercises/match-exercise";
import SortExercise from "@/components/quran/learn/exercises/sort-exercise";
import TrueFalseExercise from "@/components/quran/learn/exercises/true-false-exercise";
import AudioMatchExercise from "@/components/quran/learn/exercises/audio-match-exercise";
import QuickMemoryExercise from "@/components/quran/learn/exercises/quick-memory-exercise";
import SurahCompleteExercise from "@/components/quran/learn/exercises/surah-complete-exercise";
import WordHuntExercise from "@/components/quran/learn/exercises/word-hunt-exercise";

function starsFromWrongAnswers(wrong: number): 1 | 2 | 3 {
  if (wrong <= 0) return 3;
  if (wrong <= 2) return 2;
  return 1;
}

type Phase = "load" | "play" | "result";

export default function LearnLessonPage() {
  const router = useRouter();
  const { t: tl } = useTranslation("learn");
  const { t, lang } = useTranslation("quran");
  const rawId = router.query.surahId;
  const surahNumber = parseInt(
    Array.isArray(rawId) ? rawId[0] ?? "" : rawId ?? "",
    10
  );

  const surahMeta = surahs.find(s => s.number === surahNumber);
  const lessonMeta = lessonForSurah(surahNumber);

  const [phase, setPhase] = useState<Phase>("load");
  const [loadError, setLoadError] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [wrongPhase, setWrongPhase] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [reveal, setReveal] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [sessionBaseXp, setSessionBaseXp] = useState(0);
  const [perfectExercises, setPerfectExercises] = useState(0);
  const [imperfectExercises, setImperfectExercises] = useState(0);
  const savedProgress = useRef(false);
  const [xpBurst, setXpBurst] = useState(0);
  const firstCompleteEligibleRef = useRef(false);
  const currentXpRef = useRef(10);

  const reciterId = RECITERS[0]?.id ?? "ar.alafasy";

  const messages = useMemo(
    () => ({
      listen: t("learnQListen"),
      wordCard: t("learnQWordCard"),
      fillBlank: t("learnQFillBlank"),
      match: t("learnQMatch"),
      sort: t("learnQSort"),
      trueFalse: t("learnQTrueFalse"),
      audioMatch: t("learnQAudioMatch"),
      quickMemory: t("learnQuickMemory"),
      surahComplete: t("learnQSurahComplete"),
      wordHunt: t("learnQWordHunt"),
    }),
    [t]
  );

  const load = useCallback(async () => {
    if (!Number.isFinite(surahNumber) || !lessonMeta || !surahMeta) {
      setLoadError(true);
      setPhase("load");
      return;
    }
    if (!isUnlocked(surahNumber)) {
      void router.replace("/learn");
      return;
    }

    setLoadError(false);
    setPhase("load");

    const data = await fetchLessonData(surahNumber);
    if (!data) {
      setLoadError(true);
      return;
    }

    firstCompleteEligibleRef.current = !isLessonCompleted(surahNumber);

    const audioUrl = quranProvider.getAudioUrl(surahNumber, reciterId);
    const list = await generateExercises(
      data,
      messages,
      audioUrl,
      lang === "tr",
      lessonMeta.level,
      reciterId
    );

    if (!list.length) {
      setLoadError(true);
      return;
    }

    setExercises(list);
    setIdx(0);
    setWrongAnswers(0);
    setSessionBaseXp(0);
    setPerfectExercises(0);
    setImperfectExercises(0);
    resetExerciseUiState();
    setPhase("play");
  }, [
    surahNumber,
    lessonMeta,
    surahMeta,
    router,
    messages,
    lang,
    reciterId,
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    void load();
  }, [router.isReady, load]);

  function resetExerciseUiState() {
    setFeedback("idle");
    setWrongPhase(false);
    setBlocked(false);
    setSelected(null);
    setReveal(null);
  }

  const exercise = exercises[idx];
  currentXpRef.current = exercise?.xpReward ?? 10;

  const advanceExercise = useCallback(() => {
    setIdx(i => {
      if (i >= exercises.length - 1) {
        setPhase("result");
        return i;
      }
      resetExerciseUiState();
      return i + 1;
    });
  }, [exercises.length]);

  const finishExerciseSuccess = useCallback(() => {
    setBlocked(true);
    setFeedback("correct");
    setSessionBaseXp(s => s + currentXpRef.current);
    setPerfectExercises(p => p + 1);
    setXpBurst(k => k + 1);
    window.setTimeout(() => {
      advanceExercise();
    }, 380);
  }, [advanceExercise]);

  const handleWrongPick = useCallback((correctLabel: string) => {
    setWrongAnswers(w => w + 1);
    setFeedback("wrong");
    setWrongPhase(true);
    setBlocked(true);
    setReveal(correctLabel);
  }, []);

  const handleWrongContinue = useCallback(() => {
    setSessionBaseXp(s => s + currentXpRef.current);
    setImperfectExercises(p => p + 1);
    advanceExercise();
  }, [advanceExercise]);

  const onMcPick = (answer: string, correct: string | string[]) => {
    if (blocked) return;
    const ok = Array.isArray(correct)
      ? correct.includes(answer)
      : answer === correct;
    setSelected(answer);
    if (ok) {
      finishExerciseSuccess();
    } else {
      const revealStr = Array.isArray(correct) ? correct.join(" ") : correct;
      handleWrongPick(revealStr);
    }
  };

  const onSortCheck = (ok: boolean) => {
    if (blocked) return;
    if (ok) {
      finishExerciseSuccess();
    } else {
      const ord = (exercise?.correctAnswer as string[]) ?? [];
      handleWrongPick(ord.join(" "));
    }
  };

  const surahTitle =
    lang === "tr" ? surahMeta?.nameTr ?? "" : surahMeta?.nameEn ?? "";

  const flawlessBonus = wrongAnswers === 0 ? 25 : 0;
  const firstCompleteBonus = firstCompleteEligibleRef.current ? 50 : 0;
  const xpBreakdown = useMemo(
    () => ({
      base: sessionBaseXp,
      flawless: flawlessBonus,
      firstComplete: firstCompleteBonus,
      total: sessionBaseXp + flawlessBonus + firstCompleteBonus,
    }),
    [sessionBaseXp, flawlessBonus, firstCompleteBonus]
  );

  useEffect(() => {
    if (phase !== "result" || savedProgress.current || !surahMeta) return;
    savedProgress.current = true;
    const stars = starsFromWrongAnswers(wrongAnswers);
    saveLesson(surahNumber, stars, xpBreakdown.total);
  }, [phase, surahMeta, wrongAnswers, surahNumber, xpBreakdown.total]);

  const resultStars = starsFromWrongAnswers(wrongAnswers);

  const revealDisplay =
    exercise?.type === "true-false" && reveal
      ? reveal === "yes"
        ? tl("tfRevealYes")
        : tl("tfRevealNo")
      : reveal;

  const renderExercise = () => {
    if (!exercise) return null;

    switch (exercise.type) {
      case "listen":
        return (
          <ListenExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={a => onMcPick(a, exercise.correctAnswer as string)}
          />
        );
      case "word-card":
        return (
          <WordCardExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={a => onMcPick(a, exercise.correctAnswer as string)}
          />
        );
      case "fill-blank":
        return (
          <FillBlankExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={a => onMcPick(a, exercise.correctAnswer as string)}
          />
        );
      case "match":
        return (
          <MatchExercise
            exercise={exercise}
            disabled={blocked}
            onSolved={finishExerciseSuccess}
          />
        );
      case "sort":
        return (
          <SortExercise
            key={`sort-${idx}`}
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            revealCorrect={Boolean(wrongPhase && reveal)}
            onCheck={onSortCheck}
          />
        );
      case "true-false":
        return (
          <TrueFalseExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onPick={v => onMcPick(v, exercise.correctAnswer as string)}
          />
        );
      case "audio-match":
        return (
          <AudioMatchExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={m => onMcPick(m, exercise.correctAnswer as string)}
          />
        );
      case "quick-memory":
        return (
          <QuickMemoryExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={m => onMcPick(m, exercise.correctAnswer as string)}
          />
        );
      case "surah-complete":
        return (
          <SurahCompleteExercise
            exercise={exercise}
            disabled={blocked}
            wrongPhase={wrongPhase}
            selected={selected}
            onSelect={f => onMcPick(f, exercise.correctAnswer as string)}
          />
        );
      case "word-hunt":
        return (
          <WordHuntExercise
            exercise={exercise}
            disabled={blocked}
            onWrongTap={() => setWrongAnswers(w => w + 1)}
            onCorrect={finishExerciseSuccess}
          />
        );
      default:
        return null;
    }
  };

  if (!router.isReady) {
    return (
      <LearnLayout>
        <Container className="py-8 text-center text-sm">
          {tl("loading")}
        </Container>
      </LearnLayout>
    );
  }

  if (!lessonMeta || !surahMeta || !Number.isFinite(surahNumber)) {
    return (
      <LearnLayout>
        <Container className="py-8">
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {tl("invalidSurah")}
          </p>
          <Link
            href="/learn"
            className="mt-4 block text-center text-sm font-medium text-violet-600 dark:text-violet-400"
          >
            {tl("backToMap")}
          </Link>
        </Container>
      </LearnLayout>
    );
  }

  return (
    <LearnLayout>
      <Head>
        <title>{tl("lessonPageTitle", { surah: surahTitle })}</title>
      </Head>
      <Container className="relative py-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <Link
            href="/learn"
            className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <IconChevronLeft size={16} />
            {tl("backToMap")}
          </Link>
        </div>

        <AnimatePresence>
          {feedback === "correct" && (
            <motion.div
              key={xpBurst}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: -28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55 }}
              className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 rounded-full bg-violet-500 px-3 py-1 text-xs font-bold text-white shadow-md ring-2 ring-violet-300/80 dark:bg-violet-600 dark:ring-violet-400/50"
            >
              +{exercise?.xpReward ?? 10} XP
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "load" && loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
            <p className="text-sm text-red-800 dark:text-red-200">
              {tl("fetchError")}
            </p>
            <button
              type="button"
              className="mt-4 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-600"
              onClick={() => void load()}
            >
              {tl("retry")}
            </button>
          </div>
        )}

        {phase === "load" && !loadError && (
          <p className="py-12 text-center text-sm text-zinc-500">
            {tl("loading")}
          </p>
        )}

        {phase === "play" && exercise && (
          <ExerciseShell
            currentIndex={idx}
            total={exercises.length}
            feedback={feedback}
          >
            {renderExercise()}

            {wrongPhase &&
              reveal &&
              exercise.type !== "sort" &&
              exercise.type !== "word-hunt" && (
                <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                  <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
                    {tl("correctWas")}
                  </p>
                  <p className="mt-2 text-center text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    {revealDisplay}
                  </p>
                  <button
                    type="button"
                    onClick={handleWrongContinue}
                    className="mt-4 w-full rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-600"
                  >
                    {tl("continue")}
                  </button>
                </div>
              )}

            {wrongPhase && reveal && exercise.type === "sort" && (
              <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-600">
                <button
                  type="button"
                  onClick={handleWrongContinue}
                  className="w-full rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-600"
                >
                  {tl("continue")}
                </button>
              </div>
            )}
          </ExerciseShell>
        )}

        {phase === "result" && surahMeta && (
          <LessonResult
            surahName={surahTitle}
            stars={resultStars}
            xpBreakdown={xpBreakdown}
            correctCount={perfectExercises}
            mistakeCount={imperfectExercises}
            flawless={wrongAnswers === 0}
          />
        )}
      </Container>
    </LearnLayout>
  );
}
