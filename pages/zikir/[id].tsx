import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import useTranslation from "next-translate/useTranslation";
import { IconChevronLeft } from "@tabler/icons-react";
import ZikirLayout from "@/components/zikir/layout";
import {
  DHIKR_STATIC_PATH_IDS,
  getDhikrById,
  type IDhikr,
} from "@/data/dhikr";
import { cx } from "@/utils/helper";

type PageProps = {
  dhikr: IDhikr;
};

export default function ZikirDetailPage({ dhikr }: PageProps) {
  const { t } = useTranslation("zikir");
  const showSufiNote = dhikr.category === "tasavvufi";

  return (
    <ZikirLayout>
      <Head>
        <title>{dhikr.transliteration}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-4">
        <header className="mb-6">
          <Link
            href="/zikir"
            className="inline-flex items-center gap-0.5 text-sm font-semibold text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-200"
          >
            <IconChevronLeft size={18} />
            {t("title")}
          </Link>
        </header>

        <article className="space-y-6">
          <p
            className="text-center font-arabic text-5xl leading-relaxed text-zinc-900 dark:text-zinc-50"
            dir="rtl"
          >
            {dhikr.arabic}
          </p>
          <p className="text-center text-lg font-semibold text-amber-800 dark:text-amber-300">
            {dhikr.transliteration}
          </p>
          <p className="text-center text-base text-zinc-700 dark:text-zinc-200">
            {dhikr.meaning}
          </p>

          {showSufiNote ? (
            <aside
              className={cx(
                "rounded-r-xl border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-100/95"
              )}
            >
              {t("tasavvufiNote")}
            </aside>
          ) : null}

          <section>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t("virtueLabel")}
            </h2>
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {dhikr.virtue}
            </p>
          </section>

          <section>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t("sourceLabel")}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {dhikr.source}
            </p>
          </section>

          <Link
            href={`/zikir/tesbih?id=${encodeURIComponent(dhikr.id)}`}
            className="flex w-full items-center justify-center rounded-2xl bg-amber-500 py-4 text-base font-bold text-white shadow-md transition-colors hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            {t("readWithTasbih")}
          </Link>
        </article>
      </div>
    </ZikirLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: DHIKR_STATIC_PATH_IDS.map(id => ({ params: { id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const raw = params?.id;
  const id = typeof raw === "string" ? raw : "";
  const dhikr = getDhikrById(id);
  if (!dhikr) {
    return { notFound: true };
  }
  return { props: { dhikr } };
};
