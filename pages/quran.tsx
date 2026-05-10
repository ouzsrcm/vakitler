import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { IconChevronDown, IconChevronLeft } from "@tabler/icons-react";
import * as Select from "@radix-ui/react-select";
import QuranLayout from "@/components/quran/layout";
import SurahList from "@/components/quran/surah-list";
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

const STORAGE_KEY_RECITER = "VAKITLER_QURAN_RECITER";
const STORAGE_KEY_SURAH = "VAKITLER_QURAN_SURAH";

export default function QuranPage() {
  const router = useRouter();
  const { t, lang } = useTranslation("quran");
  const isTr = lang === "tr";

  const mod: QuranMod = parseQuranMod(router.query.mod);

  const [selectedSurah, setSelectedSurah] = useState<ISurah | null>(null);
  const [reciterId, setReciterId] = useState<string>(RECITERS[0].id);

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
  }, []);

  const handleSelectSurah = (surah: ISurah) => {
    setSelectedSurah(surah);
    localStorage.setItem(STORAGE_KEY_SURAH, String(surah.number));
  };

  const handleChangeReciter = (id: string) => {
    setReciterId(id);
    localStorage.setItem(STORAGE_KEY_RECITER, id);
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

              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white dark:border-zinc-700 dark:bg-zinc-800">
                <SurahList
                  surahs={surahs}
                  selectedNumber={selectedSurah?.number ?? null}
                  onSelect={handleSelectSurah}
                />
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
