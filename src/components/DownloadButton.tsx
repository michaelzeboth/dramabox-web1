'use client';

import { useState } from 'react';
import type { DownloadQuality } from '@/lib/dramabox';

export default function DownloadButton({
    qualities,
    bookName,
    episodeIndex,
}: {
    qualities: DownloadQuality[];
    bookName: string;
    episodeIndex: number;
}) {
    // useState: kualitas yang sedang di-download. `null` = idle. Diturunkan jadi `isBusy`
    // (tanpa state terpisah) — `downloading` sebelumnya adalah derived state, dihapus.
    const [activeQuality, setActiveQuality] = useState<number | null>(null);
    // useState: persen progress download. Berubah saat tiap chunk masuk → perlu re-render.
    const [progress, setProgress] = useState(0);

    const isBusy = activeQuality !== null;
    const sortedQualities = [...qualities].sort((a, b) => b.quality - a.quality);

    const handleDownload = async (videoPath: string, quality: number) => {
        if (isBusy) return;
        setActiveQuality(quality);
        setProgress(0);

        try {
            const filename = `${bookName} - EP ${episodeIndex + 1} - ${quality}p.mp4`;

            // Fetch langsung ke upstream (CORS sudah * di sansekai). Tidak lewat Vercel.
            const res = await fetch(videoPath);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const total = Number(res.headers.get('content-length')) || 0;
            const contentType = res.headers.get('content-type') || 'video/mp4';

            let blob: Blob;
            if (res.body && total > 0) {
                // Stream chunk-by-chunk untuk track progress
                const reader = res.body.getReader();
                const chunks: Uint8Array[] = [];
                let received = 0;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    received += value.length;
                    setProgress(Math.round((received / total) * 100));
                }
                blob = new Blob(chunks as BlobPart[], { type: contentType });
            } else {
                // Fallback: tanpa progress
                blob = await res.blob();
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            // Beri waktu browser memproses klik sebelum revoke
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error('Download error:', error);
            alert('Download gagal. Coba lagi.');
        } finally {
            setActiveQuality(null);
            setProgress(0);
        }
    };

    return (
        <div className="rounded-xl bg-slate-800/50 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Download</h3>
                <span className="text-xs text-slate-400">
                    {isBusy ? `${progress}%` : 'Pilih kualitas'}
                </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
                {sortedQualities.map((video) => {
                    const isDownloading = activeQuality === video.quality;

                    return (
                        <button
                            key={video.quality}
                            onClick={() => handleDownload(video.url, video.quality)}
                            disabled={isBusy}
                            className={[
                                "relative flex flex-col items-center justify-center overflow-hidden rounded-md px-2 py-2 text-center transition-all",
                                isDownloading
                                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                                    : "bg-slate-700 text-white ring-1 ring-white/10 hover:bg-slate-600 hover:ring-white/20",
                                isBusy && !isDownloading ? "opacity-50" : "",
                            ].join(" ")}
                            title={video.isVipEquity ? `${video.quality}p (VIP)` : `${video.quality}p`}
                        >
                            {/* Progress fill di belakang konten button */}
                            {isDownloading ? (
                                <span
                                    className="absolute inset-y-0 left-0 bg-blue-500/40 transition-[width] duration-150"
                                    style={{ width: `${progress}%` }}
                                    aria-hidden
                                />
                            ) : null}

                            {video.isVipEquity && (
                                <span className="absolute -right-1 -top-1 z-10 rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-1 py-px text-[8px] font-bold text-slate-900">
                                    VIP
                                </span>
                            )}

                            <span className="relative z-10 text-base font-bold leading-none">
                                {video.quality}p
                            </span>

                            {isDownloading ? (
                                <span className="relative z-10 mt-0.5 text-[9px] font-semibold text-white">
                                    {progress}%
                                </span>
                            ) : video.isDefault ? (
                                <span className="mt-0.5 text-[9px] font-semibold text-blue-400">
                                    Default
                                </span>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
