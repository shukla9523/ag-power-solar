/**
 * Purpose: AG POWER main site footer (Deep Forest Green theme).
 */
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, Phone, Mail, MapPin, ArrowRight, ShieldCheck } from "lucide-react"
import {
  solarSolutionsLinks,
  companyLinks,
  solarGuideLinks,
  popularSearches,
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
              <p className="text-[13px] text-sage">
                Get a customized rooftop assessment & ROI calculation today.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LocalizedClientLink
              href="/calculator"
              className="inline-flex items-center justify-center rounded-xl border border-gold px-5 py-2.5 font-inter text-[14px] font-semibold text-gold transition-colors hover:bg-gold hover:text-forest"
            >
              Calculate Savings
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 font-inter text-[14px] font-bold text-forest shadow-sm transition-all hover:bg-gold-hover"
            >
              Get Free Consultation
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

          {/* Brand Col */}
          <div className="lg:col-span-2">
            <LocalizedClientLink href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold">
                <SunMedium className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-manrope text-[22px] font-extrabold tracking-tight text-white">
                  AG POWER
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sage">
                  Clean Energy. Smarter Living.
                </span>
              </div>
            </LocalizedClientLink>

            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-sage-mist/80">
              AG POWER by Electro Global delivers high-performance rooftop solar solutions for residences, businesses, and housing societies. Engineered for reliability, built for clean energy independence.
            </p>

            <div className="mt-5 flex flex-col gap-2 text-[13px] text-sage-mist/90">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gold" />
                <a href="tel:+919523467849" className="hover:text-gold transition-colors">
                  +91 95234 67849
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:akashshukla9523@gmail.com" className="hover:text-gold transition-colors">
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
                    className="text-sage-mist/80 transition-colors hover:text-gold"
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
                    className="text-sage-mist/80 transition-colors hover:text-gold"
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
                    className="text-sage-mist/80 transition-colors hover:text-gold"
                  >
                    {item.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* SEO Statement */}
        <div className="mt-12 border-t border-white/10 pt-8 text-[12px] leading-relaxed text-sage/80">
          <p>{seoContent}</p>
          <div className="mt-3 text-[11px] text-sage/60">
            <span className="font-semibold text-sage">Popular Searches: </span>
            {popularSearches}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-sage sm:flex-row">
          <p>© {new Date().getFullYear()} AG POWER (Electro Global). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <LocalizedClientLink href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </LocalizedClientLink>
            <LocalizedClientLink href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Service
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="hover:text-white transition-colors">
              Support
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
