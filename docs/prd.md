# PRD · AG POWER Website (Momentum → AG POWER) · v1.0

Project owner: Electro Global · Final approver: CEO · Priority: High
Type: Existing website transformation + frontend redesign + functional integrations
Reference website: SolarSquare — https://www.solarsquare.in/ (learn from approach; do not copy layouts, text, brand assets or illustrations)
Solar panel reference: https://www.thesolarclub.in/category/solar-panels

This is NOT a rebuild of Momentum. Momentum already has dynamic frontend blocks, schemas, reusable structures, content management and blog functionality. We keep that architecture and transform visual identity, frontend experience, content and service structure.

---

## 1. Problem and users

**Objective.** Create a premium, professional solar-energy website for AG POWER that:
1. Establishes AG POWER as a trustworthy solar-energy brand.
2. Communicates residential, commercial and housing society solar solutions.
3. Educates customers about solar technology and its benefits.
4. Helps customers estimate their solar requirements and potential savings.
5. Showcases solar panels and their technical advantages.
6. Generates qualified enquiries through functional forms.
7. Provides a strong foundation for SEO and future marketing.

It must feel like a premium, established solar-energy company — not a generic WordPress template or an ordinary equipment-selling website.

**Every important section answers one of these questions:**
- Why should I choose solar?
- Why should I trust AG POWER?
- Which solar solution is suitable for me?
- How much capacity do I need?
- How much could I save?
- What happens after I submit an enquiry?

**User types**
- Homeowner (residential customer)
- Business (offices, factories, warehouses — commercial customer)
- Housing society / RWA / apartment association
- Admin (manages content through Momentum's existing content management)

**Brand personality:** Trust, Reliability, Innovation, Energy independence, Sustainability, Affordability, Engineering expertise, Long-term value. Not overly playful, overly colourful or excessively futuristic. Premium, clean, confident, approachable.

**Tagline (from brand material):** "Powering a Brighter Tomorrow." · "Clean Energy. Smarter Living."

---

## 2. Goals and success metrics

| Goal | Metric | Target | Measured in |
|---|---|---|---|
| Fast mobile pages | Mobile LCP | under 2.5 s | Lighthouse CI |
| Stable layout | CLS | under 0.1 | Lighthouse CI |
| Responsive interaction | INP | under 200 ms | Lighthouse / field data |
| Performance | Lighthouse performance | 80+ minimum | Lighthouse CI |
| Discoverability | Lighthouse SEO | 90+ | Lighthouse CI |
| Accessibility | Lighthouse accessibility | 90+ | Lighthouse CI |
| Quality | Lighthouse best practices | 90+ | Lighthouse CI |
| Lead capture | Every accepted enquiry recorded in Google Sheets + Telegram notification | 100% of accepted enquiries | Integration tests (see F11) |

Analytics goals / conversion targets: not provided — see Open questions.

---

## 3. Features (user stories)
Project priority: High (per brief). All features below are in scope for this version.

### F1. Brand identity and design system
As a visitor, I see one consistent AG POWER look on every page so that the brand feels trustworthy.
Acceptance criteria:
- [ ] Given any page, when rendered, then only the approved palette, Manrope + Inter, and approved radius/spacing tokens are used.
- [ ] Given any page, when viewed at 375 / 768 / 1024 / 1440 px, then there is no horizontal overflow, overlapping text or broken image ratio.
- [ ] Given a user with reduced-motion enabled, when animations would play, then they are disabled and no content is blocked.

### F2. Header and navigation
As a visitor, I can reach any page easily on desktop and mobile.
Navigation: Home · About Us · Solar Solutions (Residential / Commercial / Housing Society) · Solar Calculator · Solar Panels · Blogs · Contact Us, plus a prominent "Get Free Consultation" button.
Acceptance criteria:
- [ ] Given desktop, when I open "Solar Solutions", then a dropdown lists Residential, Commercial, Housing Society.
- [ ] Given mobile, when I open the menu, then it is clean, keyboard/touch accessible, with touch targets ≥ 44px.
- [ ] Given scrolling, when the header becomes sticky, then the transition is smooth and content is not covered.
- [ ] Default header background Warm Ivory with Forest Green typography; logo is AG POWER.

### F3. Homepage (12 sections, in this order)
As a visitor, I understand what AG POWER does and am guided to calculate savings or enquire.
1. **Header**
2. **Hero banner** — premium residential rooftop with solar panels, bright natural daylight, clean architectural photography, Forest Green dominant, Gold CTA. Headline: "Power Your Home with Smarter Solar Energy." Supporting copy: "Make the switch to cleaner energy, reduce your electricity expenses and take control of your energy future with AG POWER." Primary CTA: "Calculate Your Solar Savings". Secondary CTA: "Get Free Consultation". Responsive image handling, fixed image dimensions, hero prioritised for loading.
3. **Solar solutions** — three large visual cards (Residential, Commercial, Housing Society), each with image, short description, main benefits, Learn More → dedicated service page.
4. **Why choose solar?** — reduced electricity expenses; energy independence; long-term financial value; clean energy generation; better utilisation of rooftop space. Visual illustrations and iconography. No unverified savings or financial guarantees.
5. **Why AG POWER?** — expert consultation; customised solar planning; quality components; professional installation; after-sales assistance. Only claims supported by actual company information.
6. **Quick solar calculator** — compact preview. Inputs: customer category, monthly electricity bill, city or pincode. Shows indicative recommended capacity, estimated monthly savings, approximate system investment. CTA to the full calculator.
7. **Installation process** — timeline: Initial consultation → Site assessment → Solar system design → Proposal and approval → Installation → Commissioning and after-sales support.
8. **Featured solar panels** — each card: panel image, brand, model, wattage, technology, efficiency (where verified), key benefits. CTA: "Explore Solar Panels".
9. **Customer testimonials** — real testimonials only: name (where permission exists), project category, feedback, photo/video if authorised. Never fabricate reviews, ratings or outcomes.
10. **FAQs** — solar installation, investment, maintenance, electricity savings, solar panels; link to full FAQ page.
11. **Final CTA** — headline: "Your Solar Journey Starts Here." CTA: "Get Your Free Solar Consultation".
12. **Footer** — logo, short company introduction, main navigation, solar solutions, contact information, social links, legal pages, copyright.
Acceptance criteria:
- [ ] Given the homepage, when loaded, then sections appear in the order above.
- [ ] Given a section with no approved real content (e.g. testimonials), when published, then it is hidden or shows an empty state — never placeholder or fabricated content.
- [ ] Given each service card, when "Learn More" is clicked, then the matching service page opens.

### F4. About Us page
Sections: Hero · Company introduction · Our mission · Our vision · Why AG POWER · Our approach to solar energy · Our expertise · Team (only if approved information is available) · Trust indicators · FAQs · Contact CTA.
Acceptance criteria:
- [ ] Given the page, when published, then no company history, certifications, employee counts or achievements appear unless supplied by the company.

### F5. Service landing pages (shared reusable template, data-driven)
Every service page is a dedicated SEO-friendly landing page with unique content, images, benefits, FAQs (5–8 contextual) and CTAs, unique SEO metadata. No separate static implementation per page.

**F5a Residential Solar** — audience: individual homeowners.
Sections: hero · benefits of home solar · how rooftop solar works · suitable system capacities · solar panels and components · installation process · savings calculator CTA · subsidy information (where applicable) · testimonials · FAQs · enquiry form · final CTA. Primary CTA: "Calculate My Home Solar Savings".

**F5b Commercial Solar** — audience: businesses, offices, factories, warehouses.
Sections: hero · business electricity expenditure problem · commercial solar benefits · rooftop and project applications · custom system design · project installation process · investment and ROI explanation · relevant case studies (if available) · FAQs · business enquiry form · final CTA. Primary CTA: "Get a Commercial Solar Proposal".

**F5c Housing Society Solar** — audience: apartment associations, RWAs, housing societies.
Sections: hero · common-area electricity challenges · solar for lifts, pumps and common facilities · shared electricity cost benefits · installation planning · society approval and coordination process · project examples (if available) · FAQs · society enquiry form · final CTA. Primary CTA: "Get a Society Solar Consultation".

Acceptance criteria:
- [ ] Given each service page, when rendered, then it uses the shared template and a data configuration.
- [ ] Given each service page, when viewed, then it has 5–8 contextual FAQs, unique title/description, one H1.
- [ ] Given optional sections (case studies, project examples, testimonials) with no data, when rendered, then they are hidden or show an empty state.

### F6. Solar Calculator (real working feature, not a mockup)
As a visitor, I can estimate system size, cost and savings and then request a consultation.
**Inputs.** Required: customer category (Residential / Commercial / Housing Society), monthly electricity bill, city or pincode. Optional: monthly consumption in units, available rooftop area, roof type, electricity tariff, preferred system capacity.
**Results.** Recommended system capacity (kW) · approximate number of solar panels · expected monthly generation · estimated installation investment · estimated monthly savings · estimated annual savings · estimated payback period · indicative CO₂ reduction.
**Calculation rules.**
- All assumptions documented.
- No arbitrary prices or generation figures hardcoded in UI components.
- Configurable inputs for: electricity tariffs, solar generation assumptions, panel wattage, system installation costs, inverter costs, mounting structures, maintenance, subsidy eligibility and applicable limits, degradation assumptions (if calculating long-term savings).
- Residential and commercial assumptions kept separate.
- Subsidy is never applied automatically without checking eligibility and current applicable rules.
- Results shown as estimates, not guaranteed savings or quotations, with a clear disclaimer.
**Experience.** Step-based or single screen: (1) select property type → (2) bill and location → (3) optional roof information → (4) calculate → (5) result with visual summary → (6) consultation form. Customer can submit calculation details with their enquiry. Validation, loading and error states required.
Acceptance criteria:
- [ ] Given valid required inputs, when I calculate, then all eight results are shown with the disclaimer.
- [ ] Given missing/invalid inputs, when I calculate, then field-level messages explain what to fix.
- [ ] Given calculation in progress, then a loading state is shown; given a server error, then a friendly error and retry are shown with inputs preserved.
- [ ] Given a result, when I submit the consultation form, then the calculation details are included in the lead (enquiry type "Calculator").
- [ ] Calculations run in the backend; the frontend only displays.

### F7. Solar Panel Catalogue (information and discovery — NOT ecommerce)
Catalogue listing page, panel cards, and individual panel detail pages or equivalent expandable views (depending on existing architecture).
Each panel shows: brand · product/model name · wattage · cell technology · Mono PERC / TOPCon / other verified technology · bifacial or monofacial · DCR / NDCR (where applicable) · efficiency % · dimensions (where available) · warranty (where verified) · technical benefits · ideal applications.
Images: actual solar panel images from The Solar Club reference, subject to usage permission or appropriate licensing. No random substitute images; accurate product-image mapping.
Features: dynamic panel cards · search by brand or model · filters for wattage and technology · sorting where useful · panel comparison if feasible in existing architecture · individual panel information · enquiry CTA.
Every panel has an **"Enquire About This Panel"** action.
**Strictly prohibited:** cart, checkout, online payment, purchase flow, ecommerce order management, add-to-cart buttons.
Acceptance criteria:
- [ ] Given the catalogue, when I search by brand/model or filter by wattage/technology, then results update (search debounced) and an empty state shows when nothing matches.
- [ ] Given a panel, when I click "Enquire About This Panel", then the enquiry form opens with the panel prefilled (enquiry type "Catalogue").
- [ ] Given any catalogue page, then no cart/checkout/payment/add-to-cart element exists.
- [ ] Given a field with no verified data (efficiency, warranty, etc.), then it is not shown.

### F8. Customer Services page
Includes: installation assistance · solar consultation · system maintenance · technical support · after-sales assistance · service request enquiry. Contextual FAQs and a contact CTA. Only services the business actually provides are advertised.

### F9. Contact page
Contact hero · contact details · phone number · email · address (once provided and verified) · map (if applicable) · WhatsApp CTA · contact enquiry form · FAQs.

### F10. Reusable enquiry form system
Common fields: full name · phone number · email · customer category · city · pincode · service required · monthly electricity bill (where relevant) · message · privacy consent. Fields adapt to the enquiry type (not every field everywhere). One reusable form system wherever possible.
Every form must: validate inputs · show loading state · show success state · show user-friendly errors · prevent duplicate submissions · include spam protection · record the source page · preserve form data on recoverable failure.
Acceptance criteria:
- [ ] Given invalid input, when I submit, then field-level messages appear and nothing is sent.
- [ ] Given a submission in progress, when I click again, then no duplicate is created.
- [ ] Given a recoverable failure, then my entered data is preserved.
- [ ] Given success, then a success state tells me what happens next.
- [ ] Given consent is not ticked, then submission is blocked.

### F11. Google Sheets + Telegram lead pipeline (critical business requirement)
Flow: Customer form → secure backend submission → validation and duplicate protection → Google Sheets → Telegram notification.
**Google Sheets lead structure**

| Field | Description |
|---|---|
| Enquiry ID | Unique ID |
| Date and time | Submission timestamp |
| Name | Customer name |
| Phone | Contact number |
| Email | Email |
| Category | Residential / Commercial / Society |
| Service | Selected service |
| City | Location |
| Monthly bill | Customer's electricity bill |
| Source page | Website page |
| Enquiry type | Contact / Calculator / Catalogue |
| Message | Additional information |
| Status | New / Contacted / Qualified / Closed |

Additional fields may be added based on actual requirements.
**Telegram notification** contains: new enquiry alert · customer name · phone number · customer category · enquiry type · city · source page · relevant customer message.
**Security/reliability:** credentials on the server only; secure environment variables; validate all incoming data; rate-limit submissions; implement retries; log integration failures without exposing personal data; a Telegram failure must not discard an accepted lead; submission handling is idempotent.
Acceptance criteria:
- [ ] Given a valid enquiry from each form type, then a correct Sheets row (ID, timestamp, source page, enquiry type) and a correct Telegram message appear.
- [ ] Given the same submission twice, then only one lead is recorded.
- [ ] Given Telegram is down, then the lead stays recorded and the failure is logged without personal data.
- [ ] Given Google Sheets is temporarily unavailable, then behaviour is defined, tested and the failure is logged without personal data.
- [ ] Given the browser bundle, then no tokens or credentials are present.

### F12. Blog system (reuse Momentum blog — do not rebuild)
Adapt content to solar. Categories: Solar Energy Basics · Residential Solar · Commercial Solar · Solar Panel Technology · Solar Installation Guides · Solar Maintenance · Government Schemes and Subsidies · Solar Savings and ROI.
Maintain: blog listing · blog detail · categories · featured images · author details · publication dates · related articles · dynamic metadata · structured data · responsive reading experience. Each article has internal links to relevant services or the solar calculator.
Acceptance criteria:
- [ ] Given the blog, then listing, detail, categories, related articles and metadata work as they do in Momentum, with solar categories.

### F13. FAQ system
Central FAQ page plus a contextual FAQ section on every relevant core and service page. Categories: General solar questions · Residential solar · Commercial solar · Housing society solar · Solar panels · Installation · Maintenance · Savings and subsidy. Reusable dynamic FAQ blocks. FAQ content must be visible on the page if FAQ structured data is used.

### F14. Legal pages
Terms of Service and Privacy Policy. Privacy policy accurately explains: information collected · purpose · Google Sheets lead storage · Telegram notifications · data retention · customer rights · contact details for privacy requests. Legal content reviewed and approved by the company before publication.

### F15. Animations
Scroll-triggered section reveals · smooth fade/slide transitions · subtle image parallax · hover animations on cards · animated numerical counters · solar energy flow illustrations · smooth calculator result updates · testimonial carousel transitions · sticky navigation transitions · subtle button interactions. Use existing animation dependencies; no large new animation library without reason; respect reduced motion; never block content or interaction.

---

## 4. Out of scope (this version)

- Rebuilding Momentum from scratch.
- Any ecommerce: cart, checkout, online payment, purchase flow, order management, add-to-cart buttons.
- Product/Offer ecommerce structured data for informational panel listings (unless the page and data genuinely qualify).
- Fabricated reviews, ratings, project outcomes, company history, certifications, employee counts, achievements.
- Unverified savings figures or financial guarantees; calculator results presented as quotations.
- Copying SolarSquare layouts, text, brand assets or proprietary illustrations.
- Additional fonts beyond Manrope and Inter without approval.
- Replacing existing architecture, changing major database structures, removing existing functionality, changing authentication/security models, introducing a different technology stack, destructive production changes, materially increasing scope — all require approval first.

---

## 5. Roles and permissions

Momentum's existing role model is retained (roles verified server-side from the `profiles` table; no change to authentication or security models without approval):

| Action | Visitor | customer | marketer | admin | owner |
|---|---|---|---|---|---|
| View public pages, calculator, catalogue, blog | yes | yes | yes | yes | yes |
| Submit enquiry forms | yes | yes | yes | yes | yes |
| Manage content through Momentum admin (blog, services, SEO, leads, pages) | no | no | per `src/lib/config/roles.ts` | per `roles.ts` | per `roles.ts` |

Exact per-role page/API access is defined in `src/lib/config/roles.ts` (existing). Any additional role (e.g. seo_editor) — see Open questions.

---

## 6. SEO goals (public sites)

Implement: unique page titles · unique meta descriptions · one primary keyword per page · one H1 per page · canonical URLs · Open Graph metadata · appropriate structured data · XML sitemap · robots.txt · breadcrumbs where relevant · internal linking · image alt text · responsive rendering.
Structured data: Organization · WebSite · WebPage · Service · ContactPage · Article/BlogPosting · FAQPage (only when eligible and visibly supported) · BreadcrumbList.
Company details in structured data come from verified company information only.
Target keywords per page type and which SEO fields admins edit: not provided — see Open questions.

---

## 7. AI use

**No new AI in AG POWER features.** The existing Momentum codebase already contains AI features (SEO auto-fill, image fill, embeddings for internal links; `ai-provider.ts`, kill switch `AI_ENABLED`). These are existing functionality and stay unless removal is approved (brief §19). Because AI exists in the repo, `ai-setup-guide.md` is required — keep Momentum's guide and adapt naming only (see momentum-audit-report.md §7-D). Any new AI feature needs the guide updated first.

---

## 8. Performance expectations

Targets: mobile LCP < 2.5 s · CLS < 0.1 · INP < 200 ms · Lighthouse performance 80+ · SEO 90+ · accessibility 90+ · best practices 90+.
Also: optimise images (WebP/AVIF), lazy-load below-the-fold imagery, prioritise hero imagery, split code by route, avoid unnecessary dependencies and excessive animations, optimise font delivery, minimise layout shifts.
Expected users and data size now and in 12 months: not provided — see Open questions.

---

## 9. Integrations

| Integration | Purpose | Status |
|---|---|---|
| Google Sheets | Store every accepted lead | Exists in Momentum (webhook / Sheets API / Google Form); lead structure changes to the AG POWER structure (F11) |
| Telegram Bot | Notify team of each new enquiry | New (none exists) |
| WhatsApp | CTA on contact page | Link/CTA only (brief) |
| Map | Contact page map, if applicable | Brief |
| Email (MailX / SMTP), Cloudflare Turnstile | Existing lead emails / spam check | Exist in Momentum; retained |
| Analytics | Not specified in brief | See Open questions |

---

## 10. Data and compliance

Personal data collected via forms: full name, phone, email, city, pincode, monthly electricity bill, message, customer category, service required, source page, privacy consent; calculator inputs/results when submitted with an enquiry.
Purpose: respond to solar enquiries and consultations.
Stored in: Google Sheets (leads); Telegram receives notification content.
No secrets/tokens/OTPs/full phone numbers in code or logs; integration failures logged without personal data.
Compliance: DPDP Act 2023 (per company SOP). Privacy policy must cover collection, purpose, Sheets storage, Telegram, retention, customer rights, privacy contact.
Retention: Momentum's existing code deletes leads after 730 days (`LEAD_RETENTION_DAYS`); whether AG POWER keeps this value, and the deletion-on-request process, are in Open questions.

---

## 11. Constraints

- Retain existing Momentum architecture wherever practical.
- Devices/breakpoints: test at 375px mobile, 768px tablet, 1024px laptop, 1440px desktop; mobile designed intentionally.
- Accessibility: touch targets ≥ 44px, accessible forms, keyboard-accessible navigation, visible focus states, proper contrast (WCAG AA), reduced-motion support.
- Fonts: Manrope + Inter only; self-host variable fonts where practical with fallback fonts.
- Stack/hosting (found by audit): Next.js 15 App Router + Supabase on Vercel; domain currently Momentum's.
- Deadline, budget, languages: not provided — see Open questions.

---

## 12. Open questions (must be resolved before Gate 1)

1. Verified company information: phone, email, address, WhatsApp number, social links, logo files, company introduction, mission, vision, team, trust indicators, differentiators actually supported.
2. Real testimonials, case studies and project examples available, with permissions.
3. Solar panel data (brands, models, wattage, technology, bifacial/mono, DCR/NDCR, efficiency, dimensions, warranty) and written permission/licence to use The Solar Club panel images.
4. Calculator assumption values (tariffs by customer/city, generation per kW, panel wattage, installation/inverter/mounting costs, maintenance, subsidy rules and limits, degradation) and who owns/updates them.
5. Telegram chat/group details and Google Sheet owner/access.
6. Enquiry-type value for service-page, business and society enquiry forms (brief lists Contact / Calculator / Catalogue only).
7. Data retention period for AG POWER (existing code: 730 days), deletion-on-request process, privacy contact, legal content approver.
8. Roles beyond Momentum's existing ones (e.g. seo_editor) and which SEO fields admins edit; target keywords per page.
9. Analytics tools and conversion goals.
10. Expected users/data size now and in 12 months.
11. Languages (English only or also Hindi), deadline, budget.
12. Dark mode: brief defines the light palette only (SOP asks for light and dark values) — is dark mode required?
13. Is the Supabase project new for AG POWER or the same as Momentum's?
14. Approvals required by the brief (§19) for items found in the audit: replacing/archiving Momentum's existing `docs/`; removing existing Momentum pages/functionality (EDITZ, Blog AI, Work/case studies, agency services); new tables/columns in the database; changing existing lead-save behaviour. See momentum-audit-report.md.

Gate 1 check: every feature has acceptance criteria ✔ · sections 5, 7, 10 filled ✔ · **section 12 is NOT empty — Gate 1 cannot pass until answered.**

---

## Appendix A. Reference study (brief §3.1)
Study SolarSquare (https://www.solarsquare.in/) carefully. Pay attention to: hero composition · typography hierarchy · section spacing · residential and commercial service presentation · photography · customer trust elements · savings calculator UX · conversion placement · mobile experience. Purpose: learn from its design approach, not copy its layouts, text, brand assets or proprietary illustrations. Create an original AG POWER visual identity.
General UI principles (brief §3.2): minimal and clean · flat UI with restrained shadows · rounded corners generally 10–14px · generous whitespace · consistent container widths · strong typography hierarchy · beautiful photography · consistent button styles · subtle transitions · excellent responsive behaviour.

## Appendix B. Lead pipeline testing (brief §12.5)
Submit test enquiries from every form type and verify: (1) correct Google Sheets row · (2) correct Telegram notification · (3) correct source page · (4) correct timestamp · (5) duplicate protection · (6) behaviour when either integration is temporarily unavailable.

## Appendix C. Developer authority and boundaries (brief §19)
Authorised to: redesign the frontend · improve layouts · extend dynamic blocks · build reusable components · add appropriate animations · improve responsiveness · implement the calculator · build the catalogue · implement approved integrations · improve frontend structure · refactor relevant code.
Approval required before: replacing the existing architecture · changing major database structures · removing existing functionality · changing authentication or security models · introducing a different technology stack · making destructive production changes · increasing project scope materially.
If an architectural limitation is found: report the issue and recommend a solution instead of silently working around it.

## Appendix D. Working agreements (brief §22)
1. Decisions within scope are trusted. 2. No permission needed for every small design choice. 3. Questions and technical discussions are encouraged. 4. Mistakes are opportunities to improve, not reasons for blame. 5. Report blockers early. 6. Never hide an issue or mark incomplete work as complete. 7. If something is technically difficult, explain it and recommend an alternative. 8. Do not compromise security or existing functionality to meet an artificial deadline. 9. Maintain reasonable working boundaries. 10. Prioritise quality and transparent communication.
Daily progress update: completed today · currently working on · next deliverable · blockers · decisions requiring approval. Report actual progress, not just activity.
Think like a senior product designer, frontend architect and engineering lead: not a simple redesign that changes colours and swaps text — a cohesive, premium solar-energy customer experience, trustworthy for a homeowner, professional for a commercial client, organised for a large housing society. Proceed with implementation only after the required planning and approval gates are completed.

## Appendix E. Definition of Done (brief §21)
Brand and design
- [ ] AG POWER brand identity is implemented.
- [ ] Approved palette is used consistently.
- [ ] Manrope and Inter are implemented.
- [ ] Responsive design is complete.
- [ ] Animations work smoothly.
- [ ] Design is consistent across all pages.
Website
- [ ] All main pages are implemented.
- [ ] All three service pages are implemented.
- [ ] Every relevant page has contextual FAQs.
- [ ] Blog functionality works.
- [ ] Navigation and footer work.
- [ ] All internal links are correct.
Functionality
- [ ] Solar calculator produces valid estimates.
- [ ] Panel catalogue works.
- [ ] Search and filters work where implemented.
- [ ] Every form works.
- [ ] Google Sheets receives leads.
- [ ] Telegram notifications are received.
- [ ] Errors and loading states are handled.
Technical quality
- [ ] Existing Momentum architecture is preserved wherever practical.
- [ ] Dynamic schemas work.
- [ ] No unrelated functionality is broken.
- [ ] No exposed secrets.
- [ ] No major console errors.
- [ ] SEO implementation is complete.
- [ ] Lighthouse targets are achieved.
- [ ] Security review passes.
- [ ] End-to-end testing passes.
Release
- [ ] All work is committed.
- [ ] Documentation is updated.
- [ ] Known issues are documented.
- [ ] Staging has been reviewed.
- [ ] Final approval is received.
