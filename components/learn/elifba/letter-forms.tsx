import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";
import type { ILetter } from "@/data/arabic-alphabet";
import { cx } from "@/utils/helper";

export default function LetterForms({ letter }: { letter: ILetter }) {
  const { t } = useTranslation("learn");
  const { forms, canConnect } = letter;

  const cells = [
    { key: "initial", label: t("elifba.formInitial"), val: forms.initial },
    { key: "medial", label: t("elifba.formMedial"), val: forms.medial },
    { key: "final", label: t("elifba.formFinal"), val: forms.final },
  ];

  return (
    <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80">
      <h3 className="mb-3 text-sm font-bold text-zinc-900 dark:text-zinc-50">
        {t("elifba.formsTitle")}
      </h3>
      <div
        className="grid grid-cols-3 gap-2 text-center"
        dir="rtl"
      >
        {cells.map((c, idx) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="rounded-xl border border-violet-100 bg-violet-50/50 px-1 py-3 dark:border-zinc-600 dark:bg-zinc-900/60"
          >
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {c.label}
            </p>
            <p
              className="font-arabic text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
              dir="rtl"
            >
              {c.val === "-" ? "—" : c.val}
            </p>
          </motion.div>
        ))}
      </div>
      {!canConnect ? (
        <p
          className={cx(
            "mt-3 rounded-lg border-l-4 border-violet-400 bg-violet-50 px-3 py-2 text-xs text-violet-900 dark:border-violet-500 dark:bg-violet-900/20 dark:text-violet-100"
          )}
        >
          {t("elifba.noConnectNote")}
        </p>
      ) : null}
    </section>
  );
}
