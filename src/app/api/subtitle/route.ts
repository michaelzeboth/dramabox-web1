import { NextRequest, NextResponse } from "next/server";

// Proxy + konverter: HTML5 <track> hanya menerima WebVTT, sedangkan upstream
// menyajikan SRT. Plus CDN upstream kemungkinan CORS-restricted, jadi kita
// fetch & re-serve dari same-origin agar bisa dipakai sebagai track src.
export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
        return new NextResponse("missing url", { status: 400 });
    }

    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return new NextResponse("invalid url", { status: 400 });
    }

    // Hanya izinkan host upstream dramabox untuk mencegah open-proxy abuse.
    if (!parsed.hostname.endsWith(".dramaboxdb.com")) {
        return new NextResponse("forbidden host", { status: 403 });
    }

    let upstream: Response;
    try {
        upstream = await fetch(parsed.toString(), { cache: "force-cache" });
    } catch {
        return new NextResponse("fetch failed", { status: 502 });
    }

    if (!upstream.ok) {
        return new NextResponse("upstream error", { status: 502 });
    }

    let text = await upstream.text();
    // Strip UTF-8 BOM kalau ada
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    // Konversi SRT → VTT: tambah header + ganti `,` di milidetik jadi `.`
    const vtt =
        "WEBVTT\n\n" +
        text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");

    return new NextResponse(vtt, {
        headers: {
            "content-type": "text/vtt; charset=utf-8",
            "cache-control": "public, max-age=86400, immutable",
        },
    });
}
