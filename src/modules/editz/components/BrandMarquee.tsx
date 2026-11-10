'use client';

import { EDITZ_DEFAULTS } from '@modules/editz/lib/content-defaults';
import type { EditzBrandsContent } from '@lib/validation/product-pages';

export default function BrandMarquee({ content }: { content?: EditzBrandsContent } = {}) {
  const section = content ?? EDITZ_DEFAULTS.brands;
  const brandLogos = section.logos;

  const brands = [...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="py-6 sm:py-14 bg-editz-cream overflow-hidden">
      <style jsx>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8 text-center">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-black/40">
          {section.heading}
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="marquee-track items-center gap-12 sm:gap-20">
          {brands.map((brand, idx) => (
            <div key={idx} className="flex items-center justify-center h-12 px-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-editable logo URL rendered at intrinsic width (w-auto); next/image needs fixed dimensions */}
              <img
                src={brand.src}
                alt={brand.name}
                className="h-9 sm:h-11 w-auto max-w-[140px] object-contain mix-blend-multiply"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
