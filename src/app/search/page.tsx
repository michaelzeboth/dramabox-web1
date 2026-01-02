import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { getPopularSearch, searchDrama } from "@/lib/dramabox";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string };
}) {
    const q = (searchParams.q ?? "").trim();

    const [popular, results] = await Promise.all([
        getPopularSearch().catch(() => []),
        q ? searchDrama(q).catch(() => []) : Promise.resolve([]),
    ]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Search</h1>
                            <p className="mt-1 text-sm text-slate-600">
                                Cari drama berdasarkan judul.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
                        >
                            Kembali
                        </Link>
                    </div>

                    <div className="mt-5">
                        <SearchForm />
                    </div>

                    {/* Popular Search */}
                    <div className="mt-6">
                        <div className="text-sm font-semibold text-slate-900">Popular Search</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {popular.slice(0, 12).map((p) => (
                                <Link
                                    key={p.bookId}
                                    href={`/search?q=${encodeURIComponent(p.bookName)}`}
                                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200"
                                >
                                    {p.bookName}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                {q ? (
                    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Hasil untuk: “{q}”</h2>
                                <p className="mt-1 text-sm text-slate-600">{results.length} hasil</p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {results.map((item) => {
                                const img = item.coverWap || item.cover || "";
                                const tags = (item.tagNames || item.tags || []).slice(0, 3);

                                return (
                                    <Link
                                        key={item.bookId}
                                        href={`/drama/${item.bookId}`}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                                            {img ? (
                                                <Image
                                                    src={img}
                                                    alt={item.bookName}
                                                    fill
                                                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                />
                                            ) : null}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <div className="truncate text-sm font-semibold text-white">
                                                    {item.bookName}
                                                </div>
                                                <div className="mt-1 text-xs text-white/80">
                                                    {item.chapterCount ? `${item.chapterCount} episode` : item.protagonist || ""}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {tags.map((t) => (
                                                    <span
                                                        key={t}
                                                        className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {results.length === 0 ? (
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                Tidak ada hasil.
                            </div>
                        ) : null}
                    </section>
                ) : null}
            </div>
        </main>
    );
}
