import { Metadata } from "next"
import Image from "next/image"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { getService, getServices } from "@lib/data/services"
import { getSeoSetting } from "@lib/data/seo"
import { resolveServiceData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { epilogue, outfit, mansalva } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PageFaqSection from "@modules/common/components/page-faq-section"
import { getServiceFocusPoints, enrichServiceFocusContent } from "@lib/data/service-focus"
import { linkKeywords, newLinkState } from "@lib/seo/keyword-links"

// Same look as the existing in-copy links in the focus section.
const FOCUS_LINK_CLASS = "text-brand font-semibold underline underline-offset-4 hover:text-navy transition-colors"

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
      title: "Services | Mommantum",
      description: "Explore performance marketing, SEO, creative branding, and AI automation services by Mommantum.",
    }
  }

  const resolved = resolveServiceData(service, seoSetting)
  return buildMetadataFromResolved(resolved)
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

  // Renamed URLs 301 to their new address; anything else is a real 404 (not a soft redirect).
  if (!service) {
    const target = await findRedirect(`/services/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  const focusPoints = getServiceFocusPoints(slug)

  // Image alt / title come from the page's meta object (keyword-based, AI fills them when empty).
  const heroAlt = seoSetting?.image_alt || `${service.title} — Mommantum, Jaipur`
  const heroTitle = seoSetting?.image_title || service.title

  // Keyword internal links (each keyword links to the page that owns it; one link per target).
  const linkState = newLinkState(focusPoints.reduce((n, fp) => n + fp.content.split(/\s+/).length, 0))
  const enrichedFocus: string[] = []
  for (const fp of focusPoints) {
    enrichedFocus.push(
      await linkKeywords(enrichServiceFocusContent(fp.content, slug, undefined, { usedTargets: linkState.usedTargets }), `/services/${slug}`, linkState, FOCUS_LINK_CLASS)
    )
  }

  // Map service FAQs into FAQItem shape for PageFaqSection
  const formattedFaqs = (service.faqs || []).map((f, i) => ({
    id: `svc-faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
    category: service.shortLabel || "Service",
  }))

  return (
    <>
      <JsonLd type="service" data={service} seoSetting={seoSetting} />

      <main className="min-h-screen bg-paper text-navy">
        {/* ─── BREADCRUMBS & TOP BAR ─── */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="content-container mx-auto max-w-[1240px] px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-neutral-500">
              <LocalizedClientLink href="/" className="hover:text-brand transition-colors">
                Home
              </LocalizedClientLink>
              <span>/</span>
              <LocalizedClientLink href="/services" className="hover:text-brand transition-colors">
                Services
              </LocalizedClientLink>
              <span>/</span>
              <span className="font-medium text-navy">{service.shortLabel || service.title}</span>
            </nav>
          </div>
        </div>

        {/* ─── HERO SECTION ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-surface-slate pt-14 pb-18 lg:pt-20 lg:pb-24 border-b border-neutral-200">
          <div className="content-container mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className={`${mansalva.className} inline-block rounded-full bg-brand-tint px-4 py-1 text-sm font-semibold text-brand border border-brand-pale`}>
                  {service.shortLabel}
                </span>

                <h1 className={`${epilogue.className} mt-4 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl lg:text-5xl lg:leading-[1.12]`}>
                  {service.title}
                </h1>

                <p className={`${outfit.className} mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg`}>
                  {service.intro || service.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <LocalizedClientLink
                    href="/contact"
                    className={`${epilogue.className} inline-flex items-center justify-center rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-deep hover:shadow-xl hover:-translate-y-0.5`}
                  >
                    Schedule Growth Consultation
                    <span className="ml-2 font-bold">→</span>
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href="/services"
                    className={`${epilogue.className} inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400`}
                  >
                    View All Services
                  </LocalizedClientLink>
                </div>
              </div>

              {/* Service Hero Image / Graphic */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto aspect-[1200/630] w-full max-w-[560px] overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xl shadow-slate-200/60 transition-all duration-300 hover:shadow-2xl">
                  <Image
                    src={service.heroImage || service.image}
                    alt={heroAlt}
                    title={heroTitle}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SERVICE FOCUS & STRATEGY SECTION ─── */}
        {focusPoints && focusPoints.length > 0 && (
          <section className="bg-white py-16 lg:py-24 border-b border-neutral-200">
            <div className="content-container mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p className={`${mansalva.className} text-base text-brand`}>Strategic Approach</p>
                <h2 className={`${epilogue.className} mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl`}>
                  How We Execute {service.shortLabel} for Measurable Growth
                </h2>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-3">
                {focusPoints.map((fp, fpIndex) => {
                  const enrichedText = enrichedFocus[fpIndex]
                  return (
                    <div
                      key={fp.number}
                      className="rounded-2xl border border-neutral-200/80 bg-paper p-7 transition-all hover:border-brand/40 hover:bg-white hover:shadow-lg hover:shadow-slate-100"
                    >
                      <span className={`${epilogue.className} inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint font-extrabold text-brand border border-brand-pale`}>
                        0{fp.number}
                      </span>
                      <h3 className={`${epilogue.className} mt-5 text-lg font-bold text-navy`}>
                        {fp.title}
                      </h3>
                      <div
                        className={`${outfit.className} mt-3 text-sm leading-relaxed text-neutral-600 prose-a:text-brand prose-a:underline hover:prose-a:text-navy`}
                        dangerouslySetInnerHTML={{ __html: enrichedText }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── DELIVERABLES & OUTCOMES ─── */}
        <section className="py-16 lg:py-24">
          <div className="content-container mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Deliverables / Scope */}
              {service.points && service.points.length > 0 && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <h3 className={`${epilogue.className} text-xl font-extrabold text-navy`}>
                    What&apos;s Included in {service.shortLabel}
                  </h3>
                  <p className={`${outfit.className} mt-2 text-sm text-neutral-500`}>
                    Execution deliverables handled end-to-end by our Jaipur studio.
                  </p>
                  <ul className="mt-6 space-y-4">
                    {service.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
                          ✓
                        </span>
                        <span className={`${outfit.className} text-sm font-medium text-neutral-700`}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes & Why It Matters */}
              <div className="space-y-8">
                {service.outcomes && service.outcomes.length > 0 && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                    <h3 className={`${epilogue.className} text-xl font-extrabold text-navy`}>
                      Expected Business Outcomes
                    </h3>
                    <ul className="mt-6 space-y-3">
                      {service.outcomes.map((oc, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-base text-brand">📈</span>
                          <span className={`${outfit.className} text-sm text-neutral-700`}>{oc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.whyItMatters && service.whyItMatters.length > 0 && (
                  <div className="rounded-2xl border border-neutral-200 bg-accent-purple-tint/50 p-8">
                    <h3 className={`${epilogue.className} text-xl font-extrabold text-navy`}>
                      Why This Matters for Your Brand
                    </h3>
                    <ul className="mt-6 space-y-3">
                      {service.whyItMatters.map((wm, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-base text-accent-purple">★</span>
                          <span className={`${outfit.className} text-sm text-neutral-700`}>{wm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── SERVICE-SPECIFIC FAQS ─── */}
        {formattedFaqs.length > 0 && (
          <PageFaqSection
            faqs={formattedFaqs}
            title={`${service.shortLabel || service.title} FAQs`}
            subtitle="Clear answers about execution timelines, deliverables, strategy, and reporting."
          />
        )}

        {/* ─── BOTTOM CONVERSION BANNER ─── */}
        <section className="bg-white py-16 lg:py-20 border-t border-neutral-200">
          <div className="content-container mx-auto max-w-[1000px] text-center px-4">
            <span className={`${mansalva.className} text-lg text-brand`}>Ready to Scale?</span>
            <h2 className={`${epilogue.className} mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl`}>
              Transform Your Growth with Mommantum {service.shortLabel}
            </h2>
            <p className={`${outfit.className} mx-auto mt-4 max-w-xl text-base text-neutral-600`}>
              Get a comprehensive audit of your existing campaigns, technical funnel, and opportunities to drive higher returns.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} rounded-xl bg-navy px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-brand`}
              >
                Start Your Project Today →
              </LocalizedClientLink>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
