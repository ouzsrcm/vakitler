import { AnimatePresence, motion } from "framer-motion";
import { cx } from "@/utils/helper";

type CounterProps = {
  count: number;
  target: number;
  complete: boolean;
};

/** Büyük sayaç + SVG halka (kalan tekrar gösterir). */
export function TasbihCounterDisplay({
  count,
  target,
  complete,
}: CounterProps) {
  const pct = target > 0 ? Math.min(1, count / target) : 0;
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - pct);
  const remaining = Math.max(0, target - count);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[200px] w-[200px] items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 140 140"
          aria-hidden
        >
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            className="stroke-zinc-200 dark:stroke-zinc-700"
            strokeWidth={8}
          />
          <circle
            cx={70}
            cy={70}
            r={r}
            fill="none"
            strokeWidth={8}
            strokeLinecap="round"
            className={complete ? "stroke-emerald-500" : "stroke-amber-500"}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <motion.div
          className="relative z-10 flex h-[148px] w-[148px] items-center justify-center overflow-hidden rounded-2xl border border-amber-100 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          animate={
            complete
              ? { scale: [1, 1.05, 1, 1.05, 1, 1.05, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.75, ease: "easeInOut" }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={remaining}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cx(
                "select-none text-6xl font-bold tabular-nums",
                complete
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-zinc-900 dark:text-zinc-50"
              )}
            >
              {remaining}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
