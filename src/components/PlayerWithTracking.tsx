"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HlsPlayer from "@/components/HlsPlayer";
import {
    readContinueWatching,
    upsertContinueWatching,
    type ContinueWatchingEntry,
} from "@/lib/continueWatching";
import type { Subtitle } from "@/lib/dramabox";

export default function PlayerWithTracking({
    src,
    meta,
    nextHref,
    nextLabel,
    subtitles,
}: {
    src: string;
    meta: {
        bookId: string;
        bookName: string;
        cover: string;
        chapterId: string;
        chapterIndex: number;
    };
    nextHref?: string;
    nextLabel?: string;
    subtitles?: Subtitle[];
}) {
    const router = useRouter();
    // useState: posisi resume — perlu state karena nilainya datang asynchronously dari localStorage,
    // dan harus mempengaruhi prop `startAt` ke HlsPlayer (re-render diperlukan).
    const [startAt, setStartAt] = useState(0);

    const existing = useMemo(() => {
        const items = readContinueWatching();
        return items.find((x) => x.bookId === meta.bookId);
    }, [meta.bookId]);

    // useEffect: read continue-watching dari localStorage hanya di client (sinkronisasi sistem eksternal)
    useEffect(() => {
        if (!existing) return;
        // resume hanya kalau chapter sama (kalau beda, mulai dari 0)
        if (existing.chapterId === meta.chapterId) {
            setStartAt(Math.max(0, existing.positionSec || 0));
        }
    }, [existing, meta.chapterId]);

    const saveProgress = useCallback((currentTime: number, duration: number) => {
        const entry: ContinueWatchingEntry = {
            bookId: meta.bookId,
            bookName: meta.bookName,
            cover: meta.cover,
            chapterId: meta.chapterId,
            chapterIndex: meta.chapterIndex,
            positionSec: Math.max(0, currentTime || 0),
            durationSec: duration > 0 ? duration : undefined,
            updatedAt: Date.now(),
        };
        upsertContinueWatching(entry);
    }, [meta.bookId, meta.bookName, meta.cover, meta.chapterId, meta.chapterIndex]);

    const handleEnded = useCallback(() => {
        if (nextHref) router.push(nextHref);
    }, [nextHref, router]);

    return (
        <div className="relative h-full w-full">
            <HlsPlayer
                src={src}
                startAt={startAt}
                onProgress={saveProgress}
                onEnded={handleEnded}
                subtitles={subtitles}
            />

            {nextHref && nextLabel ? (
                <Link
                    href={nextHref}
                    prefetch
                    className="pointer-events-auto absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 px-3 py-1.5 text-xs font-bold text-white opacity-70 ring-1 ring-white/10 backdrop-blur-md transition hover:bg-slate-900/90 hover:opacity-100"
                    aria-label={`Episode berikutnya: ${nextLabel}`}
                >
                    Next: {nextLabel}
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            ) : null}
        </div>
    );
}
