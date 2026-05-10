import { useRouter } from "next/router";
import { cx } from "@/utils/helper";
import useTranslation from "next-translate/useTranslation";
import type { QuranMod } from "./quran-mod";

export default function ModeTabs({ activeMod }: { activeMod: QuranMod }) {
  const router = useRouter();
  const { t } = useTranslation("quran");

  const setMod = (m: QuranMod) => {
    const pathname = router.pathname || "/quran";
    void router.push(
      { pathname, query: { ...router.query, mod: m } },
      undefined,
      { shallow: true }
    );
  };

  const tabs: { mod: QuranMod; label: string }[] = [
    { mod: "dinle", label: t("modeListen") },
    { mod: "oku", label: t("modeRead") },
    { mod: "notlar", label: t("modeNotes") },
  ];

  return (
    <div
      className="mb-4 flex rounded-full border border-emerald-100 bg-white/80 p-1 dark:border-zinc-700 dark:bg-zinc-800/80"
      role="tablist"
      aria-label={t("modeTablist")}
    >
      {tabs.map(({ mod, label }) => {
        const active = activeMod === mod;
        return (
          <button
            key={mod}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setMod(mod)}
            className={cx(
              "min-w-0 flex-1 rounded-full px-2 py-2 text-center text-xs font-medium transition-colors sm:text-sm",
              active
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-zinc-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            )}
          >
            <span className="whitespace-normal break-words">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
