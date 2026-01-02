import Link from "next/link";
import PlayerWithTracking from "@/components/PlayerWithTracking";
import { getDetail, getAllEpisodes, getBestVideoUrl } from "@/lib/dramabox";

export default async function WatchPage({
    params,
    searchParams,
}: {
    params: Promise<{ bookId: string }>;
    searchParams: Promise<{ chapterId?: string }>;
}) {
    const { bookId } = await params;
    const { chapterId } = await searchParams;

    // Fetch detail dan episodes secara parallel
    const [detail, episodes] = await Promise.all([
        getDetail(bookId).catch(() => null),
        getAllEpisodes(bookId),
    ]);

    // Error handling untuk detail
    if (!detail) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>

                    <div className="mt-6 rounded-lg bg-slate-800 p-8 shadow-xl ring-1 ring-white/10">
                        <h1 className="text-xl font-bold text-white">Video belum tersedia</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Detail drama untuk ID ini belum bisa diambil dari API saat ini.
                            Coba refresh beberapa saat lagi.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={`/watch/${bookId}`}
                                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:bg-slate-100"
                            >
                                Refresh
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-600"
                            >
                                Kembali ke Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const book = detail.data.book;
    const selected = chapterId
        ? episodes.find((ep) => ep.chapterId === chapterId)
        : episodes[0];

    if (!selected) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <Link
                        href={`/drama/${encodeURIComponent(book.bookId)}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Detail
                    </Link>

                    <div className="mt-6 rounded-lg bg-slate-800 p-8 text-sm text-slate-300 shadow-xl ring-1 ring-white/10">
                        Episode tidak tersedia untuk diputar.
                    </div>
                </div>
            </main>
        );
    }

    const videoUrl = getBestVideoUrl(selected);

    if (!videoUrl) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <Link
                        href={`/drama/${encodeURIComponent(book.bookId)}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Detail
                    </Link>

                    <div className="mt-6 rounded-lg bg-slate-800 p-8 text-sm text-slate-300 shadow-xl ring-1 ring-white/10">
                        Video URL tidak tersedia untuk episode ini.
                    </div>
                </div>
            </main>
        );
    }

    // Find next and previous episodes
    const currentIndex = episodes.findIndex((ep) => ep.chapterId === selected.chapterId);
    const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
    const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href={`/drama/${encodeURIComponent(book.bookId)}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>

                    <div className="text-right">
                        <div className="text-sm font-bold text-white">{book.bookName}</div>
                        <div className="text-xs text-slate-400">{selected.chapterName}</div>
                    </div>
                </div>

                {/* Video Player */}
                <div className="mt-6 overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
                    <PlayerWithTracking
                        src={videoUrl}
                        meta={{
                            bookId: book.bookId,
                            bookName: book.bookName,
                            cover: book.cover,
                            chapterId: selected.chapterId,
                            chapterIndex: selected.chapterIndex,
                        }}
                    />
                </div>

                {/* Episode Navigation - Prev/Next */}
                <div className="mt-6 flex gap-3">
                    {prevEpisode ? (
                        <Link
                            href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(prevEpisode.chapterId)}`}
                            className="flex flex-1 items-center gap-3 rounded-xl bg-slate-800 p-4 shadow-xl ring-1 ring-white/10 transition-all hover:bg-slate-700 hover:ring-white/20"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-700">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-xs font-medium text-slate-400">Previous</div>
                                <div className="truncate text-sm font-bold text-white">
                                    EP {prevEpisode.chapterIndex + 1}
                                </div>
                            </div>
                        </Link>
                    ) : null}

                    {nextEpisode ? (
                        <Link
                            href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(nextEpisode.chapterId)}`}
                            className="flex flex-1 items-center gap-3 rounded-xl bg-slate-800 p-4 shadow-xl ring-1 ring-white/10 transition-all hover:bg-slate-700 hover:ring-white/20"
                        >
                            <div className="min-w-0 flex-1 text-right">
                                <div className="text-xs font-medium text-slate-400">Next</div>
                                <div className="truncate text-sm font-bold text-white">
                                    EP {nextEpisode.chapterIndex + 1}
                                </div>
                            </div>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-700">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ) : null}
                </div>

                {/* Episode Grid */}
                <div className="mt-8 rounded-xl bg-slate-800/50 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">All Episodes</h2>
                        <span className="text-sm text-slate-400">{episodes.length} total</span>
                    </div>

                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                        {episodes.map((ep) => {
                            const isActive = ep.chapterId === selected.chapterId;
                            return (
                                <Link
                                    key={ep.chapterId}
                                    href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(ep.chapterId)}`}
                                    className={[
                                        "flex aspect-square items-center justify-center rounded-lg text-sm font-bold shadow-lg transition-all",
                                        isActive
                                            ? "bg-white text-slate-900 ring-2 ring-white"
                                            : "bg-slate-700 text-white ring-1 ring-white/10 hover:bg-slate-600 hover:ring-white/20",
                                    ].join(" ")}
                                >
                                    {ep.chapterIndex + 1}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}