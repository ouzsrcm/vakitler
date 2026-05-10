import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconFlame, IconStarFilled } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import LearnLayout from "@/components/learn/layout";
import CurriculumMap from "@/components/quran/learn/curriculum-map";
import { getXP, getStreak } from "@/lib/learn/progress";

export default function LearnIndexPage() {
  const { t } = useTranslation("learn");
  const [mounted, setMounted] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setXp(getXP());
    setStreak(getStreak());
    setMounted(true);
  }, []);

  return (
    <LearnLayout>
      <Head>
        <title>{t("pageTitle")}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5">
        <section className="-mx-5 mb-6 min-h-[180px] rounded-b-3xl bg-gradient-to-b from-violet-500 to-violet-700 px-8 pb-6 pt-8 text-white dark:from-violet-900 dark:to-zinc-900">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-xl font-bold tracking-tight">
              <span aria-hidden className="mr-1.5">
                🎓
              </span>
              {t("pageTitle")}
            </h1>
            <p className="max-w-[280px] text-sm font-medium text-white/90">
              {t("pageSubtitle")}
            </p>
            {mounted ? (
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <IconFlame
                    size={16}
                    className="shrink-0 text-orange-300"
                    aria-hidden
                  />
                  <span>
                    {streak} {t("streakLabel")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  <IconStarFilled
                    size={16}
                    className="shrink-0 text-amber-300"
                    aria-hidden
                  />
                  <span>
                    {xp} {t("xpLabel")}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <div className="pb-6 pt-1">
          <div className="mb-4">
            <Link
              href="/quran"
              className="flex items-center gap-1 text-sm text-violet-700 transition-colors hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200"
            >
              <IconChevronLeft size={16} />
              {t("backToQuran")}
            </Link>
          </div>

          <CurriculumMap />
        </div>
      </div>
    </LearnLayout>
  );
}
