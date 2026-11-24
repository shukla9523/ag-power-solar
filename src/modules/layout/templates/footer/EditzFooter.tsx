/**
 * Purpose: footer shown on EDITZ routes (server component). Only the mobile accordions are client
 * code (FooterAccordion). Markup and classes are unchanged from the former client footer.
 */
import Image from "next/image"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { epilogue, outfit } from "@lib/fonts"
import { FooterAccordion } from "./FooterAccordion"
import { editzAiVideo, editzQuickLinks, editzVideoEditing } from "./footer-data"
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./FooterIcons"

export default function EditzFooter() {
  return (
    <footer className="relative border-t border-slate-100 bg-white">
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
        .footer-social-btn.youtube:hover {
          border-color: transparent;
          color: white;
          background: #ff0000;
          transform: translateY(-3px) scale(1.08);
          box-shadow: 0 8px 20px rgba(255,0,0,0.3);
        }
      `}</style>

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1320px] py-10 lg:py-16">

          {/* Mobile View */}
          <div className="lg:hidden">
            <LocalizedClientLink href="/editz" className="inline-flex items-center gap-2.5">
              <Image
                src="/logo.webp"
                alt="AG POWER Solar Editz Logo"
                width={36}
                height={36}
                className="h-[36px] w-[36px] flex-shrink-0 object-contain"
              />
              <span className={`${epilogue.className} flex items-center text-[18px] font-extrabold leading-none tracking-[-0.04em] text-navy`}>
                AG POWER Editz
                <span
                  className="ml-[2px] inline-block rounded-full bg-brand"
                  style={{ width: 4, height: 4, verticalAlign: "super", flexShrink: 0 }}
                />
              </span>
            </LocalizedClientLink>

            <p className={`${outfit.className} mt-2 text-[13px] leading-relaxed text-slate-500`}>
              Video Editing + AI Video Creation{" "}<br />for Brands, Founders & Creators.
            </p>

            <div className="mt-5 rounded-[14px] border border-slate-100 bg-snow p-5">
              <p className={`${epilogue.className} text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                LET&apos;S WORK
              </p>
              <h3 className={`${epilogue.className} mt-2 text-[16px] font-extrabold tracking-[-0.03em] text-navy`}>
                Ready to create better content?
              </h3>
              <p className={`${outfit.className} mt-1.5 text-[13px] leading-[1.7] text-slate-500`}>
                Send us your footage or idea.{" "}<br />
                We&apos;ll turn it into content ready to publish.
              </p>
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] items-center justify-center gap-1.5 rounded-[10px] bg-brand px-6 text-[11.5px] font-extrabold uppercase tracking-[0.07em] text-white transition-all hover:bg-brand-hover`}
              >
                START YOUR PROJECT
              </LocalizedClientLink>
              <p className={`${outfit.className} mt-3 text-[12px] text-slate-400`}>
                • No commitment. Just a quick conversation.
              </p>
            </div>

            <FooterAccordion title="QUICK LINKS">
              <div className="flex flex-col gap-3">
                {editzQuickLinks.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-brand`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="VIDEO EDITING">
              <div className="flex flex-col gap-3">
                {editzVideoEditing.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-brand`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <FooterAccordion title="AI VIDEO">
              <div className="flex flex-col gap-3">
                {editzAiVideo.map((item) => (
                  <LocalizedClientLink key={item.name} href={item.href}
                    className={`${outfit.className} text-[13.5px] font-medium leading-snug text-slate-600 transition-colors hover:text-accent-purple`}>
                    {item.name}
                  </LocalizedClientLink>
                ))}
              </div>
            </FooterAccordion>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className={`${epilogue.className} mb-3 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                FOLLOW US
              </p>
              <div className="flex items-center gap-3">
                <Link href="https://www.instagram.com/mommantumeditz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-btn instagram">
                  <InstagramIcon />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61594685770172" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-btn facebook">
                  <FacebookIcon />
                </Link>
                <Link href="https://www.linkedin.com/company/mommantum-media/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-btn linkedin">
                  <LinkedInIcon />
                </Link>
              </div>
            </div>

          </div>

          {/* Desktop View */}
          <div className="hidden lg:grid lg:grid-cols-[260px_160px_180px_180px_1fr] lg:gap-x-10 xl:gap-x-14 lg:items-start">

            {/* Brand + Let's Work */}
            <div className="flex flex-col">
              <LocalizedClientLink href="/editz" className="inline-flex items-center gap-2.5">
                <Image
                  src="/logo.webp"
                  alt="AG POWER Solar Editz Logo"
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] flex-shrink-0 object-contain"
                />
                <span className={`${epilogue.className} flex items-center text-[19px] font-extrabold leading-none tracking-[-0.04em] text-navy`}>
                  AG POWER Editz
                  <span
                    className="ml-[2px] inline-block rounded-full bg-brand"
                    style={{ width: 5, height: 5, verticalAlign: "super", flexShrink: 0 }}
                  />
                </span>
              </LocalizedClientLink>

              <p className={`${outfit.className} mt-3 text-[13px] leading-relaxed text-slate-500`}>
                Video Editing + AI Video Creation{" "}<br />for Brands, Founders & Creators.
              </p>

              <div className="my-5 h-px w-full bg-slate-100" />

              <p className={`${epilogue.className} text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                LET&apos;S WORK
              </p>
              <h3 className={`${epilogue.className} mt-3 text-[17px] font-extrabold leading-snug tracking-[-0.03em] text-navy`}>
                Ready to create better content?
              </h3>
              <p className={`${outfit.className} mt-2 text-[13px] leading-[1.75] text-slate-500`}>
                Send us your footage or idea.{" "}<br />
                We&apos;ll turn it into content ready to publish.
              </p>
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} mt-4 inline-flex h-[40px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand px-5 text-[11px] font-extrabold uppercase tracking-[0.07em] text-white transition-all duration-200 hover:bg-brand-hover hover:shadow-md`}
              >
                START YOUR PROJECT
              </LocalizedClientLink>
              <p className={`${outfit.className} mt-3 text-[12px] text-slate-400`}>
                • No commitment. Just a quick conversation.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                QUICK LINKS
              </p>
              <div className="flex flex-col gap-3">
                {editzQuickLinks.map((item) => (
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

            {/* Video Editing */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                VIDEO EDITING
              </p>
              <div className="flex flex-col gap-3">
                {editzVideoEditing.map((item) => (
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

            {/* AI Video */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                AI VIDEO
              </p>
              <div className="flex flex-col gap-3">
                {editzAiVideo.map((item) => (
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

            {/* Follow Us */}
            <div className="flex flex-col">
              <p className={`${epilogue.className} mb-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-slate-400`}>
                FOLLOW US
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="https://www.instagram.com/mommantumeditz/"
                  target="_blank" rel="noopener noreferrer"
                  className={`${outfit.className} flex items-center gap-2.5 text-[13.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-social-instagram`}
                >
                  <div className="footer-social-btn instagram !h-7 !w-7 !rounded-md">
                    <InstagramIcon />
                  </div>
                  Instagram
                </Link>
                <Link
                  href="https://www.facebook.com/profile.php?id=61594685770172"
                  target="_blank" rel="noopener noreferrer"
                  className={`${outfit.className} flex items-center gap-2.5 text-[13.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-social-facebook`}
                >
                  <div className="footer-social-btn facebook !h-7 !w-7 !rounded-md">
                    <FacebookIcon />
                  </div>
                  Facebook
                </Link>
                <Link
                  href="https://www.linkedin.com/company/mommantum-media/"
                  target="_blank" rel="noopener noreferrer"
                  className={`${outfit.className} flex items-center gap-2.5 text-[13.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-social-linkedin`}
                >
                  <div className="footer-social-btn linkedin !h-7 !w-7 !rounded-md">
                    <LinkedInIcon />
                  </div>
                  LinkedIn
                </Link>
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
              © 2026 AG POWER Solar. All rights reserved.
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
    </footer>
  )
}
