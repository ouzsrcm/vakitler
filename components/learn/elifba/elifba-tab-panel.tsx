import { useEffect, useMemo, useState } from "react";
import { ARABIC_LETTERS } from "@/data/arabic-alphabet";
import { loadElifbaMastery, type ElifbaMastery } from "@/lib/learn/elifba-progress";
import ElifbaGrid from "./elifba-grid";
import ElifbaStatsHeader from "./elifba-stats-header";

export default function ElifbaTabPanel() {
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
      <ElifbaStatsHeader learnedCount={learnedCount} />
      <ElifbaGrid masteryMap={masteryMap} />
    </div>
  );
}
