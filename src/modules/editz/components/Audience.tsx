'use client';

import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { EDITZ_DEFAULTS } from '@modules/editz/lib/content-defaults';
import { renderLines } from '@modules/editz/lib/lines';
import type { EditzAudienceContent } from '@lib/validation/product-pages';

export default function Audience({ content }: { content?: EditzAudienceContent } = {}) {
  const section = content ?? EDITZ_DEFAULTS.audience;
  const audiences = section.items;

  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-editz-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <Users className="w-4 h-4 text-editz-red" />
            <span>{section.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-editz-black tracking-tight">
            {renderLines(section.heading, { brClassName: 'hidden sm:inline', spaceBeforeBreak: true })}
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((aud, index) => (
            <motion.div
              key={`${index}-${aud.title}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] bg-black shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] flex flex-col justify-between p-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- admin-editable EDITZ image URL; host may not be in images.remotePatterns */}
              <img
                src={aud.image}
                alt={aud.title}
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              {/* TOP WHITE TAB BADGE */}
              <div className="relative z-10 self-center">
                <span className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-editz-black shadow-xs">
                  {aud.title}
                </span>
              </div>

              {/* BOTTOM TEXT BOX OVERLAY */}
              <div className="relative z-10 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  {aud.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
