import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import { cx } from "@/utils/helper";

const PRESETS = [11, 33, 99, 100] as const;

type Props = {
  open: boolean;
  onClose: () => void;
  value: number;
  onSelect: (n: number) => void;
};

export default function TasbihTargetSheet({
  open,
  onClose,
  value,
  onSelect,
}: Props) {
  const { t } = useTranslation("zikir");
  const [customOpen, setCustomOpen] = useState(false);
  const [customVal, setCustomVal] = useState(String(value));

  useEffect(() => {
    if (open) {
      setCustomVal(String(value));
      setCustomOpen(false);
    }
  }, [open, value]);

  const applyCustom = () => {
    const n = Math.max(1, Math.min(9999, parseInt(customVal, 10) || 1));
    onSelect(n);
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Kapat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[85vh] w-full max-w-md rounded-t-3xl border border-amber-100 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {t("targetLabel")}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                <IconX size={22} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {PRESETS.map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    onSelect(n);
                    onClose();
                  }}
                  className={cx(
                    "rounded-2xl py-3 text-base font-bold transition-colors",
                    value === n
                      ? "bg-amber-500 text-white"
                      : "bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                  )}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomOpen(v => !v)}
                className={cx(
                  "rounded-2xl py-3 text-sm font-bold sm:col-span-1",
                  customOpen ||
                    !PRESETS.some(p => p === value)
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 text-amber-900 hover:bg-amber-100 dark:bg-zinc-700 dark:text-zinc-100"
                )}
              >
                {t("customTarget")}
              </button>
            </div>
            {customOpen ? (
              <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("customTarget")}
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    inputMode="numeric"
                    value={customVal}
                    onChange={e => setCustomVal(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-amber-100 bg-white px-3 py-2 text-lg dark:border-zinc-600 dark:bg-zinc-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={applyCustom}
                  className="rounded-xl bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600"
                >
                  {t("targetLabel")}
                </button>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
