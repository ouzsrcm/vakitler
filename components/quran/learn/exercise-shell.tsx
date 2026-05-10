import Link from "next/link";
import { motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { cx } from "@/utils/helper";

const shakeTransition = { duration: 0.45 };

export default function ExerciseShell({
  currentIndex,
  total,
  feedback,
  children,
}: {
  currentIndex: number;
  total: number;
  feedback: "idle" | "correct" | "wrong";
  children: React.ReactNode;
}) {
  const { t } = useTranslation("quran");
  const pct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {t("learnExerciseProgress", {
            current: currentIndex + 1,
            total,
          })}
        </p>
        <Link
          href="/learn"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label={t("learnExitLesson")}
        >
          <IconX size={20} />
        </Link>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-1 flex-col"
      >
        <motion.div
          animate={
            feedback === "wrong"
              ? { x: [0, -10, 10, -10, 10, 0] }
              : { x: 0 }
          }
          transition={shakeTransition}
          className={cx(
            "flex flex-1 flex-col rounded-2xl border p-4 shadow-sm transition-colors duration-300 sm:p-5",
            feedback === "correct" &&
              "border-emerald-500 bg-emerald-100 dark:border-emerald-500 dark:bg-emerald-900/50",
            feedback === "wrong" &&
              "border-red-500 bg-red-100 dark:border-red-500 dark:bg-red-900/40",
            feedback === "idle" &&
              "border-emerald-100 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          )}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
