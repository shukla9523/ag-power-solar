'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { getEditzSectionFromHref, scrollToEditzSection } from '@modules/editz/lib/scroll';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const section = getEditzSectionFromHref(pathname || '');
    const rawHash = window.location.hash.replace(/^#/, '');
    const target = section || rawHash;
    if (!target) return;

    const frame = requestAnimationFrame(() => {
      scrollToEditzSection(target);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const navLinks = [
    { name: 'Services', target: 'services', href: '/editz/services' },
    { name: 'Benefits', target: 'benefits', href: '/editz/benefits' },
    { name: 'Projects', target: 'projects', href: '/editz/projects' },
    { name: 'Process', target: 'process', href: '/editz/process' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-editz-cream/90 backdrop-blur-md border-b border-black/5 py-4 shadow-xs'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO — CLICK REDIRECTS TO HOMEPAGE */}
        <LocalizedClientLink
          href="/"
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="relative flex items-center justify-center">
            <Image
              src="/logo.webp"
              alt="AG POWER Solar"
              width={36}
              height={36}
              priority
              className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-brand/20"
            />
          </div>
          <span className="flex items-center font-extrabold text-[22px] tracking-[-0.03em] text-navy">
            <span className="text-brand font-black text-[23px] mr-[0.5px]">E</span>
            <span>DITZ</span>
            <span className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        </LocalizedClientLink>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <LocalizedClientLink
              key={link.name}
              href={link.href}
              scroll={false}
              onClick={() => scrollToEditzSection(link.target)}
              className="text-sm font-medium text-editz-body hover:text-black transition-colors duration-200"
            >
              {link.name}
            </LocalizedClientLink>
          ))}
        </nav>

        {/* DESKTOP RIGHT CTA */}
        <div className="hidden md:flex items-center">
          <LocalizedClientLink
            href="/editz/contact"
            scroll={false}
            onClick={() => scrollToEditzSection('contact')}
            className="px-6 py-2.5 rounded-full bg-editz-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Contact Us
          </LocalizedClientLink>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-white border border-black/10 text-black shadow-xs"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-b border-black/10 px-6 py-6 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <LocalizedClientLink
                  key={link.name}
                  href={link.href}
                  scroll={false}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToEditzSection(link.target);
                  }}
                  className="text-base font-semibold text-zinc-800 hover:text-editz-red py-2 border-b border-zinc-100"
                >
                  {link.name}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/editz/contact"
                scroll={false}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToEditzSection('contact');
                }}
                className="mt-2 w-full flex items-center justify-center py-3 rounded-full bg-editz-black text-white font-bold"
              >
                Contact Us
              </LocalizedClientLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
