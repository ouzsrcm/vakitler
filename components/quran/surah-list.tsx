import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { ISurah } from "@/data/surahs";
import { cx } from "@/utils/helper";
import useTranslation from "next-translate/useTranslation";

export type SurahListEmptyState = "none" | "favorites";

function buildPaginationItems(
  totalPages: number,
  currentPage: number
): (number | "ellipsis")[] {
  if (totalPages <= 6) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set<number>();
  set.add(1);
  set.add(totalPages);
  for (let d = -2; d <= 2; d++) {
    set.add(currentPage + d);
  }
  const sorted = Array.from(set)
    .filter(n => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const out: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i];
    if (i > 0 && n - sorted[i - 1] > 1) {
      out.push("ellipsis");
    }
    out.push(n);
  }
  return out;
}

interface ListenPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface Props {
  surahs: ISurah[];
  selectedNumber: number | null;
  /** Used when rows are buttons (dinle / notlar). Ignored if getItemHref is set. */
  onSelect?: (surah: ISurah) => void;
  /** When set, rows navigate with Next Link instead of calling onSelect. */
  getItemHref?: (surah: ISurah) => string;
  favorites?: number[];
  onToggleFavorite?: (surahNumber: number) => void;
  listenPagination?: ListenPagination | null;
  listTopRef?: React.Ref<HTMLDivElement>;
  emptyState?: SurahListEmptyState;
}

export default function SurahList({
  surahs,
  selectedNumber,
  onSelect,
  getItemHref,
  favorites = [],
  onToggleFavorite,
  listenPagination,
  listTopRef,
  emptyState = "none",
}: Props) {
  const { lang, t } = useTranslation("quran");
  const isTr = lang === "tr";
  const isLinkMode = Boolean(getItemHref);
  const showHearts = Boolean(onToggleFavorite) && !isLinkMode;
  const [heartPulse, setHeartPulse] = useState<{
    surahNumber: number;
    dir: "in" | "out";
  } | null>(null);

  const favoriteSet = useMemo(
    () => new Set(favorites),
    [favorites]
  );

  const pageItems = useMemo(() => {
    if (!listenPagination || listenPagination.totalPages <= 1) return [];
    return buildPaginationItems(
      listenPagination.totalPages,
      listenPagination.page
    );
  }, [listenPagination]);

  if (emptyState === "favorites" && surahs.length === 0) {
    return (
      <div
        ref={listTopRef}
        className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center"
      >
        <IconHeartFilled
          size={40}
          className="text-red-400/80"
          aria-hidden
        />
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {t("favoritesEmptyTitle")}
        </p>
        <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
          {t("favoritesEmptyHint")}
        </p>
      </div>
    );
  }

  return (
    <div ref={listTopRef} className="flex flex-col">
      <div className="divide-y divide-emerald-100 dark:divide-zinc-800">
        {surahs.map(surah => {
          const isSelected = surah.number === selectedNumber;
          const href = getItemHref?.(surah);
          const isFavorite = favoriteSet.has(surah.number);
          const rowClass = cx(
            "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
            "hover:bg-emerald-100 dark:hover:bg-zinc-800",
            isSelected && "bg-emerald-100 dark:bg-zinc-800"
          );
          const pulseThis =
            heartPulse?.surahNumber === surah.number ? heartPulse.dir : null;

          const inner = (
            <>
              <span
                className={cx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-100 text-emerald-700 dark:bg-zinc-700 dark:text-zinc-300"
                )}
              >
                {surah.number}
              </span>

              <div className="min-w-0 grow">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cx(
                      "truncate font-medium",
                      isSelected && "text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    {isTr ? surah.nameTr : surah.nameEn}
                  </span>
                  <span className="shrink-0 font-arabic text-xl text-zinc-500 dark:text-zinc-400">
                    {surah.name}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {isTr ? surah.meaningTr : surah.meaning} · {surah.verses}{" "}
                  {t("verses")}
                </div>
              </div>

              {showHearts ? (
                <motion.button
                  type="button"
                  aria-label={
                    isFavorite ? t("favoriteRemoveAria") : t("favoriteAddAria")
                  }
                  aria-pressed={isFavorite}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const next = !isFavorite;
                    setHeartPulse({ surahNumber: surah.number, dir: next ? "in" : "out" });
                    onToggleFavorite?.(surah.number);
                  }}
                  onAnimationComplete={() => setHeartPulse(null)}
                  animate={
                    pulseThis === "in"
                      ? { scale: [1, 1.3, 1] }
                      : pulseThis === "out"
                        ? { scale: [1, 0.8, 1] }
                        : { scale: 1 }
                  }
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className={cx(
                    "shrink-0 rounded-full p-1.5 outline-none ring-emerald-400/30 focus-visible:ring-2",
                    isFavorite ? "text-red-400" : "text-zinc-500"
                  )}
                >
                  {isFavorite ? (
                    <IconHeartFilled size={22} />
                  ) : (
                    <IconHeart
                      size={22}
                      stroke={1.75}
                      className="opacity-30 transition-opacity hover:opacity-70"
                    />
                  )}
                </motion.button>
              ) : null}
            </>
          );

          if (href) {
            return (
              <Link key={surah.number} href={href} className={rowClass} scroll>
                {inner}
              </Link>
            );
          }

          return (
            <button
              key={surah.number}
              type="button"
              onClick={() => onSelect?.(surah)}
              className={rowClass}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {listenPagination && listenPagination.totalPages > 1 ? (
        <nav
          className="flex items-center justify-center gap-1 border-t border-emerald-100 bg-white px-2 py-3 dark:border-zinc-700 dark:bg-zinc-800"
          aria-label={t("paginationAria")}
        >
          <button
            type="button"
            onClick={() =>
              listenPagination.onPageChange(listenPagination.page - 1)
            }
            disabled={listenPagination.page <= 1}
            aria-label={t("paginationPrev")}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors dark:text-zinc-300",
              listenPagination.page <= 1
                ? "cursor-not-allowed opacity-30"
                : "hover:text-emerald-600 dark:hover:text-emerald-400"
            )}
          >
            <IconChevronLeft size={20} stroke={2} />
          </button>

          {pageItems.map((item, idx) =>
            item === "ellipsis" ? (
              <span
                key={`e-${idx}`}
                className="w-8 text-center text-sm text-zinc-400"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => listenPagination.onPageChange(item)}
                aria-current={item === listenPagination.page ? "page" : undefined}
                className={cx(
                  "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
                  item === listenPagination.page
                    ? "w-8 bg-emerald-500 text-white"
                    : "px-1 text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                )}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() =>
              listenPagination.onPageChange(listenPagination.page + 1)
            }
            disabled={listenPagination.page >= listenPagination.totalPages}
            aria-label={t("paginationNext")}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-600 transition-colors dark:text-zinc-300",
              listenPagination.page >= listenPagination.totalPages
                ? "cursor-not-allowed opacity-30"
                : "hover:text-emerald-600 dark:hover:text-emerald-400"
            )}
          >
            <IconChevronRight size={20} stroke={2} />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
