import { Metadata } from "next"
import Image from "next/image"
import { notFound, permanentRedirect } from "next/navigation"
import { findRedirect } from "@lib/seo/redirects"
import { getCaseStudy, getCaseStudies } from "@lib/data/case-studies"
import { getFirstSeoSetting } from "@lib/data/seo"
import { resolveCaseStudyData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import { epilogue, outfit, mansalva } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const revalidate = 60

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [study, seoSetting] = await Promise.all([
    getCaseStudy(slug),
    getFirstSeoSetting([`work:${slug}`, `case-study:${slug}`]).catch(() => null),
  ])

  if (!study) {
    return {
      title: "Case Studies | Mommantum",
      description: "Explore verified growth results and case studies from Mommantum clients.",
    }
  }

  const resolved = resolveCaseStudyData(study, seoSetting)
  return buildMetadataFromResolved(resolved)
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [study, seoSetting] = await Promise.all([
    getCaseStudy(slug),
    getFirstSeoSetting([`work:${slug}`, `case-study:${slug}`]).catch(() => null),
  ])

  // Renamed URLs 301 to their new address; anything else is a real 404 (not a soft redirect).
  if (!study) {
    const target = await findRedirect(`/work/${slug}`)
    if (target) permanentRedirect(target)
    notFound()
  }

  return (
    <>
      <JsonLd type="case-study" data={study} seoSetting={seoSetting} />

      <main className="min-h-screen bg-paper text-navy pb-24">
        {/* ─── BREADCRUMBS ─── */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="content-container mx-auto max-w-[1100px] px-4 py-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-neutral-500">
              <LocalizedClientLink href="/" className="hover:text-brand transition-colors">
                Home
              </LocalizedClientLink>
              <span>/</span>
              <LocalizedClientLink href="/work" className="hover:text-brand transition-colors">
                Case Studies
              </LocalizedClientLink>
              <span>/</span>
              <span className="font-medium text-navy truncate max-w-[200px] sm:max-w-[400px]">
                {study.title}
              </span>
            </nav>
          </div>
        </div>

        {/* ─── HERO ─── */}
        <section className="content-container mx-auto max-w-[1100px] px-4 pt-12 pb-10 sm:px-6 lg:px-8">
          <span className={`${mansalva.className} inline-block rounded-full bg-brand-tint px-4 py-1 text-sm font-semibold text-brand border border-brand-pale`}>
            {study.category}
          </span>

          <h1 className={`${epilogue.className} mt-4 text-3xl font-extrabold tracking-[-0.04em] text-navy sm:text-4xl lg:text-5xl lg:leading-[1.12]`}>
            {study.title}
          </h1>

          {study.tagline && (
            <p className={`${outfit.className} mt-4 text-lg text-neutral-600 sm:text-xl font-medium`}>
              {study.tagline}
            </p>
          )}

          {/* ─── METRICS STRIP ─── */}
          {study.metrics && study.metrics.length > 0 && (
            <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
              {study.metrics.map((m, idx) => (
                <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm text-center">
                  <p className={`${outfit.className} text-xs font-semibold uppercase tracking-wider text-neutral-500`}>
                    {m.label}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {m.before && (
                      <span className={`${outfit.className} text-sm line-through text-neutral-400`}>
                        {m.before}
                      </span>
                    )}
                    <span className={`${epilogue.className} text-2xl font-extrabold text-brand`}>
                      {m.after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── IMAGE ─── */}
          {study.image && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-md">
              <Image
                src={study.image}
                alt={study.title}
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
              />
            </div>
          )}

          {/* ─── CASE STUDY DETAILS ─── */}
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-8">
              {study.about && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <h3 className={`${epilogue.className} text-xl font-bold text-navy`}>About the Client</h3>
                  <p className={`${outfit.className} mt-3 text-sm leading-relaxed text-neutral-600`}>
                    {study.about}
                  </p>
                </div>
              )}

              {study.challenge && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <h3 className={`${epilogue.className} text-xl font-bold text-navy`}>The Challenge</h3>
                  <p className={`${outfit.className} mt-3 text-sm leading-relaxed text-neutral-600`}>
                    {study.challenge}
                  </p>
                </div>
              )}

              {study.solution && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <h3 className={`${epilogue.className} text-xl font-bold text-navy`}>Our Solution</h3>
                  <p className={`${outfit.className} mt-3 text-sm leading-relaxed text-neutral-600`}>
                    {study.solution}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-8">
              {study.whatWeDid && study.whatWeDid.length > 0 && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                  <h3 className={`${epilogue.className} text-xl font-bold text-navy`}>What We Did</h3>
                  <ul className="mt-4 space-y-3">
                    {study.whatWeDid.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 text-xs text-brand font-bold">✓</span>
                        <span className={`${outfit.className} text-sm text-neutral-700`}>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {study.results && study.results.length > 0 && (
                <div className="rounded-2xl border border-brand/20 bg-brand-tint/50 p-8">
                  <h3 className={`${epilogue.className} text-xl font-bold text-navy`}>Key Results</h3>
                  <ul className="mt-4 space-y-3">
                    {study.results.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 text-xs text-brand">★</span>
                        <span className={`${outfit.className} text-sm font-semibold text-neutral-800`}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ─── FOOTER CTA ─── */}
          <div className="mt-14 rounded-2xl bg-navy p-8 text-center text-white sm:p-12">
            <h3 className={`${epilogue.className} text-2xl font-bold sm:text-3xl`}>
              Want similar results for your business?
            </h3>
            <p className={`${outfit.className} mx-auto mt-3 max-w-xl text-neutral-300 text-sm sm:text-base`}>
              Let&apos;s build a custom growth system for your brand with performance marketing, SEO, and creative execution.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <LocalizedClientLink
                href="/contact"
                className={`${epilogue.className} rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-brand-deep`}
              >
                Schedule Growth Consultation →
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/work"
                className={`${epilogue.className} rounded-xl border border-neutral-600 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10`}
              >
                View All Case Studies
              </LocalizedClientLink>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
