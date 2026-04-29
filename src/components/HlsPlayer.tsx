"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";
import type { Subtitle } from "@/lib/dramabox";

export default function HlsPlayer({
    src,
    startAt = 0,
    onProgress,
    onEnded,
    subtitles,
}: {
    src: string;
    startAt?: number;
    onProgress?: (payload: { currentTime: number; duration: number }) => void;
    onEnded?: () => void;
    subtitles?: Subtitle[];
}) {
    // useRef: butuh referensi DOM <video> persisten untuk attach hls.js & event listener tanpa re-render
    const ref = useRef<HTMLVideoElement | null>(null);
    // useRef: simpan timestamp emit terakhir untuk throttle progress tanpa memicu re-render
    const lastEmitRef = useRef<number>(0);

    // useEffect: sinkronisasi dengan DOM video element + hls.js (sistem eksternal)
    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        let hls: Hls | null = null;

        const applyStartTime = () => {
            if (!video) return;
            if (startAt > 1 && isFinite(startAt)) {
                try {
                    video.currentTime = startAt;
                } catch { }
            }
        };

        const emit = () => {
            if (!onProgress || !video) return;
            const now = Date.now();
            // throttle: setiap 4 detik
            if (now - lastEmitRef.current < 4000) return;
            lastEmitRef.current = now;

            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            onProgress({ currentTime: video.currentTime || 0, duration });
        };

        const handleEnded = () => onEnded?.();
        const onLoadedMetadata = () => applyStartTime();
        const onTimeUpdate = () => emit();

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("ended", handleEnded);

        // HLS / MP4 wiring
        if (src.includes(".m3u8")) {
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else {
                hls = new Hls({ enableWorker: true });
                hls.loadSource(src);
                hls.attachMedia(video);
            }
        } else {
            video.src = src;
        }

        return () => {
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("ended", handleEnded);
            if (hls) hls.destroy();
        };
    }, [src, startAt, onProgress, onEnded]);

    return (
        <video
            ref={ref}
            controls
            playsInline
            autoPlay
            className="block h-full w-full object-contain bg-black"
        >
            {subtitles?.map((sub) => (
                <track
                    key={sub.lang}
                    kind="subtitles"
                    label={sub.label}
                    srcLang={sub.lang}
                    src={sub.url}
                    default={sub.isDefault}
                />
            ))}
        </video>
    );
}
