import { useRouter } from "next/router";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cx } from "@/utils/helper";
import useTranslation from "next-translate/useTranslation";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function SurahPagination({
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const { t } = useTranslation("quran");

  if (totalPages <= 1) return null;

  const go = (page: number) => {
    const p = Math.max(1, Math.min(totalPages, page));
    void router.push(
      { pathname: router.pathname, query: { ...router.query, sayfa: String(p) } },
      undefined,
      { shallow: true }
    );
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1 border-t border-emerald-100 bg-white px-2 py-3 dark:border-zinc-700 dark:bg-zinc-800"
      aria-label={t("paginationAria")}
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label={t("paginationPrev")}
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors dark:text-zinc-300",
          currentPage <= 1
            ? "opacity-30"
            : "hover:bg-emerald-100 dark:hover:bg-zinc-700"
        )}
      >
        <IconChevronLeft size={20} stroke={2} />
      </button>

      {pages.map(p => {
        const active = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={active ? "page" : undefined}
            className={cx(
              "min-w-[2.25rem] px-2.5 py-1.5 text-sm font-medium tabular-nums transition-colors",
              active
                ? "rounded-full bg-emerald-500 text-white shadow-sm"
                : "rounded-full text-zinc-600 hover:bg-emerald-50 dark:text-zinc-300 dark:hover:bg-zinc-700"
            )}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label={t("paginationNext")}
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors dark:text-zinc-300",
          currentPage >= totalPages
            ? "opacity-30"
            : "hover:bg-emerald-100 dark:hover:bg-zinc-700"
        )}
      >
        <IconChevronRight size={20} stroke={2} />
      </button>
    </nav>
  );
}
