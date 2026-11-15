'use client';

import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { scrollToEditzSection } from '@modules/editz/lib/scroll';

export default function Footer() {
  return (
    <footer className="bg-editz-cream border-t border-black/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-black/8">
          <div>
            <LocalizedClientLink href="/" className="group inline-flex items-center gap-2.5 mb-3 transition-transform duration-200 hover:scale-[1.02]">
              <div className="relative flex items-center justify-center">
                <Image
                  src="/mommantum_logo.webp"
                  alt="MOMMANTUM"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-pink-500/20"
                />
              </div>
              <span className="flex items-center font-extrabold text-[22px] tracking-[-0.03em] text-navy">
                <span className="text-brand font-black text-[23px] mr-[0.5px]">E</span>
                <span>DITZ</span>
                <span className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
            </LocalizedClientLink>
            <p className="text-sm text-ash-light max-w-sm">
              Creating performance-driven video content for creators and growing brands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <LocalizedClientLink
              href="/editz/contact"
              scroll={false}
              onClick={() => scrollToEditzSection('contact')}
              className="px-6 py-2.5 rounded-full bg-brand text-white text-sm font-extrabold uppercase hover:bg-brand-hover transition-colors shadow-md"
            >
              Contact Us
            </LocalizedClientLink>

            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/mommantumeditz/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-editz-black hover:text-brand hover:border-brand transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594685770172"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-editz-black hover:text-social-facebook hover:border-social-facebook transition-colors shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-editz-muted">
          <div>© 2026 MOMMANTUM EDITZ. All Rights Reserved.</div>
          <div>Email: <a href="mailto:akashshukla9523@gmail.com" className="font-semibold text-editz-black hover:underline">akashshukla9523@gmail.com</a></div>
        </div>
      </div>
    </footer>
  );
}
