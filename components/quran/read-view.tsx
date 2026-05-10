import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import SurahList from "@/components/quran/surah-list";
import SurahPagination from "@/components/quran/surah-pagination";
import surahs from "@/data/surahs";

const PAGE_SIZE = 20;

export default function ReadView() {
  const router = useRouter();
  const { t } = useTranslation("quran");
  const listTopRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(surahs.length / PAGE_SIZE);

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.sayfa;
    if (raw === undefined || raw === "") {
      void router.replace(
        {
          pathname: "/quran",
          query: { ...router.query, sayfa: "1" },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  const currentPage = useMemo(() => {
    const raw = router.query.sayfa;
    const s = Array.isArray(raw) ? raw[0] : raw;
    const n = parseInt(String(s ?? "1"), 10);
    if (!Number.isFinite(n)) return 1;
    return Math.min(Math.max(1, n), totalPages);
  }, [router.query.sayfa, totalPages]);

  useEffect(() => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage]);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageSurahs = useMemo(
    () => surahs.slice(start, start + PAGE_SIZE),
    [start]
  );

  const getItemHref = (surah: (typeof surahs)[0]) =>
    `/quran/${surah.number}?mod=oku&sayfa=${currentPage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-0"
    >
      <div
        ref={listTopRef}
        id="quran-surah-list"
        className="overflow-hidden rounded-2xl border border-emerald-100 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      >
        <SurahList
          surahs={pageSurahs}
          selectedNumber={null}
          getItemHref={getItemHref}
        />
        <SurahPagination currentPage={currentPage} totalPages={totalPages} />
      </div>

      <p className="mt-3 px-1 text-center text-xs text-zinc-500 dark:text-zinc-400">
        {t("readSelectSurah")}
      </p>
    </motion.div>
  );
}
