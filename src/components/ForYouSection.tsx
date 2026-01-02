import Image from "next/image";
import Link from "next/link";
import { getForYou } from "@/lib/dramabox";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-slate-900">
            {children}
        </span>
    );
}

export function ForYouSectionSkeleton() {
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

export default async function ForYouSection() {
    let items: Awaited<ReturnType<typeof getForYou>> = [];
    let errorMsg = "";

    try {
        items = await getForYou();
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
                <h2 className="text-2xl font-bold text-white">For You</h2>
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
                            <div className="absolute left-3 top-3">
                                {item.corner?.name ? <Badge>{item.corner.name}</Badge> : null}
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
                                    {item.playCount ? (
                                        <span className="flex items-center gap-1">
                                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            {item.playCount}
                                        </span>
                                    ) : null}
                                </div>

                                {/* Title */}
                                <h3 className="line-clamp-2 text-base font-bold leading-tight text-white">
                                    {item.bookName}
                                </h3>

                                {/* Play Button - Appears on Hover */}
                                <div className="mt-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <div className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg">
                                        <PlayIcon className="h-4 w-4" />
                                        Play
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}