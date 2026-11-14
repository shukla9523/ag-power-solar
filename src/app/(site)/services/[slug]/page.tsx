import { Metadata } from "next"
import Image from "next/image"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { getService, getServices } from "@lib/data/services"
import { getSeoSetting } from "@lib/data/seo"
import { resolveServiceData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageFaqSection from "@modules/common/components/page-faq-section"
import { SunMedium, ArrowRight, CheckCircle2, ShieldCheck, Zap, Calculator, Sparkles, Building2, Home, Users } from "lucide-react"

export const revalidate = 60

export async function generateStaticParams() {
  const services = await getServices()
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [service, seoSetting] = await Promise.all([
    getService(slug),
    getSeoSetting(`service:${slug}`).catch(() => null),
  ])

  if (!service) {
    return {
      title: "Solar Solutions | AG POWER",
      description: "Explore turnkey rooftop solar energy solutions by AG POWER.",
    }
  }

  const resolved = resolveServiceData(service, seoSetting)
  const baseMeta = buildMetadataFromResolved(resolved)

  return {
    ...baseMeta,
    title: `${service.title} | AG POWER Solar Solutions`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [service, seoSetting] = await Promise.all([
    getService(slug),
    getSeoSetting(`service:${slug}`).catch(() => null),
  ])

  if (!service) {
    const target = await findRedirect(`/services/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  // Primary & Secondary CTAs tailored to service type
  const isResidential = slug.includes("residential")
  const isCommercial = slug.includes("commercial")
  const isSociety = slug.includes("society")

  const primaryCta = isResidential
    ? { text: "Calculate My Home Solar Savings", href: "/calculator?cat=residential" }
    : isCommercial
    ? { text: "Get a Commercial Solar Proposal", href: "/contact?cat=commercial" }
    : { text: "Get a Society Solar Consultation", href: "/contact?cat=society" }

  const secondaryCta = isResidential
    ? { text: "Get Free Consultation", href: "/contact?service=residential-solar" }
    : isCommercial
    ? { text: "Calculate Commercial ROI", href: "/calculator?cat=commercial" }
    : { text: "Calculate Society Savings", href: "/calculator?cat=society" }

  // System Capacities Table Data
  const capacities = isResidential
    ? [
        { cap: "3 kW System", bill: "₹2,500 - ₹4,500/mo", panels: "6 Panels", roof: "~250 sq.ft", subsidy: "₹78,000 Subsidy" },
        { cap: "5 kW System", bill: "₹5,000 - ₹8,000/mo", panels: "9-10 Panels", roof: "~420 sq.ft", subsidy: "₹78,000 Subsidy" },
        { cap: "8 kW System", bill: "₹9,000 - ₹14,000/mo", panels: "15 Panels", roof: "~680 sq.ft", subsidy: "₹78,000 Max" },
        { cap: "10 kW System", bill: "₹15,000+/mo", panels: "18-20 Panels", roof: "~850 sq.ft", subsidy: "₹78,000 Max" },
      ]
    : isCommercial
    ? [
        { cap: "25 kW System", bill: "₹25,000 - ₹45,000/mo", panels: "45 Panels", roof: "~2,000 sq.ft", subsidy: "40% Tax Depreciation" },
        { cap: "50 kW System", bill: "₹50,000 - ₹90,000/mo", panels: "90 Panels", roof: "~4,200 sq.ft", subsidy: "40% Tax Depreciation" },
        { cap: "100 kW System", bill: "₹1,00,000+/mo", panels: "180 Panels", roof: "~8,500 sq.ft", subsidy: "40% Tax Depreciation" },
        { cap: "250+ kW System", bill: "₹2,50,000+/mo", panels: "450+ Panels", roof: "~20,000 sq.ft", subsidy: "Custom PPA / CAPEX" },
      ]
    : [
        { cap: "15 kW System", bill: "Small RWA / 20-40 flats", panels: "27 Panels", roof: "~1,250 sq.ft", subsidy: "Lowers Maintenance" },
        { cap: "25 kW System", bill: "Medium Society / 50-80 flats", panels: "45 Panels", roof: "~2,100 sq.ft", subsidy: "Offsets Lifts & Pumps" },
        { cap: "50 kW System", bill: "Large Society / 100+ flats", panels: "90 Panels", roof: "~4,200 sq.ft", subsidy: "Clubhouse + Pumps" },
        { cap: "100 kW System", bill: "Township / High-Rise", panels: "180 Panels", roof: "~8,500 sq.ft", subsidy: "Maximum Energy Offset" },
      ]

  // Map service FAQs into FAQItem shape
  const formattedFaqs = (service.faqs || []).map((f, i) => ({
    id: `svc-faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
    category: service.shortLabel || "Solar Energy",
  }))

  return (
    <>
      <JsonLd type="service" data={service} seoSetting={seoSetting} />

      <main className="min-h-screen bg-ivory">
        
        {/* Breadcrumb Bar */}
        <div className="border-b border-charcoal/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-[13px] text-charcoal-muted">
              <LocalizedClientLink href="/" className="hover:text-forest transition-colors">
                Home
              </LocalizedClientLink>
              <span>/</span>
              <LocalizedClientLink href="/services" className="hover:text-forest transition-colors">
                Solar Solutions
              </LocalizedClientLink>
              <span>/</span>
              <span className="font-semibold text-forest">{service.shortLabel || service.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-forest py-16 text-white sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-forest-deep px-4 py-1 text-[12px] font-bold uppercase tracking-wider text-gold">
                  <SunMedium className="h-4 w-4" />
                  <span>AG POWER Dedicated Solution</span>
                </span>

                <h1 className="mt-4 font-manrope text-[38px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[48px] lg:text-[54px]">
                  {service.title}
                </h1>

                <p className="mt-6 text-[17px] leading-relaxed text-sage-mist/90 sm:text-[19px]">
                  {service.intro || service.description}
                </p>

                {/* Quick Points */}
                <div className="mt-8 flex flex-wrap gap-4 text-[13px] text-sage">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    <span>25-Year Performance Warranty</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-gold" />
                    <span>Tier-1 Bifacial & TOPCon Modules</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-gold" />
                    <span>Complete DISCOM Liaison</span>
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <LocalizedClientLink
                    href={primaryCta.href}
                    className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-gold px-7 font-inter text-[15px] font-bold text-forest shadow-md transition-all hover:bg-gold-hover active:scale-95"
                  >
                    <span>{primaryCta.text}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href={secondaryCta.href}
                    className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 font-inter text-[15px] font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
                  >
                    {secondaryCta.text}
                  </LocalizedClientLink>
                </div>
              </div>

              {/* Graphic Showcase Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-forest to-forest-deep p-7 shadow-2xl">
                  <h3 className="font-manrope text-[20px] font-bold text-white">
                    {service.shortLabel} Snapshot
                  </h3>
                  <p className="mt-1 text-[13px] text-sage">
                    Engineered for continuous reliability and maximum ROI
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[12px] text-sage">Bill Offset</p>
                      <p className="font-manrope text-[26px] font-bold text-gold">Up to 90%</p>
                      <p className="text-[12px] text-sage-mist/70">Direct reduction in grid dependency</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[12px] text-sage">Capital Payback</p>
                      <p className="font-manrope text-[26px] font-bold text-white">2.5 - 4 Years</p>
                      <p className="text-[12px] text-sage-mist/70">Free energy for the next 20+ years</p>
                    </div>

                    <div className="rounded-xl bg-gold/20 border border-gold/30 p-3.5 text-[13px] text-sage-mist">
                      <span className="font-bold text-gold">Turnkey Guarantee: </span>
                      AG POWER manages DISCOM net-meter approvals, engineering CAD drawings, and subsidy portal processing.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Suitable System Capacities Table */}
        <section className="py-16 sm:py-20 bg-white border-b border-charcoal/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-[13px] font-bold uppercase tracking-wider text-charcoal-muted">
                Capacity Guide
              </span>
              <h2 className="mt-2 font-manrope text-[30px] font-extrabold text-forest sm:text-[38px]">
                Recommended System Sizes & Specifications
              </h2>
              <p className="mt-3 text-[15px] text-charcoal/80">
                Choose the capacity tailored to your electrical load and available rooftop surface.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capacities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-ivory p-6 transition-all hover:border-forest/30 hover:shadow-lg"
                >
                  <div>
                    <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-gold">
                      {item.subsidy}
                    </span>
                    <h3 className="mt-4 font-manrope text-[22px] font-bold text-forest">
                      {item.cap}
                    </h3>
                    <div className="mt-4 space-y-2 text-[13px] text-charcoal">
                      <div className="flex justify-between border-b border-charcoal/8 pb-1.5">
                        <span className="text-charcoal-muted">Typical Bill:</span>
                        <span className="font-semibold text-forest">{item.bill}</span>
                      </div>
                      <div className="flex justify-between border-b border-charcoal/8 pb-1.5">
                        <span className="text-charcoal-muted">Panels:</span>
                        <span className="font-semibold">{item.panels}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-muted">Roof Area:</span>
                        <span className="font-semibold">{item.roof}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-charcoal/8">
                    <LocalizedClientLink
                      href={`/contact?service=${slug}&capacity=${item.cap}`}
                      className="inline-flex min-h-[40px] w-full items-center justify-center rounded-xl bg-forest text-[13px] font-bold text-white transition-colors hover:bg-forest-deep"
                    >
                      Enquire For {item.cap}
                    </LocalizedClientLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deliverables & Benefits */}
        <section className="py-16 sm:py-20 bg-ivory">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              
              {/* Deliverables */}
              {service.points && service.points.length > 0 && (
                <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm">
                  <h3 className="font-manrope text-[22px] font-bold text-forest">
                    What&apos;s Included in Our {service.shortLabel}
                  </h3>
                  <p className="mt-1 text-[13px] text-charcoal-muted">
                    Turnkey engineering, component procurement, installation, and DISCOM commissioning.
                  </p>
                  <ul className="mt-6 space-y-3.5">
                    {service.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14px] text-charcoal">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes & Why It Matters */}
              <div className="space-y-6">
                {service.outcomes && service.outcomes.length > 0 && (
                  <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm">
                    <h3 className="font-manrope text-[22px] font-bold text-forest">
                      Guaranteed Outcomes
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {service.outcomes.map((oc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] text-charcoal">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-mist text-forest font-bold text-xs">
                            ✓
                          </span>
                          <span>{oc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.whyItMatters && service.whyItMatters.length > 0 && (
                  <div className="rounded-3xl border border-forest/15 bg-sage-mist/70 p-8">
                    <h3 className="font-manrope text-[20px] font-bold text-forest">
                      Why This Matters For You
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {service.whyItMatters.map((wm, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[14px] text-charcoal">
                          <span className="text-forest font-bold">•</span>
                          <span>{wm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* FAQs */}
        {formattedFaqs.length > 0 && (
          <PageFaqSection
            faqs={formattedFaqs}
            title={`${service.shortLabel || service.title} FAQs`}
            subtitle="Clear, verified answers about technical feasibility, DISCOM approvals, and investment."
          />
        )}

        {/* Final Conversion Section */}
        <section className="bg-forest py-16 text-white sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <span className="text-[13px] font-bold uppercase tracking-wider text-gold">
              Get Started Today
            </span>
            <h2 className="mt-3 font-manrope text-[32px] font-extrabold sm:text-[42px]">
              Ready to Power Your Rooftop with Solar?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] text-sage-mist/85">
              Contact our certified solar engineers for a free site assessment and customized financial yield proposal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <LocalizedClientLink
                href={`/contact?service=${slug}`}
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-gold px-8 font-inter text-[15px] font-bold text-forest shadow-md transition-all hover:bg-gold-hover"
              >
                <span>Request Feasibility Assessment</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/calculator"
                className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 font-inter text-[15px] font-semibold text-white hover:bg-white/20"
              >
                <Calculator className="mr-2 h-4 w-4 text-gold" />
                <span>Calculate Savings</span>
              </LocalizedClientLink>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
