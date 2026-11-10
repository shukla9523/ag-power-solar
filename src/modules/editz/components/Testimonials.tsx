'use client';

import { motion } from 'motion/react';
import { MessageSquare, Star, CheckCircle2, TrendingUp } from 'lucide-react';
import { EDITZ_DEFAULTS } from '@modules/editz/lib/content-defaults';
import { renderLines } from '@modules/editz/lib/lines';
import type { EditzTestimonialsContent } from '@lib/validation/product-pages';

export default function Testimonials({ content }: { content?: EditzTestimonialsContent } = {}) {
  const section = content ?? EDITZ_DEFAULTS.testimonials;

  return (
    <section className="py-12 sm:py-24 lg:py-32 bg-editz-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <MessageSquare className="w-4 h-4 text-editz-red" />
            <span>{section.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-editz-black tracking-tight">
            {renderLines(section.heading)}
          </h2>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {section.items.map((testimonial, index) => (
            <motion.div
              key={`${index}-${testimonial.author}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl bg-white border border-black/[0.08] p-7 sm:p-8 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div>
                {/* Rating & Metric Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 text-editz-red">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-editz-red" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-tint-2 text-editz-red">
                    <TrendingUp className="w-3 h-3" />
                    {testimonial.metric}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-editz-quote text-base leading-relaxed mb-8 font-normal">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-black/5">
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-editable EDITZ image URL; host may not be in images.remotePatterns */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border border-black/10"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-white absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-editz-black leading-tight">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs text-ash-light font-medium pt-0.5">
                    {testimonial.role} • <span className="text-zinc-500 font-semibold">{testimonial.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
