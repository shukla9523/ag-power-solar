# 6 · memory.md — Decisions and Learnings

This file is the project memory: decisions and why they were made, known issues and gotchas, patterns to follow, and a change log. Anything learned the hard way is added the same day so the same mistake is never repeated.

*Add an entry the same day · Four sections*


## A. Decisions


| ID | Decision | Why |
|---|---|---|
| D-01 | No standalone Medusa server; in-process proxy at /api/store maps to Supabase | Lower cost and one deploy; Medusa SDK still works |
| D-02 | Backend = Next route handlers + Supabase (no separate API service) | Single Vercel deployment, small team |
| D-03 | Country prefix (/in) removed; region default "in" | Clean URLs, India-first SEO |
| D-04 | React Query not installed. OPEN: adopt for client lists or exception | SOP rule 8 vs. current Server Component approach |
| D-05 | ~~Global-CSS token rule exempted~~ **Reversed by D-12 (2026-11-08)** | — |
| D-06 | One resolver feeds metadata and JSON-LD | Prevents title/description/schema mismatch |
| D-07 | No aggregateRating/review schema | No verified reviews exist; avoids Google penalties |
| D-08 | Schema panel removed; no per-page hardcoded schema | Manager instruction; single templates per type |
| D-09 | DB changes go to db-proposals/ and are run by a human | Protect production Supabase |
| D-10 | Admin path can be masked via CUSTOM_ADMIN_PATH; unauthorised gets 404 | Obfuscation, reduce brute force |
| D-11 | Public routes bypass DB in middleware | Zero TTFB cost for visitors |
| D-12 | All colours/fonts come from src/styles/tokens.css; Tailwind maps to RGB-channel variables; Admin → Settings → Theme overrides at runtime | SOP rule 9; one place to restyle; zero visual change at migration |
| D-13 | 4 roles: owner / admin / marketer / customer; legacy roles map automatically; owner = verified OWNER_EMAIL, protected in app and by DB trigger | CEO requirement 2026-11-08; least privilege |
| D-14 | Access token is trusted only after signature verification (HS256 secret or Supabase Auth); expiry handled by rotating refresh token in middleware | Old decode-only parseJwt allowed forged admin sessions |
| D-15 | AI writes only EMPTY meta fields; any human-saved field is marked "human" in field_sources and is never changed automatically; no force mode | CEO requirement; protects human SEO work |
| D-16 | Internal links = keyword ownership (primary > secondary; manual site_keywords rules win), server-rendered, first mention, one link per target, ~1 per 150 words | Predictable, no AI cost, prevents cannibalisation |
| D-17 | Leads: Supabase is the source of truth; Google Sheet (API or existing Google Form) and Zoho emails are background copies with retry | No lost leads when Google or Zoho is down |
| D-18 | Breadcrumbs = real hierarchy; "latest items" lists live in a dynamic ItemList on /services, /work, /blog | Google BreadcrumbList guidance; previous nav-menu breadcrumbs were misuse |
| D-19 | One FAQ source per page feeds the visible accordion, the page FAQPage schema and the /faq hub | Markup must equal visible content |
| D-20 | Google Indexing API removed; sitemaps with real lastmod are the crawl signal | Indexing API only supports JobPosting/BroadcastEvent |
| D-21 | Caching = in-process TTL caches (src/lib/util/ttl-cache.ts) + Next ISR/unstable_cache tags; no Redis | CEO requirement; zero extra infrastructure |
| D-22 | Audit log is append-only (DB trigger), stores full before/after rows and powers one-click restore | Accountability + undo without a separate revisions table |
| D-23 | 2FA = Supabase TOTP; profiles.mfa_enabled mirrors it so middleware can require aal2 without an Auth call; REQUIRE_ADMIN_MFA forces it for owner/admin | Stolen passwords alone cannot open the admin |
| D-24 | Drafts are previewed through signed, expiring links + Next draft mode, never through public URLs | Drafts stay private and uncached |
| D-25 | Product pages (EDITZ, Blog AI) store only per-section overrides; code defaults render when no override exists | Zero visual change until someone edits; easy reset |
| D-26 | Public pages read site_setting with the server key and keep public columns only; anon has no access (M-06) | site_setting also stores private values (leads sheet link) |
| D-27 | CSP: safe directives enforced, full allowlist Report-Only first; enforce after a clean week | Security without risking broken third-party scripts |
| D-28 | Fonts self-hosted with next/font/local from @fontsource woff2 (byte-identical to Google's files) | Removes render-blocking Google Fonts CSS; zero visual change |
| D-29 | Home Organization is typed Organization + ProfessionalService; every page emits compact Organization + WebSite nodes; founder is one Person @id | Entity consistency for search and AI answers; Review/aggregateRating stay forbidden (D-07) |
| D-30 | Marketers see lead email/phone masked; owner/admin see full details | Least privilege for personal data (DPDP) |


## B. Known issues and gotchas


| ID | Issue | Impact / fix |
|---|---|---|
| K-21 | (Fixed 2026-11-08) Forged JWT accepted: parseJwt only decoded the payload | lib/auth/verify-token.ts; test: src/lib/__tests__/platform.test.ts |
| K-22 | (Fixed 2026-11-08) Admin PUT/DELETE routes for blog/services/case-studies/users were missing (edit/delete 404) | app/api/admin/*/[slug|id]/route.ts |
| K-23 | (Fixed 2026-11-08) Blog SEO wiped on edit: editor loaded from a list that excluded blog:* rows | GET /api/admin/seo?page_key=; blank values never overwrite stored values |
| K-24 | (Fixed 2026-11-08) Sitemap index pointed to 4 child sitemaps that did not exist | app/sitemap/[name]/route.ts |
| K-25 | (Fixed 2026-11-08) Case-study pages read SEO from "case-study:<slug>" while admin saved "work:<slug>" | pages read both keys |
| K-26 | (Fixed 2026-11-08) Every case study's schema carried The Kids Store FAQs; EDITZ schema FAQs differed from visible FAQs | getPageFaqs returns [] for unknown keys; getEditzFaqs |
| K-27 | Supabase access tokens are JWTs by design — "refresh tokens instead of JWT" is implemented as short-lived verified access token + rotating httpOnly refresh token | See setup-guide §2 |
| K-28 | (Fixed 2026-11-08) One-off colour classes tokenised; remaining literals are only inside `<style>` blocks, SVG fill attributes, brand logos and email HTML | Lint rule blocks new raw hex classes |
| K-29 | (Fixed 2026-11-08) Public blog queries did not filter status — drafts were readable on /blog unless RLS blocked them | getBlogPosts/getBlogPost filter status = published |
| K-30 | Product page saves are last-write-wins per page (no row locking) | Audit log keeps both versions; add updated_at check if concurrent editing becomes common |
| K-31 | Scheduled publishing runs daily on Vercel Hobby (cron limit) | Switch to hourly on Pro |
| K-32 | (Fixed 2026-11-09) Open redirect via /api/preview/exit?to=/\evil.com | lib/util/safe-redirect.ts compares origins; test security.test.ts |
| K-33 | (Fixed 2026-11-09) Lead fields could run as formulas in the Google Sheet | valueInputOption RAW + neutralizeFormula |
| K-34 | (Fixed 2026-11-09) Owner 2FA could be skipped if the profile lookup failed | resolve-role fails closed; also reads verified factors from Supabase Auth |
| K-35 | (Fixed 2026-11-09) A lead retry e-mailed the team again when only the auto-reply had failed | email_status "team_sent" tracks the two mails separately |
| K-36 | (Fixed 2026-11-09) Second in-memory cache inside unstable_cache served stale SEO after edits | removed; tags only |
| K-37 | next/font option values must be literals (constants fail only at `next build`, not tsc/tests) | keep unicode-range strings inline in src/lib/fonts.ts |
| K-38 | 15 legacy files are still over 400 lines (admin editors, hub page clients, FAQ data) | split gradually; public-page splits need a visual check |
| K-01 | V-01 role escalation via sb-role cookie (CVSS 9.8) | Critical. Fix in NTF-301 |
| K-02 | V-02 hardcoded service-role key in source (9.8) | Critical. Rotate key, move to env, NTF-301 |
| K-03 | V-03 admin auto-created on first login (9.1) | Critical. NTF-301 |
| K-04 | V-04 CRON_SECRET not enforced on AI endpoint (7.5) | Denial of wallet. NTF-301 |
| K-05 | V-05 no CSRF/Origin check on admin APIs (7.1) | NTF-301 |
| K-06 | V-06 cart IDOR (6.5); V-07 readable sb-role cookie (6.5); V-08 role-cache memory growth (5.3) | NTF-301 |
| K-07 | next.config.js ignores TypeScript and ESLint errors in builds | Run npx tsc --noEmit manually until NTF-302 |
| K-08 | No automated check before release | NTF-302 |
| K-09 | .env.local was in the delivered zip | Treat keys as exposed; rotate; never zip env files |
| K-10 | Dependencies using "latest" (@medusajs/*) | Unpredictable upgrades; pin versions in NTF-302 |
| K-11 | Package name medusa-next and Medusa starter README/assets remain | Dead code; cleanup in T-07 |
| K-12 | API routes not under /api/v1 and not a standard response | NTF-304 |
| K-13 | mommantum_supabase.json is an n8n workflow, not a DB schema | Do not use it to infer tables |
| K-14 | Live site still shows old DB FAQs until SQL scripts are executed | NTF-303 |
| K-15 | Seven SQL scripts must run in strict order | See HANDOFF.md order; NTF-303 |
| K-16 | seo_setting vs seo_settings both appear in code | Verify real table name; unify in T-08 |
| K-20 | Founder title differs: UI "Founder & Creative Director", schema "Founder" | Intentional; keep both |


## C. Patterns to follow

- Any new content type: add a fetcher, a resolver, a template, tests, and call revalidateContent() from every admin save API.
- Any public page: take metadata from its resolver, add the JsonLd component once, one H1.
- Any admin route: check role with auth-helpers, validate with Zod, call revalidateContent(), return the standard response.
- Any list page: paginate, cache with unstable_cache and a tag, and add a skeleton in src/modules/skeletons.
- Any DB change: SQL in db-proposals first, backup, human execution, record in Change log.
- Any slug change: add a 301 redirect and revalidate old and new paths.
- Reuse components from src/modules/common before creating new ones.

## D. Change log (newest first)


| Date | Entry |
|---|---|
| 2026-11-08 | Phase 8 + finishing: 50 more colour tokens (0 raw hex classes, ESLint rule), next/image on EDITZ, error boundaries (site/admin/global), CI workflow + Lighthouse budgets, `/api/v1` rewrite alias, 30 golden AI evals + grounding guard (rejects invented numbers, injection echoes, foreign links), ai-setup-guide v2, on-brand service hero illustrations (share cards kept for OG). 132 tests; fresh build passes. |
| 2026-11-08 | Phase 6 + 7 (migration M-05): audit log with diffs + one-click restore, TOTP 2FA (enrol, login code step for password + Google, API enforcement, optional REQUIRE_ADMIN_MFA), scheduled publishing + daily cron, signed draft preview links (draft mode), media picker, unsaved-changes guard, blog pagination + bulk actions, publish toggle sends status only, drafts no longer public (K-29), EDITZ / Blog AI content editable in Admin → Products. 100 tests; build passes. |
| 2026-11-08 | Platform remediation (docs/platform-remediation-plan.md, setup-guide.md): verified sessions + refresh rotation, 4-role model with protected owner, missing admin CRUD routes, owner-safe users API, uploads/XSS/mass-assignment fixes, meta-object locks, empty-field AI fill (Cloudflare Workers AI / OpenAI fallback), AI images, keyword internal linking, real sitemaps, robots for AI answer engines, schema matrix (Service, ItemList, real breadcrumbs), unified FAQs + /faq hub, contact leads pipeline (Supabase → Sheet → Zoho), notifications, analytics dashboard, SEO report, settings + theme, tokens.css. Migration M-04. Removed: dev-login, admin_auth route, indexer.ts, LinkingService + internal-linking routes, RelatedLinks, client KeepAlive, supabase-server.ts. Build now fails on type/lint errors. |
| 2026-11-04 | Implemented NTF-301 (Security Hardening): Closed audit findings V-01 through V-08. Removed client-controlled role escalation via `sb-role` cookie; removed hardcoded `SUPABASE_SERVICE_ROLE_KEY` secret fallback; disabled auto-provisioning of admin roles on first login; enforced mandatory `CRON_SECRET` on AI auto-fill; added CSRF/Origin verification on mutating admin APIs via `src/lib/util/origin-check.ts`; bounded in-memory role caches with LRU/TTL eviction. Implemented NTF-302 (`npm run check` build gate script) and NTF-304 (`src/lib/util/api-response.ts` standardized `ok`/`fail` helpers). |
| 2026-10-21 | Six core project documentation files established in docs/ (prd.md, architecture.md, rules.md, design.md, task.md, memory.md) with corrections applied (site.ts brand facts reference, completed out-of-scope boundaries and open questions in PRD, completed image/OG and form specifications in design.md). Added BRAND_GUIDELINES.md, .env.example, and CLAUDE.md. |
| 2026-10-21 | Six project files created for Mommantum from source code and project docs (PRD, architecture, rules, design, task, memory). |
| Oct 2026 | Security audit written: 8 findings (4 critical, 2 high, 2 medium). |
| Oct 2026 | Handoff: schema engine, /admin/schema removal, FAQ/keyword/org-profile SQL proposals, vitest added. |
| Earlier | SDS and SEO automation blueprint written; internal linking, AI SEO auto-fill, Google Indexing API, n8n blog ingestion, custom admin suite and RBAC delivered; production on Vercel. |


## E. Incident and lesson template


```
Date:
What happened:
Root cause:
Fix:
What to do instead next time:
Linked task / file:
```


## F. Lessons already learned in this project

- Metadata and schema must come from the same resolver or they drift apart.
- Never read role from a cookie; always verify from the database.
- Run SQL scripts in the exact documented order and back up first.
- Slug changes need a redirect and revalidation of the old and new paths.
- A cart id alone must never grant access to a cart.
- Disabled build checks hide real errors: turn them on early.
- Keep brand facts in one place (constants and organization_profile).

## Pattern: performance work

- Always record a baseline first, change one thing at a time, re-measure, and save both reports.
- Never lazy-load the hero/LCP image; always give images width and height.
- Never cache user-specific responses publicly.
- Index changes go through db-proposals and are validated on real data volumes.
