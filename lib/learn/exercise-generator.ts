import surahs, { type ISurah } from "@/data/surahs";
import type { LearnLevel } from "@/data/learn-curriculum";
import type {
  Exercise,
  ExerciseMessages,
  LessonData,
  LessonWord,
  ExerciseType,
} from "./types";
import { xpForExerciseType } from "./exercise-xp";

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
  return shuffle(distinct).slice(0, count);
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

function verseAudioUrl(globalAyahNumber: number, reciterId: string): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}

async function audioLikelyAvailable(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: "HEAD", mode: "cors" });
    return r.ok;
  } catch {
    return true;
  }
}

function attachXp<T extends Omit<Exercise, "xpReward">>(ex: T): Exercise {
  return { ...ex, xpReward: xpForExerciseType(ex.type) };
}

export function cloneExercise(ex: Exercise): Exercise {
  return {
    ...ex,
    options: ex.options ? [...ex.options] : undefined,
    pairs: ex.pairs?.map(p => ({ ...p })),
    sortPool: ex.sortPool ? [...ex.sortPool] : undefined,
    wordHuntCards: ex.wordHuntCards?.map(c => ({ ...c })),
  };
}

const ALL_TYPES: ExerciseType[] = [
  "listen",
  "word-card",
  "fill-blank",
  "match",
  "sort",
  "true-false",
  "audio-match",
  "quick-memory",
  "surah-complete",
  "word-hunt",
];

function typeAllowedForLevel(
  level: LearnLevel,
  type: ExerciseType,
  lessonData: LessonData
): boolean {
  if (type === "surah-complete" && lessonData.ayahs.length < 4) {
    return false;
  }
  if (level === 1) {
    return !["sort", "quick-memory", "word-hunt", "surah-complete"].includes(
      type
    );
  }
  return true;
}

function paddingWeights(
  level: LearnLevel,
  lessonData: LessonData
): Record<ExerciseType, number> {
  const can9 = lessonData.ayahs.length >= 4 ? 3 : 0;
  if (level === 1) {
    return {
      listen: 5,
      "word-card": 5,
      "fill-blank": 5,
      match: 2,
      sort: 0,
      "true-false": 5,
      "audio-match": 3,
      "quick-memory": 0,
      "surah-complete": 0,
      "word-hunt": 0,
    };
  }
  if (level === 2) {
    return {
      listen: 3,
      "word-card": 3,
      "fill-blank": 3,
      match: 3,
      sort: 2,
      "true-false": 3,
      "audio-match": 3,
      "quick-memory": 2,
      "surah-complete": can9,
      "word-hunt": 2,
    };
  }
  return {
    listen: 2,
    "word-card": 2,
    "fill-blank": 2,
    match: 2,
    sort: 2,
    "true-false": 2,
    "audio-match": 2,
    "quick-memory": 2,
    "surah-complete": can9,
    "word-hunt": 2,
  };
}

function weightedPickType(
  weights: Record<ExerciseType, number>,
  allowed: (t: ExerciseType) => boolean
): ExerciseType | null {
  const entries = ALL_TYPES.filter(t => allowed(t) && weights[t] > 0).map(
    t => [t, weights[t]] as const
  );
  if (!entries.length) return null;
  const sum = entries.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * sum;
  for (const [t, w] of entries) {
    r -= w;
    if (r <= 0) return t;
  }
  return entries[entries.length - 1]?.[0] ?? null;
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

  return attachXp({
    type: "listen",
    surahNumber: lessonData.surahNumber,
    question: messages.listen,
    correctAnswer: correctLabel,
    options: opts,
    audioUrl,
  });
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

  return attachXp({
    type: "word-card",
    surahNumber: lessonData.surahNumber,
    verseNumber: picked.verseNumber,
    question: messages.wordCard,
    correctAnswer: picked.turkish,
    options: opts,
    pairs: [{ arabic: picked.arabic, turkish: picked.turkish }],
  });
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

  const pool = shuffle(tokens.filter(t => t !== hidden && t.length >= 3));
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

  return attachXp({
    type: "fill-blank",
    surahNumber: lessonData.surahNumber,
    verseNumber: ayah.numberInSurah,
    question: `${messages.fillBlank}\n${masked}`,
    correctAnswer: hidden,
    options: opts,
  });
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

  return attachXp({
    type: "match",
    surahNumber: lessonData.surahNumber,
    verseNumber: verseNo,
    question: messages.match,
    correctAnswer: "",
    pairs,
  });
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

  return attachXp({
    type: "sort",
    surahNumber: lessonData.surahNumber,
    verseNumber: v,
    question: messages.sort,
    correctAnswer: ordered,
    sortPool: pool,
  });
}

function tryTrueFalse(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const ayah =
    lessonData.ayahs[Math.floor(Math.random() * lessonData.ayahs.length)];
  if (!ayah?.mealTr?.trim()) return null;

  let foreign =
    lessonData.decoyMealsTr.length > 0 && Math.random() < 0.5;
  let mealShown = ayah.mealTr;
  if (foreign) {
    const decoys = lessonData.decoyMealsTr.filter(m => m !== ayah.mealTr);
    if (!decoys.length) {
      foreign = false;
      mealShown = ayah.mealTr;
    } else {
      mealShown =
        decoys[Math.floor(Math.random() * decoys.length)] ?? ayah.mealTr;
    }
  }

  const yes = !foreign;

  return attachXp({
    type: "true-false",
    surahNumber: lessonData.surahNumber,
    verseNumber: ayah.numberInSurah,
    question: `${messages.trueFalse}\n${mealShown}`,
    correctAnswer: yes ? "yes" : "no",
    belongsToSurah: yes,
  });
}

async function tryAudioMatch(
  lessonData: LessonData,
  messages: ExerciseMessages,
  reciterId: string
): Promise<Exercise | null> {
  const candidates = lessonData.ayahs.filter(
    a => a.mealTr.trim().length > 8 && a.globalAyahNumber > 0
  );
  if (candidates.length < 4) return null;

  const picked =
    candidates[Math.floor(Math.random() * candidates.length)];
  const url = verseAudioUrl(picked.globalAyahNumber, reciterId);
  if (!(await audioLikelyAvailable(url))) return null;

  const wrongPool = shuffle(
    candidates.filter(c => c.mealTr !== picked.mealTr)
  ).slice(0, 3);
  if (wrongPool.length < 3) return null;

  const opts = shuffle([
    picked.mealTr,
    ...wrongPool.map(c => c.mealTr),
  ]);

  return attachXp({
    type: "audio-match",
    surahNumber: lessonData.surahNumber,
    verseNumber: picked.numberInSurah,
    question: messages.audioMatch,
    correctAnswer: picked.mealTr,
    options: opts,
    audioUrl: url,
  });
}

function tryQuickMemory(
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

  return attachXp({
    type: "quick-memory",
    surahNumber: lessonData.surahNumber,
    verseNumber: picked.verseNumber,
    question: messages.quickMemory,
    correctAnswer: picked.turkish,
    options: opts,
    flashArabic: picked.arabic,
    pairs: [{ arabic: picked.arabic, turkish: picked.turkish }],
  });
}

function trySurahComplete(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  if (lessonData.ayahs.length < 4) return null;

  const candidates = lessonData.ayahs
    .map(a => a.numberInSurah)
    .filter(v => {
      const ws = orderedVerseWords(lessonData.words, v);
      return ws.length >= 4;
    });
  if (!candidates.length) return null;

  const verseNo =
    candidates[Math.floor(Math.random() * candidates.length)];
  const ws = orderedVerseWords(lessonData.words, verseNo);
  const k = Math.max(2, Math.floor(ws.length / 2));
  if (ws.length - k < 1) return null;

  const prefix = ws
    .slice(0, k)
    .map(w => w.arabic)
    .join(" ");
  const suffixCorrect = ws
    .slice(k)
    .map(w => w.arabic)
    .join(" ");

  const wrongSuffixes: string[] = [];
  for (const vn of shuffle([...candidates])) {
    if (vn === verseNo) continue;
    const o = orderedVerseWords(lessonData.words, vn);
    if (o.length < 2) continue;
    const cut = Math.max(1, Math.floor(o.length / 2));
    const suf = o.slice(cut).map(w => w.arabic).join(" ");
    if (suf && suf !== suffixCorrect && !wrongSuffixes.includes(suf)) {
      wrongSuffixes.push(suf);
    }
    if (wrongSuffixes.length >= 3) break;
  }
  if (wrongSuffixes.length < 3) return null;

  const opts = shuffle([suffixCorrect, ...wrongSuffixes.slice(0, 3)]);

  return attachXp({
    type: "surah-complete",
    surahNumber: lessonData.surahNumber,
    verseNumber: verseNo,
    question: messages.surahComplete,
    correctAnswer: suffixCorrect,
    options: opts,
    arabicPrefix: prefix,
  });
}

function tryWordHunt(
  lessonData: LessonData,
  messages: ExerciseMessages
): Exercise | null {
  const pool = lessonData.words.filter(w => w.arabic.length >= 1);
  const byAr = Array.from(new Map(pool.map(w => [w.arabic, w])).values());
  if (byAr.length < 6) return null;

  const picked = byAr[Math.floor(Math.random() * byAr.length)];
  const wrong = shuffle(byAr.filter(w => w.arabic !== picked.arabic)).slice(
    0,
    5
  );
  if (wrong.length < 5) return null;

  const cards = shuffle([
    { arabic: picked.arabic, correct: true },
    ...wrong.map(w => ({ arabic: w.arabic, correct: false as boolean })),
  ]);

  return attachXp({
    type: "word-hunt",
    surahNumber: lessonData.surahNumber,
    verseNumber: picked.verseNumber,
    question: `${messages.wordHunt}\n${picked.turkish}`,
    correctAnswer: picked.arabic,
    wordHuntCards: cards,
  });
}

async function buildOne(
  type: ExerciseType,
  lessonData: LessonData,
  messages: ExerciseMessages,
  audioUrl: string,
  langTr: boolean,
  target: ISurah,
  reciterId: string
): Promise<Exercise | null> {
  switch (type) {
    case "listen":
      return tryListen(lessonData, messages, audioUrl, target, langTr);
    case "word-card":
      return tryWordCard(lessonData, messages);
    case "fill-blank":
      return tryFillBlank(lessonData, messages);
    case "match":
      return tryMatch(lessonData, messages);
    case "sort":
      return trySort(lessonData, messages);
    case "true-false":
      return tryTrueFalse(lessonData, messages);
    case "audio-match":
      return tryAudioMatch(lessonData, messages, reciterId);
    case "quick-memory":
      return tryQuickMemory(lessonData, messages);
    case "surah-complete":
      return trySurahComplete(lessonData, messages);
    case "word-hunt":
      return tryWordHunt(lessonData, messages);
    default:
      return null;
  }
}

export async function generateExercises(
  lessonData: LessonData,
  messages: ExerciseMessages,
  audioUrl: string,
  langTr: boolean,
  level: LearnLevel,
  reciterId: string
): Promise<Exercise[]> {
  const target = surahs.find(s => s.number === lessonData.surahNumber);
  if (!target) return [];

  const allowed = (t: ExerciseType) =>
    typeAllowedForLevel(level, t, lessonData);

  const out: Exercise[] = [];

  for (const typ of shuffle([...ALL_TYPES])) {
    if (!allowed(typ)) continue;
    const ex = await buildOne(
      typ,
      lessonData,
      messages,
      audioUrl,
      langTr,
      target,
      reciterId
    );
    if (ex) out.push(ex);
  }

  const weights = paddingWeights(level, lessonData);
  let guard = 0;
  while (out.length < 10 && guard < 80) {
    guard++;
    const typ = weightedPickType(weights, t => allowed(t));
    if (!typ) break;
    const ex = await buildOne(
      typ,
      lessonData,
      messages,
      audioUrl,
      langTr,
      target,
      reciterId
    );
    if (ex) out.push(cloneExercise(ex));
  }

  let listenIdx = out.findIndex(e => e.type === "listen");
  if (listenIdx === -1) {
    const l = tryListen(lessonData, messages, audioUrl, target, langTr);
    if (l) out.unshift(l);
    listenIdx = out.findIndex(e => e.type === "listen");
  }

  if (listenIdx === -1) return [];

  const listen = out[listenIdx];
  const rest = shuffle(
    out.filter((e, i) => i !== listenIdx && e.type !== "listen")
  );

  return [listen, ...rest];
}
