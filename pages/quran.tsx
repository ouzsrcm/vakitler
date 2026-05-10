import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import * as Select from "@radix-ui/react-select";
import QuranLayout from "@/components/quran/layout";
import SurahList from "@/components/quran/surah-list";
import SurahFilters, {
  type SurahFilterTab,
} from "@/components/quran/surah-filters";
import QuranPlayer from "@/components/quran/player";
import ModeTabs from "@/components/quran/mode-tabs";
import ReadView from "@/components/quran/read-view";
import NotesView from "@/components/quran/notes-view";
import Container from "@/components/container";
import surahs, { type ISurah } from "@/data/surahs";
import { quranProvider, RECITERS } from "@/lib/quran";
import { BOTTOM_NAV_CONTENT_PADDING } from "@/components/nav/bottom-nav";
import { cx } from "@/utils/helper";
import { parseQuranMod, type QuranMod } from "@/components/quran/quran-mod";
import {
  clearLastPlayed,
  readFavorites,
  readLastPlayed,
  writeFavorites,
} from "@/components/quran/storage";

const STORAGE_KEY_RECITER = "VAKITLER_QURAN_RECITER";
const STORAGE_KEY_SURAH = "VAKITLER_QURAN_SURAH";
const PAGE_SIZE = 20;

function formatResumeClock(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuranPage() {
  const router = useRouter();
  const { t, lang } = useTranslation("quran");
  const isTr = lang === "tr";

  const mod: QuranMod = parseQuranMod(router.query.mod);

  const [selectedSurah, setSelectedSurah] = useState<ISurah | null>(null);
  const [reciterId, setReciterId] = useState<string>(RECITERS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SurahFilterTab>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [resumeBanner, setResumeBanner] = useState<{
    surahNumber: number;
    currentTime: number;
  } | null>(null);
  const [playerInitialSeek, setPlayerInitialSeek] = useState<number | null>(
    null
  );

  const listTopRef = useRef<HTMLDivElement>(null);
  const resumeBannerSilencedRef = useRef(false);

  useEffect(() => {
    const savedReciter = localStorage.getItem(STORAGE_KEY_RECITER);
    if (savedReciter && RECITERS.find(r => r.id === savedReciter)) {
      setReciterId(savedReciter);
    }
    const savedSurah = localStorage.getItem(STORAGE_KEY_SURAH);
    if (savedSurah) {
      const n = parseInt(savedSurah, 10);
      const found = surahs.find(s => s.number === n);
      if (found) setSelectedSurah(found);
    }
    setFavorites(readFavorites());
  }, []);

  useEffect(() => {
    if (resumeBannerSilencedRef.current) return;
    const p = readLastPlayed();
    if (!p) return;
    const savedMs = new Date(p.savedAt).getTime();
    if (!Number.isFinite(savedMs)) return;
    if (Date.now() - savedMs > 7 * 24 * 60 * 60 * 1000) return;
    if (!surahs.some(s => s.number === p.surahNumber)) return;
    setResumeBanner({
      surahNumber: p.surahNumber,
      currentTime: p.currentTime,
    });
  }, []);

  const emptyFavorites =
    activeFilter === "favorites" && favorites.length === 0;

  const filteredSurahs = useMemo(() => {
    if (emptyFavorites) return [];
    let list = surahs;
    if (activeFilter === "favorites") {
      list = list.filter(s => favorites.includes(s.number));
    } else if (activeFilter === "meccan") {
      list = list.filter(s => s.type === "Meccan");
    } else if (activeFilter === "medinan") {
      list = list.filter(s => s.type === "Medinan");
    }
    const qRaw = searchQuery.trim();
    if (qRaw) {
      const q = qRaw.toLowerCase();
      list = list.filter(s => {
        const numStr = String(s.number);
        return (
          s.nameTr.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          numStr.includes(q)
        );
      });
    }
    return list;
  }, [searchQuery, activeFilter, favorites, emptyFavorites]);

  const isFilterActive =
    searchQuery.trim().length > 0 || activeFilter !== "all";

  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeFilter]);

  const totalPages = Math.ceil(filteredSurahs.length / PAGE_SIZE);

  const paginatedSurahs = useMemo(() => {
    if (isFilterActive) return filteredSurahs;
    const start = (page - 1) * PAGE_SIZE;
    return filteredSurahs.slice(start, start + PAGE_SIZE);
  }, [filteredSurahs, page, isFilterActive]);

  useEffect(() => {
    if (!isFilterActive) {
      listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page, isFilterActive]);

  const handleSelectSurah = useCallback((surah: ISurah) => {
    setSelectedSurah(surah);
    localStorage.setItem(STORAGE_KEY_SURAH, String(surah.number));
  }, []);

  const handleChangeReciter = (id: string) => {
    setReciterId(id);
    localStorage.setItem(STORAGE_KEY_RECITER, id);
  };

  const toggleFavorite = (surahNumber: number) => {
    setFavorites(prev => {
      const next = prev.includes(surahNumber)
        ? prev.filter(n => n !== surahNumber)
        : [...prev, surahNumber].sort((a, b) => a - b);
      writeFavorites(next);
      return next;
    });
  };

  const currentIndex = selectedSurah
    ? surahs.findIndex(s => s.number === selectedSurah.number)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) handleSelectSurah(surahs[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < surahs.length - 1)
      handleSelectSurah(surahs[currentIndex + 1]);
  };

  const audioUrl = selectedSurah
    ? quranProvider.getAudioUrl(selectedSurah.number, reciterId)
    : "";

  const currentReciter = RECITERS.find(r => r.id === reciterId) ?? RECITERS[0];

  const listenPagination =
    !isFilterActive && totalPages > 1
      ? { page, totalPages, onPageChange: setPage }
      : null;

  const resumeSurahMeta = resumeBanner
    ? surahs.find(s => s.number === resumeBanner.surahNumber)
    : null;

  const dismissResumeBanner = () => {
    clearLastPlayed();
    setResumeBanner(null);
    resumeBannerSilencedRef.current = true;
  };

  const handlePlayerInitialTimeApplied = useCallback(() => {
    setPlayerInitialSeek(null);
  }, []);

  const handleResumeContinue = () => {
    if (!resumeBanner) return;
    const surah = surahs.find(s => s.number === resumeBanner.surahNumber);
    if (surah) {
      handleSelectSurah(surah);
      setPlayerInitialSeek(resumeBanner.currentTime);
    }
    setResumeBanner(null);
  };

  const showEmptySearchBlock =
    filteredSurahs.length === 0 && !emptyFavorites;

  return (
    <QuranLayout>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <Container className={cx("py-4", BOTTOM_NAV_CONTENT_PADDING)}>
        <div className="mb-4 grid grid-cols-3 items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <IconChevronLeft size={16} />
            {t("back")}
          </Link>

          <h1 className="text-center text-sm font-semibold text-zinc-800 dark:text-zinc-100 sm:text-base">
            {t("title")}
          </h1>

          <div className="flex justify-end">
            {mod === "dinle" ? (
              <Select.Root
                value={reciterId}
                onValueChange={handleChangeReciter}
              >
                <Select.Trigger className="inline-flex max-w-full items-center gap-1 text-xs text-zinc-500 outline-none dark:text-zinc-400">
                  <span className="max-w-[72px] truncate sm:max-w-[100px]">
                    {isTr ? currentReciter.nameTr : currentReciter.nameEn}
                  </span>
                  <Select.Icon>
                    <IconChevronDown size={12} />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="z-[60] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
                    <Select.Viewport className="p-2">
                      <Select.Group>
                        {RECITERS.map(reciter => (
                          <Select.Item
                            key={reciter.id}
                            value={reciter.id}
                            className={cx(
                              "flex h-10 cursor-pointer select-none items-center rounded-lg pl-3 pr-6 leading-none outline-none",
                              "data-[state=checked]:bg-emerald-50 dark:data-[state=checked]:bg-emerald-900/40",
                              "hover:bg-zinc-50 dark:hover:bg-zinc-700"
                            )}
                          >
                            <Select.ItemText>
                              <span className="text-sm">
                                {isTr ? reciter.nameTr : reciter.nameEn}
                              </span>
                            </Select.ItemText>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            ) : (
              <span className="inline-block w-1 shrink-0" aria-hidden />
            )}
          </div>
        </div>

        <ModeTabs activeMod={mod} />

        <AnimatePresence mode="wait">
          {mod === "dinle" && (
            <motion.div
              key="dinle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {selectedSurah ? (
                <div className="mb-4">
                  <QuranPlayer
                    surah={selectedSurah}
                    audioUrl={audioUrl}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    hasPrev={currentIndex > 0}
                    hasNext={currentIndex < surahs.length - 1}
                    initialTime={playerInitialSeek ?? undefined}
                    onInitialTimeApplied={handlePlayerInitialTimeApplied}
                  />
                </div>
              ) : (
                <div
                  className={cx(
                    "mb-4 rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-8 text-center",
                    "text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400"
                  )}
                >
                  {t("listenSelectSurah")}
                </div>
              )}

              <AnimatePresence>
                {resumeBanner && resumeSurahMeta ? (
                  <motion.div
                    key="resume-banner"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cx(
                      "mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                        <IconPlayerPlay size={18} className="ml-0.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                          {t("resumeTitle")}
                        </p>
                        <p className="mt-0.5 text-xs text-emerald-800/90 dark:text-emerald-200/90">
                          {isTr ? resumeSurahMeta.nameTr : resumeSurahMeta.nameEn}{" "}
                          · {formatResumeClock(resumeBanner.currentTime)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleResumeContinue}
                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                          >
                            {t("resumeContinue")}
                          </button>
                          <button
                            type="button"
                            onClick={dismissResumeBanner}
                            className="rounded-full border border-emerald-300 p-1.5 text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
                            aria-label={t("resumeDismiss")}
                          >
                            <IconX size={18} stroke={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                <SurahFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  showEmptySearchResult={showEmptySearchBlock}
                  onClearSearch={() => setSearchQuery("")}
                />
                {!showEmptySearchBlock ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFilter}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <SurahList
                        surahs={paginatedSurahs}
                        selectedNumber={selectedSurah?.number ?? null}
                        onSelect={handleSelectSurah}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        listenPagination={listenPagination}
                        listTopRef={listTopRef}
                        emptyState={emptyFavorites ? "favorites" : "none"}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : null}
              </div>
            </motion.div>
          )}

          {mod === "oku" && <ReadView key="oku" />}

          {mod === "notlar" && <NotesView key="notlar" />}
        </AnimatePresence>
      </Container>
    </QuranLayout>
  );
}
