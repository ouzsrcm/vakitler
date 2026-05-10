import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import ZikirLayout from "@/components/zikir/layout";
import DhikrHeader from "@/components/zikir/dhikr-header";
import DhikrCategoryTabs from "@/components/zikir/dhikr-category-tabs";
import DhikrCard from "@/components/zikir/dhikr-card";
import type { DhikrCategory } from "@/data/dhikr";
import {
  getDailySuggestedDhikrId,
  getDhikrById,
  getDhikrsByCategory,
} from "@/data/dhikr";
import { cx } from "@/utils/helper";

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export default function ZikirIndexPage() {
  const { t } = useTranslation("zikir");
  const [category, setCategory] = useState<DhikrCategory>("namaz-sonrasi");

  const suggestedId = useMemo(() => getDailySuggestedDhikrId(), []);
  const suggested = useMemo(
    () => getDhikrById(suggestedId) ?? getDhikrById("subhanallah")!,
    [suggestedId]
  );

  const items = useMemo(
    () => getDhikrsByCategory(category),
    [category]
  );

  return (
    <ZikirLayout>
      <Head>
        <title>{t("title")}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5">
        <DhikrHeader />

        <section className="mb-6">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-amber-700/90 dark:text-amber-400/90">
            {t("dailySuggestion")}
          </p>
          <Link
            href={`/zikir/tesbih?id=${encodeURIComponent(suggested.id)}`}
            className={cx(
              "block rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <p
                className="font-arabic text-2xl text-zinc-900 dark:text-zinc-50"
                dir="rtl"
              >
                {suggested.arabic}
              </p>
              <span className="shrink-0 text-sm font-semibold text-amber-600 dark:text-amber-400">
                0 / {suggested.defaultCount}
              </span>
            </div>
            <div className="mt-3 flex h-12 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-white dark:bg-amber-600">
              {t("tapButton")}
            </div>
          </Link>
        </section>

        <DhikrCategoryTabs active={category} onChange={setCategory} />

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 pb-6"
          >
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3"
            >
              {items.map(d => (
                <DhikrCard key={d.id} dhikr={d} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ZikirLayout>
  );
}
