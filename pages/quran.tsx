import Head from "next/head";
import { BOTTOM_NAV_CONTENT_PADDING } from "@/components/nav/bottom-nav";
import { cx } from "@/utils/helper";

export default function QuranPage() {
  return (
    <div
      className={cx(
        "min-h-dvh bg-emerald-50 px-4 pt-8 dark:bg-zinc-900",
        BOTTOM_NAV_CONTENT_PADDING
      )}
    >
      <Head>
        <title>Kuran — Namaz vakti</title>
      </Head>
      <h1 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
        Kuran
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bu sayfa yakında güncellenecek.
      </p>
    </div>
  );
}
