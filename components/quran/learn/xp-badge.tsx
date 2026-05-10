import { IconFlame, IconStarFilled } from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

export default function XpBadge({ xp, streak }: { xp: number; streak: number }) {
  const { t } = useTranslation("quran");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
        title={t("learnStreakHint")}
      >
        <IconFlame size={16} aria-hidden />
        <span>{t("learnStreakLabel", { count: streak })}</span>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm">
        <IconStarFilled size={16} aria-hidden />
        <span>{t("learnXpTotal", { xp })}</span>
      </div>
    </div>
  );
}
