/**
 * Purpose: the main site footer (server component). Interactive pieces are small client
 * components: FooterAccordion / MobileQuickLinks (mobile accordions), HomepageOnly (shows the FAQ
 * block on "/" only) and FooterFaqSection. Markup and classes are unchanged from the former client
 * footer.
 */
import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { epilogue, outfit } from "@lib/fonts"
import FooterFaqSection from "./FooterFaqSection"
import { FooterAccordion, MobileQuickLinks } from "./FooterAccordion"
import { HomepageOnly } from "./FooterSwitch"
import {
  articleLinks,
  companyLinks,
  performanceServices,
  popularSearches,
  seoContent,
  webAiServices,
} from "./footer-data"
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./FooterIcons"

export default function MainFooter({
  homeFaqs,
}: {
  homeFaqs?: { question: string; answer: string }[]
}) {
  return (
    <footer className="relative border-t border-slate-100 bg-white">
      {/* ── Homepage Footer FAQ Section ── */}
      <HomepageOnly>
        <FooterFaqSection customFaqs={homeFaqs} />
      </HomepageOnly>

      <style>{`
        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          color: #64748b;
          text-decoration: none;
          transition:
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.25s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.2s ease,
            background 0.2s ease;
        }
        .footer-social-btn.instagram:hover {
          border-color: transparent;
          color: white;
          background: linear-gradient(135deg, #f58529 0%, #dd2a7b 50%, #8134af 100%);
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(221,42,123,0.3);
        }
        .footer-social-btn.linkedin:hover {
          border-color: transparent;
          color: white;
          background: #0077b5;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(0,119,181,0.3);
        }
        .footer-social-btn.facebook:hover {
          border-color: transparent;
          color: white;
          background: #1877f2;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(24,119,242,0.3);
        }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px] py-10 lg:py-16">

          {/* ── MOBILE LAYOUT ── (unchanged) */}
          <div className="lg:hidden">

            <LocalizedClientLink href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="Mommantum Logo"
                width={36}
                height={36}
                className="h-[36px] w-[36px] flex-shrink-0 object-contain"
              />
              <span className={`${epilogue.className} flex items-center text-[18px] font-extrabold leading-none tracking-[-0.04em] text-navy`}>
                mommantum
                <span
                  className="ml-[2px] inline-block rounded-full bg-brand"
                  style={{ width: 4, height: 4, verticalAlign: "super", flexShrink: 0 }}
                />
              </span>
            </LocalizedClientLink>

            <p className={`${outfit.className} mt-2 text-[13px] text-slate-400`}>
              Growth studio for D2C brands.
            </p>

            <div className="mt-5 rounded-[14px] border border-slate-100 bg-snow p-5">
              <p className={`${epilogue.className} text-[16px] font-extrabold tracking-[-0.03em] text-navy`}>
                Ready to grow?
              </p>
              <p className={`${outfit.className} mt-1.5 text-[13px] leading-[1.7] text-slate-500`}>
                Free strategy call. We tell you exactly what to fix first.
              </p>
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] items-center justify-center gap-1.5 rounded-[10px] bg-brand px-6 text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-white transition-all hover:bg-brand-hover`}
              >
                Let&apos;s Make It Happen
              </LocalizedClientLink>
            </div>

            <div className="mt-4">
              <MobileQuickLinks links={companyLinks} />
            </div>

            <FooterAccordion title="Performance Marketing">
              <div className="flex flex-col gap-3">
                {performanceServices.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-brand`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="Web & AI">
              <div className="flex flex-col gap-3">
                {webAiServices.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-accent-purple`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="Articles">
              <div className="flex flex-col gap-4">
                {articleLinks.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} block text-[13.5px] leading-[1.65] text-slate-600 transition-colors hover:text-navy`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <div className="mt-6 flex items-center gap-3">
              <Link href="https://www.instagram.com/mommantumeditz/"
                target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="footer-social-btn instagram">
                <InstagramIcon />
              </Link>
              <Link href="https://www.linkedin.com/company/mommantum-media/"
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="footer-social-btn linkedin">
                <LinkedInIcon />
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=61594685770172"
                target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="footer-social-btn facebook">
                <FacebookIcon />
              </Link>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden lg:grid lg:grid-cols-[240px_160px_1fr_1fr_1fr] lg:gap-x-10 xl:gap-x-14 lg:items-start">

            {/* ── Col 1: Brand + CTA + Socials ── */}
            <div className="flex flex-col">
              {/* Logo */}
              <LocalizedClientLink href="/" className="inline-flex items-center gap-2.5">
                <Image
                  src="/logo.webp"
                  alt="Mommantum Logo"
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] flex-shrink-0 object-contain"
                />
                <span className={`${epilogue.className} flex items-center text-[19px] font-extrabold leading-none tracking-[-0.04em] text-navy`}>
                  mommantum
                  <span
                    className="ml-[2px] inline-block rounded-full bg-brand"
                    style={{ width: 5, height: 5, verticalAlign: "super", flexShrink: 0 }}
                  />
                </span>
              </LocalizedClientLink>

              {/* Tagline */}
              <p className={`${outfit.className} mt-3 text-[13px] leading-relaxed text-slate-400`}>
                Growth studio for D2C brands.
              </p>

              {/* Divider */}
              <div className="my-5 h-px w-full bg-slate-100" />

              {/* CTA block */}
              <p className={`${epilogue.className} text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Let&apos;s Work
              </p>
              <h3 className={`${epilogue.className} mt-3 text-[17px] font-extrabold leading-snug tracking-[-0.03em] text-navy`}>
                Ready to grow your brand?
              </h3>
              <p className={`${outfit.className} mt-2 text-[13px] leading-[1.75] text-slate-500`}>
                Free strategy call. We tell you exactly what to fix first.
              </p>
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-white transition-all duration-200 hover:bg-brand-hover hover:shadow-md`}
              >
                Let&apos;s Make It Happen
              </LocalizedClientLink>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-[5px] w-[5px] rounded-full bg-accent-mint" />
                <p className={`${outfit.className} text-[12px] text-slate-400`}>
                  No commitment. Just clarity.
                </p>
              </div>

              {/* Socials */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="https://www.instagram.com/mommantumeditz/"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="footer-social-btn instagram"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/mommantum-media/"
                  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="footer-social-btn linkedin"
                >
                  <LinkedInIcon />
                </Link>
                <Link
                  href="https://www.facebook.com/profile.php?id=61594685770172"
                  target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="footer-social-btn facebook"
                >
                  <FacebookIcon />
                </Link>
              </div>
            </div>

            {/* ── Col 2: Quick Links ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Quick Links
              </p>
              <div className="flex flex-col gap-3">
                {companyLinks.map((item) => (
                  <LocalizedClientLink
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-brand`}
                  >
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>

            {/* ── Col 3: Performance Marketing ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Performance Marketing
              </p>
              <div className="flex flex-col gap-3">
                {performanceServices.map((item) => (
                  <LocalizedClientLink
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors duration-200 hover:text-brand`}
                  >
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>

            {/* ── Col 4: Web & AI ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Web & AI
              </p>
              <div className="flex flex-col gap-3">
                {webAiServices.map((item) => (
                  <LocalizedClientLink
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors duration-200 hover:text-accent-purple`}
                  >
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>

            {/* ── Col 5: Articles ── */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                Articles
              </p>
              <div className="flex flex-col gap-4">
                {articleLinks.map((item) => (
                  <LocalizedClientLink
                    key={item.name}
                    href={item.href}
                    className={`${outfit.className} block text-[13.5px] leading-[1.65] text-slate-600 transition-colors duration-200 hover:text-navy`}
                  >
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100 bg-snow">
        <div className="content-container px-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-2.5 py-4 md:flex-row md:items-center md:justify-between">
            <p className={`${outfit.className} text-[12px] text-slate-400`}>
              © 2026 Mommantum. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <LocalizedClientLink href="/privacy-policy" className={`${outfit.className} text-[12px] text-slate-400 hover:text-navy transition-colors`}>
                Privacy Policy
              </LocalizedClientLink>
              <LocalizedClientLink href="/terms-and-conditions" className={`${outfit.className} text-[12px] text-slate-400 hover:text-navy transition-colors`}>
                Terms & Conditions
              </LocalizedClientLink>
              <LocalizedClientLink href="/contact" className={`${outfit.className} text-[12px] text-slate-400 hover:text-navy transition-colors`}>
                Contact
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden SEO block */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", width: "1px", height: "1px",
          padding: 0, margin: "-1px", overflow: "hidden",
          clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
        }}
      >
        <h2>Popular Searches</h2>
        <p>{popularSearches}</p>
        <h2>Growth Studio for D2C Brands</h2>
        <p>{seoContent}</p>
      </div>

    </footer>
  )
}
