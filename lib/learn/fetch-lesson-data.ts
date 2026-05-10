import type { LessonAyah, LessonData, LessonWord } from "./types";

interface AlquranSurahPayload {
  numberOfAyahs: number;
  ayahs: { numberInSurah: number; text: string }[];
}

interface AlquranResponse {
  data?: AlquranSurahPayload;
}

interface AcikWordRow {
  sort_number: number;
  arabic: string;
  turkish: string;
}

interface AcikWordsResponse {
  data?: AcikWordRow[];
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchWordsForVerse(
  surahNumber: number,
  verseNo: number
): Promise<AcikWordRow[]> {
  const url = `https://api.acikkuran.com/surah/${surahNumber}/verse/${verseNo}/words`;
  const body = await fetchJson<AcikWordsResponse>(url);
  const rows = body?.data;
  return Array.isArray(rows) ? rows : [];
}

export async function fetchLessonData(
  surahNumber: number
): Promise<LessonData | null> {
  const uthmaniUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`;
  const mealUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/tr.diyanet`;

  const [arPayload, trPayload] = await Promise.all([
    fetchJson<AlquranResponse>(uthmaniUrl),
    fetchJson<AlquranResponse>(mealUrl),
  ]);

  const arData = arPayload?.data;
  const trData = trPayload?.data;
  if (
    !arData?.ayahs?.length ||
    !trData?.ayahs?.length ||
    arData.numberOfAyahs !== trData.numberOfAyahs
  ) {
    return null;
  }

  const n = arData.numberOfAyahs;
  const wordResults = await Promise.all(
    Array.from({ length: n }, (_, i) =>
      fetchWordsForVerse(surahNumber, i + 1)
    )
  );

  const ayahs: LessonAyah[] = [];
  const words: LessonWord[] = [];

  for (let i = 0; i < n; i++) {
    const ar = arData.ayahs[i];
    const tr = trData.ayahs[i];
    if (
      !ar ||
      !tr ||
      ar.numberInSurah !== i + 1 ||
      tr.numberInSurah !== i + 1
    ) {
      continue;
    }
    ayahs.push({
      numberInSurah: ar.numberInSurah,
      arabic: ar.text,
      mealTr: tr.text,
    });

    const verseWords = wordResults[i] ?? [];
    for (const w of verseWords) {
      const turkish = (w.turkish ?? "").trim();
      const arabic = (w.arabic ?? "").trim();
      if (!arabic || !turkish) continue;
      words.push({
        verseNumber: i + 1,
        arabic,
        turkish,
        sortIndex: w.sort_number,
      });
    }
  }

  if (!ayahs.length) return null;

  return { surahNumber, ayahs, words };
}
