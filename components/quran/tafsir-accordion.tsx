import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconLoader2 } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { cx } from "@/utils/helper";

interface Props {
  open: boolean;
  surahNumber: number;
  ayahNumber: number;
  onUnavailable: () => void;
  onClose: () => void;
}

export default function TafsirAccordion({
  open,
  surahNumber,
  ayahNumber,
  onUnavailable,
  onClose,
}: Props) {
  const { t } = useTranslation("quran");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const cache = useRef<Map<string, string | null>>(new Map());
  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    if (!open) {
      setLoading(false);
      return;
    }

    const key = `${surahNumber}:${ayahNumber}`;

    if (cache.current.has(key)) {
      const c = cache.current.get(key);
      if (c === null || c === undefined || c === "") {
        onUnavailableRef.current();
        setText(null);
      } else {
        setText(c);
      }
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setText(null);

    const url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/en.maududi`;

    void (async () => {
      try {
        const res = await fetch(url);
        const json = (await res.json()) as {
          data?: { text?: string };
        };
        const raw = json.data?.text?.trim() ?? "";
        if (cancelled) return;
        if (!raw) {
          cache.current.set(key, null);
          onUnavailableRef.current();
          setLoading(false);
          return;
        }
        cache.current.set(key, raw);
        setText(raw);
      } catch {
        if (cancelled) return;
        cache.current.set(key, null);
        onUnavailableRef.current();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, surahNumber, ayahNumber]);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="panel"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div
            className={cx(
              "mt-2 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-3 dark:bg-amber-950/20",
              "text-sm italic text-zinc-800 dark:text-zinc-200"
            )}
          >
            <div className="mb-2 flex items-baseline justify-between gap-2 not-italic">
              <span className="text-xs font-semibold tracking-wide text-amber-900 dark:text-amber-200">
                {t("tafsirTitle")}{" "}
                <span className="font-normal text-amber-700/90 dark:text-amber-300/90">
                  {t("tafsirMaududi")}
                </span>
              </span>
            </div>

            {loading && (
              <div className="flex items-center gap-2 py-2 not-italic">
                <IconLoader2
                  className="animate-spin text-amber-600 dark:text-amber-400"
                  size={20}
                  stroke={1.5}
                  aria-hidden
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {t("tafsirLoading")}
                </span>
              </div>
            )}

            {!loading && text && (
              <>
                <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 text-xs font-medium not-italic text-amber-800 underline-offset-2 hover:underline dark:text-amber-300"
                >
                  {t("tafsirClose")}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
