export type LetterCategory = "ay" | "güneş";

export interface ILetterExample {
  word: string;
  meaning: string;
}

export interface ILetterForms {
  isolated: string;
  initial: string;
  medial: string;
  final: string;
}

export interface ILetter {
  slug: string;
  order: number;
  arabic: string;
  name: string;
  nameAr: string;
  pronunciation: string;
  forms: ILetterForms;
  canConnect: boolean;
  category: LetterCategory;
  examples: ILetterExample[];
  /** Özel öğrenme ipucu (varsa) */
  learningTipKey?: string;
}

/** Müfredat kısa surelerden örnek kelimeler; harf vurgusu `arabic` ile eşleşir. */
export const ARABIC_LETTERS: readonly ILetter[] = [
  {
    slug: "elif",
    order: 1,
    arabic: "ا",
    name: "Elif",
    nameAr: "أَلِف",
    pronunciation: "Uzun «a» sesi",
    forms: {
      isolated: "ا",
      initial: "اـ",
      medial: "ـاـ",
      final: "ـا",
    },
    canConnect: false,
    category: "ay",
    examples: [
      { word: "الله", meaning: "Allah" },
      { word: "أَحَد", meaning: "Ehad (bir)" },
      { word: "النَّاس", meaning: "İnsanlar" },
    ],
    learningTipKey: "tipSunMoon",
  },
  {
    slug: "be",
    order: 2,
    arabic: "ب",
    name: "Be",
    nameAr: "بَاء",
    pronunciation: "«b» sesi",
    forms: {
      isolated: "ب",
      initial: "بـ",
      medial: "ـبـ",
      final: "ـب",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "بِسْمِ", meaning: "İsmiyle" },
      { word: "رَبِّ", meaning: "Rabb" },
      { word: "نَصْرٍ", meaning: "Yardım" },
    ],
  },
  {
    slug: "te",
    order: 3,
    arabic: "ت",
    name: "Te",
    nameAr: "تَاء",
    pronunciation: "«t» (dil ucu dişe)",
    forms: {
      isolated: "ت",
      initial: "تـ",
      medial: "ـتـ",
      final: "ـت",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "تَبَّتْ", meaning: "Helâk olsun" },
      { word: "مِيثَاقًا", meaning: "Ahit" },
      { word: "مُتَمَكِّنِينَ", meaning: "Güç sahibi" },
    ],
    learningTipKey: "tipTT",
  },
  {
    slug: "se",
    order: 4,
    arabic: "ث",
    name: "Se",
    nameAr: "ثَاء",
    pronunciation: "«s» (dil ucu dişler arası)",
    forms: {
      isolated: "ث",
      initial: "ثـ",
      medial: "ـثـ",
      final: "ـث",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "مَثَلًا", meaning: "Misal" },
      { word: "يُنْثَرُ", meaning: "Saçılır" },
      { word: "ثُلُثٌ", meaning: "Üçte bir" },
    ],
  },
  {
    slug: "cim",
    order: 5,
    arabic: "ج",
    name: "Cim",
    nameAr: "جِيم",
    pronunciation: "«c» (yumuşak)",
    forms: {
      isolated: "ج",
      initial: "جـ",
      medial: "ـجـ",
      final: "ـج",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "أَجْرٌ", meaning: "Sevap" },
      { word: "حُجْرَةٍ", meaning: "Oda" },
      { word: "مَجْنُونٌ", meaning: "Deli" },
    ],
  },
  {
    slug: "ha",
    order: 6,
    arabic: "ح",
    name: "Ha",
    nameAr: "حَاء",
    pronunciation: "Boğazdan hafif «h»",
    forms: {
      isolated: "ح",
      initial: "حـ",
      medial: "ـحـ",
      final: "ـح",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "أَحَدٌ", meaning: "Bir tek" },
      { word: "صَمَدٌ", meaning: "Samed (ihtiyaçsız)" },
      { word: "حَسَدًا", meaning: "Haset" },
    ],
    learningTipKey: "tipHaKhaHe",
  },
  {
    slug: "hi",
    order: 7,
    arabic: "خ",
    name: "Hı",
    nameAr: "خَاء",
    pronunciation: "Boğazdan kuvvetli «h»",
    forms: {
      isolated: "خ",
      initial: "خـ",
      medial: "ـخـ",
      final: "ـخ",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "خَيْرٍ", meaning: "Hayır (iyilik)" },
      { word: "مُخْلِصِينَ", meaning: "İhlaslı" },
      { word: "سَخَرَ", meaning: "Boyun eğdirdi" },
    ],
    learningTipKey: "tipHaKhaHe",
  },
  {
    slug: "dal",
    order: 8,
    arabic: "د",
    name: "Dal",
    nameAr: "دَال",
    pronunciation: "«d»",
    forms: {
      isolated: "د",
      initial: "د",
      medial: "ـد",
      final: "ـد",
    },
    canConnect: false,
    category: "güneş",
    examples: [
      { word: "وَدُّ", meaning: "Sevgi" },
      { word: "عَبَدَ", meaning: "Kulluk etti" },
      { word: "مَدَى", meaning: "Müddet" },
    ],
  },
  {
    slug: "zel",
    order: 9,
    arabic: "ذ",
    name: "Zel",
    nameAr: "ذَال",
    pronunciation: "«z» (dil diş arası)",
    forms: {
      isolated: "ذ",
      initial: "ذ",
      medial: "ـذ",
      final: "ـذ",
    },
    canConnect: false,
    category: "güneş",
    examples: [
      { word: "ذُرِّيَّتِهِ", meaning: "Zürriyet" },
      { word: "مَذْهَبًا", meaning: "Mezhep" },
      { word: "أَذِنَ", meaning: "İzin verdi" },
    ],
  },
  {
    slug: "re",
    order: 10,
    arabic: "ر",
    name: "Re",
    nameAr: "رَاء",
    pronunciation: "Sert «r»",
    forms: {
      isolated: "ر",
      initial: "ر",
      medial: "ـر",
      final: "ـر",
    },
    canConnect: false,
    category: "güneş",
    examples: [
      { word: "رَبِّ", meaning: "Rabb" },
      { word: "فِرْعَوْنَ", meaning: "Firavun" },
      { word: "قُرَيْشٍ", meaning: "Kureyş" },
    ],
  },
  {
    slug: "ze",
    order: 11,
    arabic: "ز",
    name: "Ze",
    nameAr: "زَاي",
    pronunciation: "«z»",
    forms: {
      isolated: "ز",
      initial: "ز",
      medial: "ـز",
      final: "ـز",
    },
    canConnect: false,
    category: "güneş",
    examples: [
      { word: "زَيْتُونٍ", meaning: "Zeytin" },
      { word: "مَزِيدًا", meaning: "Daha fazla" },
      { word: "عُزَّةً", meaning: "Güç" },
    ],
  },
  {
    slug: "sin",
    order: 12,
    arabic: "س",
    name: "Sin",
    nameAr: "سِين",
    pronunciation: "«s»",
    forms: {
      isolated: "س",
      initial: "سـ",
      medial: "ـسـ",
      final: "ـس",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "سَمَدٌ", meaning: "Samed" },
      { word: "مُسْتَقِرًّا", meaning: "Durağan" },
      { word: "يَسْأَلُ", meaning: "Sorar" },
    ],
    learningTipKey: "tipSS",
  },
  {
    slug: "şin",
    order: 13,
    arabic: "ش",
    name: "Şın",
    nameAr: "شِين",
    pronunciation: "«ş»",
    forms: {
      isolated: "ش",
      initial: "شـ",
      medial: "ـشـ",
      final: "ـش",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "شَرٌّ", meaning: "Şer" },
      { word: "مَشْرُبًا", meaning: "İçecek" },
      { word: "يَشْعُرُ", meaning: "Hissediyor" },
    ],
  },
  {
    slug: "sad",
    order: 14,
    arabic: "ص",
    name: "Sad",
    nameAr: "صَاد",
    pronunciation: "Vurgulu «s»",
    forms: {
      isolated: "ص",
      initial: "صـ",
      medial: "ـصـ",
      final: "ـص",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "صَمَدٌ", meaning: "Samed" },
      { word: "أَصْلَابِهِمْ", meaning: "Omurgaları" },
      { word: "نَصْرٍ", meaning: "Yardım" },
    ],
    learningTipKey: "tipSS",
  },
  {
    slug: "dad",
    order: 15,
    arabic: "ض",
    name: "Dad",
    nameAr: "ضَاد",
    pronunciation: "Vurgulu «d»",
    forms: {
      isolated: "ض",
      initial: "ضـ",
      medial: "ـضـ",
      final: "ـض",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "ضَالِّينَ", meaning: "Sapanlar" },
      { word: "مَضْجَعًا", meaning: "Yatak" },
      { word: "أَرْضًا", meaning: "Toprak" },
    ],
  },
  {
    slug: "tı",
    order: 16,
    arabic: "ط",
    name: "Tı",
    nameAr: "طَاء",
    pronunciation: "Vurgulu «t»",
    forms: {
      isolated: "ط",
      initial: "طـ",
      medial: "ـطـ",
      final: "ـط",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "طَوَافِينَ", meaning: "Dolaşanlar" },
      { word: "خَاطِئَةٍ", meaning: "Günahkâr" },
      { word: "بَطْشًا", meaning: "Kıskıvrak yakalama" },
    ],
    learningTipKey: "tipTT",
  },
  {
    slug: "zı",
    order: 17,
    arabic: "ظ",
    name: "Zı",
    nameAr: "ظَاء",
    pronunciation: "Vurgulu «z»",
    forms: {
      isolated: "ظ",
      initial: "ظـ",
      medial: "ـظـ",
      final: "ـظ",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "ظَنَّ", meaning: "Zannetti" },
      { word: "مَظْلُومًا", meaning: "Zulüm gören" },
      { word: "حَافِظِينَ", meaning: "Koruyanlar" },
    ],
  },
  {
    slug: "ayn",
    order: 18,
    arabic: "ع",
    name: "Ayn",
    nameAr: "عَيْن",
    pronunciation: "Boğazdan keskin durak",
    forms: {
      isolated: "ع",
      initial: "عـ",
      medial: "ـعـ",
      final: "ـع",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "أَعُوذُ", meaning: "Sığınırım" },
      { word: "سُبْحَانَ", meaning: "Sübhan (tesbih)" },
      { word: "مَعَاذِ", meaning: "Sığınak" },
    ],
    learningTipKey: "tipAynGayn",
  },
  {
    slug: "gayn",
    order: 19,
    arabic: "غ",
    name: "Gayn",
    nameAr: "غَيْن",
    pronunciation: "Boğazdan gürültülü ses",
    forms: {
      isolated: "غ",
      initial: "غـ",
      medial: "ـغـ",
      final: "ـغ",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "غَيْظًا", meaning: "Öfke" },
      { word: "مَغْفُورًا", meaning: "Bağışlanmış" },
      { word: "بُغْضَاءً", meaning: "Düşmanlık" },
    ],
    learningTipKey: "tipAynGayn",
  },
  {
    slug: "fe",
    order: 20,
    arabic: "ف",
    name: "Fe",
    nameAr: "فَاء",
    pronunciation: "«f»",
    forms: {
      isolated: "ف",
      initial: "فـ",
      medial: "ـفـ",
      final: "ـف",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "فَلْيَعْبُدُوا", meaning: "İbadet etsinler" },
      { word: "أَفْلَحَ", meaning: "Kurtuluşa erdi" },
      { word: "مُفْتَرِينَ", meaning: "İftira edenler" },
    ],
  },
  {
    slug: "kaf",
    order: 21,
    arabic: "ق",
    name: "Kaf",
    nameAr: "قَاف",
    pronunciation: "«k» (arka damak)",
    forms: {
      isolated: "ق",
      initial: "قـ",
      medial: "ـقـ",
      final: "ـق",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "قُلْ", meaning: "De ki" },
      { word: "قُرَيْشٍ", meaning: "Kureyş" },
      { word: "مَقْبُوحًا", meaning: "Kınanmış" },
    ],
  },
  {
    slug: "kef",
    order: 22,
    arabic: "ك",
    name: "Kef",
    nameAr: "كَاف",
    pronunciation: "«k»",
    forms: {
      isolated: "ك",
      initial: "كـ",
      medial: "ـكـ",
      final: "ـك",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "كَيْدًا", meaning: "Hile" },
      { word: "مَكِينٍ", meaning: "Güçlü" },
      { word: "مُتَمَكِّنِينَ", meaning: "Güç sahibi" },
    ],
  },
  {
    slug: "lam",
    order: 23,
    arabic: "ل",
    name: "Lam",
    nameAr: "لَام",
    pronunciation: "«l»",
    forms: {
      isolated: "ل",
      initial: "لـ",
      medial: "ـلـ",
      final: "ـل",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "لِلَّهِ", meaning: "Allah için" },
      { word: "الْفَلَقِ", meaning: "Felak (tan)" },
      { word: "مُلْكِ", meaning: "Mülk" },
    ],
    learningTipKey: "tipSunMoon",
  },
  {
    slug: "mim",
    order: 24,
    arabic: "م",
    name: "Mim",
    nameAr: "مِيم",
    pronunciation: "«m»",
    forms: {
      isolated: "م",
      initial: "مـ",
      medial: "ـمـ",
      final: "ـم",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "مِنْ", meaning: "Kimden" },
      { word: "مَالِكِ", meaning: "Sahibi" },
      { word: "مُؤْمِنِينَ", meaning: "Müminler" },
    ],
  },
  {
    slug: "nun",
    order: 25,
    arabic: "ن",
    name: "Nun",
    nameAr: "نُون",
    pronunciation: "«n»",
    forms: {
      isolated: "ن",
      initial: "نـ",
      medial: "ـنـ",
      final: "ـن",
    },
    canConnect: true,
    category: "güneş",
    examples: [
      { word: "النَّاسِ", meaning: "İnsanlar" },
      { word: "أَنْعَمْتَ", meaning: "İhsan ettin" },
      { word: "مِنْهُمْ", meaning: "Onlardan" },
    ],
  },
  {
    slug: "he",
    order: 26,
    arabic: "ه",
    name: "He",
    nameAr: "هَاء",
    pronunciation: "«h» (hafif nefes)",
    forms: {
      isolated: "ه",
      initial: "هـ",
      medial: "ـهـ",
      final: "ـه",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "أَهْلَكَ", meaning: "Helâk ettin" },
      { word: "مُهْتَدِينَ", meaning: "Hidayete erenler" },
      { word: "شَاهِدٍ", meaning: "Şahit" },
    ],
    learningTipKey: "tipHaKhaHe",
  },
  {
    slug: "vav",
    order: 27,
    arabic: "و",
    name: "Vav",
    nameAr: "وَاو",
    pronunciation: "«v» / «u» / «o»",
    forms: {
      isolated: "و",
      initial: "و",
      medial: "ـو",
      final: "ـو",
    },
    canConnect: false,
    category: "ay",
    examples: [
      { word: "وَدُّ", meaning: "Sevgi" },
      { word: "أَوْزَاعًا", meaning: "Düzenler" },
      { word: "مَوْعِدًا", meaning: "Randevu" },
    ],
  },
  {
    slug: "ye",
    order: 28,
    arabic: "ي",
    name: "Ye",
    nameAr: "يَاء",
    pronunciation: "«y» / «i»",
    forms: {
      isolated: "ي",
      initial: "يـ",
      medial: "ـيـ",
      final: "ـي",
    },
    canConnect: true,
    category: "ay",
    examples: [
      { word: "يُحِبُّ", meaning: "Sever" },
      { word: "حِينَ", meaning: "Zaman" },
      { word: "مَيِّتًا", meaning: "Ölü" },
    ],
  },
] as const;

export function letterBySlug(slug: string): ILetter | undefined {
  return ARABIC_LETTERS.find(l => l.slug === slug);
}

export function letterNeighbors(slug: string): {
  prev?: ILetter;
  next?: ILetter;
} {
  const i = ARABIC_LETTERS.findIndex(l => l.slug === slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? ARABIC_LETTERS[i - 1] : undefined,
    next: i < ARABIC_LETTERS.length - 1 ? ARABIC_LETTERS[i + 1] : undefined,
  };
}
