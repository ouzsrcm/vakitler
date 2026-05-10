import { IconSearch, IconX } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { cx } from "@/utils/helper";

export type SurahFilterTab = "all" | "favorites" | "meccan" | "medinan";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: SurahFilterTab;
  onFilterChange: (filter: SurahFilterTab) => void;
  showEmptySearchResult: boolean;
  onClearSearch: () => void;
}

export default function SurahFilters({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  showEmptySearchResult,
  onClearSearch,
}: Props) {
  const { t } = useTranslation("quran");

  const pills: { id: SurahFilterTab; label: string }[] = [
    { id: "all", label: t("filterAll") },
    { id: "favorites", label: t("filterFavorites") },
    { id: "meccan", label: t("filterMeccan") },
    { id: "medinan", label: t("filterMedinan") },
  ];

  return (
    <div className="space-y-3 border-b border-emerald-100 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
      <div
        className={cx(
          "flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-shadow",
          "bg-white dark:bg-zinc-800",
          "border-emerald-100 dark:border-zinc-700",
          "focus-within:border-emerald-400 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.2)] dark:focus-within:border-emerald-500 dark:focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"
        )}
      >
        <IconSearch
          size={20}
          className="shrink-0 text-emerald-600 opacity-70 dark:text-emerald-400"
          stroke={1.75}
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={t("surahSearchPlaceholder")}
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          autoComplete="off"
          enterKeyHint="search"
        />
        {searchQuery.length > 0 ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="shrink-0 rounded-lg p-1 text-zinc-400 transition-colors hover:bg-emerald-50 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            aria-label={t("surahSearchClear")}
          >
            <IconX size={18} stroke={2} />
          </button>
        ) : null}
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto whitespace-nowrap px-1 pb-0.5">
        {pills.map(p => {
          const active = activeFilter === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onFilterChange(p.id)}
              className={cx(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                active
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "border border-emerald-200 bg-white text-zinc-700 hover:border-emerald-300 dark:border-emerald-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-700"
              )}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {showEmptySearchResult ? (
        <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {t("surahSearchEmpty")}
          </p>
          <button
            type="button"
            onClick={onClearSearch}
            className="mt-3 text-sm font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            {t("surahSearchClearAction")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
