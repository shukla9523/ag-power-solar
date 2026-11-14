# Architecture · AG POWER Website · v1.0

Source: project brief + System Design SOP + Phase 1 audit (`momentum-audit-report.md`). Exact route paths and new table/column definitions for new features are written in the task plan of each task (task.md) and added here in the same PR (rules #16). Live Supabase column lists are not in the repo: export the schema and paste it in §4.

## 1. System map
| Part | Technology | Job |
|---|---|---|
| Frontend | Next.js 15.3.9 App Router, React 19, Tailwind, Radix UI, Motion, lucide-react | Display, collect input, call APIs, loading/empty/error states |
| Backend | Next.js route handlers `src/app/api/**` + server-only modules `src/lib/**` (no separate server) | Business calculations, validation, sensitive integrations, credentials, lead persistence, permissions |
| Database / Auth | Supabase PostgreSQL, RLS, GoTrue | System of record, sessions |
| Hosting | Vercel (cron jobs in `vercel.json`) | Deploy, edge middleware, cron |
| Integrations | Google Sheets, Telegram Bot (new), MailX/SMTP, Cloudflare Turnstile | See §10 |
| AI (existing only) | Cloudflare Workers AI / OpenAI via `src/lib/services/ai-provider.ts` | Existing SEO features; see ai-setup-guide.md |

## 2. Responsibility rule
Frontend: visual presentation, user interaction, form input, display of calculator results, loading/empty/error states. Nothing else.
Backend: business calculations, input validation, sensitive integrations, credential management, lead persistence, permissions, SEO values.
Existing backend responsibilities are not moved into the frontend.

## 3. Folder structure (existing, from audit)
```
src/
  middleware.ts                 edge gate; public routes: zero DB work
  app/(site)/                   public pages: home, about, contact, faq, blog, services, work, editz, blog-ai, privacy-policy, terms-and-conditions
  app/admin/                    admin panel (blog, services, case-studies, pages, seo, sitemap, users, leads, clients, products, audit, security, settings)
  app/api/                      admin/*, auth/*, blog/*, contact, cron/*, keep-alive, preview
  app/{sitemap,robots,llms.txt}
  lib/config                    roles.ts, leads.ts, owner.ts
  lib/data                      fetch layer (services, blog-posts, case-studies, seo, faqs, product-pages…)
  lib/schema                    JSON-LD engine (resolvers, templates, tests)
  lib/seo                       sitemap, redirects, meta fields, page registry
  lib/services                  leads-service, google-sheets, mailer, mailx, notifications, ai-*, audit…
  lib/util                      rate-limit, sanitize, mask-pii, origin-check, api-response…
  lib/validation*               Zod schemas
  modules/                      common, contact, editz, home, layout (UI)
  styles/                       tokens.css, globals.css
db-proposals/                   reviewable SQL, executed by a human
docs/                           project docs
```

## 4. Data models
**Existing (names from audit):** services, case_studies, post (blog), testimonials, site_setting (incl. theme_tokens), site_keywords, product_pages, clients, seo_setting, link_suggestion, link_embedding, organization_profile, redirects, contact_leads, admin_notifications, audit tables, profiles, customer; legacy store tables left untouched.

`contact_leads` today: name, email, phone, subject, message, source, source_page, consent, consent_text_version, ip_hash, user_agent, status (new/contacted/qualified/closed/spam), notes, sheet_status/attempts, email_status/attempts, created_at, updated_at.

**Required by the brief (definitions go in task plans; database structure changes need approval):**
- Lead: Enquiry ID, date and time, name, phone, email, category (Residential / Commercial / Society), service, city, pincode, monthly bill, source page, enquiry type (Contact / Calculator / Catalogue), message, status (New / Contacted / Qualified / Closed), privacy consent; calculation details when submitted from the calculator; panel reference when submitted from the catalogue.
- Calculator configuration (configurable, not hardcoded): electricity tariffs, solar generation assumptions, panel wattage, system installation costs, inverter costs, mounting structures, maintenance, subsidy eligibility and limits, degradation assumptions; residential and commercial separate.
- Solar panel: brand, product/model name, wattage, cell technology, Mono PERC/TOPCon/other verified technology, bifacial/monofacial, DCR/NDCR, efficiency, dimensions, warranty, technical benefits, ideal applications, image.
- Content: service page configuration (3 solar services), FAQs with categories, testimonials (real only), process steps — reuse existing tables/templates where possible.

## 5. API routes
**Existing:** `POST /api/contact` (public lead form), `/api/auth/*`, `/api/admin/*` (role-checked), `/api/blog/publish` + `/upload`, `/api/cron/*` (CRON_SECRET), `/api/keep-alive`, sitemap/robots routes.
**Required by the brief (paths defined in task plans):**
- Enquiry submission for all form types with validation, duplicate protection, rate limiting, spam protection, source page.
- Calculator estimate (backend calculation).
- Panel catalogue list (search, filters, sorting, pagination) and panel detail.
Standard response shape per rules #7; all inputs validated (Zod); all lists paginated.

## 6. Auth and sessions
Existing Momentum auth is retained unchanged: Supabase GoTrue, httpOnly cookies, middleware gate for admin, roles verified server-side from `profiles`, optional admin MFA. Public visitors do not log in. Changing authentication/security models requires approval.

## 7. SEO data flow
Existing: one resolver per route type feeds both `generateMetadata` and the JSON-LD `@graph`; `seo_setting` per page; sitemap routes; robots; redirects table (301). Brief additions: unique titles/descriptions, canonical, Open Graph, breadcrumbs, structured data types listed in prd.md §6, FAQPage only when FAQ visible, no Product/Offer markup for panels. Organisation facts come from `src/lib/schema/site.ts` / `organization_profile` using verified AG POWER details. Staging always noindex.

## 8. State plan
Server data via Server Components + `src/lib/data/*` with `unstable_cache` and tag revalidation (existing). UI-only state local. (React Query is not installed; rules #8 exception to be decided — see memory.md.)

## 9. Error flow
Typed errors → route handler → standard response → client shows user-friendly message → `error.tsx` boundary keeps page alive. Forms preserve entered data on recoverable failures. Logs contain no personal data.

## 10. Integrations
**Lead pipeline (brief §12):** Customer form → secure backend submission → validation and duplicate protection → Google Sheets → Telegram notification.
- Credentials only in server env; never in browser bundles.
- Validate all incoming data; rate-limit submissions; implement retries; log integration failures without personal data.
- A Telegram failure never discards an accepted lead; submission handling is idempotent.
- Telegram message: new enquiry alert, name, phone, category, enquiry type, city, source page, relevant message.
- Existing building blocks: lead saved first then delivered in background, `cron/leads-retry`, Google Sheets with three delivery modes, honeypot, Turnstile, consent record.
| Integration | Direction | Auth | Status |
|---|---|---|---|
| Google Sheets | out | env credentials/webhook | exists; columns change to brief's lead structure |
| Telegram Bot | out | bot token in env | new |
| MailX / SMTP | out | env | exists |
| Turnstile | out | secret in env | exists |
| WhatsApp | link | none | CTA only |

## 11. Environments and config
dev (localhost:8000) / staging (Vercel preview, noindex) / production (Vercel). Variables listed in `.env.example`; secrets only in the secret manager; `.env.local` never committed or shared.

## 12. AI components
Existing only (SEO auto-fill, image fill, embeddings); see ai-setup-guide.md. No AI in new AG POWER features.

## 13. Diagrams
Lead flow in §10. Calculator and panel flows: added with their task plans.

## Feature → routes → models
| PRD feature | Routes | Models |
|---|---|---|
| F1–F5, F8, F9, F13, F14 pages | existing page routes (`app/(site)`) + services template | existing page/services/FAQ tables |
| F6 Calculator | calculator estimate (new) | Calculator configuration |
| F7 Catalogue | panel list/detail (new) | Solar panel |
| F10, F11 Forms + pipeline | enquiry submission (extends `/api/contact`) | Lead |
| F12 Blog | existing blog routes | existing blog tables |
