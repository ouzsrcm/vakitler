import { IQuranProvider } from "../types";

// Uses the Islamic Network CDN backed by alquran.cloud
// Audio URL format: https://cdn.islamic.network/quran/audio-surah/{bitrate}/{edition}/{surahNumber}.mp3
const BASE_CDN = "https://cdn.islamic.network/quran/audio-surah";

class AlquranCloudProvider implements IQuranProvider {
  getAudioUrl(surahNumber: number, reciterId: string): string {
    return `${BASE_CDN}/128/${reciterId}/${surahNumber}.mp3`;
  }
}

export const alquranCloudProvider = new AlquranCloudProvider();
