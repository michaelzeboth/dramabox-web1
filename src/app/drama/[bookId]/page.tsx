import Image from "next/image";
import Link from "next/link";
import { getDetail } from "@/lib/dramabox";

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
    );
}

export default async function DramaDetailPage({
    params,
}: {
    params: Promise<{ bookId: string }>;
}) {
    const { bookId } = await params;

    let detail;
    try {
        detail = await getDetail(bookId);
    } catch (e: any) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali
                    </Link>

                    <div className="mt-6 rounded-lg border border-rose-800 bg-rose-900/20 p-6 text-sm text-rose-400">
                        Gagal memuat detail drama.
                        <div className="mt-2 break-words text-xs text-rose-500">
                            {e?.message || "Unknown error"}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!detail) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
                        <h1 className="text-xl font-bold text-white">Detail belum tersedia</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            API sedang mengembalikan status "buku tidak ditemukan" untuk ID ini.
                            Coba refresh beberapa saat lagi.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={`/drama/${bookId}`}
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
    const chapters = detail.data.chapterList || [];
    const recommends = detail.data.recommends || [];
    const firstPlayable = chapters[0];

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

                {/* Main Content */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Poster - Sticky */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8">
                            <div className="overflow-hidden rounded-xl bg-slate-800 shadow-2xl ring-1 ring-white/10">
                                <div className="relative aspect-[3/4] w-full bg-slate-700">
                                    <Image
                                        src={book.cover}
                                        alt={book.bookName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Play Button - Below Poster */}
                            {firstPlayable ? (
                                <Link
                                    href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(
                                        firstPlayable.id
                                    )}`}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-slate-900 shadow-xl transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
                                >
                                    <PlayIcon className="h-5 w-5" />
                                    Tonton Sekarang
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    {/* Info & Episodes */}
                    <div className="lg:col-span-8">
                        {/* Title & Meta */}
                        <div>
                            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                                {book.bookName}
                            </h1>

                            {/* Stats */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    {Number(book.viewCount || 0).toLocaleString()}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {Number(book.followCount || 0).toLocaleString()}
                                </span>
                                {book.chapterCount ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-300 ring-1 ring-white/10">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                        {book.chapterCount} Episode
                                    </span>
                                ) : null}
                            </div>

                            {/* Description */}
                            {book.introduction ? (
                                <p className="mt-6 text-base leading-relaxed text-slate-300">
                                    {book.introduction}
                                </p>
                            ) : null}

                            {/* Tags/Genres */}
                            {(book.typeTwoNames || book.tags || []).length > 0 ? (
                                <div className="mt-6">
                                    <h3 className="text-sm font-semibold text-slate-400">Genres</h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(book.typeTwoNames || book.tags || []).slice(0, 10).map((t: string) => (
                                            <span
                                                key={t}
                                                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 ring-1 ring-white/10"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Episodes Section */}
                        <div className="mt-10">
                            <div className="flex items-end justify-between">
                                <h2 className="text-2xl font-bold text-white">Episodes</h2>
                                <span className="text-sm font-medium text-slate-400">
                                    {chapters.length} total
                                </span>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                                {chapters.map((c) => (
                                    <Link
                                        key={c.id}
                                        href={`/watch/${encodeURIComponent(book.bookId)}?chapterId=${encodeURIComponent(c.id)}`}
                                        className="group overflow-hidden rounded-lg bg-slate-800 p-3 shadow-xl ring-1 ring-white/10 transition-all hover:-translate-y-1 hover:bg-slate-700 hover:shadow-2xl hover:ring-white/20"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-white">
                                                {c.index + 1}
                                            </span>
                                            <PlayIcon className="h-3 w-3 text-slate-400 transition-colors group-hover:text-white" />
                                        </div>
                                        {c.utime ? (
                                            <div className="mt-1 text-xs text-slate-500">
                                                {c.utime}
                                            </div>
                                        ) : null}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations */}
                        {recommends.length > 0 ? (
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold text-white">Rekomendasi</h2>

                                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                                    {recommends.slice(0, 8).map((r) => (
                                        <Link
                                            key={r.bookId}
                                            href={`/drama/${encodeURIComponent(r.bookId)}`}
                                            className="group overflow-hidden rounded-lg bg-slate-800 shadow-xl ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-white/20"
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden bg-slate-700">
                                                <Image
                                                    src={r.cover}
                                                    alt={r.bookName}
                                                    fill
                                                    className="object-cover transition duration-500 group-hover:scale-110"
                                                    sizes="(max-width: 640px) 50vw, 25vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                <div className="absolute inset-x-0 bottom-0 p-3">
                                                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-white">
                                                        {r.bookName}
                                                    </h3>
                                                    {r.chapterCount ? (
                                                        <p className="mt-1 text-xs text-slate-300">
                                                            {r.chapterCount} episodes
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
}