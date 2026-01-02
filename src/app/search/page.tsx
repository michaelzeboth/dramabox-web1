import Image from "next/image";
import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import { getPopularSearch, searchDrama } from "@/lib/dramabox";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>; // 👈 Changed to Promise
}) {
    // 👇 Await searchParams
    const params = await searchParams;
    const q = (params.q ?? "").trim();

    const [popular, results] = await Promise.all([
        getPopularSearch().catch(() => []),
        q ? searchDrama(q).catch(() => []) : Promise.resolve([]),
    ]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali
                </Link>

                {/* Search Section */}
                <div className="mt-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white">Search Drama</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Cari drama berdasarkan judul atau genre
                        </p>
                    </div>

                    {/* Search Form */}
                    <SearchForm />

                    {/* Popular Search */}
                    {popular.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-4 text-sm font-semibold text-slate-400">Popular Searches</h2>
                            <div className="flex flex-wrap gap-2">
                                {popular.slice(0, 15).map((p) => (
                                    <Link
                                        key={p.bookId}
                                        href={`/search?q=${encodeURIComponent(p.bookName)}`}
                                        className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 ring-1 ring-white/10 transition-all hover:bg-slate-700 hover:text-white hover:ring-white/20"
                                    >
                                        {p.bookName}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Results */}
                {q ? (
                    <div className="mt-12">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Results for "{q}"
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    {results.length} {results.length === 1 ? 'result' : 'results'} found
                                </p>
                            </div>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {results.map((item) => {
                                    const img = item.coverWap || item.cover || "";
                                    const tags = (item.tagNames || item.tags || []).slice(0, 2);

                                    return (
                                        <Link
                                            key={item.bookId}
                                            href={`/drama/${item.bookId}`}
                                            className="group overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-white/20"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
                                                {img ? (
                                                    <Image
                                                        src={img}
                                                        alt={item.bookName}
                                                        fill
                                                        className="object-cover transition duration-500 group-hover:scale-110"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                                                    />
                                                ) : null}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                <div className="absolute inset-x-0 bottom-0 p-3">
                                                    {/* Meta */}
                                                    {item.chapterCount ? (
                                                        <div className="mb-2 flex items-center gap-1 text-xs text-slate-300">
                                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                            </svg>
                                                            {item.chapterCount} EP
                                                        </div>
                                                    ) : null}

                                                    {/* Title */}
                                                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">
                                                        {item.bookName}
                                                    </h3>

                                                    {/* Play Button */}
                                                    <div className="mt-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                        <div className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
                                                            <PlayIcon className="h-3 w-3" />
                                                            Play
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            {tags.length > 0 ? (
                                                <div className="p-3">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {tags.map((t) => (
                                                            <span
                                                                key={t}
                                                                className="rounded-md bg-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-300"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-lg bg-slate-800 p-8 text-center shadow-xl ring-1 ring-white/10">
                                <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="mt-4 text-sm font-medium text-slate-400">
                                    No results found for "{q}"
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Try searching with different keywords
                                </p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        </main>
    );
}