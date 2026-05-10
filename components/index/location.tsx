import { cx } from "@/utils/helper";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import useLocations from "@/hooks/use-locations";

export default function IndexLocation() {
  const { lang } = useTranslation("common");
  const { city } = useLocations();

  return (
    <motion.div
      {...containerAnim}
      className={cx("absolute inset-x-0 text-center top-4 md:top-6 z-20")}
    >
      <div
        className="relative inline-flex items-center gap-2 px-4 py-1.5 text-sm
        font-medium uppercase tracking-wider"
      >
        <span className="absolute inset-0 -z-10 rounded-3xl bg-white dark:bg-white/10" />

        <span>{city?.toLocaleLowerCase(lang)}</span>
      </div>
    </motion.div>
  );
}

const containerAnim = {
  variants: {
    open: {
      y: 0,
      scale: 1,
      opacity: 1,
    },
    closed: {
      y: 20,
      scale: 0.8,
      opacity: 0,
    },
  },
  transition: {
    delay: 0.4,
  },
};
