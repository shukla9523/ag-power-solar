'use client';

import { useState } from 'react';
import FilmstripBackground from './FilmstripBackground';
import LazyVideo from './LazyVideo';
import { EDITZ_DEFAULTS } from '@modules/editz/lib/content-defaults';
import { renderLines } from '@modules/editz/lib/lines';
import {
  getEditzSectionFromHref,
  normalizeEditzHref,
  scrollToEditzSection,
} from '@modules/editz/lib/scroll';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import type { EditzHeroContent } from '@lib/validation/product-pages';

export default function Hero({
  content,
  marqueeItems,
}: {
  content?: EditzHeroContent;
  marqueeItems?: string[];
} = {}) {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const hero = content ?? EDITZ_DEFAULTS.hero;
  const tickerItems = marqueeItems ?? EDITZ_DEFAULTS.marquee.items;
  const resolvedCtaHref = normalizeEditzHref(hero.ctaHref);
  const ctaSection = getEditzSectionFromHref(resolvedCtaHref);

  const heroVideos = hero.videos.map((video, idx) => ({ id: String(idx + 1), ...video }));

  return (
    <section className="relative pt-20 pb-8 sm:pt-28 md:pt-36 sm:pb-16 bg-white overflow-hidden">
      {/* SCOPED RESPONSIVE CARD TRANSFORMS */}
      <style>{`
        @media (max-width: 639px) {
          .hero-v-card-0 { transform: rotate(-3deg) !important; }
          .hero-v-card-1 { transform: rotate(3deg) !important; }
          .hero-v-card-2 { transform: rotate(-2deg) !important; }
        }
        @media (min-width: 640px) {
          .hero-v-card-0 { transform: rotate(-5deg) skewY(8deg) !important; }
          .hero-v-card-1 { transform: none !important; }
          .hero-v-card-2 { transform: rotate(5deg) skewY(-8deg) !important; }
        }
      `}</style>

      {/* EXACT ANGLED FILMSTRIP & DOT GRID BACKGROUND */}
      <FilmstripBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* STATUS BADGE */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-editz-body">
            <span className="w-2 h-2 rounded-full bg-editz-live animate-pulse" />
            <span>{hero.badge}</span>
          </div>
        </div>

        {/* HEADLINE */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-editz-black leading-[1.1]">
            <span className="text-editz-red">{hero.headlineAccent}</span>{' '}
            {renderLines(hero.headline, { brClassName: 'hidden sm:block', spaceBeforeBreak: true })}
          </h1>
        </div>

        {/* SUBTITLE */}
        <p className="mt-5 text-base text-ash max-w-xl mx-auto text-center font-semibold leading-relaxed">
          {hero.subtitle}
        </p>

        {/* CTA BUTTON */}
        <div className="mt-8 flex justify-center">
          {resolvedCtaHref.startsWith('/') ? (
            <LocalizedClientLink
              href={resolvedCtaHref}
              scroll={!ctaSection}
              onClick={ctaSection ? () => scrollToEditzSection(ctaSection) : undefined}
              className="px-7 py-3 rounded-full bg-editz-black text-white font-semibold text-sm hover:bg-zinc-800 transition-all duration-200"
            >
              {hero.ctaLabel}
            </LocalizedClientLink>
          ) : (
            <a
              href={resolvedCtaHref}
              className="px-7 py-3 rounded-full bg-editz-black text-white font-semibold text-sm hover:bg-zinc-800 transition-all duration-200"
            >
              {hero.ctaLabel}
            </a>
          )}
        </div>

        {/* HERO VIDEO CARDS (STACKED ONE-BY-ONE ON MOBILE, TILTED ROW ON DESKTOP) */}
        <div className="mt-8 sm:mt-16 relative max-w-4xl mx-auto">
          {/* VIDEO CARDS CONTAINER */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-center gap-8 sm:gap-6 px-4">
            {heroVideos.map((video, idx) => (
              <div
                key={video.id}
                onClick={() => setActiveVideoModal(video.videoUrl)}
                className={`hero-v-card-${idx} relative w-full max-w-[300px] aspect-[9/16] sm:aspect-auto sm:w-auto sm:flex-1 sm:h-[460px] md:h-[510px] sm:max-w-[260px] rounded-[32px] sm:rounded-b-none sm:rounded-t-[24px] bg-white p-2.5 sm:p-1 shadow-[0_20px_50px_rgba(0,0,0,0.18)] cursor-pointer transition-all duration-300 ${
                  idx === 1 ? 'z-10' : 'z-20'
                }`}
              >
                <div className="w-full h-full rounded-[24px] sm:rounded-b-none sm:rounded-t-[20px] overflow-hidden relative shadow-inner">
                  <LazyVideo
                    src={video.videoUrl}
                    poster={video.image}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* MARQUEE TICKER — ROUNDED PILL OVERLAPPING ON TOP OF CARDS */}
          <div className="relative z-30 mt-8 sm:-mt-8 border border-black/[0.08] py-3.5 bg-white overflow-hidden rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="flex overflow-x-hidden group">
              <div className="flex animate-marquee whitespace-nowrap items-center group-hover:[animation-play-state:paused]">
                {(() => {
                  const safeItems = tickerItems || [];
                  const marqueeList = [...safeItems, ...safeItems, ...safeItems];
                  return marqueeList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-5 mx-3">
                      <span className="text-xs font-semibold text-editz-black">{item}</span>
                      <span className="text-editz-red text-[10px]">•</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCAL VIDEO MODAL IF CLICKED */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative w-full max-w-xl aspect-[9/16] max-h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full h-full object-cover"
              src={activeVideoModal}
              controls
              autoPlay
              playsInline
            />
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:bg-editz-red transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

