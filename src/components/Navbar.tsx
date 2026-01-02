"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function cn(...v: Array<string | false | null | undefined>) {
    return v.filter(Boolean).join(" ");
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M16.2 16.2 21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [q, setQ] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const isHome = useMemo(() => pathname === "/", [pathname]);
    const isSearch = useMemo(() => pathname?.startsWith("/search"), [pathname]);

    function submitQuery(query: string) {
        const trimmed = query.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        setMobileOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex h-16 items-center justify-between gap-3">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="text-base font-semibold tracking-tight text-slate-900"
                        >
                            DramaBox
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden items-center gap-1 md:flex">
                            <Link
                                href="/"
                                className={cn(
                                    "rounded-full px-3 py-1.5 text-sm font-medium transition",
                                    isHome
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                )}
                            >
                                Home
                            </Link>

                            <Link
                                href="/search"
                                className={cn(
                                    "rounded-full px-3 py-1.5 text-sm font-medium transition",
                                    isSearch
                                        ? "bg-slate-900 text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                )}
                            >
                                Search
                            </Link>
                        </nav>
                    </div>

                    {/* Right: Desktop search */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitQuery(q);
                        }}
                        className="hidden w-[420px] items-center md:flex"
                    >
                        <div className="relative w-full">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari drama..."
                                className="w-full rounded-full border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300"
                            />
                        </div>
                    </form>

                    {/* Mobile: button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((s) => !s)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-900 shadow-sm transition hover:bg-slate-50 md:hidden"
                        aria-label="Open menu"
                        aria-expanded={mobileOpen}
                    >
                        <MenuIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile panel */}
                {mobileOpen ? (
                    <div className="pb-4 md:hidden">
                        <div className="flex flex-col gap-3">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submitQuery(q);
                                }}
                            >
                                <div className="relative">
                                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        placeholder="Cari drama..."
                                        className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-300"
                                    />
                                </div>
                            </form>

                            <div className="flex gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
                                        isHome
                                            ? "bg-slate-900 text-white"
                                            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/search"
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex-1 rounded-2xl px-4 py-3 text-center text-sm font-semibold transition",
                                        isSearch
                                            ? "bg-slate-900 text-white"
                                            : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    Search
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
