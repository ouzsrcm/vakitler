import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { lessonsByLevel, type LearnLevel } from "@/data/learn-curriculum";
import {
  getLessonProgress,
  getXP,
  getStreak,
  isLevelLocked,
  isUnlocked,
} from "@/lib/learn/progress";
import LessonCard from "./lesson-card";
import XpBadge from "./xp-badge";
import { cx } from "@/utils/helper";

const LEVELS: LearnLevel[] = [1, 2, 3];

export default function CurriculumMap() {
  const { t } = useTranslation("quran");
  const [mounted, setMounted] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setXp(getXP());
    setStreak(getStreak());
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/90">
        <div className="mb-4 flex flex-col items-center gap-2 text-center">
          <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {t("learnTitle")}
          </h2>
          {mounted ? <XpBadge xp={xp} streak={streak} /> : null}
        </div>

        {LEVELS.map(level => {
          const locked = isLevelLocked(level);
          const lessons = lessonsByLevel(level);

          return (
            <section key={level} className="mt-6 first:mt-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {t(`learnLevel${level}` as const)}
                </span>
                {locked && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {t("learnLevelLocked")}
                  </span>
                )}
              </div>
              <div
                className={cx(
                  "grid grid-cols-2 gap-2 sm:grid-cols-2",
                  locked && "opacity-60"
                )}
              >
                {lessons.map(lesson => (
                  <LessonCard
                    key={lesson.surahNumber}
                    lesson={lesson}
                    progress={getLessonProgress(lesson.surahNumber)}
                    locked={!isUnlocked(lesson.surahNumber)}
                    levelLocked={locked}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <p className="mt-6 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          {t("learnCurriculumNote")}
        </p>
      </div>
    </div>
  );
}
