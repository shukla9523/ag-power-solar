"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SunMedium, ShieldCheck, Award, Zap, CheckCircle2, ArrowRight, Compass, Users2, Leaf, Building2 } from "lucide-react"

interface Props {
  countryCode?: string
  children?: React.ReactNode
}

export default function AboutClient({ children }: Props) {
  return (
    <div className="bg-ivory min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-forest-deep px-4 py-1 text-[12px] font-bold uppercase tracking-wider text-gold">
              <SunMedium className="h-4 w-4" />
              <span>About AG POWER · Electro Global</span>
            </span>
            <h1 className="mt-5 font-manrope text-[38px] font-extrabold tracking-tight sm:text-[50px] lg:text-[58px]">
              Powering India with Clean, Reliable Solar Energy
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-sage-mist/90 sm:text-[20px]">
              We are an engineering-first solar EPC company committed to making rooftop solar adoption accessible, financially rewarding, and built to last 25+ years.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Mission */}
            <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-gold">
                <Leaf className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-manrope text-[26px] font-bold text-forest">
                Our Mission
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal/80">
                To accelerate India&apos;s transition to renewable energy by delivering reliable, precision-engineered solar installations that dramatically reduce electricity expenses for homeowners, businesses, and communities.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-gold">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-manrope text-[26px] font-bold text-forest">
                Our Vision
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal/80">
                To be India&apos;s most trusted clean-energy solutions partner — recognized for uncompromised engineering integrity, transparent execution, and superior lifetime solar generation output.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Company Philosophy & Values */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-y border-charcoal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[13px] font-bold uppercase tracking-wider text-charcoal-muted">
              Core Principles
            </span>
            <h2 className="mt-2 font-manrope text-[32px] font-extrabold text-forest sm:text-[40px]">
              How We Approach Every Solar Installation
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/80">
              Solar is a 25-year structural and electrical commitment. We do not take shortcuts on safety, mounting strength, or hardware durability.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-charcoal/10 bg-ivory p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold font-bold">
                01
              </div>
              <h3 className="mt-5 font-manrope text-[19px] font-bold text-forest">
                Engineering-First Design
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-charcoal/80">
                Every rooftop is unique. We conduct 3D irradiance simulations to position panels for peak sun exposure and zero shadow interference.
              </p>
            </div>

            <div className="rounded-2xl border border-charcoal/10 bg-ivory p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold font-bold">
                02
              </div>
              <h3 className="mt-5 font-manrope text-[19px] font-bold text-forest">
                Tier-1 Components Only
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-charcoal/80">
                We only deploy ALMM-listed, DCR-compliant Mono PERC and TOPCon panels from verified manufacturers with guaranteed 25-30 year linear warranties.
              </p>
            </div>

            <div className="rounded-2xl border border-charcoal/10 bg-ivory p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest text-gold font-bold">
                03
              </div>
              <h3 className="mt-5 font-manrope text-[19px] font-bold text-forest">
                Zero DISCOM Bureaucracy
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-charcoal/80">
                Our in-house liaison team handles all DISCOM net-metering applications, technical sanction drawings, and PM Surya Ghar central subsidy filings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="bg-forest py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
            <div>
              <p className="font-manrope text-[36px] font-black text-gold sm:text-[44px]">25+</p>
              <p className="text-[13px] text-sage">Years Linear Warranty</p>
            </div>
            <div>
              <p className="font-manrope text-[36px] font-black text-white sm:text-[44px]">90%</p>
              <p className="text-[13px] text-sage">Maximum Bill Savings</p>
            </div>
            <div>
              <p className="font-manrope text-[36px] font-black text-gold sm:text-[44px]">100%</p>
              <p className="text-[13px] text-sage">Tier-1 Hardware</p>
            </div>
            <div>
              <p className="font-manrope text-[36px] font-black text-white sm:text-[44px]">₹78K</p>
              <p className="text-[13px] text-sage">Max Central Subsidy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Children: FAQs & Testimonials */}
      {children}

      {/* Final Action */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-manrope text-[30px] font-extrabold text-forest sm:text-[36px]">
            Ready to Begin Your Solar Journey?
          </h2>
          <p className="mt-3 text-[16px] text-charcoal/80">
            Let our senior solar engineers evaluate your rooftop potential with a no-obligation feasibility assessment.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <LocalizedClientLink
              href="/contact"
              className="inline-flex min-h-[48px] items-center rounded-xl bg-forest px-7 font-inter text-[14px] font-bold text-white shadow-md hover:bg-forest-deep"
            >
              Contact Our Engineers →
            </LocalizedClientLink>
          </div>
        </div>
      </section>

    </div>
  )
}
