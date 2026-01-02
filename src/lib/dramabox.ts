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
  
  console.log("🔧 API_BASE_URL:", base); // CEK INI!

  const cleanId = decodeURIComponent(String(bookId)).trim().replace(/\s+/g, "");
  const url = `${base}/api/dramabox/detail?bookId=${encodeURIComponent(cleanId)}`;

  console.log("🔗 Final URL:", url); // CEK INI!

  const attempt = async () => {
    console.log("🚀 Fetching...");
    const raw = await fetchJson<any>(url);
    
    console.log("📦 Raw response keys:", Object.keys(raw)); // CEK INI!
    console.log("✅ raw.success:", raw?.success);
    console.log("✅ raw.data:", !!raw?.data);
    console.log("✅ raw.data.book:", !!raw?.data?.book);

    if (raw?.success === false) {
      console.log("❌ API success=false, status:", raw?.status);
      if (raw?.status === 12000) return null;
      throw new Error(`${raw?.message || "API error"} (status: ${raw?.status ?? "unknown"})`);
    }

    if (raw?.data?.book) {
      console.log("✅ FOUND: raw.data.book - returning success!");
      return raw as DetailResponse;
    }
    
    if (raw?.data?.data?.book) {
      console.log("✅ FOUND: raw.data.data.book - returning success!");
      return { ...raw, data: raw.data.data } as DetailResponse;
    }

    console.log("⚠️ UNEXPECTED SHAPE!");
    throw new Error(`Unexpected detail response shape: ${JSON.stringify(raw).slice(0, 300)}`);
  };

  try {
    console.log("🎯 Attempt 1...");
    const first = await attempt();
    if (first) {
      console.log("✅ First attempt SUCCESS");
      return first;
    }

    console.log("⚠️ First attempt returned null, retrying...");
    const second = await attempt();
    if (second) console.log("✅ Second attempt SUCCESS");
    else console.log("❌ Second attempt also null");
    return second;
  } catch (error: any) {
    console.error("💥 ERROR in getDetail:", error.message);
    throw error;
  }
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

export function getBestVideoUrl(episode: EpisodeVideo): string | null {
  // Cari CDN dengan isDefault = 1
  const defaultCdn = episode.cdnList.find((cdn) => cdn.isDefault === 1) || episode.cdnList[0];
  if (!defaultCdn) return null;

  // Cari video dengan isDefault = 1, atau ambil yang quality 720p
  const defaultVideo = defaultCdn.videoPathList.find((v) => v.isDefault === 1);
  if (defaultVideo) return defaultVideo.videoPath;

  // Fallback: cari 720p atau quality tertinggi
  const video720 = defaultCdn.videoPathList.find((v) => v.quality === 720);
  if (video720) return video720.videoPath;

  // Ambil quality tertinggi
  const sorted = [...defaultCdn.videoPathList].sort((a, b) => b.quality - a.quality);
  return sorted[0]?.videoPath || null;
}
