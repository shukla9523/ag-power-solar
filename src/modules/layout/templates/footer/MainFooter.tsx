/**
 * Purpose: AG POWER main site footer (Deep Forest Green theme).
 */
import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AgPowerLogo from "@modules/common/components/brand/AgPowerLogo"
import { SunMedium, Phone, Mail, MapPin, ArrowRight } from "lucide-react"
import {
  solarSolutionsLinks,
  companyLinks,
  solarGuideLinks,
  popularSearches,
  popularSearchList,
  seoContent,
} from "./footer-data"
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./FooterIcons"

export default function MainFooter({
  homeFaqs,
}: {
  homeFaqs?: { question: string; answer: string }[]
}) {
  return (
    <footer className="relative border-t border-forest bg-forest text-ivory">
      {/* Top Banner CTA */}
      <div className="border-b border-white/10 bg-forest-deep">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-forest">
              <SunMedium className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-manrope text-[18px] font-bold text-white">
                Ready to cut your electricity bill by up to 90%?
              </h3>
              <p className="text-[13px] font-medium text-[var(--footer-text)]/90">
                Get a customized rooftop assessment & ROI calculation today.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <LocalizedClientLink
              href="/calculator"
              className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center rounded-xl bg-white hover:bg-slate-100 px-6 py-2.5 font-inter text-[14px] font-bold text-slate-900 shadow-sm transition-all text-center"
            >
              Calculate Savings
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="btn-primary w-full sm:w-auto text-center"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand Col */}
          <div className="lg:col-span-2">
            <LocalizedClientLink href="/" className="inline-flex items-center">
              <AgPowerLogo variant="dark" size="lg" />
            </LocalizedClientLink>

            <p className="mt-4 max-w-sm text-[14px] font-medium leading-relaxed text-[var(--footer-text)]">
              AG POWER by Electro Global delivers high-performance rooftop solar solutions for residences, businesses, and housing societies. Engineered for reliability, built for clean energy independence.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-[13px] font-medium text-[var(--footer-text)]">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="tel:+919523467849" className="hover:text-[var(--footer-link-hover)] transition-colors">
                  +91 95234 67849
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <a href="mailto:akashshukla9523@gmail.com" className="hover:text-[var(--footer-link-hover)] transition-colors">
                  akashshukla9523@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>Electro Global, Corporate Office, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-gold hover:text-forest"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-gold hover:text-forest"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-gold hover:text-forest"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Solutions Col */}
          <div>
            <h4 className="font-manrope text-[15px] font-bold uppercase tracking-wider text-gold">
              Solar Solutions
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
              {solarSolutionsLinks.map((item) => (
                <li key={item.name}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-[var(--footer-text)] font-medium transition-colors hover:text-[var(--footer-link-hover)]"
                  >
                    {item.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides & Resources Col */}
          <div>
            <h4 className="font-manrope text-[15px] font-bold uppercase tracking-wider text-gold">
              Solar Guides
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
              {solarGuideLinks.map((item) => (
                <li key={item.name}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-[var(--footer-text)] font-medium transition-colors hover:text-[var(--footer-link-hover)]"
                  >
                    {item.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="font-manrope text-[15px] font-bold uppercase tracking-wider text-gold">
              Company
            </h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-[14px]">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <LocalizedClientLink
                    href={item.href}
                    className="text-[var(--footer-text)] font-medium transition-colors hover:text-[var(--footer-link-hover)]"
                  >
                    {item.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* SEO Statement & Popular Searches */}
        <div className="mt-12 border-t border-white/10 pt-8 text-[14px] leading-relaxed text-[var(--footer-text)] font-medium">
          <p>{seoContent}</p>
          <div className="mt-4 text-[14px] leading-[1.7] text-[var(--footer-text)] font-medium">
            <span className="font-semibold text-[var(--footer-text)]">Popular Searches: </span>
            {popularSearchList.map((item, idx) => (
              <React.Fragment key={item.name}>
                <LocalizedClientLink
                  href={item.href}
                  className="text-[var(--footer-text)] font-medium transition-colors hover:text-[var(--footer-link-hover)]"
                >
                  {item.name}
                </LocalizedClientLink>
                {idx < popularSearchList.length - 1 && (
                  <span className="text-[var(--footer-text)] mx-2 select-none">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] font-medium text-[var(--footer-text)] sm:flex-row">
          <p>© {new Date().getFullYear()} AG POWER (Electro Global). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <LocalizedClientLink href="/privacy-policy" className="text-[var(--footer-text)] font-medium hover:text-[var(--footer-link-hover)] transition-colors">
              Privacy Policy
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms-and-conditions" className="text-[var(--footer-text)] font-medium hover:text-[var(--footer-link-hover)] transition-colors">
              Terms of Service
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="text-[var(--footer-text)] font-medium hover:text-[var(--footer-link-hover)] transition-colors">
              Support
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
