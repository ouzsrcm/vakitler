import Link from "next/link";
import { motion } from "framer-motion";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import type { ILetter } from "@/data/arabic-alphabet";
import type { ElifbaMastery } from "@/lib/learn/elifba-progress";
import { cx } from "@/utils/helper";

export default function LetterCard({
  letter,
  mastery,
  index,
}: {
  letter: ILetter;
  mastery: ElifbaMastery;
  index: number;
}) {
  const learned = mastery >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link
        href={`/learn/elifba/${letter.slug}`}
        className={cx(
          "relative flex aspect-square flex-col items-center justify-center rounded-2xl border p-2 text-center shadow-sm transition-colors",
          "border-violet-100 bg-white hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-violet-600 dark:hover:bg-zinc-800/90"
        )}
      >
        <span className="absolute right-1.5 top-1.5">
          {learned ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <IconStarFilled
                size={14}
                className="text-violet-500 dark:text-violet-400"
                aria-label="learned"
              />
            </motion.span>
          ) : (
            <IconStar
              size={14}
              className="text-zinc-200 dark:text-zinc-600"
              aria-hidden
            />
          )}
        </span>
        <span
          className="font-arabic text-4xl font-semibold leading-none text-zinc-900 dark:text-zinc-50"
          dir="rtl"
        >
          {letter.arabic}
        </span>
        <span className="mt-1.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
          {letter.name}
        </span>
      </Link>
    </motion.div>
  );
}
