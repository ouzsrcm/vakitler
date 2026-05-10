import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import { cx } from "@/utils/helper";

const btnClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-white text-zinc-600 transition-colors hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700";

export default function ElifbaPracticeShell({
  currentIndex,
  total,
  exitHref = "/learn?tab=elifba",
  onExit,
  children,
}: {
  currentIndex: number;
  total: number;
  exitHref?: string;
  onExit?: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("learn");
  const pct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;
  const label = t("elifba.exitPractice");

  return (
    <div className="flex min-h-[50vh] flex-col">
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {t("elifba.practiceProgress", { current: currentIndex + 1, total })}
        </p>
        {onExit ? (
          <button type="button" onClick={onExit} className={btnClass} aria-label={label}>
            <IconX size={20} />
          </button>
        ) : (
          <Link href={exitHref} className={cx(btnClass)} aria-label={label}>
            <IconX size={20} />
          </Link>
        )}
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-violet-500 transition-[width] duration-300 dark:bg-violet-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {children}
    </div>
  );
}
