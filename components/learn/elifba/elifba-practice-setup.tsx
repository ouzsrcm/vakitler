import { useEffect, useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { ARABIC_LETTERS, type ILetter } from "@/data/arabic-alphabet";
import { getElifbaMastery } from "@/lib/learn/elifba-progress";
import { canUseSpeechSynthesis } from "@/lib/learn/elifba-speech";
import { shuffleArray } from "@/lib/learn/words";
import { cx } from "@/utils/helper";

export type ElifbaPracticeMode = "name" | "sound" | "form";

export interface ElifbaPracticeConfig {
  mode: ElifbaPracticeMode;
  deck: ILetter[];
}

function buildDeck(
  scope: "all" | "unlearned" | "pick",
  picked: Record<string, boolean>
): ILetter[] {
  let pool = [...ARABIC_LETTERS];
  if (scope === "unlearned") {
    pool = pool.filter(l => getElifbaMastery(l.slug) < 3);
  }
  if (scope === "pick") {
    const keys = Object.keys(picked).filter(k => picked[k]);
    if (keys.length > 0) {
      pool = pool.filter(l => keys.includes(l.slug));
    }
  }
  return shuffleArray(pool);
}

export default function ElifbaPracticeSetup({
  onStart,
}: {
  onStart: (cfg: ElifbaPracticeConfig) => void;
}) {
  const { t } = useTranslation("learn");
  const [scope, setScope] = useState<"all" | "unlearned" | "pick">("all");
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<ElifbaPracticeMode>("name");
  const [speechOk, setSpeechOk] = useState(false);
  useEffect(() => {
    setSpeechOk(canUseSpeechSynthesis());
  }, []);

  const previewDeck = useMemo(
    () => buildDeck(scope, picked),
    [scope, picked]
  );

  const togglePick = (slug: string) => {
    setPicked(p => ({ ...p, [slug]: !p[slug] }));
  };

  const start = () => {
    const deck = buildDeck(scope, picked);
    if (!deck.length) return;
    if (mode === "sound" && !speechOk) return;
    onStart({ mode, deck });
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("elifba.setupScope")}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="elif-scope"
            checked={scope === "all"}
            onChange={() => setScope("all")}
            className="accent-violet-600"
          />
          {t("elifba.setupAll")}
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="elif-scope"
            checked={scope === "unlearned"}
            onChange={() => setScope("unlearned")}
            className="accent-violet-600"
          />
          {t("elifba.setupUnlearned")}
        </label>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input
            type="radio"
            name="elif-scope"
            checked={scope === "pick"}
            onChange={() => setScope("pick")}
            className="accent-violet-600"
          />
          {t("elifba.setupPick")}
        </label>
        {scope === "pick" ? (
          <div className="mt-3 max-h-44 space-y-2 overflow-y-auto rounded-xl border border-violet-100 bg-violet-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-800/60">
            {ARABIC_LETTERS.map(l => (
              <label
                key={l.slug}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200"
              >
                <input
                  type="checkbox"
                  checked={!!picked[l.slug]}
                  onChange={() => togglePick(l.slug)}
                  className="accent-violet-600"
                />
                <span className="font-arabic text-lg" dir="rtl">
                  {l.arabic}
                </span>
                <span>{l.name}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {t("elifba.setupMode")}
        </p>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
          <input
            type="radio"
            name="elif-mode"
            checked={mode === "name"}
            onChange={() => setMode("name")}
            className="accent-violet-600"
          />
          {t("elifba.modeName")}
        </label>
        <label
          className={cx(
            "mt-2 flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm",
            !speechOk
              ? "cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-600"
              : "border-violet-100 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          )}
        >
          <input
            type="radio"
            name="elif-mode"
            checked={mode === "sound"}
            disabled={!speechOk}
            onChange={() => setMode("sound")}
            className="accent-violet-600"
          />
          {t("elifba.modeSound")}
        </label>
        {!speechOk ? (
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
            {t("elifba.noSpeech")}
          </p>
        ) : null}
        <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl border border-violet-100 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
          <input
            type="radio"
            name="elif-mode"
            checked={mode === "form"}
            onChange={() => setMode("form")}
            className="accent-violet-600"
          />
          {t("elifba.modeForm")}
        </label>
      </div>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        {t("elifba.setupPreview", { count: previewDeck.length })}
      </p>

      <button
        type="button"
        disabled={!previewDeck.length || (mode === "sound" && !speechOk)}
        onClick={start}
        className="w-full rounded-xl bg-violet-500 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("elifba.setupStart")}
      </button>
    </div>
  );
}
