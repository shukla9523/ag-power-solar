# Momentum Audit Report · AGP-001 (Phase 1) · v1.0

Scope: read-only audit of `MommantumNew.zip` (Next.js repo). No implementation code written; nothing in the repo was modified.
Method: read docs/, package.json, config, middleware, API routes, services, data layer, schema engine, tokens/fonts, migrations (db-proposals), CI. Env **variable names only** were read from `.env.local` (no values).
Not verified (not possible here): `npm run build`, `npm test`, `npm run lint`, live Supabase schema/data, live site, Vercel settings. `node_modules` in the zip is Windows-built, so tests/build could not be run. Treat "passes CI" as unverified.

---

## 1. Architecture report

| Part | Finding |
|---|---|
| Framework | Next.js 15.3.9 App Router, React 19.0.4, TypeScript 5, Tailwind 3 (+ Medusa UI preset, Radix), `motion` for animation, lucide-react |
| Backend | No separate server. Next.js route handlers (`src/app/api/**`) + server-only modules (`src/lib/**`) |
| Database / auth | Supabase PostgreSQL + RLS + GoTrue. Anon client for public reads, service-role client for admin APIs. Roles resolved server-side from `profiles` (owner/admin/marketer/customer), optional admin MFA |
| Hosting | Vercel (serverless), Vercel cron jobs (keep-alive, publish-scheduled, leads-retry, seo-auto-fill) |
| Validation | Zod 4 (`src/lib/validation*.ts`, route-level schemas) |
| Rendering | Server Components, ISR (`revalidate` 60/300) + `unstable_cache` with tag revalidation (`src/lib/revalidate.ts`) |
| SEO | Unified JSON-LD `@graph` engine (`src/lib/schema/**`), one resolver per route type feeding both `generateMetadata` and JSON-LD; sitemap routes, robots, redirects table (301 on slug change), llms.txt |
| Fonts | Self-hosted via `next/font/local` (Epilogue, Outfit, DM Sans, Mansalva). **Not Manrope/Inter** |
| Existing docs | `docs/` already contains Momentum's own SOP files (prd, architecture, design, performance, ai-setup-guide, task, memory — **no rules.md in the zip**) plus ~17 other files (see risk R-01) |
| Size | 279 source files in `src/` |

### Folder map (actual)
- `src/app/(site)/` public pages: home, about, contact, faq, blog, blog/[slug], blog-ai, services, services/[slug] (+ how-it-works), work, work/[slug], editz, privacy-policy, terms-and-conditions
- `src/app/admin/` admin panel: blog, services, case-studies, pages, seo, sitemap, users, leads, clients, products (EDITZ/Blog AI section editor), audit, security, settings
- `src/app/api/` admin/*, auth/*, blog/publish + upload, **contact**, cron/*, keep-alive, preview, + `src/app/{sitemap,robots,llms.txt}`
- `src/lib/` config (roles, leads, owner), data (fetch layer), schema (JSON-LD), seo, services (leads, google-sheets, mailer, mailx, notifications, ai-*), util (rate-limit, sanitize, mask-pii, origin-check…), validation, theme
- `src/modules/` UI by domain: common, contact, editz, home, layout
- `db-proposals/` reviewable SQL migrations/seeds (executed by a human; no live DDL in zip)

---

## 2. Component inventory

| Area | Components | Reusable for AG POWER? |
|---|---|---|
| Layout | `Header`, `NavBar`, `ServicesDropdown`, footer set (`MainFooter`, `EditzFooter`, `FooterAccordion`, `FooterFaqSection`, `footer-data.ts`) | Yes, restyle. Nav/footer content partly in code (`footer-data.ts`) — see R-06 |
| Home | `hero`, `why-mommantum`, `who-we-are`, `stats-strip`, `our-services`, `case-studies` (each 200–315 lines, **hardcoded sections**) | Structure yes; content/copy rewrite. Not data-driven |
| Common | `page-faq-section`, `json-ld`, `interactive-link`, `localized-client-link`, icons | Yes (FAQ + JSON-LD directly reusable) |
| Contact | `ContactClient` (535 lines), `google-form-contact` | Base for the enquiry form, needs new fields and extraction into a reusable form |
| EDITZ | ~15 components (Hero, Process, Testimonials, FAQ, Marquee, Footer…) | Mommantum-specific product. Some patterns reusable (Process, Testimonials, FAQ) |
| Services | `services/[slug]/page.tsx` (296 lines) — **DB-driven template** keyed by slug | **Best base for the 3 solar service pages** |
| Blog | `blog` listing + `[slug]` detail + admin BlogEditor + `/api/blog/publish` | Reusable; solar categories needed |
| Admin | SharedEntityEditor, MediaPicker, NotificationBell, admin `ui.tsx` | Reusable |

**Important correction to the brief:** Momentum has **no generic "block registry / page renderer"**. Pages are either (a) hardcoded React sections (home, about…), (b) DB-driven templates (services, blog, case studies), or (c) "product pages" (EDITZ, Blog AI) whose text is overridden from the admin via `product_pages.content` + `section-config.ts` + Zod (`validation/product-pages.ts`). The (c) mechanism is the closest thing to "dynamic blocks", but it is specific to two product pages.

---

## 3. Schema inventory

Supabase tables found in code / migrations (exact columns **not verifiable** — no live DDL in the zip; the existing architecture.md also says this):
- Content: `services` (slug, title, short_label, description, intro, image, points[], outcomes[], why_it_matters[], faqs[]), `case_studies`, `post` (blog: slug, title, category_id, featured_image, excerpt, content, author_name, status, published_at, meta_*, faqs), `testimonials`, `site_setting` (incl. theme_tokens), `site_keywords`, `product_pages` (slug, content jsonb), `clients`
- SEO: `seo_setting` (page_key), `link_suggestion`, `link_embedding`, `organization_profile`, `redirects`
- Leads/ops: `contact_leads` (name, email, phone, subject, message, source, source_page, consent, consent_text_version, ip_hash, user_agent, status new/contacted/qualified/closed/spam, notes, sheet_status/attempts, email_status/attempts), `admin_notifications`, audit tables
- Identity: `profiles`, `customer`
- Legacy store tables (product, cart, order, region…): store removed 2026-10-21, tables intentionally left untouched

Other schema-like assets: Zod schemas (`src/lib/validation*`), JSON-LD templates (`src/lib/schema/templates/*`, 11 builders), tests in `src/lib/schema/__tests__`, `src/lib/__tests__`.

**Not present (needed for AG POWER):** panels/catalogue table, calculator configuration, solar-specific lead fields (category, city, pincode, monthly bill, service, enquiry type), Telegram integration.

---

## 4. Functionality inventory (existing)

| Function | Status |
|---|---|
| Lead pipeline | `POST /api/contact`: Zod validation, honeypot, per-IP rate limit (5/10 min), optional Cloudflare Turnstile, DPDP consent + text version. Saves to `contact_leads` first; then (background) Google Sheet + MailX email; `cron/leads-retry` retries; leads auto-deleted after 730 days; admin leads list/export; admin notifications |
| Google Sheets | 3 fallbacks: Apps Script webhook → Sheets API service account → Google Form. Formula-injection neutralised. Sheet columns today: timestamp, name, email, subject, message, phone, source, sourcePage, id |
| Telegram | **None** (no reference anywhere in code or docs) |
| Email | MailX HTTPS API (primary), SMTP fallback (Zoho). Auto-reply + team email |
| Admin panel | CRUD for services, blog, case studies, SEO, users, clients, leads, EDITZ/Blog AI sections, theme tokens (Admin → Settings → Theme, no redeploy), audit log + restore, MFA |
| Blog | Listing, detail, categories (category_id), scheduled publishing cron, ingestion API for n8n |
| SEO | JSON-LD graph, metadata parity, sitemap(s), robots, redirects, internal-link suggestions (embeddings), SEO report |
| AI (existing) | `ai-provider.ts` (Cloudflare Workers AI → OpenAI fallback, kill switch `AI_ENABLED`), AI SEO auto-fill (monthly cron), image-fill job, embeddings for internal links, eval tests (`ai-evals.test.ts`) |
| Auth | Supabase GoTrue, httpOnly cookies, middleware gate with 0 DB work on public routes, hidden admin path (`CUSTOM_ADMIN_PATH`) |
| Calculator | **None** |
| Panel catalogue | **None** (and e-commerce was deliberately removed) |
| Tests / CI | Vitest (schema, revalidate, api-response, admin validation, ai-evals, product-pages), GitHub Actions: typecheck, lint, test, build, Lighthouse CI (perf ≥0.8, a11y ≥0.9, SEO ≥0.95, BP ≥0.9) |

---

## 5. Fit against the AG POWER brief

| Brief requirement | Momentum today | Gap / effort |
|---|---|---|
| Keep dynamic blocks/schemas | No block registry; DB templates + product-page overrides | Decide approach (see Plan §A) |
| Service pages from one template | `services/[slug]` is data-driven | **Good fit.** Seed 3 solar services; extend fields (hero CTA, benefits, process, ranges) — extra columns need approval |
| Reusable form system | One contact form, 4 sources (`contact/editz/blog-ai/other`) | Extract + extend fields; `LEAD_SOURCES` enum must be extended |
| Google Sheets | Exists (3 modes) | Change columns to the AG POWER lead structure (13 fields) |
| Telegram | None | New integration + retry; failure must not lose lead (existing pattern: save first, deliver in background, retry cron — reuse it) |
| Duplicate protection / idempotency | None found (rate limit only; in-memory per instance) | New |
| Spam protection | Honeypot + Turnstile (optional) | Reuse; Turnstile is optional (skipped if keys unset) |
| Calculator (backend, configurable) | None | New service + config table |
| Panel catalogue (search/filters, no ecommerce) | None | New table/API/pages; reuse pagination/Zod/ISR patterns |
| Blog with solar categories | Exists | Content/category migration only |
| FAQ blocks | Exists (`page-faq-section`, page/service/home FAQ tables) | Reuse |
| Structured data (Service, FAQPage, Breadcrumb, Article…) | Exists, tested | Update organisation profile (`site.ts` / `organization_profile`) for AG POWER |
| Manrope + Inter | Epilogue/Outfit/DM Sans/Mansalva | Replace in `fonts.ts` + CSS font tokens |
| Palette tokens | `tokens.css` (RGB channels) + admin theme overrides; but **404 raw hex values in 34 files** bypass tokens | Token swap alone will not re-colour the site (R-04) |
| Lighthouse targets | CI already asserts them | Keep |

---

## 6. Technical risks

| ID | Risk | Severity | Note |
|---|---|---|---|
| R-01 | **`docs/` already holds Momentum's own prd/architecture/design/performance/task/memory/ai-setup-guide** (+ ~17 other files, incl. a 1,155-line remediation plan). Dropping the AG POWER docs in would overwrite or conflict, and `CLAUDE.md` already exists with different rules | High | Decision D-1 |
| R-02 | **`.env.local` was inside the zip** (contains keys: Supabase service role, Google private key, OpenAI, Cloudflare, Zoho SMTP, MailX, Turnstile secret, n8n/publish keys, CRON/PREVIEW secrets). It is git-ignored, but it left the machine. | High | Rotate all those keys; stop sharing zips with `.env.local` |
| R-03 | Brief assumes a block registry/page renderer; none exists. Home/About are hardcoded components (200–535 lines each) | High | "Do not rebuild Momentum" vs "data-driven pages" tension. Needs approval on approach |
| R-04 | 404 raw hex colours in 34 `.ts/.tsx` files (rule 9 violation); site is pink/navy across components, admin theme tokens, JSON-LD, emails (e.g. `#e61e73` in auto-reply email) | Medium | Phase 2 must include a colour sweep, plus email templates |
| R-05 | Brand "Mommantum" appears ~501 times in 99 files (copy, metadata, schema defaults, emails, public assets/logos, videos, `llms.txt`, sitemap/OG images in `public/og`) | Medium | Rebrand checklist needed; `DEFAULT_ORGANIZATION_PROFILE` in `lib/schema/site.ts` is the single source for org facts |
| R-06 | Hardcoded content outside DB: footer data, home sections, about, nav | Medium | Violates "no hardcoding" rule; AG POWER content should be data-driven where the brief demands (service pages, FAQs, panels) |
| R-07 | In-memory rate limiting (per warm serverless instance) | Medium | Not enough for the brief's "rate-limit submissions" at scale; no idempotency/dedup. Needs a shared store decision (DB-based) |
| R-08 | Turnstile is optional: if `TURNSTILE_SECRET_KEY` is unset, verification passes | Medium | Must be mandatory in production for forms (spam protection requirement) |
| R-09 | `createLead` swallows Supabase failure and continues with an in-memory fallback lead (returns success even if nothing was persisted) | Medium | Conflicts with "accepted lead is never lost": if DB fails, the lead exists only in memory/background delivery. Review before relying on it |
| R-10 | Lead text and PII sent in team emails / Google Sheet; retention 730 days set in code | Low-Med | Privacy policy must match (retention is now known: 730 days) |
| R-11 | Existing AI features (SEO auto-fill, image fill, embeddings) call external models; docs/ai-setup-guide exists and is a required file for this repo | Medium | PRD §7 said "no AI" for the *new* work — correct statement is "existing AI features stay; no new AI" (removal requires approval) |
| R-12 | Dependencies: `@types/node@17`, `eslint-config-next@15.0.8` vs next 15.3.9, typescript target ES5 deprecation warnings (seen with newer tsc), `vite@^8`/`vitest@^5` | Low | Verify `npm ci`, build and tests on a clean machine |
| R-13 | `tsconfig.tsbuildinfo`, `.next/`, `node_modules/` (Windows binaries), `Mommantum-Development-Docs.pdf`, large videos in `public/` (e.g. `project*.mp4`, `video*.mp4`) | Low | Mommantum media should be removed from AG POWER build (bundle/perf, brand) |
| R-14 | Git working tree shows modified files across many configs (line-ending churn likely: files use CRLF) | Low | Normalise before first AG POWER commit |
| R-15 | Panel images from The Solar Club require permission/licence; `next.config` `remotePatterns` allows only Supabase/Unsplash/localhost | Low | Host approved images in Supabase storage; do not hotlink |
| R-16 | Pre-existing Mommantum pages (EDITZ, Blog AI, Work/Case studies, `/services/*` agency content, `llms.txt`, redirects, SEO seeds, sitemap entries) will be live under the AG POWER brand unless removed/replaced | Medium | Removing existing functionality requires approval (brief §19) |
| R-17 | Existing `CLAUDE.md` says "read `.agents/AGENTS.md`" — folder `.agents/` is not in the zip; `.workrules/RULES.md` is private/excluded | Low | Confirm what rules live there |

---

## 7. Proposed modification plan

### A. Decisions needed before Phase 2 (approval gate)
- **D-1 Docs:** archive Momentum's `docs/` to `docs/archive-momentum/` and replace with the AG POWER set (recommended), or keep both with a prefix. Merge useful Momentum rules (e.g. revalidation, schema parity, role verification) into AG POWER `rules.md`.
- **D-2 "Dynamic blocks" approach:** (recommended) keep Next.js/Supabase; do **not** build a new CMS. Use the existing DB-driven `services/[slug]` template for the 3 solar pages (extend `services` data, which may need new columns → approval), and the existing admin-editable "product pages" pattern for editable home/about sections only where the brief needs admin editing; build reusable React section components shared by home + service pages. Alternative: extend the product-page override mechanism to Home/About.
- **D-3 Old Mommantum pages:** remove or redirect EDITZ, Blog AI, Work/Case studies, agency services content (needs approval since it removes functionality).
- **D-4 DB changes (need approval):** new tables for panels and calculator config; new/extended columns on `contact_leads` (category, city, pincode, monthly_bill, service, enquiry_type, calculation_details, panel_ref, idempotency_key, telegram_status/attempts); extend `LEAD_SOURCES`/`enquiry_type`.
- **D-5 Lead durability:** change `createLead` fallback so an unsaved lead returns an error instead of success (R-09), or persist to a second durable store.
- **D-6 Idempotency/rate-limit store:** DB-backed (Supabase) dedupe on idempotency key; keep in-memory limiter as a first filter.
- **D-7 Turnstile mandatory** in production for all public forms.
- **D-8 Secrets:** rotate everything listed in R-02 now.

### B. Phase 2 (design system) work items
Tokens: replace brand palette in `tokens.css` with AG POWER tokens (channels), update `theme-tokens.ts` defaults + labels (admin theme editor keeps working); fonts: swap to Manrope + Inter in `fonts.ts` and CSS font tokens; colour sweep of 34 files/404 hex values; email templates (`mailx.ts`, `mailer.ts`); then buttons/inputs/cards/nav/footer.

### C. Reuse map
| Need | Reuse |
|---|---|
| Service pages | `services` table + `services/[slug]` + `resolveServiceData` + JSON-LD service template |
| FAQ | `page-faq-section`, page/home FAQ data |
| Blog | existing blog + admin editor + publish API |
| Forms | `/api/contact` pattern (Zod, honeypot, Turnstile, consent, save-first, background delivery, retry cron) |
| Sheets | `google-sheets.ts` (change columns) |
| Admin/leads | `/admin/leads`, notifications, export |
| SEO | schema engine, metadata parity, sitemap, redirects |
| Perf/CI | Lighthouse CI config (already ≥ brief targets) |
| New | calculator service, panel catalogue (data + API + pages), Telegram service, idempotency, enquiry form v2 |

### D. Corrections to the docs I drafted earlier
1. `prd.md §7` "AI: No" → existing AI features remain; AG POWER adds none.
2. `architecture.md` [AUDIT] items → Next.js 15 + Supabase + Vercel (details above); routes follow `/api/...` (the `next.config.js` header comment mentions an `/api/v1` alias rewrite — not verified in the rewrite rules); leads route is `/api/contact` today.
3. `rules.md` stack add-on → **Next.js + Node route handlers** variant (server components default, client only for interaction, SSR/SSG for public pages). Medusa commerce modules do not apply (store removed); only the Medusa UI Tailwind preset remains in use.
4. `design.md §8` → admin theme tokens exist (Admin → Settings → Theme, `site_setting.theme_tokens`), SEO fields in `seo_setting`.
5. `performance.md` → Vercel CDN/ISR present, Lighthouse CI present; DB pooling handled by Supabase.
6. `ai-setup-guide.md` is **required** (existing AI); keep Momentum's version, adjust only for AG POWER naming.

---

## 8. Questions for you (blocking)
1. Approve D-1 … D-8 (or tell me which to change).
2. Do you want me to keep EDITZ / Blog AI / Work pages (D-3)?
3. Is the Supabase project new for AG POWER or the same as Momentum's? (Affects migrations and data.)
4. The earlier open questions in `prd.md §12` still stand (company details, calculator numbers, panel data, Telegram chat, etc.).

Gate: Phase 2 starts only after CTO/CEO approval of this report and the plan above.
