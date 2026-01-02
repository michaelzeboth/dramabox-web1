"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    clearContinueWatching,
    readContinueWatching,
    type ContinueWatchingEntry,
} from "@/lib/continueWatching";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

function formatTime(sec: number) {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
}

export default function ContinueWatchingSection() {
    const [items, setItems] = useState<ContinueWatchingEntry[]>([]);

    useEffect(() => {
        setItems(readContinueWatching());
    }, []);

    if (!items.length) return null;

    return (
        <section className="mb-16">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        Continue Watching
                        <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">Lanjutkan tontonan terakhir kamu</p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        clearContinueWatching();
                        setItems([]);
                    }}
                    className="group flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                </button>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {items.slice(0, 12).map((it) => {
                    const pct =
                        it.durationSec && it.durationSec > 0
                            ? Math.min(100, Math.max(0, (it.positionSec / it.durationSec) * 100))
                            : 0;

                    return (
                        <Link
                            key={it.bookId}
                            href={`/watch/${it.bookId}?chapterId=${encodeURIComponent(it.chapterId)}`}
                            className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-white/20"
                        >
                            {/* "RESUME" Badge - Top Right */}
                            <div className="absolute right-2 top-2 z-10">
                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                                    <PlayIcon className="h-3 w-3" />
                                    RESUME
                                </span>
                            </div>

                            {/* 3:4 Portrait Poster */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
                                <Image
                                    src={it.cover}
                                    alt={it.bookName}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                {/* Progress Bar - Top */}
                                <div className="absolute inset-x-0 top-0 h-1 bg-slate-900/50">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>

                                {/* Info Overlay - Bottom */}
                                <div className="absolute inset-x-0 bottom-0 p-3">
                                    {/* Episode Info */}
                                    <div className="mb-2 flex items-center gap-2 text-xs text-blue-400">
                                        <span className="flex items-center gap-1 font-semibold">
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                            </svg>
                                            EP {it.chapterIndex + 1}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">
                                        {it.bookName}
                                    </h3>

                                    {/* Time Progress */}
                                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-300">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                                        </svg>
                                        <span>
                                            {formatTime(it.positionSec)}
                                            {it.durationSec ? ` / ${formatTime(it.durationSec)}` : ""}
                                        </span>
                                    </div>

                                    {/* Progress Percentage */}
                                    <div className="mt-1 text-xs font-bold text-blue-400">
                                        {Math.round(pct)}% complete
                                    </div>

                                    {/* Play Button - Appears on Hover */}
                                    <div className="mt-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                                            <PlayIcon className="h-3 w-3" />
                                            Continue
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}