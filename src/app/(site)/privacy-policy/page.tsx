import { Metadata } from "next"
import { manrope, inter } from "@lib/fonts"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getSeoSetting } from "@lib/data/seo"
import { getPageMetaDefault } from "@lib/schema/page-defaults"
import { getPageFaqs } from "@lib/data/page-faqs"
import { resolveLegalPageData, buildMetadataFromResolved } from "@lib/schema/resolvers"
import JsonLd from "@modules/common/components/json-ld"
import PageFaqSection from "@modules/common/components/page-faq-section"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seoSetting = await getSeoSetting("privacy-policy").catch(() => null)
  const defaultMeta = getPageMetaDefault("privacy-policy")!
  const resolved = resolveLegalPageData(
    "privacy-policy",
    defaultMeta.title,
    defaultMeta.description,
    seoSetting
  )
  return buildMetadataFromResolved(resolved)
}

export default async function PrivacyPolicyPage() {
  const seoSetting = await getSeoSetting("privacy-policy").catch(() => null)
  const defaultMeta = getPageMetaDefault("privacy-policy")!
  const faqs = getPageFaqs("privacy-policy", seoSetting)

  return (
    <main className={`relative overflow-hidden bg-ivory pt-12 pb-20 lg:pt-16 lg:pb-28 ${inter.className}`}>
      <JsonLd
        type="page"
        slug="privacy-policy"
        title={defaultMeta.title}
        description={defaultMeta.description}
        seoSetting={seoSetting}
      />

      <div className="content-container relative px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[880px]">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <LocalizedClientLink
              href="/"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-charcoal/60 transition-colors hover:text-forest"
            >
              ← Back to Home
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/terms-and-conditions"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Terms of Service →
            </LocalizedClientLink>
          </div>

          <div className="mt-6 border-b border-charcoal/10 pb-8">
            <h1 className={`${manrope.className} text-[34px] font-extrabold tracking-[-0.03em] text-forest sm:text-[44px]`}>
              Privacy Policy
            </h1>
            <p className="mt-2 text-[14px] text-charcoal/70">
              Electro Global (operating as AG POWER) • Effective Date: November 2026 • Compliant with DPDP Act 2023
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {[
              {
                title: "1. Overview & Scope",
                content: `Electro Global, doing business as AG POWER ("AG POWER", "we", "us", or "our"), is committed to safeguarding your personal data in accordance with the Digital Personal Data Protection (DPDP) Act 2023 of India. This Privacy Policy details the types of personal and property data we collect via agpower.in, how we process and store that information, and your legal rights as a data principal.`,
              },
              {
                title: "2. Personal & Project Information We Collect",
                content: `When you request a solar savings estimate, submit an enquiry, or schedule a rooftop survey, we collect: (a) Contact identifiers: full name, telephone number, and email address; (b) Site & Energy Data: installation pincode/city, property type (residential, commercial, housing society), average monthly electricity bill, sanctioned load, and estimated rooftop square footage; (c) Technical details: optional electricity bill uploads or DISCOM account identifiers required for net-metering feasibility.`,
              },
              {
                title: "3. Lawful Purpose & Processing",
                content: `We collect and process your information strictly for legitimate commercial and engineering purposes: (a) Preparing customized solar kW sizing and financial payback calculations; (b) Scheduling and conducting on-site engineering surveys; (c) Coordinating with regional state DISCOMs and central government portals (e.g., PM Surya Ghar National Portal) for net-metering approvals and direct-benefit subsidy disbursements; (d) Delivering operational system alerts and scheduled maintenance notifications.`,
              },
              {
                title: "4. Zero-Spam & Non-Disclosure Commitment",
                content: `AG POWER does NOT sell, rent, lease, trade, or transfer your contact details to third-party telemarketers, lead brokers, or unrelated advertisers. Your information is accessed solely by authorized AG POWER engineers, verified site surveyors, and project managers directly responsible for executing your solar project.`,
              },
              {
                title: "5. Data Storage, Security & Integration Partners",
                content: `Inquiry submissions are transmitted using TLS 1.3 encryption. Lead information is stored in restricted-access databases and secure Google Sheets repositories protected by multi-factor authentication. Instant internal alerts are dispatched via encrypted bot notifications (such as Telegram API) to ensure immediate engineering follow-up.`,
              },
              {
                title: "6. Cookies & Site Analytics",
                content: `Our website uses standard technical cookies and anonymous analytics to understand site performance, navigation flows, and calculator utilization. You may adjust your browser preferences to reject non-essential cookies without affecting your ability to browse our solar solutions or contact our team.`,
              },
              {
                title: "7. Data Retention & Erasure",
                content: `We retain inquiry details for the duration required to complete your solar consultation, project installation, and active warranty/AMC cycles. If you do not proceed with an installation, you may request permanent erasure of your contact record from our active databases at any time.`,
              },
              {
                title: "8. Your Rights Under DPDP Act 2023",
                content: `As an Indian citizen and data principal, you have the right to: (a) Confirm whether AG POWER processes your personal data; (b) Access a summary of personal data held; (c) Request correction, completion, or updating of inaccurate records; (d) Withdraw consent and request data deletion; (e) Nominate another individual to exercise rights in the event of incapacity.`,
              },
              {
                title: "9. Grievance Officer & Contact",
                content: `For any inquiries, requests for data deletion, or grievances regarding our privacy practices, please contact our Data Protection Officer: Electro Global (AG POWER), Email: akashshukla9523@gmail.com, Phone: +91 95234 67849, Address: Corporate Office, India. Grievances are reviewed and acknowledged within 48 hours.`,
              },
            ].map((section) => (
              <div
                key={section.title}
                className="rounded-[16px] border border-charcoal/10 bg-white p-6 shadow-xs lg:p-7"
              >
                <h2 className={`${manrope.className} text-[18px] font-bold text-forest sm:text-[20px]`}>
                  {section.title}
                </h2>
                <p className="mt-3 text-[14.5px] leading-[1.8] text-charcoal/80">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {faqs && faqs.length > 0 && (
            <div className="mt-14">
              <PageFaqSection
                faqs={faqs}
                title="Privacy & Data Protection FAQs"
                subtitle="Common questions regarding how AG POWER protects customer information under DPDP Act 2023."
              />
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-[18px] bg-forest p-8 text-center text-white shadow-md sm:p-10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 text-[20px]">
              🔒
            </span>
            <h3 className={`${manrope.className} mt-3 text-[22px] font-extrabold text-white sm:text-[26px]`}>
              Have questions about your solar data or privacy?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-[14.5px] leading-relaxed text-white/80">
              Our privacy and compliance officers are happy to assist you with any questions regarding our data practices.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <LocalizedClientLink
                href="/contact"
                className={`${manrope.className} inline-flex h-[46px] items-center justify-center rounded-[12px] bg-emerald-600 hover:bg-emerald-500 px-7 text-[13px] font-bold text-white transition-all active:scale-95 shadow-md`}
              >
                Contact Privacy Desk →
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
