import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";
import type { IDhikr } from "@/data/dhikr";
import { cx } from "@/utils/helper";
import { IconChevronRight } from "@tabler/icons-react";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

type Props = {
  dhikr: IDhikr;
};

export default function DhikrCard({ dhikr }: Props) {
  const { t } = useTranslation("zikir");

  return (
    <motion.article
      layout
      variants={cardVariants}
      className={cx(
        "relative overflow-hidden rounded-2xl border border-amber-100 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800"
      )}
    >
      <span className="absolute right-3 top-3 text-lg font-bold text-amber-500 dark:text-amber-400">
        {dhikr.defaultCount}
      </span>
      <Link
        href={`/zikir/${dhikr.id}`}
        className="block min-h-[4.5rem] pr-10 text-left"
      >
        <div className="flex gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              {dhikr.transliteration}
            </p>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
              {dhikr.meaning}
            </p>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              {dhikr.source}
            </p>
          </div>
          <p
            className="shrink-0 text-right font-arabic text-2xl leading-snug text-zinc-900 dark:text-zinc-100"
            dir="rtl"
          >
            {dhikr.arabic}
          </p>
        </div>
      </Link>
      <div className="mt-3 flex justify-end border-t border-amber-100/80 pt-3 dark:border-zinc-700">
        <Link
          href={`/zikir/tesbih?id=${encodeURIComponent(dhikr.id)}`}
          className="inline-flex items-center gap-0.5 rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          {t("startButton")}
          <IconChevronRight size={18} aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}
