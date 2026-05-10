import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";
import LearnLayout from "@/components/learn/layout";
import ElifbaPracticeSetup, {
  type ElifbaPracticeConfig,
} from "@/components/learn/elifba/elifba-practice-setup";
import ElifbaPracticeResult, {
  type ElifbaRunStats,
} from "@/components/learn/elifba/elifba-practice-result";
import FormMatchExercise from "@/components/learn/elifba/exercises/form-match-exercise";
import LetterNameExercise from "@/components/learn/elifba/exercises/letter-name-exercise";
import SoundExercise from "@/components/learn/elifba/exercises/sound-exercise";

type Phase = "setup" | "run" | "result";

export default function ElifbaPracticePage() {
  const { t } = useTranslation("learn");
  const [phase, setPhase] = useState<Phase>("setup");
  const [cfg, setCfg] = useState<ElifbaPracticeConfig | null>(null);
  const [stats, setStats] = useState<ElifbaRunStats | null>(null);

  const start = (c: ElifbaPracticeConfig) => {
    setCfg(c);
    setPhase("run");
  };

  const finish = (s: ElifbaRunStats) => {
    setStats(s);
    setPhase("result");
  };

  const backSetup = () => {
    setPhase("setup");
    setCfg(null);
    setStats(null);
  };

  return (
    <LearnLayout>
      <Head>
        <title>{t("elifba.practicePageTitle")}</title>
      </Head>
      <div className="mx-auto w-full max-w-md px-5 pb-8 pt-4">
        <div className="mb-4">
          <Link
            href="/learn?tab=elif"
            className="inline-flex items-center gap-1 text-sm text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-200"
          >
            <IconChevronLeft size={16} />
            {t("elifba.backToElifba")}
          </Link>
        </div>
        <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("elifba.practicePageTitle")}
        </h1>

        {phase === "setup" ? <ElifbaPracticeSetup onStart={start} /> : null}

        {phase === "run" && cfg?.mode === "name" ? (
          <LetterNameExercise
            deck={cfg.deck}
            onExit={backSetup}
            onFinish={finish}
          />
        ) : null}
        {phase === "run" && cfg?.mode === "sound" ? (
          <SoundExercise deck={cfg.deck} onExit={backSetup} onFinish={finish} />
        ) : null}
        {phase === "run" && cfg?.mode === "form" ? (
          <FormMatchExercise
            deck={cfg.deck}
            onExit={backSetup}
            onFinish={finish}
          />
        ) : null}

        {phase === "result" && stats ? (
          <ElifbaPracticeResult stats={stats} onDone={backSetup} />
        ) : null}
      </div>
    </LearnLayout>
  );
}
