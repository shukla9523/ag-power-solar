import { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { getService, getServices } from "@lib/data/services"
import { getSeoSetting } from "@lib/data/seo"
import { resolveServiceData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageFaqSection from "@modules/common/components/page-faq-section"
import { CheckCircle2 } from "lucide-react"

// Reusable Service Page Components conforming to AG POWER Design Tokens
import ServiceHero from "../_components/ServiceHero"
import ServiceTrustStrip from "../_components/ServiceTrustStrip"
import ServiceRwaWorkflow from "../_components/ServiceRwaWorkflow"
import ServiceCaseStudies from "../_components/ServiceCaseStudies"
import ServiceCtaSection from "../_components/ServiceCtaSection"
import ServiceMobileWhatsApp from "../_components/ServiceMobileWhatsApp"

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

  const isResidential = slug.includes("residential")
  const isCommercial = slug.includes("commercial")
  const isSociety = slug.includes("society")

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

        {/* 1. Hero Section (Design tokens, WCAG AA contrast, custom cards & buttons) */}
        <ServiceHero service={service} slug={slug} />

        {/* 2. Trust Strip (Installations, experience, customer rating, approved vendor) */}
        <ServiceTrustStrip />

        {/* 3. Suitable System Capacities Table */}
        <section className="py-16 sm:py-20 bg-white border-b border-charcoal/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-[13px] font-bold uppercase tracking-wider text-charcoal-muted">
                Capacity Guide
              </span>
              <h2 className="mt-2 font-manrope text-[30px] font-extrabold text-forest-deep sm:text-[38px]">
                Recommended System Sizes &amp; Specifications
              </h2>
              <p className="mt-3 text-[15px] text-charcoal/80">
                Choose the capacity tailored to your electrical load and available rooftop surface.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {capacities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-ivory p-6 transition-all hover:border-forest/40 hover:shadow-lg"
                >
                  <div>
                    <span className="rounded-full bg-forest-deep px-3 py-1 text-[11px] font-bold text-gold">
                      {item.subsidy}
                    </span>
                    <h3 className="mt-4 font-manrope text-[22px] font-bold text-forest-deep">
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
                      className="inline-flex min-h-[42px] w-full items-center justify-center rounded-xl bg-forest-deep text-[13px] font-bold text-white transition-colors hover:bg-forest"
                    >
                      Enquire For {item.cap}
                    </LocalizedClientLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Deliverables & Benefits */}
        <section className="py-16 sm:py-20 bg-ivory border-b border-charcoal/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              
              {/* Deliverables */}
              {service.points && service.points.length > 0 && (
                <div className="rounded-3xl border border-charcoal/10 bg-white p-8 shadow-sm">
                  <h3 className="font-manrope text-[22px] font-bold text-forest-deep">
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
                    <h3 className="font-manrope text-[22px] font-bold text-forest-deep">
                      Guaranteed Outcomes
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {service.outcomes.map((oc, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[14px] text-charcoal">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest/15 text-forest font-bold text-xs">
                            ✓
                          </span>
                          <span>{oc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.whyItMatters && service.whyItMatters.length > 0 && (
                  <div className="rounded-3xl border border-forest/20 bg-forest/5 p-8">
                    <h3 className="font-manrope text-[20px] font-bold text-forest-deep">
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

        {/* 5. How It Works for RWAs (Specifically on Housing Society page) */}
        {isSociety && <ServiceRwaWorkflow />}

        {/* 6. Case Studies / Project Showcase (location, system size kW, monthly saving) */}
        <ServiceCaseStudies slug={slug} />

        {/* 7. FAQs */}
        {formattedFaqs.length > 0 && (
          <PageFaqSection
            faqs={formattedFaqs}
            title={`${service.shortLabel || service.title} FAQs`}
            subtitle="Clear, verified answers about technical feasibility, DISCOM approvals, and investment."
          />
        )}

        {/* 8. Bottom Conversion Section (Identical buttons as Hero + WhatsApp & Call buttons) */}
        <ServiceCtaSection slug={slug} />

        {/* 9. Mobile Sticky WhatsApp Floating Button */}
        <ServiceMobileWhatsApp />

      </main>
    </>
  )
}
