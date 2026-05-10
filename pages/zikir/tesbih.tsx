import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { IconChevronLeft } from "@tabler/icons-react";
import ZikirLayout from "@/components/zikir/layout";
import { TasbihCounterDisplay } from "@/components/zikir/tasbih-counter";
import TasbihProgress from "@/components/zikir/tasbih-progress";
import TasbihTapButton from "@/components/zikir/tasbih-tap-button";
import TasbihTargetSheet from "@/components/zikir/tasbih-target-sheet";
import TasbihComplete from "@/components/zikir/tasbih-complete";
import {
  DEFAULT_DHIKR_ID,
  getDhikrById,
  getNextDhikrId,
} from "@/data/dhikr";
import {
  readZikirSession,
  writeZikirSession,
} from "@/lib/zikir/session-storage";
import { tryVibrate } from "@/lib/zikir/vibrate";
import { cx } from "@/utils/helper";

function parseId(q: string | string[] | undefined): string {
  const raw = Array.isArray(q) ? q[0] : q;
  if (!raw || typeof raw !== "string") return DEFAULT_DHIKR_ID;
  const id = decodeURIComponent(raw).trim();
  return getDhikrById(id) ? id : DEFAULT_DHIKR_ID;
}

export default function ZikirTesbihPage() {
  const { t } = useTranslation("zikir");
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const dhikrId = useMemo(
    () => (router.isReady ? parseId(router.query.id) : DEFAULT_DHIKR_ID),
    [router.isReady, router.query.id]
  );

  const dhikr = useMemo(
    () => getDhikrById(dhikrId) ?? getDhikrById(DEFAULT_DHIKR_ID)!,
    [dhikrId]
  );

  const isComplete = target > 0 && count >= target;

  useEffect(() => {
    if (!router.isReady) return;
    const session = readZikirSession();
    if (session && session.dhikrId === dhikr.id) {
      setCount(session.count);
      setTarget(session.target);
    } else {
      setCount(0);
      setTarget(dhikr.defaultCount);
    }
    setHydrated(true);
  }, [router.isReady, dhikr.id, dhikr.defaultCount]);

  const persist = useCallback((c: number, tg: number, id: string) => {
    writeZikirSession({ dhikrId: id, count: c, target: tg });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(count, target, dhikr.id);
  }, [hydrated, count, target, dhikr.id, persist]);

  const handleTap = () => {
    if (isComplete) return;
    tryVibrate(30);
    setCount(c => {
      if (c >= target) return c;
      const n = c + 1;
      if (n >= target) {
        tryVibrate([100, 50, 100]);
      }
      return n;
    });
  };

  const handleReset = () => {
    setCount(0);
  };

  const onTargetSelect = (n: number) => {
    const next = Math.max(1, n);
    setTarget(next);
    setCount(c => Math.min(c, next));
  };

  const handleContinue = () => {
    setCount(0);
  };

  const nextId = getNextDhikrId(dhikr.id);

  const handleNextDhikr = () => {
    if (!nextId) return;
    void router.push(`/zikir/tesbih?id=${encodeURIComponent(nextId)}`);
  };

  if (!router.isReady || !hydrated) {
    return (
      <ZikirLayout>
        <div className="mx-auto max-w-md px-5 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {t("title")}
        </div>
      </ZikirLayout>
    );
  }

  return (
    <ZikirLayout>
      <Head>
        <title>{dhikr.transliteration}</title>
      </Head>
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-4">
        <header className="mb-4 flex items-center gap-2">
          <Link
            href="/zikir"
            className="flex items-center gap-0.5 rounded-xl p-2 text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-zinc-800"
            aria-label="Geri"
          >
            <IconChevronLeft size={22} />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {dhikr.transliteration}
          </h1>
        </header>

        <div className="flex flex-1 flex-col items-center gap-5">
          <p
            className="text-center font-arabic text-4xl leading-relaxed text-zinc-900 dark:text-zinc-50"
            dir="rtl"
          >
            {dhikr.arabic}
          </p>
          <p className="text-center text-base font-semibold text-amber-800 dark:text-amber-300">
            {dhikr.transliteration}
          </p>
          <p className="max-w-sm text-center text-sm text-zinc-600 dark:text-zinc-300">
            {dhikr.meaning}
          </p>

          <TasbihCounterDisplay
            count={count}
            target={target}
            complete={isComplete}
          />

          <div className="w-full max-w-sm">
            <TasbihProgress
              count={count}
              target={target}
              complete={isComplete}
            />
          </div>

          {isComplete ? (
            <TasbihComplete
              onContinue={handleContinue}
              onNext={handleNextDhikr}
              hasNext={Boolean(nextId)}
            />
          ) : (
            <TasbihTapButton onTap={handleTap} />
          )}

          <div className="flex w-full max-w-sm flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-amber-200"
            >
              {t("targetLabel")}: {target} ▾
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={cx(
                "rounded-xl px-4 py-2.5 text-sm font-semibold",
                "border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
              )}
            >
              {t("resetButton")}
            </button>
          </div>
        </div>
      </div>

      <TasbihTargetSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        value={target}
        onSelect={onTargetSelect}
      />
    </ZikirLayout>
  );
}
