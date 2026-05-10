import { ReactNode } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import colors from "tailwindcss/colors";
import { bottomNavScrollPaddingBottomClass } from "@/components/nav/bottom-nav";
import { cx } from "@/utils/helper";

export default function LearnLayout({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  const themeColor =
    resolvedTheme === "light" ? colors.violet["50"] : colors.zinc["900"];

  return (
    <div
      className={cx(
        "min-h-dvh bg-violet-50 dark:bg-zinc-900",
        bottomNavScrollPaddingBottomClass
      )}
    >
      <Head>
        <meta name="theme-color" content={themeColor} />
      </Head>
      {children}
    </div>
  );
}
