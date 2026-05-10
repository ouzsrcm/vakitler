import useTranslation from "next-translate/useTranslation";
import type { ILetter, ILetterExample } from "@/data/arabic-alphabet";

function WordLine({
  ex,
  letterChar,
}: {
  ex: ILetterExample;
  letterChar: string;
}) {
  const parts: React.ReactNode[] = [];
  let highlighted = false;
  let i = 0;
  for (const ch of ex.word) {
    if (!highlighted && ch === letterChar) {
      parts.push(
        <span
          key={i}
          className="font-arabic text-violet-600 dark:text-violet-400"
        >
          {ch}
        </span>
      );
      highlighted = true;
    } else {
      parts.push(
        <span key={i} className="text-zinc-800 dark:text-zinc-100">
          {ch}
        </span>
      );
    }
    i += 1;
  }

  return (
    <div className="flex flex-row-reverse flex-wrap items-baseline justify-end gap-2 border-b border-zinc-100 py-2.5 last:border-0 dark:border-zinc-700">
      <span
        dir="rtl"
        className="font-arabic text-lg font-medium leading-relaxed"
      >
        {parts}
      </span>
      <span aria-hidden className="text-zinc-400">
        →
      </span>
      <span className="text-left text-sm text-zinc-600 dark:text-zinc-300">
        {ex.meaning}
      </span>
    </div>
  );
}

export default function LetterExamples({ letter }: { letter: ILetter }) {
  const { t } = useTranslation("learn");

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
      <h3 className="mb-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
        {t("elifba.examplesTitle")}
      </h3>
      <div>
        {letter.examples.map((ex, idx) => (
          <WordLine key={idx} ex={ex} letterChar={letter.arabic} />
        ))}
      </div>
    </section>
  );
}
