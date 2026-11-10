'use client';

import { motion } from 'motion/react';
import { Instagram, Youtube, Disc } from 'lucide-react';
import { EDITZ_DEFAULTS } from '@modules/editz/lib/content-defaults';
import type { EditzCtaContent } from '@lib/validation/product-pages';

export default function CTA({ content }: { content?: EditzCtaContent } = {}) {
  const cta = content ?? EDITZ_DEFAULTS.cta;

  return (
    <section id="contact" className="py-12 sm:py-24 lg:py-32 bg-editz-cream relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-white border border-black/8 p-6 sm:p-16 text-center shadow-xl filmstrip-holes bg-grid-pattern overflow-hidden"
        >
          <h2 className="text-4xl sm:text-6xl font-bold text-editz-black tracking-tight leading-none mb-6">
            <span className="text-editz-red">{cta.headingAccent}</span> {cta.heading}
          </h2>

          <p className="text-base sm:text-xl text-ash max-w-xl mx-auto mb-10 font-normal leading-relaxed">
            {cta.description}
          </p>

          <div className="flex justify-center mb-12">
            <a
              href={cta.buttonHref}
              className="px-8 py-4 rounded-full bg-editz-black text-white font-semibold text-base hover:bg-zinc-800 transition-all duration-200 shadow-md"
            >
              {cta.buttonLabel}
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-ash-light">
            <a href={cta.instagramUrl} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-editz-cream hover:text-editz-red transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={cta.youtubeUrl} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-editz-cream hover:text-editz-red transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href={cta.tiktokUrl} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-editz-cream hover:text-editz-red transition-colors">
              <Disc className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
