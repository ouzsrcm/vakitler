import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

export default function DhikrHeader() {
  const { t } = useTranslation("zikir");

  return (
    <motion.header
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="-mx-5 mb-5 rounded-b-3xl bg-gradient-to-b from-amber-500 to-amber-700 px-6 pb-6 pt-10 text-center text-white shadow-sm"
    >
      <h1 className="text-xl font-bold tracking-tight">
        <span aria-hidden className="mr-1.5">
          📿
        </span>
        {t("title")}
      </h1>
      <p className="mx-auto mt-2 max-w-[300px] text-sm font-medium text-white/95">
        {t("subtitle")}
      </p>
      <p className="mt-2 text-xs font-semibold text-white/80">
        {t("subtitleSource")}
      </p>
    </motion.header>
  );
}
