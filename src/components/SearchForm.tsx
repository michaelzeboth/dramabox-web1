"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function SearchForm() {
    const router = useRouter();
    const sp = useSearchParams();
    const initial = useMemo(() => sp.get("q") ?? "", [sp]);

    const [value, setValue] = useState(initial);

    function submit(q: string) {
        const trimmed = q.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submit(value);
            }}
            className="flex w-full gap-2"
        >
            <div className="flex-1">
                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Cari judul drama..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-slate-300"
                />
            </div>
            <button
                type="submit"
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
                Search
            </button>
        </form>
    );
}
