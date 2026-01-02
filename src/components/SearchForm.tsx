'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
                <svg
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search drama by title..."
                    className="w-full rounded-lg bg-slate-800 py-3 pl-12 pr-4 text-white placeholder-slate-400 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
                />
            </div>
            <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:bg-slate-100 active:scale-95"
            >
                Search
            </button>
        </form>
    );
}