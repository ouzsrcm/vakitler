import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { IconVolume } from "@tabler/icons-react";
import { ARABIC_LETTERS, type ILetter } from "@/data/arabic-alphabet";
import { bumpElifbaMastery } from "@/lib/learn/elifba-progress";
import { speakArabic } from "@/lib/learn/elifba-speech";
import { shuffleArray } from "@/lib/learn/words";
import { cx } from "@/utils/helper";
import ElifbaPracticeShell from "../elifba-practice-shell";
import type { ElifbaRunStats } from "../elifba-practice-result";

function otherLetters(cur: ILetter, n: number): ILetter[] {
  return shuffleArray(ARABIC_LETTERS.filter(l => l.slug !== cur.slug)).slice(
    0,
    n
  );
}

export default function SoundExercise({
  deck,
  onExit,
  onFinish,
}: {
  deck: ILetter[];
  onExit: () => void;
  onFinish: (stats: ElifbaRunStats) => void;
}) {
  const { t } = useTranslation("learn");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPhase, setWrongPhase] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [pulse, setPulse] = useState(false);
  const statsRef = useRef<ElifbaRunStats>({
    correct: 0,
    wrong: 0,
    newlyMasteredSlugs: [],
  });

  const current = deck[index];
  const total = deck.length;

  const options = useMemo(() => {
    if (!current) return [];
    return shuffleArray([current, ...otherLetters(current, 3)]);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    speakArabic(current.nameAr);
  }, [current]);

  const play = () => {
    if (!current) return;
    speakArabic(current.nameAr);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 500);
  };

  const recordNewMaster = (slug: string) => {
    if (!statsRef.current.newlyMasteredSlugs.includes(slug)) {
      statsRef.current.newlyMasteredSlugs.push(slug);
    }
  };

  const onPick = (slug: string) => {
    if (!current || disabled) return;
    if (slug === current.slug) {
      setSelected(slug);
      setDisabled(true);
      setFeedback("correct");
      const { prev, next } = bumpElifbaMastery(current.slug);
      if (next === 3 && prev < 3) recordNewMaster(current.slug);
      statsRef.current.correct += 1;
      window.setTimeout(() => {
        if (index + 1 >= total) {
          onFinish({ ...statsRef.current });
          return;
        }
        setIndex(i => i + 1);
        setSelected(null);
        setDisabled(false);
        setFeedback("idle");
      }, 420);
    } else {
      setSelected(slug);
      setWrongPhase(true);
      setFeedback("wrong");
      statsRef.current.wrong += 1;
      window.setTimeout(() => {
        setWrongPhase(false);
        setSelected(null);
        setFeedback("idle");
      }, 500);
    }
  };

  if (!current) return null;

  return (
    <ElifbaPracticeShell
      currentIndex={index}
      total={total}
      onExit={onExit}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.slug}
          initial={{ opacity: 0, x: 280 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-5"
        >
          <p className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            {t("elifba.exSoundPrompt")}
          </p>
          <button
            type="button"
            onClick={play}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet-600"
          >
            <motion.span
              animate={pulse ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <IconVolume size={20} aria-hidden />
            </motion.span>
            <span>{t("elifba.listen")}</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            {options.map((L, idx) => {
              const isSel = selected === L.slug;
              return (
                <motion.button
                  key={`${current.slug}-s-${idx}-${L.slug}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPick(L.slug)}
                  animate={
                    feedback === "wrong" && isSel
                      ? { x: [0, -8, 8, -8, 8, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.45 }}
                  className={cx(
                    "flex min-h-[5.5rem] items-center justify-center rounded-2xl border-2 text-5xl font-semibold transition-colors disabled:opacity-60",
                    "border-violet-200 bg-violet-50/60 hover:bg-violet-100 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700",
                    isSel &&
                      wrongPhase &&
                      "border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30",
                    isSel &&
                      !wrongPhase &&
                      disabled &&
                      "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/40"
                  )}
                  dir="rtl"
                >
                  {L.arabic}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </ElifbaPracticeShell>
  );
}
