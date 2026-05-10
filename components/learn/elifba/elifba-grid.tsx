import { ARABIC_LETTERS } from "@/data/arabic-alphabet";
import type { ElifbaMastery } from "@/lib/learn/elifba-progress";
import LetterCard from "./letter-card";

export default function ElifbaGrid({
  masteryMap,
}: {
  masteryMap: Record<string, ElifbaMastery>;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {ARABIC_LETTERS.map((letter, index) => (
        <LetterCard
          key={letter.slug}
          letter={letter}
          mastery={masteryMap[letter.slug] ?? 0}
          index={index}
        />
      ))}
    </div>
  );
}
