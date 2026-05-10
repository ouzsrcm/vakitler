import type { ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  IconBook,
  IconHome2,
  IconSettings,
  type TablerIconsProps,
} from "@tabler/icons-react";
import { cx } from "@/utils/helper";

export const BOTTOM_NAV_CONTENT_PADDING =
  "pb-[calc(4.5rem+env(safe-area-inset-bottom))]";

type Tab = {
  href: string;
  label: string;
  Icon: ComponentType<TablerIconsProps>;
  match: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  {
    href: "/",
    label: "Vakitler",
    Icon: IconHome2,
    match: p => p === "/",
  },
  {
    href: "/quran",
    label: "Kuran",
    Icon: IconBook,
    match: p => p === "/quran" || p.startsWith("/quran/"),
  },
  {
    href: "/settings",
    label: "Ayarlar",
    Icon: IconSettings,
    match: p => p.startsWith("/settings"),
  },
];

export default function BottomNav() {
  const router = useRouter();

  if (router.pathname === "/tv") {
    return null;
  }

  const onHome = router.pathname === "/";

  const barBg = onHome
    ? "border border-white/20 bg-white/20 shadow-sm backdrop-blur-md dark:border-white/15 dark:bg-white/10"
    : "border-t border-zinc-200/80 bg-white dark:border-zinc-700/80 dark:bg-zinc-800";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center">
      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="pointer-events-auto mx-auto w-full max-w-md px-3"
        aria-label="Ana navigasyon"
      >
        <div
          className={cx(
            "flex items-stretch justify-around gap-1 rounded-t-2xl px-1 pt-2",
            "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
            barBg
          )}
        >
          {tabs.map(({ href, label, Icon, match }) => {
            const active = match(router.pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-2xl py-1.5",
                  active
                    ? "font-semibold text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 dark:text-zinc-400"
                )}
              >
                <span
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    active &&
                      (onHome
                        ? "bg-white/40 ring-2 ring-white/50 dark:bg-white/15 dark:ring-white/20"
                        : "bg-zinc-100 ring-2 ring-zinc-300/80 dark:bg-zinc-700/80 dark:ring-zinc-600")
                  )}
                >
                  <Icon size={22} stroke={active ? 2 : 1.5} />
                </span>
                <span className="truncate text-xs">{label}</span>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
}
