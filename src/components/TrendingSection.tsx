import Image from "next/image";
import Link from "next/link";
import { getTrending } from "@/lib/dramabox";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

function TrendingBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded bg-gradient-to-r from-red-500 to-orange-500 px-2 py-1 text-xs font-bold text-white shadow-lg">
            {children}
        </span>
    );
}

export function TrendingSectionSkeleton() {
    return (
        <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
                <div className="h-7 w-32 animate-pulse rounded bg-slate-700" />
                <div className="h-9 w-24 animate-pulse rounded bg-slate-700" />
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-lg bg-slate-800">
                        <div className="aspect-[16/9] w-full animate-pulse bg-slate-700" />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default async function TrendingSection() {
    let items: Awaited<ReturnType<typeof getTrending>> = [];
    let errorMsg = "";

    try {
        items = await getTrending();
    } catch (e: any) {
        errorMsg = e?.message || "Gagal memuat data.";
    }

    if (errorMsg) {
        return (
            <section className="mb-16">
                <div className="rounded-lg border border-rose-800 bg-rose-900/20 p-4 text-sm text-rose-400">
                    {errorMsg}
                </div>
            </section>
        );
    }

    if (!items || items.length === 0) return null;

    return (
        <section className="mb-16">
            {/* Section Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        Trending
                        <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
                        </svg>
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">Paling ramai ditonton saat ini</p>
                </div>
                <Link
                    href="/"
                    className="group flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                >
                    View More
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>

            {/* Grid Cards with Ranking */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item, idx) => {
                    const rank = item.rankVo?.sort ?? idx + 1;
                    const isTopThree = rank <= 3;

                    return (
                        <Link
                            key={item.bookId}
                            href={`/drama/${item.bookId}`}
                            className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-white/20"
                        >
                            {/* Rank Number - Top Left Corner */}
                            <div className="absolute left-0 top-0 z-10">
                                <div className={`flex h-14 w-14 items-end justify-center pb-1 ${isTopThree
                                    ? 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600'
                                    : 'bg-slate-900/90'
                                    } rounded-br-2xl shadow-xl backdrop-blur-sm`}>
                                    <span className={`text-2xl font-black leading-none ${isTopThree ? 'text-slate-900' : 'text-white'
                                        }`}>
                                        {rank}
                                    </span>
                                </div>
                            </div>

                            {/* 16:9 Landscape Poster */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
                                <Image
                                    src={item.coverWap}
                                    alt={item.bookName}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-110"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                {/* Badges - Top Right */}
                                <div className="absolute right-3 top-3 flex flex-col gap-2">
                                    {item.rankVo?.hotCode ? (
                                        <TrendingBadge>🔥 {item.rankVo.hotCode}</TrendingBadge>
                                    ) : null}
                                </div>

                                {/* Info Overlay - Bottom */}
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    {/* Meta Icons */}
                                    <div className="mb-2 flex items-center gap-3 text-xs text-slate-300">
                                        {item.chapterCount ? (
                                            <span className="flex items-center gap-1">
                                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                </svg>
                                                {item.chapterCount} EP
                                            </span>
                                        ) : null}
                                        {isTopThree ? (
                                            <span className="flex items-center gap-1 font-bold text-yellow-400">
                                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                Top {rank}
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Title */}
                                    <h3 className="line-clamp-2 text-base font-bold leading-tight text-white">
                                        {item.bookName}
                                    </h3>

                                    {/* Protagonist */}
                                    {item.protagonist ? (
                                        <p className="mt-1 text-xs text-slate-300">
                                            {item.protagonist}
                                        </p>
                                    ) : null}

                                    {/* Play Button - Appears on Hover */}
                                    <div className="mt-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <div className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                                            <PlayIcon className="h-4 w-4" />
                                            Play
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Section */}
                            {item.tags && item.tags.length > 0 ? (
                                <div className="p-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-slate-700 px-2 py-0.5 text-[11px] font-semibold text-slate-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}