import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import QuranLayout from "@/components/quran/layout";
import AyahItem, { type AyahRow } from "@/components/quran/ayah-item";
import AyahSkeleton from "@/components/quran/ayah-skeleton";
import Container from "@/components/container";
import surahs, { type ISurah } from "@/data/surahs";
import { cx } from "@/utils/helper";
import {
  QURAN_FONT_PX,
  readFontSizeKey,
  readScrollY,
  readShowMeal,
  readShowTafsir,
  writeFontSizeKey,
  writeScrollY,
  writeShowMeal,
  writeShowTafsir,
  type QuranFontSizeKey,
} from "@/components/quran/quran-read-settings";

const FONT_ORDER: QuranFontSizeKey[] = ["sm", "md", "lg", "xl"];

interface ApiAyah {
  numberInSurah: number;
  text: string;
}

interface ApiPayload {
  ayahs?: ApiAyah[];
}

const AyahListBlock = memo(function AyahListBlock({
  surahNumber,
  rows,
  arabicFontPx,
  showMeal,
  showTafsirControls,
  openTafsirAyah,
  hiddenTafsir,
  onToggleTafsirForAyah,
  onTafsirUnavailableForAyah,
  onCloseTafsir,
}: {
  surahNumber: number;
  rows: AyahRow[];
  arabicFontPx: number;
  showMeal: boolean;
  showTafsirControls: boolean;
  openTafsirAyah: number | null;
  hiddenTafsir: Set<number>;
  onToggleTafsirForAyah: (ayahNo: number) => void;
  onTafsirUnavailableForAyah: (ayahNo: number) => void;
  onCloseTafsir: () => void;
}) {
  return (
    <div>
      {rows.map(row => (
        <AyahItem
          key={row.numberInSurah}
          surahNumber={surahNumber}
          row={row}
          arabicFontPx={arabicFontPx}
          showMeal={showMeal}
          showTafsirControls={showTafsirControls}
          tafsirOpen={openTafsirAyah === row.numberInSurah}
          tafsirHidden={hiddenTafsir.has(row.numberInSurah)}
          onToggleTafsirForAyah={onToggleTafsirForAyah}
          onTafsirUnavailableForAyah={onTafsirUnavailableForAyah}
          onCloseTafsir={onCloseTafsir}
        />
      ))}
    </div>
  );
});

function parseSurahId(raw: string | string[] | undefined): number | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (!s) return null;
  const n = parseInt(s, 10);
  if (!Number.isFinite(n) || n < 1 || n > 114) return null;
  return n;
}

export default function SurahReadPage() {
  const router = useRouter();
  const { t } = useTranslation("quran");
  const { lang } = useTranslation("common");
  const isTr = lang === "tr";

  const surahNo = useMemo(
    () => (router.isReady ? parseSurahId(router.query.surahId) : null),
    [router.isReady, router.query.surahId]
  );

  const sayfaRaw = router.query.sayfa;
  const listSayfa = useMemo(() => {
    const s = Array.isArray(sayfaRaw) ? sayfaRaw[0] : sayfaRaw;
    const n = parseInt(String(s ?? "1"), 10);
    return Number.isFinite(n) && n > 0 ? String(n) : "1";
  }, [sayfaRaw]);

  const meta = useMemo(
    () => (surahNo ? surahs.find(s => s.number === surahNo) ?? null : null),
    [surahNo]
  );

  const prevSurah: ISurah | null = meta
    ? surahs.find(s => s.number === meta.number - 1) ?? null
    : null;
  const nextSurah: ISurah | null = meta
    ? surahs.find(s => s.number === meta.number + 1) ?? null
    : null;

  const [ayahs, setAyahs] = useState<AyahRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fontKey, setFontKey] = useState<QuranFontSizeKey>("md");
  const [showMeal, setShowMeal] = useState(true);
  const [showTafsir, setShowTafsir] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openTafsirAyah, setOpenTafsirAyah] = useState<number | null>(null);
  const [hiddenTafsir, setHiddenTafsir] = useState(() => new Set<number>());
  const menuRef = useRef<HTMLDivElement>(null);
  const scrollRestored = useRef(false);

  useEffect(() => {
    setFontKey(readFontSizeKey());
    setShowMeal(readShowMeal());
    setShowTafsir(readShowTafsir());
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (surahNo === null) {
      void router.replace(`/quran?mod=oku&sayfa=${listSayfa}`);
    }
  }, [router.isReady, surahNo, listSayfa, router]);

  const loadAyahs = useCallback(async (n: number) => {
    setLoading(true);
    setError(false);
    setAyahs([]);
    setOpenTafsirAyah(null);
    setHiddenTafsir(new Set());
    scrollRestored.current = false;

    try {
      const [arRes, trRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${n}/tr.diyanet`),
      ]);
      if (!arRes.ok || !trRes.ok) throw new Error("fetch failed");
      const arJson = (await arRes.json()) as { data?: ApiPayload };
      const trJson = (await trRes.json()) as { data?: ApiPayload };
      const arAyahs = arJson.data?.ayahs ?? [];
      const trAyahs = trJson.data?.ayahs ?? [];
      const trByNum = new Map<number, string>();
      for (const a of trAyahs) {
        trByNum.set(a.numberInSurah, a.text);
      }
      const merged: AyahRow[] = arAyahs.map(a => ({
        numberInSurah: a.numberInSurah,
        arabic: a.text,
        translation: trByNum.get(a.numberInSurah) ?? "",
      }));
      setAyahs(merged);
    } catch {
      setError(true);
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (surahNo === null) return;
    void loadAyahs(surahNo);
  }, [surahNo, loadAyahs]);

  useEffect(() => {
    if (!surahNo || loading || ayahs.length === 0 || scrollRestored.current)
      return;
    const y = readScrollY(surahNo);
    if (y == null) {
      scrollRestored.current = true;
      return;
    }
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "auto" });
      scrollRestored.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [surahNo, loading, ayahs.length]);

  useEffect(() => {
    if (surahNo === null) return;
    let tid: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        writeScrollY(surahNo, window.scrollY);
      }, 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(tid);
      writeScrollY(surahNo, window.scrollY);
    };
  }, [surahNo]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const arabicFontPx = QURAN_FONT_PX[fontKey];

  const bumpFont = (dir: 1 | -1) => {
    setFontKey(prev => {
      const i = FONT_ORDER.indexOf(prev);
      const ni = Math.min(FONT_ORDER.length - 1, Math.max(0, i + dir));
      const key = FONT_ORDER[ni];
      writeFontSizeKey(key);
      return key;
    });
  };

  const toggleMeal = () => {
    setMenuOpen(false);
    setShowMeal(v => {
      const n = !v;
      writeShowMeal(n);
      return n;
    });
  };

  const toggleTafsirGlobal = () => {
    setMenuOpen(false);
    setShowTafsir(v => {
      const n = !v;
      writeShowTafsir(n);
      if (!n) setOpenTafsirAyah(null);
      return n;
    });
  };

  const onToggleTafsirForAyah = useCallback((ayahNo: number) => {
    setOpenTafsirAyah(prev => (prev === ayahNo ? null : ayahNo));
  }, []);

  const onTafsirUnavailableForAyah = useCallback((ayahNo: number) => {
    setHiddenTafsir(prev => new Set(prev).add(ayahNo));
    setOpenTafsirAyah(prev => (prev === ayahNo ? null : prev));
  }, []);

  const onCloseTafsir = useCallback(() => setOpenTafsirAyah(null), []);

  const listHref = `/quran?mod=oku&sayfa=${encodeURIComponent(listSayfa)}`;

  if (!router.isReady) {
    return (
      <QuranLayout>
        <div
          className="mx-auto max-w-md px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400"
          aria-busy="true"
        >
          {t("surahReadLoading")}
        </div>
      </QuranLayout>
    );
  }

  if (surahNo === null || !meta) {
    return (
      <QuranLayout>
        <div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("surahReadRedirect")}
        </div>
      </QuranLayout>
    );
  }

  const titleTr = isTr ? meta.nameTr : meta.nameEn;

  return (
    <QuranLayout>
      <Head>
        <title>
          {titleTr} — {t("pageTitle")}
        </title>
      </Head>

      <div className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/95 backdrop-blur-md dark:border-zinc-700 dark:bg-zinc-800/95">
        <div className="mx-auto flex max-w-md items-center gap-2 px-3 py-2.5">
          <Link
            href={listHref}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-emerald-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            aria-label={t("surahReadBack")}
          >
            <IconChevronLeft size={22} stroke={2} />
          </Link>

          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {titleTr}
            </h1>
            <p className="truncate font-arabic text-base text-zinc-600 dark:text-zinc-300">
              {meta.name}
            </p>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-emerald-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
              aria-expanded={menuOpen}
              aria-label={t("surahReadMenu")}
            >
              <IconDotsVertical size={20} stroke={2} />
            </button>

            {menuOpen && (
              <div
                className={cx(
                  "absolute end-0 top-full z-40 mt-1 w-56 rounded-xl border border-emerald-100 bg-white p-2 shadow-xl",
                  "dark:border-zinc-600 dark:bg-zinc-800"
                )}
                role="menu"
              >
                <p className="px-2 pb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {t("surahReadFontSize")} ({fontKey})
                </p>
                <div className="mb-2 flex items-center justify-between gap-1 rounded-lg border border-emerald-100 p-1 dark:border-zinc-600">
                  <button
                    type="button"
                    onClick={() => {
                      bumpFont(-1);
                    }}
                    disabled={fontKey === "sm"}
                    className={cx(
                      "rounded-lg p-2 text-emerald-700 dark:text-emerald-300",
                      fontKey === "sm"
                        ? "opacity-30"
                        : "hover:bg-emerald-50 dark:hover:bg-zinc-700"
                    )}
                    aria-label={t("fontDecrease")}
                  >
                    <IconMinus size={18} />
                  </button>
                  <span className="text-xs tabular-nums text-zinc-600 dark:text-zinc-300">
                    {arabicFontPx}px
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      bumpFont(1);
                    }}
                    disabled={fontKey === "xl"}
                    className={cx(
                      "rounded-lg p-2 text-emerald-700 dark:text-emerald-300",
                      fontKey === "xl"
                        ? "opacity-30"
                        : "hover:bg-emerald-50 dark:hover:bg-zinc-700"
                    )}
                    aria-label={t("fontIncrease")}
                  >
                    <IconPlus size={18} />
                  </button>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    toggleMeal();
                  }}
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-800 hover:bg-emerald-50 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {showMeal ? t("surahReadMealOff") : t("surahReadMealOn")}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    toggleTafsirGlobal();
                  }}
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-800 hover:bg-emerald-50 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  {showTafsir ? t("surahReadTafsirOff") : t("surahReadTafsirOn")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Container
        className={cx(
          "mx-auto max-w-md px-3 pt-3",
          "pb-[calc(8.5rem+env(safe-area-inset-bottom))]"
        )}
      >
        <div
          className={cx(
            "rounded-2xl border border-emerald-100 bg-white px-3 py-2 shadow-sm",
            "dark:border-zinc-700 dark:bg-zinc-800"
          )}
        >
          {loading && <AyahSkeleton count={Math.min(meta.verses, 8)} />}

          {error && !loading && (
            <div className="py-10 text-center">
              <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                {t("readLoadError")}
              </p>
              <button
                type="button"
                onClick={() => surahNo && void loadAyahs(surahNo)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
              >
                {t("surahReadRetry")}
              </button>
            </div>
          )}

          {!loading && !error && ayahs.length > 0 && (
            <AyahListBlock
              surahNumber={surahNo}
              rows={ayahs}
              arabicFontPx={arabicFontPx}
              showMeal={showMeal}
              showTafsirControls={showTafsir}
              openTafsirAyah={openTafsirAyah}
              hiddenTafsir={hiddenTafsir}
              onToggleTafsirForAyah={onToggleTafsirForAyah}
              onTafsirUnavailableForAyah={onTafsirUnavailableForAyah}
              onCloseTafsir={onCloseTafsir}
            />
          )}
        </div>
      </Container>

      <nav
        className={cx(
          "fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 border-t border-emerald-100 bg-white/95 backdrop-blur-md",
          "dark:border-zinc-700 dark:bg-zinc-800/95",
          "pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
        )}
        aria-label={t("surahReadNav")}
      >
        <div className="mx-auto flex max-w-md items-stretch gap-2 px-3">
          {prevSurah ? (
            <Link
              href={`/quran/${prevSurah.number}?mod=oku&sayfa=${encodeURIComponent(listSayfa)}`}
              className={cx(
                "flex flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50/80 py-2.5 text-xs font-medium text-emerald-900",
                "dark:border-zinc-600 dark:bg-zinc-700/80 dark:text-emerald-200"
              )}
            >
              <IconChevronLeft size={16} />
              <span className="truncate">
                {isTr ? prevSurah.nameTr : prevSurah.nameEn}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {nextSurah ? (
            <Link
              href={`/quran/${nextSurah.number}?mod=oku&sayfa=${encodeURIComponent(listSayfa)}`}
              className={cx(
                "flex flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50/80 py-2.5 text-xs font-medium text-emerald-900",
                "dark:border-zinc-600 dark:bg-zinc-700/80 dark:text-emerald-200"
              )}
            >
              <span className="truncate">
                {isTr ? nextSurah.nameTr : nextSurah.nameEn}
              </span>
              <IconChevronRight size={16} />
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
      </nav>
    </QuranLayout>
  );
}
