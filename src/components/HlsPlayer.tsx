"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function HlsPlayer({
    src,
    startAt = 0,
    onProgress,
}: {
    src: string;
    startAt?: number;
    onProgress?: (payload: { currentTime: number; duration: number }) => void;
}) {
    const ref = useRef<HTMLVideoElement | null>(null);
    const lastEmitRef = useRef<number>(0);

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

        const onLoadedMetadata = () => applyStartTime();
        const onTimeUpdate = () => emit();

        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("timeupdate", onTimeUpdate);

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
            if (hls) hls.destroy();
        };
    }, [src, startAt, onProgress]);

    return (
        <video
            ref={ref}
            controls
            playsInline
            className="w-full rounded-3xl bg-black shadow-sm"
        />
    );
}
