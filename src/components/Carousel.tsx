"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M14.5 5 8 12l6.5 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M9.5 5 16 12l-6.5 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Carousel({
    children,
    ariaLabel = "carousel",
}: {
    children: ReactNode;
    ariaLabel?: string;
}) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const update = useMemo(
        () => () => {
            const el = scrollerRef.current;
            if (!el) return;
            const { scrollLeft, scrollWidth, clientWidth } = el;
            setCanLeft(scrollLeft > 2);
            setCanRight(scrollLeft + clientWidth < scrollWidth - 2);
        },
        []
    );

    useEffect(() => {
        update();
        const el = scrollerRef.current;
        if (!el) return;

        const onScroll = () => update();
        el.addEventListener("scroll", onScroll, { passive: true });

        const ro = new ResizeObserver(() => update());
        ro.observe(el);

        return () => {
            el.removeEventListener("scroll", onScroll);
            ro.disconnect();
        };
    }, [update]);

    function scrollByPage(dir: "left" | "right") {
        const el = scrollerRef.current;
        if (!el) return;
        const amount = Math.floor(el.clientWidth * 0.9);
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }

    return (
        <div className="relative overflow-visible">
            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent" />

            {/* arrows */}
            <button
                type="button"
                onClick={() => scrollByPage("left")}
                disabled={!canLeft}
                aria-label="Scroll left"
                className={[
                    "absolute left-2 top-1/2 z-30 -translate-y-1/2",
                    "inline-flex items-center justify-center rounded-full",
                    "bg-slate-900/90 p-2 text-white shadow-lg ring-1 ring-white/10 backdrop-blur",
                    "transition hover:bg-slate-900",
                    "disabled:opacity-0 disabled:pointer-events-none",
                ].join(" ")}
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            <button
                type="button"
                onClick={() => scrollByPage("right")}
                disabled={!canRight}
                aria-label="Scroll right"
                className={[
                    "absolute right-2 top-1/2 z-30 -translate-y-1/2",
                    "inline-flex items-center justify-center rounded-full",
                    "bg-slate-900/90 p-2 text-white shadow-lg ring-1 ring-white/10 backdrop-blur",
                    "transition hover:bg-slate-900",
                    "disabled:opacity-0 disabled:pointer-events-none",
                ].join(" ")}
            >
                <ChevronRight className="h-5 w-5" />
            </button>

            <div
                ref={scrollerRef}
                aria-label={ariaLabel}
                className="flex gap-4 overflow-x-auto pb-2 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </div>
        </div>
    );
}
