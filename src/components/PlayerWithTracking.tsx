"use client";

import { useEffect, useMemo, useState } from "react";
import HlsPlayer from "@/components/HlsPlayer";
import {
    readContinueWatching,
    upsertContinueWatching,
    type ContinueWatchingEntry,
} from "@/lib/continueWatching";

export default function PlayerWithTracking({
    src,
    meta,
}: {
    src: string;
    meta: {
        bookId: string;
        bookName: string;
        cover: string;
        chapterId: string;
        chapterIndex: number;
    };
}) {
    const [startAt, setStartAt] = useState(0);

    const existing = useMemo(() => {
        const items = readContinueWatching();
        return items.find((x) => x.bookId === meta.bookId);
    }, [meta.bookId]);

    useEffect(() => {
        if (!existing) return;
        // resume hanya kalau chapter sama (kalau beda, mulai dari 0)
        if (existing.chapterId === meta.chapterId) {
            setStartAt(Math.max(0, existing.positionSec || 0));
        }
    }, [existing, meta.chapterId]);

    function saveProgress(currentTime: number, duration: number) {
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
    }

    return (
        <HlsPlayer
            src={src}
            startAt={startAt}
            onProgress={({ currentTime, duration }) => saveProgress(currentTime, duration)}
        />
    );
}
