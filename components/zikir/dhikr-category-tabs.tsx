import useTranslation from "next-translate/useTranslation";
import type { DhikrCategory } from "@/data/dhikr";
import { cx } from "@/utils/helper";

const CATEGORIES: DhikrCategory[] = ["namaz-sonrasi", "gunluk", "tasavvufi"];

type Props = {
  active: DhikrCategory;
  onChange: (c: DhikrCategory) => void;
};

export default function DhikrCategoryTabs({ active, onChange }: Props) {
  const { t } = useTranslation("zikir");

  const label = (c: DhikrCategory) => {
    if (c === "namaz-sonrasi") return t("categoryPrayer");
    if (c === "gunluk") return t("categoryDaily");
    return t("categorySufi");
  };

  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2">
      {CATEGORIES.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cx(
            "rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
            active === c
              ? "bg-amber-500 text-white shadow-sm dark:bg-amber-600"
              : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          {label(c)}
        </button>
      ))}
    </div>
  );
}
