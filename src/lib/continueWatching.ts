export type ContinueWatchingEntry = {
  bookId: string;
  bookName: string;
  cover: string;
  chapterId: string;
  chapterIndex: number;
  positionSec: number;
  durationSec?: number;
  updatedAt: number;
};

const KEY = "dramabox_continue_watching_v1";
const MAX_ITEMS = 20;

function safeParse(json: string): any {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function readContinueWatching(): ContinueWatchingEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as ContinueWatchingEntry[];
}

export function writeContinueWatching(items: ContinueWatchingEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function upsertContinueWatching(entry: ContinueWatchingEntry) {
  const items = readContinueWatching();
  const next = [
    entry,
    ...items.filter((x) => x.bookId !== entry.bookId), // unique per book
  ].slice(0, MAX_ITEMS);
  writeContinueWatching(next);
  return next;
}

export function clearContinueWatching() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
