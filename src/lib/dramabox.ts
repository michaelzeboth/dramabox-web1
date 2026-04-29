export type ForYouItem = {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount?: number;
  introduction?: string;
  tags?: string[];
  playCount?: string;
  corner?: { cornerType?: number; name?: string; color?: string };
};

export type DramaItem = {
  bookId: string;
  bookName: string;
  coverWap: string;
  cover?: string;
  chapterCount?: number;
  introduction?: string;
  tags?: string[];
  tagNames?: string[];
  playCount?: string;

  // latest-specific (opsional)
  shelfTime?: string;
  protagonist?: string;
  rankVo?: { hotCode?: string; sort?: number; rankType?: number };
};

type DetailBook = {
  bookId: string;
  bookName: string;
  cover: string;
  viewCount: number;
  followCount: number;
  introduction?: string;
  chapterCount?: number;
  labels?: string[];
  tags?: string[];
  typeTwoNames?: string[];
  shelfTime?: string;
};

export type DetailChapter = {
  id: string;
  name: string;
  index: number;
  indexStr?: string;
  unlock: boolean;
  mp4?: string;
  m3u8Url?: string;
  m3u8Flag?: boolean;
  cover?: string;
  utime?: string;
  duration?: number;
};

export type EpisodeVideo = {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: Array<{
    cdnDomain: string;
    isDefault: number;
    videoPathList: Array<{
      quality: number;
      videoPath: string;
      isDefault: number;
      isEntry: number;
      isVipEquity: number;
    }>;
  }>;
  chapterImg?: string;
  chapterType?: number;
  chargeChapter?: boolean;
  useMultiSubtitle?: number;
  subLanguageVoList?: Array<{
    captionLanguage: string;
    url: string;
    isDefault: number;
  }>;
};

export type Subtitle = {
  lang: string;
  label: string;
  url: string;
  isDefault: boolean;
};

export type DetailResponse = {
  data: {
    book: DetailBook;
    recommends: Array<{
      bookId: string;
      bookName: string;
      cover: string;
      introduction?: string;
      chapterCount?: number;
      tags?: string[];
      labels?: string[];
    }>;
    chapterList: DetailChapter[];
  };
  success: boolean;
  message: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

function requireEnv(name: string, value?: string) {
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return (await res.json()) as T;
}

export async function getForYou(): Promise<ForYouItem[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);

  const res = await fetch(`${base}/api/dramabox/foryou`, {
    // Karena “for you” biasanya dinamis/personal, default aman: jangan cache.
    cache: "no-store",

    // Kalau API kamu butuh header token, aktifkan ini:
    // headers: { "X-API-KEY": requireEnv("API_KEY", process.env.API_KEY) },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ForYou fetch failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];

  return data as ForYouItem[];
}

export async function getLatest(): Promise<DramaItem[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);

  const res = await fetch(`${base}/api/dramabox/latest`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Latest fetch failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];
  return data as DramaItem[];
}

export async function getTrending(): Promise<DramaItem[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);

  const res = await fetch(`${base}/api/dramabox/trending`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Trending fetch failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) return [];
  return data as DramaItem[];
}

export async function getPopularSearch(): Promise<DramaItem[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);
  return fetchJson<DramaItem[]>(`${base}/api/dramabox/populersearch`);
}

export async function searchDrama(query: string): Promise<DramaItem[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);
  const q = encodeURIComponent(query);
  return fetchJson<DramaItem[]>(`${base}/api/dramabox/search?query=${q}`);
}

export async function getDetail(bookId: string): Promise<DetailResponse | null> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);
  const cleanId = decodeURIComponent(String(bookId)).trim().replace(/\s+/g, "");
  const url = `${base}/api/dramabox/detail?bookId=${encodeURIComponent(cleanId)}`;

  const raw = await fetchJson<any>(url);

  if (raw?.success === false) {
    if (raw?.status === 12000) return null;
    throw new Error(`${raw?.message || "API error"} (status: ${raw?.status ?? "unknown"})`);
  }

  if (raw?.data?.book) return raw as DetailResponse;
  if (raw?.data?.data?.book) return { ...raw, data: raw.data.data } as DetailResponse;

  // API saat ini mengembalikan flat object tanpa wrapper { data: { book, chapterList, recommends } }.
  // Normalisasi ke DetailResponse agar consumer (halaman detail/watch) tidak perlu berubah.
  // Episode list & recommends dikosongkan — caller harus mengambilnya terpisah via getAllEpisodes.
  if (raw?.bookId && raw?.bookName) {
    const book: DetailBook = {
      bookId: String(raw.bookId),
      bookName: String(raw.bookName),
      cover: raw.cover || raw.coverWap || "",
      viewCount: Number(raw.viewCount) || 0,
      followCount: Number(raw.followCount) || 0,
      introduction: raw.introduction,
      chapterCount: raw.chapterCount,
      labels: raw.labels,
      tags: raw.tags,
      typeTwoNames: raw.typeTwoNames,
      shelfTime: raw.shelfTime,
    };
    return {
      data: { book, recommends: [], chapterList: [] },
      success: true,
      message: "ok",
    };
  }

  return null;
}

export async function getAllEpisodes(bookId: string): Promise<EpisodeVideo[]> {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);
  const cleanId = decodeURIComponent(String(bookId)).trim().replace(/\s+/g, "");
  const url = `${base}/api/dramabox/allepisode?bookId=${encodeURIComponent(cleanId)}`;

  try {
    const data = await fetchJson<EpisodeVideo[]>(url);
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error("💥 Error fetching episodes:", error.message);
    return [];
  }
}

// Video path dari API upstream ter-encrypt. Untuk diputar/diunduh harus dirutekan
// lewat proxy decrypt-stream milik backend kita. URL hasilnya deterministik
// (sama seperti `streamUrl` yang dikembalikan endpoint `/api/dramabox/decrypt`),
// jadi tidak perlu round-trip ekstra untuk validasi.
export function getPlayableUrl(encryptedUrl: string): string {
  const base = requireEnv("API_BASE_URL", API_BASE_URL);
  return `${base}/api/dramabox/decrypt-stream?url=${encodeURIComponent(encryptedUrl)}`;
}

export type DownloadQuality = {
  quality: number;
  url: string;
  isDefault: boolean;
  isVipEquity: boolean;
};

const SUBTITLE_LABELS: Record<string, string> = {
  in: "Indonesia",
  id: "Indonesia",
  en: "English",
  th: "ไทย",
  zh: "中文",
  zhHans: "中文 (简体)",
  ja: "日本語",
  es: "Español",
};

export function getSubtitles(episode: EpisodeVideo): Subtitle[] {
  if (!episode.subLanguageVoList) return [];
  return episode.subLanguageVoList
    .filter((s) => s.url && s.captionLanguage && s.captionLanguage !== "none")
    .map((s) => ({
      lang: s.captionLanguage,
      label: SUBTITLE_LABELS[s.captionLanguage] ?? s.captionLanguage,
      // Lewat proxy same-origin biar (a) bisa convert SRT → VTT, (b) bypass CORS upstream CDN.
      url: `/api/subtitle?url=${encodeURIComponent(s.url)}`,
      isDefault: s.isDefault === 1,
    }));
}

export function getDownloadQualities(episode: EpisodeVideo): DownloadQuality[] {
  const defaultCdn = episode.cdnList.find((cdn) => cdn.isDefault === 1) || episode.cdnList[0];
  if (!defaultCdn) return [];
  return defaultCdn.videoPathList.map((v) => ({
    quality: v.quality,
    url: getPlayableUrl(v.videoPath),
    isDefault: v.isDefault === 1,
    isVipEquity: v.isVipEquity === 1,
  }));
}

export function getBestVideoUrl(episode: EpisodeVideo): string | null {
  // Akun API premium — abaikan flag `isDefault` (yang menunjuk 720p non-VIP)
  // dan pilih quality tertinggi yang tersedia (biasanya 1080p / VIP).
  const defaultCdn = episode.cdnList.find((cdn) => cdn.isDefault === 1) || episode.cdnList[0];
  if (!defaultCdn) return null;

  const sorted = [...defaultCdn.videoPathList].sort((a, b) => b.quality - a.quality);
  return sorted[0]?.videoPath || null;
}
