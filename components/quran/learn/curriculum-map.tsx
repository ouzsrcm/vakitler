import useTranslation from "next-translate/useTranslation";
import { lessonsByLevel, type LearnLevel } from "@/data/learn-curriculum";
import {
  getLessonProgress,
  isLevelLocked,
  isUnlocked,
} from "@/lib/learn/progress";
import LessonCard from "./lesson-card";
import { cx } from "@/utils/helper";

const LEVELS: LearnLevel[] = [1, 2, 3];

export default function CurriculumMap() {
  const { t } = useTranslation("learn");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
        {LEVELS.map(level => {
          const locked = isLevelLocked(level);
          const lessons = lessonsByLevel(level);
          const labelKey = `levelLabel${level}` as const;

          return (
            <section key={level} className="mt-6 first:mt-0">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cx(
                    "text-xs font-bold uppercase tracking-wide",
                    locked
                      ? "text-zinc-400 dark:text-zinc-500"
                      : "text-violet-600 dark:text-violet-400"
                  )}
                >
                  {t(labelKey)}
                </span>
                {locked && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    ({t("locked")})
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

        <p className="mt-6 text-center text-[11px] text-zinc-500 dark:text-zinc-400">
          {t("unlockMessage")}
        </p>
        <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          {t("progressNote")}
        </p>
      </div>
    </div>
  );
}
