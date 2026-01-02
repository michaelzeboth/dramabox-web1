'use client';

import { useState } from 'react';
import type { EpisodeVideo } from '@/lib/dramabox';

export default function DownloadButton({
    episode,
    bookName,
}: {
    episode: EpisodeVideo;
    bookName: string;
}) {
    const [downloading, setDownloading] = useState(false);
    const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

    // Get all available qualities
    const defaultCdn = episode.cdnList.find((cdn) => cdn.isDefault === 1) || episode.cdnList[0];
    const qualities = defaultCdn?.videoPathList || [];

    // Sort by quality (highest first)
    const sortedQualities = [...qualities].sort((a, b) => b.quality - a.quality);

    const handleDownload = async (videoPath: string, quality: number) => {
        setDownloading(true);
        setSelectedQuality(quality);

        try {
            // Create filename
            const filename = `${bookName} - EP ${episode.chapterIndex + 1} - ${quality}p.mp4`;

            // Method 1: Direct download link
            const link = document.createElement('a');
            link.href = videoPath;
            link.download = filename;
            link.target = '_blank';
            link.click();

            // Show success message
            setTimeout(() => {
                setDownloading(false);
                setSelectedQuality(null);
            }, 2000);
        } catch (error) {
            console.error('Download error:', error);
            setDownloading(false);
            setSelectedQuality(null);
            alert('Download failed. Please try again.');
        }
    };

    return (
        <div className="rounded-xl bg-slate-800 p-6 shadow-xl ring-1 ring-white/10">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Episode
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Select quality and download to watch offline
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {sortedQualities.map((video) => {
                    const isDownloading = downloading && selectedQuality === video.quality;
                    const isVip = video.isVipEquity === 1;

                    return (
                        <button
                            key={video.quality}
                            onClick={() => handleDownload(video.videoPath, video.quality)}
                            disabled={downloading}
                            className={[
                                "relative overflow-hidden rounded-lg p-4 text-center transition-all",
                                isDownloading
                                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                                    : "bg-slate-700 text-white ring-1 ring-white/10 hover:bg-slate-600 hover:ring-white/20",
                                downloading && !isDownloading ? "opacity-50" : "",
                            ].join(" ")}
                        >
                            {/* VIP Badge */}
                            {isVip && (
                                <div className="absolute right-1 top-1">
                                    <span className="rounded bg-gradient-to-r from-yellow-500 to-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-slate-900">
                                        VIP
                                    </span>
                                </div>
                            )}

                            {/* Quality */}
                            <div className="text-2xl font-black">
                                {video.quality}p
                            </div>

                            {/* Label */}
                            <div className="mt-1 text-xs font-medium text-slate-400">
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </div>

                            {/* Default Indicator */}
                            {video.isDefault === 1 && !isDownloading && (
                                <div className="mt-1">
                                    <span className="text-[10px] font-semibold text-blue-400">
                                        Recommended
                                    </span>
                                </div>
                            )}

                            {/* Loading Spinner */}
                            {isDownloading && (
                                <div className="mt-2 flex justify-center">
                                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Info Text */}
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-900/50 p-3 text-xs text-slate-400">
                <svg className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                </svg>
                <div>
                    <p className="font-medium">Download Tips:</p>
                    <ul className="mt-1 list-inside list-disc space-y-1">
                        <li>Higher quality = larger file size</li>
                        <li>720p recommended for most devices</li>
                        <li>VIP quality requires premium subscription</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}