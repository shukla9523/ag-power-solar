"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import ServicesDropdown from "./ServicesDropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AgPowerLogo from "@modules/common/components/brand/AgPowerLogo"
import { SunMedium, ChevronDown, Phone, Calculator, ArrowRight, Menu, X, Shield, Award } from "lucide-react"

const MOBILE_BREAKPOINT = 1024

const solarSolutions = [
  { name: "Residential Solar", link: "/services/residential-solar", desc: "For independent homes & villas" },
  { name: "Commercial Solar", link: "/services/commercial-solar", desc: "For factories, offices & businesses" },
  { name: "Housing Society Solar", link: "/services/housing-society-solar", desc: "For RWAs & apartment complexes" },
]

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (isMobile === false) setMenuOpen(false)
  }, [isMobile])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200/90"
            : "bg-white/92 backdrop-blur-md shadow-xs border-b border-slate-200/70 lg:bg-white/80"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-3 sm:px-6 sm:py-3.5 lg:px-8">
          
          {/* Unified Brand Logo */}
          <LocalizedClientLink href="/" className="inline-flex items-center">
            <AgPowerLogo size="md" />
          </LocalizedClientLink>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:gap-8 lg:flex">
            <LocalizedClientLink
              href="/"
              className={`text-[15px] transition-colors ${
                pathname === "/" ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              Home
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/about"
              className={`text-[15px] transition-colors ${
                pathname === "/about" ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              About
            </LocalizedClientLink>

            {/* Solar Solutions Megamenu */}
            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1 text-[15px] transition-colors hover:text-forest focus:outline-none ${
                  pathname?.startsWith("/services") ? "font-bold text-forest" : "font-medium text-slate-700"
                }`}
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <ServicesDropdown />
            </div>

            <LocalizedClientLink
              href="/calculator"
              className={`flex items-center gap-1.5 text-[15px] transition-colors ${
                pathname === "/calculator" ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              <Calculator className="h-4 w-4 text-gold" />
              <span>Calculator</span>
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/solar-panels"
              className={`text-[15px] transition-colors ${
                pathname === "/solar-panels" ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              Solar Panels
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/blog"
              className={`text-[15px] transition-colors ${
                pathname === "/blog" || pathname?.startsWith("/blog/") ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              Blog
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/contact"
              className={`text-[15px] transition-colors ${
                pathname === "/contact" ? "font-bold text-forest" : "font-medium text-slate-700 hover:text-forest"
              }`}
            >
              Contact
            </LocalizedClientLink>
          </nav>

          {/* Right Action CTA (Pill Button, exact Momentum style) */}
          <div className="hidden items-center gap-3 lg:flex">
            <LocalizedClientLink
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 font-inter text-[14px] font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </LocalizedClientLink>
          </div>

          {/* Mobile Menu Hamburger (High-Contrast, Touch-Friendly) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-800 shadow-xs hover:bg-slate-100 hover:text-emerald-700 transition-colors lg:hidden active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Full Height, Touch-Optimized, Scrollable) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[60px] sm:top-[65px] max-h-[calc(100dvh-60px)] sm:max-h-[calc(100dvh-65px)] overflow-y-auto border-b border-slate-200 bg-white/98 backdrop-blur-2xl px-5 py-6 lg:hidden shadow-2xl z-50"
          >
            <div className="flex flex-col gap-2">
              <LocalizedClientLink
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center rounded-xl px-3 text-[16px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
              >
                Home
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center rounded-xl px-3 text-[16px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                About
              </LocalizedClientLink>

              {/* Mobile Solutions Accordion */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2">
                <button
                  type="button"
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="flex min-h-[42px] w-full items-center justify-between px-2 text-[16px] font-semibold text-slate-800"
                >
                  <span>Services & Solutions</span>
                  <ChevronDown className={`h-4 w-4 text-emerald-700 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                </button>
                {solutionsOpen && (
                  <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-200/60 pt-2">
                    {solarSolutions.map((sol) => (
                      <LocalizedClientLink
                        key={sol.link}
                        href={sol.link}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-lg px-2.5 py-2 text-[14px] font-medium text-emerald-900 hover:bg-emerald-100/60 transition-colors"
                      >
                        <p className="font-bold">{sol.name}</p>
                        <p className="text-[12px] text-slate-500">{sol.desc}</p>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>

              <LocalizedClientLink
                href="/calculator"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center justify-between rounded-xl px-3 text-[16px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-500" />
                  <span>Solar Calculator</span>
                </div>
                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-900">
                  Interactive
                </span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/solar-panels"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center rounded-xl px-3 text-[16px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Solar Panels
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center rounded-xl px-3 text-[16px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Solar Guides & Blog
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center rounded-xl px-3 text-[16px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Contact & Support
              </LocalizedClientLink>

              {/* Mobile Action CTAs */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <LocalizedClientLink
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-center font-bold text-white shadow-md active:scale-95 transition-all"
                >
                  <span>Get Free Solar Quote</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </LocalizedClientLink>

                <a
                  href="tel:+919523467849"
                  className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-white border border-slate-200 text-center font-bold text-slate-900 shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <Phone className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>Call: +91 95234 67849</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
