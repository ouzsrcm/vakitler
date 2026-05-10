export type DhikrCategory =
  | "namaz-sonrasi"
  | "gunluk"
  | "tasavvufi"
  | "esma";

export type IDhikr = {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  virtue: string;
  source: string;
  defaultCount: number;
  category: DhikrCategory;
};

export const DHIKR_LIST: IDhikr[] = [
  {
    id: "subhanallah",
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "Sübhânallah",
    meaning: "Allah'ı tüm eksikliklerden tenzih ederim",
    virtue:
      "Namazın ardından 33 kez söylenmesi sünnettir. \"Kim her namazın ardından 33 kez tesbih, 33 kez hamd, 33 kez tekbir getirirse...\"",
    source: "Müslim",
    defaultCount: 33,
    category: "namaz-sonrasi",
  },
  {
    id: "elhamdulillah",
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Elhamdülillâh",
    meaning: "Hamd ve şükür yalnızca Allah'a aittir",
    virtue:
      "Mizanda en ağır gelen zikirlerden biridir. \"Sübhanallah ve'l-hamdülillah arşı doldurur.\"",
    source: "Müslim",
    defaultCount: 33,
    category: "namaz-sonrasi",
  },
  {
    id: "allahu-akbar",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allâhu Ekber",
    meaning: "Allah her şeyden büyüktür",
    virtue:
      "Tekbir, kulun Allah'ın büyüklüğünü kalbine yerleştirmesinin en kısa yoludur.",
    source: "Buhârî, Müslim",
    defaultCount: 33,
    category: "namaz-sonrasi",
  },
  {
    id: "kelime-tevhid-namaz",
    arabic:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration:
      "Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehü'l-mülkü ve lehü'l-hamdü ve hüve alâ külli şey'in kadîr",
    meaning:
      "Allah'tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O'nundur, hamd O'nadır, O her şeye kadirdir.",
    virtue:
      "Her namazın ardından bir kez söyleyenin günahları denizin köpüğü kadar çok olsa affedilir.",
    source: "Müslim",
    defaultCount: 1,
    category: "namaz-sonrasi",
  },
  {
    id: "besmele",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    transliteration: "Bismillâhirrahmânirrahîm",
    meaning: "Rahman ve Rahim olan Allah'ın adıyla",
    virtue:
      "Her hayırlı işe besmele ile başlamak sünnettir. Besmele çekilmeden başlanan iş eksik kalır.",
    source: "Ebû Dâvûd",
    defaultCount: 1,
    category: "gunluk",
  },
  {
    id: "estagfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    transliteration: "Estağfirullâhe'l-azîm",
    meaning: "Yüce Allah'tan bağışlanma dilerim",
    virtue:
      "Peygamber Efendimiz günde 70-100 kez istiğfar ederdi. İstiğfar sıkıntıların kaldırılmasına, rızkın genişlemesine vesiledir.",
    source: "Buhârî",
    defaultCount: 100,
    category: "gunluk",
  },
  {
    id: "hasbunallah",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbünallâhu ve ni'me'l-vekîl",
    meaning: "Allah bize yeter, O ne güzel vekildir",
    virtue:
      "Hz. İbrahim ateşe atılırken, Hz. Muhammed Uhud'dan dönerken bu zikri söylemiştir. Sıkıntı ve korku anında okunur.",
    source: "Âl-i İmrân 173, Buhârî",
    defaultCount: 40,
    category: "gunluk",
  },
  {
    id: "havkale",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Lâ havle ve lâ kuvvete illâ billâh",
    meaning: "Güç ve kuvvet yalnızca Allah'tandır",
    virtue:
      "Cennet hazinelerinden bir hazinedir. Ağır yük taşıyan, yorgun düşen, endişe içindeyken okunması tavsiye edilmiştir.",
    source: "Buhârî, Müslim",
    defaultCount: 100,
    category: "gunluk",
  },
  {
    id: "salavat",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allâhümme salli alâ Muhammedin ve alâ âli Muhammed",
    meaning: "Allah'ım! Muhammed'e ve âline rahmet eyle",
    virtue:
      "Bir kez salavat getirene Allah on rahmet eder, on günahı silinir, on derece yükseltilir.",
    source: "Müslim",
    defaultCount: 100,
    category: "gunluk",
  },
  {
    id: "ismi-celal",
    arabic: "اللَّهُ",
    transliteration: "Allah",
    meaning: "Yüce Allah'ın zât ismi",
    virtue:
      "Tasavvuf geleneğinde en büyük isim (İsm-i Azam) olarak kabul edilir. Kalbin Allah ile doğrudan temas kurmasının en saf halidir.",
    source: "Tarikat geleneği, Kuşeyrî Risalesi",
    defaultCount: 100,
    category: "tasavvufi",
  },
  {
    id: "ismi-hu",
    arabic: "هُوَ",
    transliteration: "Hû",
    meaning: "O (Allah'a işaret eden zamir — O'ndan başkası yok)",
    virtue:
      "Tasavvufta en derin tevhid ifadesidir. \"Hû\" derken nefes verişin kendisi zikre dönüşür. Nefes alırken \"lâ ilâhe\", verirken \"illallâh Hû.\"",
    source: "Tarikat geleneği, İbn Arabî",
    defaultCount: 100,
    category: "tasavvufi",
  },
  {
    id: "kelime-tevhid",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "Lâ ilâhe illallâh",
    meaning: "Allah'tan başka ilah yoktur",
    virtue:
      "Zikrin efendisidir. Tasavvufta nefes alıp verişe eşlenir: \"Lâ ilâhe\" — sahte ilahları nefisle birlikte çıkar; \"illallâh\" — yalnız Allah'ı kalbe yerleştirirsin.",
    source: "Buhârî, Müslim, tarikat geleneği",
    defaultCount: 100,
    category: "tasavvufi",
  },
  {
    id: "ya-latif",
    arabic: "يَا لَطِيفُ",
    transliteration: "Yâ Latîf",
    meaning: "Ey her şeyin inceliğini bilen, lütuf sahibi Allah",
    virtue:
      "Sıkıntı, darlık ve çıkmaz anlarında okunur. Allah'ın kuluna olan ince ve gizli lütfunu celbeder. 129 kez okunması tavsiye edilmiştir.",
    source: "Esmaül Hüsna, İmam Gazâlî",
    defaultCount: 129,
    category: "tasavvufi",
  },
  {
    id: "ya-vedud",
    arabic: "يَا وَدُودُ",
    transliteration: "Yâ Vedûd",
    meaning: "Ey sevenler seveni, sevgisi sonsuz olan Allah",
    virtue:
      "Kalpler arasına sevgi ve muhabbet yerleştirmek için okunur. Gönlü katılaşmış, sevgisi azalmış kişilere tavsiye edilir.",
    source: "Esmaül Hüsna, İbn Kayyim el-Cevziyye",
    defaultCount: 100,
    category: "tasavvufi",
  },
];

const byId = new Map(DHIKR_LIST.map(d => [d.id, d]));

export function getDhikrById(id: string): IDhikr | undefined {
  return byId.get(id);
}

export function getDhikrsByCategory(category: DhikrCategory): IDhikr[] {
  return DHIKR_LIST.filter(d => d.category === category);
}

/** Namaz sonrası üçlü tesbih sırası: gün bazlı döngü. */
const DAILY_CYCLE_IDS = ["subhanallah", "elhamdulillah", "allahu-akbar"] as const;

export function getDailySuggestedDhikrId(referenceDate = new Date()): string {
  const start = new Date(referenceDate.getFullYear(), 0, 0);
  const diff = referenceDate.getTime() - start.getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  const idx = day % DAILY_CYCLE_IDS.length;
  return DAILY_CYCLE_IDS[idx] ?? "subhanallah";
}

export const DEFAULT_DHIKR_ID = "subhanallah";

export function getNextDhikrId(currentId: string): string | null {
  const i = DHIKR_LIST.findIndex(d => d.id === currentId);
  if (i < 0) return null;
  const next = DHIKR_LIST[i + 1];
  return next ? next.id : null;
}

export const DHIKR_STATIC_PATH_IDS = DHIKR_LIST.map(d => d.id);
