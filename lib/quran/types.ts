export interface IReciter {
  id: string;
  nameAr: string;
  nameTr: string;
  nameEn: string;
  bitrate: number;
}

export interface IQuranProvider {
  getAudioUrl(surahNumber: number, reciterId: string): string;
}

export const RECITERS: IReciter[] = [
  {
    id: "ar.alafasy",
    nameAr: "مشاري راشد العفاسي",
    nameTr: "Mishary Raşid el-Afasi",
    nameEn: "Mishary Rashid Alafasy",
    bitrate: 128,
  },
  {
    id: "ar.abdurrahmaansudais",
    nameAr: "عبدالرحمن السديس",
    nameTr: "Abdurrahman es-Sudeys",
    nameEn: "Abdurrahman as-Sudais",
    bitrate: 128,
  },
  {
    id: "ar.abdulbasitmurattal",
    nameAr: "عبدالباسط عبدالصمد",
    nameTr: "Abdülbasit Abdüssamed",
    nameEn: "Abdul Basit (Murattal)",
    bitrate: 128,
  },
  {
    id: "ar.husary",
    nameAr: "محمود خليل الحصري",
    nameTr: "Mahmud Halil el-Husari",
    nameEn: "Mahmoud Khalil Al-Husary",
    bitrate: 128,
  },
  {
    id: "ar.minshawi",
    nameAr: "محمد صديق المنشاوي",
    nameTr: "Muhammed Sıddık el-Minşavi",
    nameEn: "Mohamed Siddiq El-Minshawi",
    bitrate: 128,
  },
];
