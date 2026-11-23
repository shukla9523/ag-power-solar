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

  const isHome = pathname === "/"

  return (
    <>
      <div
        style={{
          backgroundColor: menuOpen
            ? "#ffffff"
            : scrolled || !isHome
            ? "rgba(255, 255, 255, 0.94)"
            : "rgba(255, 255, 255, 0.35)",
          backgroundImage:
            !scrolled && isHome && !menuOpen
              ? "linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.20) 100%)"
              : undefined,
          backdropFilter: menuOpen ? "none" : scrolled || !isHome ? "blur(16px)" : "blur(14px)",
          WebkitBackdropFilter: menuOpen ? "none" : scrolled || !isHome ? "blur(16px)" : "blur(14px)",
        }}
        className={`w-full transition-all duration-300 border-b ${
          menuOpen
            ? "border-slate-200 shadow-sm"
            : scrolled || !isHome
            ? "border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)]"
            : "border-white/40 shadow-none"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2.5 sm:px-6 sm:py-3 lg:px-8">

          {/* Unified Brand Logo with subtle glass backdrop for maximum clarity over photo */}
          <LocalizedClientLink
            href="/"
            className="inline-flex items-center px-2.5 py-1 rounded-2xl bg-white/50 backdrop-blur-xs border border-white/60 shadow-2xs hover:bg-white/70 transition-all active:scale-95"
          >
            <AgPowerLogo variant="default" size="md" />
          </LocalizedClientLink>

          {/* Desktop Navigation (Floating Frosted Glass Capsule for 100% Crisp Visibility over Background Photo) */}
          <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex rounded-full bg-white/70 backdrop-blur-md px-3 py-1 border border-white/85 shadow-[0_2px_14px_rgba(0,0,0,0.04)]">
            <LocalizedClientLink
              href="/"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/"
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              Home
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/about"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/about"
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              About
            </LocalizedClientLink>

            {/* Solar Solutions Megamenu */}
            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[15px] font-bold transition-all hover:text-forest-deep hover:bg-white/80 focus:outline-none ${
                  pathname?.startsWith("/services")
                    ? "bg-emerald-100 text-forest-deep shadow-2xs"
                    : "text-slate-900"
                }`}
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <ServicesDropdown />
            </div>

            <LocalizedClientLink
              href="/calculator"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/calculator"
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              Calculator
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/solar-panels"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/solar-panels"
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              Solar Panels
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/blog"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/blog" || pathname?.startsWith("/blog/")
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              Blog
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/contact"
              className={`px-3 py-1.5 rounded-full text-[15px] font-bold transition-all ${
                pathname === "/contact"
                  ? "bg-emerald-100 text-forest-deep shadow-2xs"
                  : "text-slate-900 hover:text-forest-deep hover:bg-white/80"
              }`}
            >
              Contact
            </LocalizedClientLink>
          </nav>

          {/* Right Action CTA: Primary Green Button with Soft Shadow */}
          <div className="hidden items-center gap-3 lg:flex">
            <LocalizedClientLink
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_4px_20px_rgba(22,163,74,0.35)] px-5 py-2.5 font-inter text-[14px] font-bold text-white shadow-[0_2px_12px_rgba(22,163,74,0.25)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="ml-1.5 h-4 w-4 text-white" />
            </LocalizedClientLink>
          </div>

          {/* Mobile Menu Hamburger (Touch-Friendly) */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/90 backdrop-blur-md text-slate-900 shadow-xs hover:bg-white hover:text-emerald-700 transition-colors lg:hidden active:scale-95"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="h-6 w-6 text-slate-900" /> : <Menu className="h-6 w-6 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Pure Solid Crisp White, Never Transparent) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{ backgroundColor: "#ffffff" }}
            className="fixed inset-x-0 top-[58px] sm:top-[64px] bottom-0 z-50 bg-white overflow-y-auto px-5 py-6 lg:hidden shadow-2xl border-t border-slate-100 flex flex-col justify-between"
          >
            <div className="flex flex-col gap-2">
              <LocalizedClientLink
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[46px] items-center rounded-xl px-3.5 text-[16px] font-bold transition-colors ${pathname === "/" ? "bg-emerald-50 text-emerald-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Home
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/about"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[46px] items-center rounded-xl px-3.5 text-[16px] font-bold transition-colors ${pathname === "/about" ? "bg-emerald-50 text-emerald-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
              >
                About AG POWER
              </LocalizedClientLink>

              {/* Mobile Solutions Accordion */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5">
                <button
                  type="button"
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="flex min-h-[42px] w-full items-center justify-between px-2 text-[16px] font-bold text-slate-900"
                >
                  <span>Services & Solutions</span>
                  <ChevronDown className={`h-4 w-4 text-emerald-700 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                </button>
                {solutionsOpen && (
                  <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-200 pt-2">
                    {solarSolutions.map((sol) => (
                      <LocalizedClientLink
                        key={sol.link}
                        href={sol.link}
                        onClick={() => setMenuOpen(false)}
                        className="rounded-lg px-2.5 py-2 text-[14px] text-slate-900 hover:bg-emerald-100/60 transition-colors"
                      >
                        <p className="font-extrabold text-emerald-800">{sol.name}</p>
                        <p className="text-[12px] text-slate-600">{sol.desc}</p>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>

              <LocalizedClientLink
                href="/calculator"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[46px] items-center justify-between rounded-xl px-3.5 text-[16px] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calculator className="h-5 w-5 text-amber-500" />
                  <span className="text-slate-900">Solar Calculator</span>
                </div>
                <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[11px] font-extrabold text-amber-900">
                  Interactive
                </span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/solar-panels"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[46px] items-center rounded-xl px-3.5 text-[16px] font-bold transition-colors ${pathname === "/solar-panels" ? "bg-emerald-50 text-emerald-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Tier-1 Solar Panels
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[46px] items-center rounded-xl px-3.5 text-[16px] font-bold transition-colors ${pathname?.startsWith("/blog") ? "bg-emerald-50 text-emerald-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Solar Guides & Blog
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[46px] items-center rounded-xl px-3.5 text-[16px] font-bold transition-colors ${pathname === "/contact" ? "bg-emerald-50 text-emerald-700" : "text-slate-900 hover:bg-slate-50"
                  }`}
              >
                Contact & Support
              </LocalizedClientLink>
            </div>

            {/* Mobile Action CTAs at bottom of screen */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col gap-3 pb-4">
              <LocalizedClientLink
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 text-center font-inter text-[15px] font-extrabold text-white shadow-md active:scale-95 transition-all"
              >
                <span>Get Free Solar Quote</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedClientLink>

              <a
                href="tel:+919523467849"
                className="flex min-h-[46px] w-full items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-center font-inter text-[14px] font-bold text-slate-900 shadow-xs active:scale-95 transition-all"
              >
                <Phone className="mr-2 h-4 w-4 text-emerald-700" />
                <span>Call Us: +91 95234 67849</span>
              </a>
            </div>
          </motion.div>
        )
        }
      </AnimatePresence >
    </>
  )
}
