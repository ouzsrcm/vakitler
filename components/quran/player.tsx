import { useEffect, useRef, useState } from "react";
import { ISurah } from "@/data/surahs";
import { cx } from "@/utils/helper";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconLoader2,
} from "@tabler/icons-react";
import useTranslation from "next-translate/useTranslation";

interface Props {
  surah: ISurah;
  audioUrl: string;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function QuranPlayer({
  surah,
  audioUrl,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) {
  const { lang } = useTranslation("common");
  const isTr = lang === "tr";
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset and auto-play when surah/url changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPlaying(false);
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
    audio.load();
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-emerald-100 dark:border-zinc-700">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          if (hasNext) onNext();
        }}
        onCanPlay={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        preload="metadata"
      />

      {/* Surah info */}
      <div className="text-center mb-4">
        <p className="text-2xl font-arabic text-zinc-700 dark:text-zinc-200 mb-1">
          {surah.name}
        </p>
        <p className="font-semibold text-zinc-800 dark:text-zinc-100">
          {isTr ? surah.nameTr : surah.nameEn}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
          {surah.number}. sure · {surah.verses} ayet
        </p>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={onSeek}
          className="w-full h-1.5 rounded-full accent-emerald-500 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #10b981 ${progress}%, #d1fae5 ${progress}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={cx(
            "p-2 rounded-full transition-opacity",
            hasPrev
              ? "opacity-80 hover:opacity-100"
              : "opacity-20 cursor-not-allowed"
          )}
        >
          <IconPlayerSkipBack size={24} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          disabled={loading}
          className={cx(
            "flex items-center justify-center w-14 h-14 rounded-full",
            "bg-emerald-500 hover:bg-emerald-600 text-white transition-colors",
            loading && "opacity-70 cursor-wait"
          )}
        >
          {loading ? (
            <IconLoader2 size={26} className="animate-spin" />
          ) : playing ? (
            <IconPlayerPause size={26} />
          ) : (
            <IconPlayerPlay size={26} />
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={cx(
            "p-2 rounded-full transition-opacity",
            hasNext
              ? "opacity-80 hover:opacity-100"
              : "opacity-20 cursor-not-allowed"
          )}
        >
          <IconPlayerSkipForward size={24} />
        </button>
      </div>
    </div>
  );
}
