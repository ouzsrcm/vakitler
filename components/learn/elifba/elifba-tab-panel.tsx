import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { ARABIC_LETTERS } from "@/data/arabic-alphabet";
import { loadElifbaMastery, type ElifbaMastery } from "@/lib/learn/elifba-progress";
import ElifbaGrid from "./elifba-grid";
import ElifbaStatsHeader from "./elifba-stats-header";

export default function ElifbaTabPanel() {
  const { t } = useTranslation("learn");
  const [masteryMap, setMasteryMap] = useState<Record<string, ElifbaMastery>>(
    {}
  );

  useEffect(() => {
    setMasteryMap(loadElifbaMastery());
  }, []);

  const learnedCount = useMemo(
    () => ARABIC_LETTERS.filter(l => (masteryMap[l.slug] ?? 0) >= 3).length,
    [masteryMap]
  );

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/quran"
          className="flex items-center gap-1 text-sm text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200"
        >
          <IconChevronLeft size={16} />
          {t("backToQuran")}
        </Link>
      </div>
      <ElifbaStatsHeader learnedCount={learnedCount} />
      <ElifbaGrid masteryMap={masteryMap} />
    </div>
  );
}
