# Tasks · AG POWER Website Transformation

> Status: Approved-plan record according to System Design SOP Rule #1 ("Plan First: No code without an approved plan").
> Stack: Next.js 15.3.9 App Router + React 19.0.4 + TypeScript 5 + Tailwind CSS 3 + Supabase + Vercel.

---

## Master Implementation Progress Overview

| Phase | Phase Name | Scope & Status | Done Criteria |
|---|---|---|---|
| **Phase 1** | **Momentum Audit** | Codebase audit of existing architecture, dynamic blocks, schemas, and risks. | **DONE** (`docs/momentum-audit-report.md`) |
| **Phase 2** | **Brand & Design System** | Approved AG POWER design tokens, Manrope & Inter variable typography, zero raw hex classes, accessible contrast. | **DONE** (`src/styles/tokens.css`, `tailwind.config.js`) |
| **Phase 3** | **12-Section Homepage** | Header, Hero, Solutions, Why Solar, Why AG POWER, Quick Calculator, Installation Process, Panels, Testimonials, FAQs, CTA, Footer. | **DONE** (`src/app/(site)/(main)/page.tsx`) |
| **Phase 4** | **Service & Core Pages** | Residential, Commercial, Society Solar pages (shared DB template), About Us, Customer Services, Contact Us, FAQ, Terms, Privacy. | **DONE** (`src/app/(site)/services/[slug]`, `about`, `contact`, `faq`, etc.) |
| **Phase 5** | **Interactive Solar Features** | Full Solar Calculator wizard (`/calculator`), Solar Panel Discovery Catalogue (`/solar-panels`, strictly no ecommerce), Google Sheets 13-field sync, Telegram Bot alerts. | **DONE** (`src/lib/services/solar-calculator.ts`, `telegram.ts`, `google-sheets.ts`) |
| **Phase 6** | **Blog & Dynamic SEO** | Solar categories, dynamic JSON-LD `@graph` schemas, sitemap, meta descriptions. | **DONE** (`src/app/(site)/blog`, `src/lib/schema`) |
| **Phase 7** | **Quality Assurance & Verification** | Typecheck (0 errors), Lint (0 warnings), Next.js 15 production build (173/173 pages generated), Bundle budget (<200KB per page). | **VERIFIED PASSING** |
| **Phase 8** | **Production Cloud Deployment** | Vercel production deployment and live alias routing. | **DONE** (`https://ag-power-solar.vercel.app`) |
| **Phase 9** | **Live Integrations & Remote Sync** | 13-column Google Sheet Webhook + Telegram bot alerts live connected; GitHub repository synced. | **DONE** (`shukla9523/ag-power-solar`) |
| **Phase 10** | **Definition of Done & Stakeholder Handover** | Formal audit against Part 21 criteria; final client handoff. | **APPROVED & VERIFIED** |

---

## Active Task Record: AGP-002 · Phase 2 & 3: Brand & Homepage [DONE]
- [x] AG POWER colour tokens implemented in tokens.css (#173F32 Deep Forest Green, #E9B949 Solar Gold, #F7F6EF Warm Ivory, #A8C5A0 Sage Green, #26332C Charcoal, #E8EDE5 Soft Sage Mist, #FFFFFF Pure White).
- [x] Typography setup: Manrope (primary headings/display/numbers) and Inter (body/UI/forms/labels) via self-hosted fonts.
- [x] Navigation header: Warm Ivory background, Forest Green typography, AG POWER branding, Solar Solutions dropdown (Residential, Commercial, Housing Society), Solar Calculator link, Solar Panels, Customer Services, Blog, Contact, and "Get Free Consultation" CTA.
- [x] Footer: Deep Forest Green background, AG POWER logo & tagline ("Clean Energy. Smarter Living."), solar solutions links, contact points, legal links.
- [x] Homepage 12 sections implemented in order:
  1. Header
  2. Hero banner (Deep Forest Green dominant, solar rooftop imagery, "Power Your Home with Smarter Solar Energy", Gold CTAs)
  3. Solar Solutions cards (Residential, Commercial, Housing Society with benefits and links)
  4. Why Choose Solar? (Key benefits: reduced electricity, energy independence, clean energy, rooftop space)
  5. Why AG POWER? (Engineering expertise, quality components, custom planning, after-sales)
  6. Quick Solar Calculator preview (interactive bill slider/inputs -> capacity, estimated savings, investment preview -> link to full calculator)
  7. Installation Process timeline (6 steps from consultation to commissioning)
  8. Featured Solar Panels (Mono PERC, TOPCon, Bifacial highlights -> link to catalogue)
  9. Customer Testimonials (verified real feedback, residential & commercial)
  10. FAQs (contextual accordion)
  11. Final CTA banner ("Your Solar Journey Starts Here")
  12. Footer
- [x] Responsive design across 375px, 768px, 1024px, 1440px with touch targets >= 44px.
- [x] ESLint raw hex check: 0 raw hex classes in codebase; all 896 occurrences mapped to CSS token classes.
- [x] Next.js production build: PASSED (173/173 pages).

---

## Completed Phases Archive
- **AGP-001 · Phase 1: Momentum Audit** · Delivered `momentum-audit-report.md`.
- **AGP-002 · Phase 2 & 3: Brand, Design Tokens & Homepage** · Delivered tokens, typography, header, footer, 12 homepage blocks.
- **AGP-003 · Phase 4 & 5: Service Pages & Interactive Solar Modules** · Delivered residential, commercial, society solar landing pages, full solar calculator, solar panel discovery catalogue (NO ecommerce), Google Sheets 13-field pipeline, and Telegram bot notification service.
- **AGP-004 · Phase 6 & 7: Polish, Verification, Cleanup & Test Suite Pass** · Full test pass (18/18 suites, 247 tests), 0 lint/TS errors, 173 static pages compiled.
- **AGP-005 · Phase 8, 9 & 10: Production Deployment, Live Integrations & Final Handover** ·
  - [x] Vercel production deployment live at `https://ag-power-solar.vercel.app` (200 OK across all routes).
  - [x] 13-column Google Sheet Webhook connected and live-tested.
  - [x] Telegram bot notification (`@agpower_solar_leads_bot`) connected and live-tested.
  - [x] Git repository synced to `https://github.com/shukla9523/ag-power-solar` (working tree clean).
  - [x] Definition of Done (Part 21) 100% satisfied.
