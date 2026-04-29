import Link from "next/link";
import PlayerWithTracking from "@/components/PlayerWithTracking";
import DownloadButton from "@/components/DownloadButton";
import {
    getDetail,
    getAllEpisodes,
    getBestVideoUrl,
    getPlayableUrl,
    getDownloadQualities,
    getSubtitles,
} from "@/lib/dramabox";

export default async function WatchPage({
    params,
    searchParams,
}: {
    params: Promise<{ bookId: string }>;
    searchParams: Promise<{ chapterId?: string }>;
}) {
    const { bookId } = await params;
    const { chapterId } = await searchParams;

    const [detail, episodes] = await Promise.all([
        getDetail(bookId).catch(() => null),
        getAllEpisodes(bookId),
    ]);

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

    const encryptedVideoUrl = getBestVideoUrl(selected);

    if (!encryptedVideoUrl) {
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

    const playUrl = getPlayableUrl(encryptedVideoUrl);
    const downloadQualities = getDownloadQualities(selected);
    const subtitles = getSubtitles(selected);

    const currentIndex = episodes.findIndex((ep) => ep.chapterId === selected.chapterId);
    const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;
    const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
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

                    <div className="min-w-0 text-right">
                        <div className="truncate text-sm font-bold text-white">{book.bookName}</div>
                        <div className="text-xs text-slate-400">{selected.chapterName}</div>
                    </div>
                </div>

                {/* Two-column on lg+, stacked on smaller screens */}
                <div className="mt-5 grid gap-6 lg:grid-cols-12">
                    {/* Left: player stage + prev/next */}
                    <div className="lg:col-span-7">
                        {/* Stage: portrait 9:16, height capped by viewport so video tidak ngambil seluruh layar */}
                        <div className="mx-auto aspect-[9/16] h-[min(72vh,640px)] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                            <PlayerWithTracking
                                src={playUrl}
                                meta={{
                                    bookId: book.bookId,
                                    bookName: book.bookName,
                                    cover: book.cover,
                                    chapterId: selected.chapterId,
                                    chapterIndex: selected.chapterIndex,
                                }}
                                nextHref={
                                    nextEpisode
                                        ? `/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(nextEpisode.chapterId)}`
                                        : undefined
                                }
                                nextLabel={nextEpisode ? `EP ${nextEpisode.chapterIndex + 1}` : undefined}
                                subtitles={subtitles}
                            />
                        </div>

                        {/* Prev / EP indicator / Next */}
                        <div className="mx-auto mt-4 flex max-w-md items-stretch gap-2">
                            {prevEpisode ? (
                                <Link
                                    href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(prevEpisode.chapterId)}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-slate-700 hover:ring-white/20"
                                    aria-label={`Episode sebelumnya: EP ${prevEpisode.chapterIndex + 1}`}
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    EP {prevEpisode.chapterIndex + 1}
                                </Link>
                            ) : (
                                <div className="flex flex-1 items-center justify-center rounded-lg bg-slate-800/40 px-3 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-white/5">
                                    —
                                </div>
                            )}

                            <div className="flex shrink-0 items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/10">
                                EP {selected.chapterIndex + 1}
                                <span className="ml-1 text-xs font-medium text-slate-500">/ {episodes.length}</span>
                            </div>

                            {nextEpisode ? (
                                <Link
                                    href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(nextEpisode.chapterId)}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-slate-700 hover:ring-white/20"
                                    aria-label={`Episode berikutnya: EP ${nextEpisode.chapterIndex + 1}`}
                                >
                                    EP {nextEpisode.chapterIndex + 1}
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <div className="flex flex-1 items-center justify-center rounded-lg bg-slate-800/40 px-3 py-2.5 text-sm font-medium text-slate-600 ring-1 ring-white/5">
                                    —
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: episode grid + download */}
                    <div className="space-y-5 lg:col-span-5">
                        {/* Episode Grid (scroll bila banyak) */}
                        <div className="rounded-xl bg-slate-800/50 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white">All Episodes</h2>
                                <span className="text-xs text-slate-400">{episodes.length} total</span>
                            </div>

                            <div className="max-h-[44vh] overflow-y-auto pr-1">
                                <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-6 xl:grid-cols-7">
                                    {episodes.map((ep) => {
                                        const isActive = ep.chapterId === selected.chapterId;
                                        return (
                                            <Link
                                                key={ep.chapterId}
                                                href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(ep.chapterId)}`}
                                                className={[
                                                    "flex aspect-square items-center justify-center rounded-md text-xs font-bold transition-all",
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

                        {/* Download Section */}
                        <DownloadButton
                            qualities={downloadQualities}
                            bookName={book.bookName}
                            episodeIndex={selected.chapterIndex}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}