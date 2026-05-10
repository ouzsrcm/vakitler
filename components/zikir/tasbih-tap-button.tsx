import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";
import { cx } from "@/utils/helper";

type Props = {
  onTap: () => void;
};

export default function TasbihTapButton({ onTap }: Props) {
  const { t } = useTranslation("zikir");

  return (
    <motion.button
      type="button"
      onClick={onTap}
      whileTap={{ scale: 0.97 }}
      className={cx(
        "flex h-[120px] w-full max-w-sm items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white shadow-md transition-colors",
        "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
      )}
    >
      <span>{String(t("tapButton"))}</span>
      <span aria-hidden>📿</span>
    </motion.button>
  );
}
