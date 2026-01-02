import Image from "next/image";
import Link from "next/link";
import { getLatest } from "@/lib/dramabox";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

function Badge({ children, variant = "hot" }: { children: React.ReactNode; variant?: "hot" | "new" }) {
    const variants = {
        hot: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
        new: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    };

    return (
        <span className={`inline-flex items-center rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-slate-900 ${variant === "hot" ? "" : variants[variant]}`}>
            {children}
        </span>
    );
}

export function LatestSectionSkeleton() {
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

export default async function LatestSection() {
    let items: Awaited<ReturnType<typeof getLatest>> = [];
    let errorMsg = "";

    try {
        items = await getLatest();
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
                    <h2 className="text-2xl font-bold text-white">Latest</h2>
                    <p className="mt-1 text-sm text-slate-400">Update terbaru yang baru masuk</p>
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

            {/* Grid Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                    <Link
                        key={item.bookId}
                        href={`/drama/${item.bookId}`}
                        className="group overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-white/20"
                    >
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

                            {/* Badges - Top Left */}
                            <div className="absolute left-3 top-3 flex flex-col gap-2">
                                {item.rankVo?.hotCode ? (
                                    <Badge variant="hot">
                                        🔥 {item.rankVo.hotCode}
                                    </Badge>
                                ) : null}
                                {item.shelfTime && new Date(item.shelfTime).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 ? (
                                    <Badge variant="new">NEW</Badge>
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
                                    {item.shelfTime ? (
                                        <span className="flex items-center gap-1">
                                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                                            </svg>
                                            {new Date(item.shelfTime).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
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
                ))}
            </div>
        </section>
    );
}