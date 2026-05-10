import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

type Props = {
  onContinue: () => void;
  onNext: () => void;
  hasNext: boolean;
};

export default function TasbihComplete({
  onContinue,
  onNext,
  hasNext,
}: Props) {
  const { t } = useTranslation("zikir");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-5 dark:border-emerald-900/60 dark:bg-emerald-950/30"
    >
      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
        ✓ {t("completed")}
      </p>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          {t("continueLabel")}
        </button>
        {hasNext ? (
          <button
            type="button"
            onClick={onNext}
            className="flex-1 rounded-xl border border-emerald-600 py-3 font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500 dark:text-emerald-200 dark:hover:bg-emerald-950/50"
          >
            {t("nextDhikr")}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
