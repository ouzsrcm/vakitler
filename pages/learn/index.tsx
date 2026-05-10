import Head from "next/head";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import QuranLayout from "@/components/quran/layout";
import Container from "@/components/container";
import CurriculumMap from "@/components/quran/learn/curriculum-map";
import { BOTTOM_NAV_CONTENT_PADDING } from "@/components/nav/bottom-nav";
import { cx } from "@/utils/helper";

export default function LearnIndexPage() {
  const { t } = useTranslation("quran");

  return (
    <QuranLayout>
      <Head>
        <title>{t("learnPageTitle")}</title>
      </Head>
      <Container className={cx("py-4", BOTTOM_NAV_CONTENT_PADDING)}>
        <div className="mb-4">
          <Link
            href="/quran"
            className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <IconChevronLeft size={16} />
            {t("learnBackQuran")}
          </Link>
        </div>

        <CurriculumMap />
      </Container>
    </QuranLayout>
  );
}
