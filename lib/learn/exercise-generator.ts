import surahs, { type ISurah } from "@/data/surahs";
import type { Exercise, ExerciseMessages, LessonData, LessonWord } from "./types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatSurahOption(s: ISurah, langTr: boolean): string {
  const tr = `${s.number}. ${s.nameTr}`;
  const line = langTr ? tr : `${s.number}. ${s.nameEn}`;
  return `${line}\n${s.name}`;
}

function neighborSurahs(targetNo: number, count: number): ISurah[] {
  const nums = surahs.map(s => s.number).sort((a, b) => a - b);
  const idx = nums.indexOf(targetNo);
  const pool: ISurah[] = [];
  if (idx >= 0) {
    for (let d = 1; d <= 6 && pool.length < 12; d++) {
      const left = nums[idx - d];
      const right = nums[idx + d];
      if (left !== undefined) {
        const s = surahs.find(x => x.number === left);
        if (s && s.number !== targetNo) pool.push(s);
      }
      if (right !== undefined) {
        const s = surahs.find(x => x.number === right);
        if (s && s.number !== targetNo) pool.push(s);
      }
    }
  }
  const distinct = pool.filter(
    (s, i, arr) => arr.findIndex(x => x.number === s.number) === i
  );
  const shuffled = shuffle(distinct);
  return shuffled.slice(0, count);
}

function fallbackRandomSurahs(targetNo: number, count: number): ISurah[] {
  const pool = shuffle(surahs.filter(s => s.number !== targetNo));
  return pool.slice(0, count);
}

function stripEdgePunct(t: string): string {
  return t.replace(/^[`"'“”‘’.,;:!?()\[\]{}«»]+|[`"'“”‘’.,;:!?()\[\]{}«»]+$/g, "");
}

function mealParts(meal: string): string[] {
  return meal.split(/\s+/).filter(Boolean);
}

function eligibleMealTokens(meal: string): string[] {
  const parts = mealParts(meal).map(stripEdgePunct).filter(Boolean);
  return parts.filter(t => t.length >= 3);
}

function orderedVerseWords(words: LessonWord[], verseNo: number): LessonWord[] {
  return words
    .filter(w => w.verseNumber === verseNo)
    .sort((a, b) => a.sortIndex - b.sortIndex);
}

function pickVerseForSort(
  lessonData: LessonData,
  min = 3,
  max = 5
): number | null {
  const candidates = lessonData.ayahs
    .map(a => a.numberInSurah)
    .filter(v => {
      const ws = orderedVerseWords(lessonData.words, v);
      return ws.length >= min && ws.length <= max;
    });
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function pickVerseWithWords(
  lessonData: LessonData,
  minWords: number
): number | null {
  const candidates = lessonData.ayahs
    .map(a => a.numberInSurah)
    .filter(v => orderedVerseWords(lessonData.words, v).length >= minWords);
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function tryListen(
  lessonData: LessonData,
  messages: ExerciseMessages,
  audioUrl: string,
  target: ISurah,
  langTr: boolean
): Exercise | null {
  let wrong = neighborSurahs(target.number, 3);
  if (wrong.length < 3) {
    wrong = [
      ...wrong,
      ...fallbackRandomSurahs(
        target.number,
        3 - wrong.length
      ).filter(s => !wrong.some(w => w.number === s.number)),
    ];
  }
  if (wrong.length < 3) return null;

  const correctLabel = formatSurahOption(target, langTr);
  const opts = shuffle([
    correctLabel,
    ...wrong.slice(0, 3).map(s => formatSurahOption(s, langTr)),
  ]);

  return {
    type: "listen",
    surahNumber: lessonData.surahNumber,
    question: messages.listen,
    correctAnswer: correctLabel,
    options: opts,
    audioUrl,
  };
}

function tryWordCard(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const pool = lessonData.words.filter(w => w.turkish.length >= 2);
  const meanings = Array.from(new Set(pool.map(w => w.turkish)));
  if (meanings.length < 4 || pool.length < 4) return null;

  const picked = pool[Math.floor(Math.random() * pool.length)];
  const wrongMeanings = shuffle(
    meanings.filter(m => m !== picked.turkish).slice(0, 3)
  );
  if (wrongMeanings.length < 3) return null;

  const opts = shuffle([picked.turkish, ...wrongMeanings]);

  return {
    type: "word-card",
    surahNumber: lessonData.surahNumber,
    verseNumber: picked.verseNumber,
    question: messages.wordCard,
    correctAnswer: picked.turkish,
    options: opts,
    pairs: [{ arabic: picked.arabic, turkish: picked.turkish }],
  };
}

function tryFillBlank(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const ayahsWithTokens = lessonData.ayahs.filter(
    a => eligibleMealTokens(a.mealTr).length >= 4
  );
  if (!ayahsWithTokens.length) return null;

  const ayah =
    ayahsWithTokens[Math.floor(Math.random() * ayahsWithTokens.length)];
  const tokens = eligibleMealTokens(ayah.mealTr);
  const hidden = tokens[Math.floor(Math.random() * tokens.length)];

  const rawParts = mealParts(ayah.mealTr);
  let replaced = false;
  const maskedParts = rawParts.map(p => {
    if (!replaced && stripEdgePunct(p) === hidden) {
      replaced = true;
      return "___";
    }
    return p;
  });
  if (!replaced) return null;
  const masked = maskedParts.join(" ");

  const pool = shuffle(
    tokens.filter(t => t !== hidden && t.length >= 3)
  );
  let wrong = pool.slice(0, 3);
  const extras = shuffle(
    lessonData.ayahs.flatMap(a =>
      eligibleMealTokens(a.mealTr).filter(x => x !== hidden)
    )
  );
  let i = 0;
  while (wrong.length < 3 && i < extras.length) {
    const t = extras[i++];
    if (!wrong.includes(t)) wrong.push(t);
  }
  wrong = wrong.slice(0, 3);
  if (wrong.length < 3) return null;

  const opts = shuffle([hidden, ...wrong]);

  return {
    type: "fill-blank",
    surahNumber: lessonData.surahNumber,
    verseNumber: ayah.numberInSurah,
    question: `${messages.fillBlank}\n${masked}`,
    correctAnswer: hidden,
    options: opts,
  };
}

function tryMatch(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const verseNo = pickVerseWithWords(lessonData, 4);
  if (verseNo === null) return null;

  const ws = orderedVerseWords(lessonData.words, verseNo).slice(0, 4);
  if (ws.length < 4) return null;

  const pairs = ws.map(w => ({
    arabic: w.arabic,
    turkish: w.turkish,
  }));

  return {
    type: "match",
    surahNumber: lessonData.surahNumber,
    verseNumber: verseNo,
    question: messages.match,
    correctAnswer: "",
    pairs,
  };
}

function trySort(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const v = pickVerseForSort(lessonData, 3, 5);
  if (v === null) return null;

  const ws = orderedVerseWords(lessonData.words, v);
  if (ws.length < 3 || ws.length > 5) return null;

  const ordered = ws.map(w => w.arabic);
  const pool = shuffle([...ordered]);

  return {
    type: "sort",
    surahNumber: lessonData.surahNumber,
    verseNumber: v,
    question: messages.sort,
    correctAnswer: ordered,
    sortPool: pool,
  };
}

export function generateExercises(
  lessonData: LessonData,
  messages: ExerciseMessages,
  audioUrl: string,
  langTr: boolean
): Exercise[] {
  const target = surahs.find(s => s.number === lessonData.surahNumber);
  if (!target) return [];

  const builders: (() => Exercise | null)[] = [
    () => tryListen(lessonData, messages, audioUrl, target, langTr),
    () => tryWordCard(lessonData, messages),
    () => tryFillBlank(lessonData, messages),
    () => tryMatch(lessonData, messages),
    () => trySort(lessonData, messages),
  ];

  const oneEach: Exercise[] = [];
  for (const b of shuffle(builders)) {
    const ex = b();
    if (ex) oneEach.push(ex);
  }

  const byType = new Map<string, Exercise>();
  for (const ex of oneEach) {
    byType.set(ex.type, ex);
  }

  const requiredTypes = ["listen", "word-card", "fill-blank", "match", "sort"];
  const core: Exercise[] = [];
  for (const t of requiredTypes) {
    const found = byType.get(t);
    if (found) core.push(found);
  }

  const extrasPool = shuffle([...core]);
  while (core.length < 7 && extrasPool.length > 0) {
    const pick = extrasPool[Math.floor(Math.random() * extrasPool.length)];
    core.push({
      ...pick,
      options: pick.options ? [...pick.options] : undefined,
      pairs: pick.pairs?.map(p => ({ ...p })),
      sortPool: pick.sortPool ? [...pick.sortPool] : undefined,
    });
  }

  return shuffle(core.slice(0, 7));
}
