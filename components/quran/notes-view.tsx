import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";
import { IconArrowLeft, IconDownload } from "@tabler/icons-react";
import { cx } from "@/utils/helper";
import surahs, { type ISurah } from "@/data/surahs";
import {
  readNotes,
  writeNotes,
  type QuranNotesMap,
} from "@/components/quran/storage";

const DEBOUNCE_MS = 500;

function buildExportText(map: QuranNotesMap, isTr: boolean): string {
  const lines: string[] = [];
  const sortedKeys = Object.keys(map)
    .map(k => parseInt(k, 10))
    .filter(n => Number.isFinite(n) && n >= 1 && n <= 114)
    .sort((a, b) => a - b);

  for (const num of sortedKeys) {
    const text = (map[String(num)] ?? "").trim();
    if (!text) continue;
    const surah = surahs.find(s => s.number === num);
    const title = surah
      ? isTr
        ? `${num}. ${surah.nameTr}`
        : `${num}. ${surah.nameEn}`
      : `${num}`;
    lines.push(title);
    lines.push("---");
    lines.push(text);
    lines.push("");
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export default function NotesView() {
  const { lang } = useTranslation("common");
  const { t } = useTranslation("quran");
  const isTr = lang === "tr";

  const [map, setMap] = useState<QuranNotesMap>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMap(readNotes());
  }, []);

  const scheduleSave = useCallback((surahNumber: number, text: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const prev = readNotes();
      const key = String(surahNumber);
      const next = { ...prev, [key]: text };
      if (!text.trim()) {
        delete next[key];
      }
      writeNotes(next);
      setMap(next);
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const withNotes = useMemo(() => {
    return surahs.filter(s => (map[String(s.number)] ?? "").trim().length > 0);
  }, [map]);

  const openEditor = (n: number) => {
    setEditing(n);
    setDraft(readNotes()[String(n)] ?? "");
  };

  const closeEditor = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    if (editing != null) {
      const key = String(editing);
      const next = { ...readNotes() };
      if (!draft.trim()) {
        delete next[key];
      } else {
        next[key] = draft;
      }
      writeNotes(next);
      setMap(next);
    }
    setEditing(null);
  };

  const onChangeDraft = (v: string) => {
    setDraft(v);
    if (editing != null) {
      scheduleSave(editing, v);
    }
  };

  const exportTxt = () => {
    const fresh = readNotes();
    const body = buildExportText(fresh, isTr);
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vakitler-kuran-notlari.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const editingSurah: ISurah | undefined =
    editing != null ? surahs.find(s => s.number === editing) : undefined;

  if (editing != null && editingSurah) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="space-y-3"
      >
        <button
          type="button"
          onClick={closeEditor}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
        >
          <IconArrowLeft size={16} />
          {t("notesBack")}
        </button>

        <div className="rounded-2xl border border-emerald-100 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                {t("notesSurahLabel", { number: editingSurah.number })}
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {isTr ? editingSurah.nameTr : editingSurah.nameEn}
              </p>
              <p className="font-arabic text-base text-zinc-600 dark:text-zinc-300">
                {editingSurah.name}
              </p>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={e => onChangeDraft(e.target.value)}
            rows={10}
            className={cx(
              "w-full resize-y rounded-xl border border-emerald-100 bg-white p-3 text-sm",
              "text-zinc-800 outline-none ring-emerald-500/30 focus:ring-2",
              "dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            )}
            placeholder={t("notesPlaceholder")}
            aria-label={t("notesEditorAria")}
          />

          {!draft.trim() && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {t("notesEmptyHint")}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("notesIntro", { count: withNotes.length })}
        </p>
        <button
          type="button"
          onClick={exportTxt}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-emerald-200 dark:hover:bg-zinc-700"
        >
          <IconDownload size={14} />
          {t("notesExport")}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white dark:border-zinc-700 dark:bg-zinc-800">
        <ul className="divide-y divide-emerald-100 dark:divide-zinc-700">
          {surahs.map(surah => {
            const raw = map[String(surah.number)] ?? "";
            const has = raw.trim().length > 0;
            return (
              <li key={surah.number}>
                <button
                  type="button"
                  onClick={() => openEditor(surah.number)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-emerald-50 dark:hover:bg-zinc-800/80"
                >
                  <span
                    className={cx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium",
                      has
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-zinc-700 dark:text-zinc-200"
                    )}
                  >
                    {surah.number}
                  </span>
                  <div className="min-w-0 grow">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {isTr ? surah.nameTr : surah.nameEn}
                      </span>
                      {has && (
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                          title={t("notesHasNote")}
                          aria-hidden
                        />
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t("notesCharCount", { count: raw.length })}
                    </div>
                  </div>
                  <span className="font-arabic text-lg text-zinc-500 dark:text-zinc-400">
                    {surah.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}
