'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { FAQS } from '@modules/editz/lib/data';

export default function FAQ({ items }: { items?: { question: string; answer: string }[] }) {
  // Same list the page's FAQPage schema uses (passed from the server page).
  const faqs = items && items.length ? items : FAQS;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Every answer is rendered on the server (so the visible HTML matches the FAQPage schema);
  // closed answers are collapsed to height 0 and hidden from assistive tech.
  return (
    <section id="faq" className="py-12 sm:py-24 lg:py-32 bg-editz-cream relative overflow-hidden border-t border-black/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="section-badge mb-4">
            <HelpCircle className="w-4 h-4 text-editz-red" />
            <span>FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-editz-black tracking-tight">
            Got questions?
          </h2>
        </div>

        {/* ACCORDION */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl bg-white border border-black/7 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`editz-faq-answer-${index}`}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-lg font-bold text-editz-black">
                    {faq.question}
                  </span>
                  <div
                    className={`p-2 rounded-full transition-colors ${
                      isOpen ? 'bg-editz-red text-white' : 'bg-smoke-2 text-editz-black'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <motion.div
                  id={`editz-faq-answer-${index}`}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={isOpen ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-7 text-sm text-ash leading-relaxed border-t border-black/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
