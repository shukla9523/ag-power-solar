"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import ServicesDropdown from "./ServicesDropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import AgPowerLogoIcon from "@modules/common/components/brand/AgPowerLogoIcon"
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
            ? "bg-white/85 backdrop-blur-xl shadow-md border-b border-slate-200/80"
            : "bg-white/75 backdrop-blur-md shadow-xs border-b border-white/30"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <LocalizedClientLink href="/" className="group flex items-center gap-2.5">
            <AgPowerLogoIcon className="h-10 w-10 shadow-sm transition-transform duration-200 group-hover:scale-105" />
            <div className="flex items-center">
              <span className="font-manrope text-[21px] font-extrabold tracking-tight text-forest">
                AG POWER
              </span>
              <span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-gold" />
            </div>
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
              className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-2.5 font-inter text-[14px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-forest-deep hover:shadow-md active:scale-95"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </LocalizedClientLink>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-forest hover:bg-gray-100 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-100 bg-white px-5 py-6 lg:hidden shadow-lg"
          >
            <div className="flex flex-col gap-3">
              <LocalizedClientLink
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[16px] font-bold text-forest"
              >
                Home
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[16px] font-semibold text-slate-800"
              >
                About
              </LocalizedClientLink>

              {/* Mobile Solutions Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className="flex min-h-[44px] w-full items-center justify-between text-[16px] font-semibold text-slate-800"
                >
                  <span>Services & Solutions</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${solutionsOpen ? "rotate-180" : ""}`} />
                </button>
                {solutionsOpen && (
                  <div className="ml-3 mt-1 flex flex-col gap-2 border-l-2 border-forest/20 pl-3">
                    {solarSolutions.map((sol) => (
                      <LocalizedClientLink
                        key={sol.link}
                        href={sol.link}
                        onClick={() => setMenuOpen(false)}
                        className="py-1.5 text-[14px] font-medium text-forest"
                      >
                        {sol.name}
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
              </div>

              <LocalizedClientLink
                href="/calculator"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center gap-2 text-[16px] font-semibold text-forest"
              >
                <Calculator className="h-5 w-5 text-gold" />
                <span>Solar Calculator</span>
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/solar-panels"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[16px] font-semibold text-slate-800"
              >
                Solar Panels
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/blog"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[16px] font-semibold text-slate-800"
              >
                Blog
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] items-center text-[16px] font-semibold text-slate-800"
              >
                Contact
              </LocalizedClientLink>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <LocalizedClientLink
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-forest text-center font-bold text-white shadow-sm hover:bg-forest-deep"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </LocalizedClientLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
