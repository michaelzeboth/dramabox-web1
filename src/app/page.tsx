import { Suspense } from "react";
import ForYouSection, { ForYouSectionSkeleton } from "@/components/ForYouSection";
import LatestSection, { LatestSectionSkeleton } from "@/components/LatestSection";
import TrendingSection, { TrendingSectionSkeleton } from "@/components/TrendingSection";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Netflix Style */}
        <div className="pb-12 pt-16 sm:pt-20">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Temukan drama favoritmu
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Rekomendasi, trending, dan episode terbaru.
          </p>
        </div>

        {/* Continue Watching */}
        <ContinueWatchingSection />

        {/* Sections */}
        <Suspense fallback={<ForYouSectionSkeleton />}>
          <ForYouSection />
        </Suspense>

        <Suspense fallback={<LatestSectionSkeleton />}>
          <LatestSection />
        </Suspense>

        <Suspense fallback={<TrendingSectionSkeleton />}>
          <TrendingSection />
        </Suspense>

        {/* Bottom Spacing */}
        <div className="h-24" />
      </div>
    </main>
  );
}