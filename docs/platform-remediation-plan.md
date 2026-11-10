# Mommantum Platform Remediation & Build Plan — v1.0

**Status:** Draft for Gate 2 approval · **Owner:** CTO · **Approver:** Saurabh Sharma (CEO) · **Date:** 2026-11-08
**Inputs:** CTO code review (2026-11-08), *System Design SOP — Project Files* v1.0, existing `docs/` set.

> **Implementation status (2026-11-08):** NTF-307 to NTF-319 are implemented in code. NTF-320
> (audit log, revisions, scheduling, 2FA, media library) is not started yet. NTF-321 is partial:
> schema, breadcrumbs and FAQs are done, but page content still lives in code. The per-task
> status table is in [task.md](task.md); deployment and operations are in
> [setup-guide.md](setup-guide.md); the database changes are in
> `db-proposals/migrations/2026-11-08_roles_owner_leads_notifications.sql` (M-04).
> Decisions D-12 to D-21 and issues K-21 to K-28 are recorded in [memory.md](memory.md).
> Where the code differs from this plan:
> - routes remain under `/api/admin/*` (the `/api/v1` rename is deferred);
> - meta objects stay in `seo_setting` with new columns, instead of a new `seo_meta` table.

---

## 0. How to read this document

This is the master plan that turns the code review and the CEO's requirements into SOP-shaped work. It does **not** replace the SOP file set. Once it is approved (Gate 2), each part moves into its SOP home, and this file becomes the index:

| Section here | Moves into |
|---|---|
| §1, §4 roles, §9 products, §14 open questions | `prd.md` (§3 features, §5 roles, §6 SEO goals, §9 integrations, §10 data) |
| §3 architecture, §3.4 data models, §3.5 route map, §6 leads | `architecture.md` |
| SOP rules referenced throughout (no hex, Zod, `/api/v1`, no dead code) | `rules.md` (already present; enforcement added in NTF-323) |
| §7 design tokens, §8 admin-editable settings | `design.md` |
| Caching and image budgets in §5 / §7 | `performance.md` |
| §5.4–§5.6 AI features | `ai-setup-guide.md` (all 10 layers, evals first) |
| §11–§12 tasks NTF-307…323 | `task.md` (one approved plan per task, before coding) |
| §2 findings, §15 decisions | `memory.md` (Known issues K-21+, Decisions D-12+) |

Per SOP rule 1, no implementation starts until the matching `task.md` plan is approved. The only exception is the Phase 0 hotfix (§11), which is an emergency security release.

---

## 1. Executive summary

- **The site looks good, but the backend is not safe to run as it is.** Login tokens are never checked for a valid signature, so anyone can forge an admin session. The AI SEO job can be run by anyone on the internet.
- **The admin panel cannot edit or delete anything.** The UI calls PUT and DELETE routes that do not exist. Every blog edit also wipes that post's saved SEO.
- **Google sees no real sitemap.** All four child sitemaps return 404, and the root layout can push a homepage canonical or a site-wide noindex onto other pages.
- **The 7 P0 items:** (1) token signatures never verified, (2) AI job has no auth, (3) more unauthenticated routes, (4) missing edit/delete routes, (5) blog SEO wiped on edit, (6) sitemaps 404, (7) dev-login ships in every build.
- **Target platform:**
  - **Data and security:** one backend services layer (`src/server/*`) with standard `/api/v1` responses, 4 roles (owner, admin, marketer, customer) and an owner account nobody else can touch.
  - **SEO:** typed SEO meta objects for every page type, a full schema matrix with breadcrumbs on every page, and a hybrid internal-linking engine.
  - **AI:** a monthly AI job that fills only empty fields, and AI images for services and blogs that have none.
  - **Leads:** a contact pipeline that saves to Supabase, appends to a Google Sheet and sends email through Zoho, plus a leads inbox and counters in the admin.
  - **Design:** centralised `tokens.css` with no visual change, editable from Settings → Theme.
  - **Products:** Editz and Blog-AI become first-class product pages.
- **Timeline (estimated, 1–2 devs):**

  | Phase | Duration |
  |---|---|
  | Phase 0 hotfix | 2–3 days |
  | Docs and Gate 2 | 2 days |
  | Foundation | ~8 days |
  | SEO | ~7 days |
  | Features | ~15 days |
  | AI | ~10 days |
  | Launch | ~3 days |
  | **Total** | **≈ 9–10 weeks** |

---

## 2. Findings register

Every row comes from the 2026-11-08 code review. P0 rows were confirmed by reading the code. Other rows still have to be re-confirmed at the start of their task (task plan section 7, "Impact check").

| ID | Sev | Area | Finding | Fix | Task |
|---|---|---|---|---|---|
| F-01 | P0 | Auth | `parseJwt` only base64-decodes the payload. A forged `sb-access-token` with any approved user's `sub` becomes admin. | Verify with `supabase.auth.getUser(token)` (hotfix), then JWKS/`jose` in middleware. Cache only verified sessions. | NTF-307 → 308 |
| F-02 | P0 | API auth | `POST /api/admin/jobs/seo-auto-fill` has no auth, and middleware passes all `/api/*` through. | Add a role check to the route. Later, a default-deny `requirePermission()` on every `/api/v1` route. | NTF-307 |
| F-03 | P0 | API auth | `/api/admin/custom/meta-listing` has no auth. `internal-linking/sync` and `/test` skip auth when `isDev`. | Require a session. Delete the `isDev` bypasses. | NTF-307 |
| F-04 | P0 | CRUD | PUT/DELETE for blog, services, case studies and users don't exist, so edit, delete, publish toggle and user edit all 404. | Build the `[slug]`/`[id]` handlers with Zod, RBAC and the standard response. | NTF-310 (part A in Phase 0) |
| F-05 | P0 | SEO data | `GET /api/admin/seo` filters out `blog:*` rows, the editor loads blanks, and saving overwrites the stored blog SEO. A 403 is swallowed by `.catch(()=>{})`. | Load by `page_key`. Never send blanks. Show errors to the user. | NTF-307 (quick fix) → 311 |
| F-06 | P0 | Sitemaps | The sitemap index lists 4 child sitemaps that don't exist, and `lastmod` is always now(). | Generate the child sitemaps from the DB with a real `lastmod`. | NTF-307 (quick fix) → 313 |
| F-07 | P0 | Auth | `/api/auth/dev-login` ships in every build, gated only by `NODE_ENV`. It creates an admin session. | Delete the route. Use a local seed user for dev. | NTF-307 |
| F-08 | High | Middleware | The RSC fast path returns before the role path check. Expired tokens still drive the role lookup. | Verify and authorise before any fast path. Reject expired tokens. | NTF-308 |
| F-09 | High | Sessions | No refresh flow, so sessions die after about 1h. The 15-min role cache is never invalidated. | Refresh-token rotation. Invalidate the cache on role change. | NTF-308 |
| F-10 | High | Origin | The origin check trusts `Host`/`X-Forwarded-Host` and allows localhost in production. | Use an origin allowlist from env. | NTF-308 |
| F-11 | High | Uploads | No size cap, the client's MIME type is trusted, SVG is allowed, and the DELETE `name` is not validated. | 5 MB cap, magic-byte check, png/jpeg/webp only, validated delete. | NTF-307 |
| F-12 | High | Secrets | The `admin_auth` cookie stores the raw `ADMIN_SECRET`, and the same secret is the publish-API bearer. | Opaque session value. Separate `PUBLISH_API_KEY`. `timingSafeEqual`. Rotate keys. | NTF-307 |
| F-13 | High | Auth | Login has no rate limit. | Limit by IP+email, with lockout. | NTF-308 |
| F-14 | High | Errors | Raw Supabase errors are returned to the client, which reveals whether an account exists. | Return generic messages and log the cause on the server. | NTF-308 |
| F-15 | High | XSS | Blog HTML is rendered with `dangerouslySetInnerHTML` without sanitising, on both the public page and the admin preview. | Sanitise on save and on render (allowlist). | NTF-307 |
| F-16 | High | Mass assignment | `/api/admin/seo/site` runs `.update(body)` on whatever is sent. | Whitelist the fields with Zod. | NTF-307 |
| F-17 | High | Slugs | Slug collisions aren't handled. Creating a page silently overwrites an existing SEO row. | Unique index and 409 `SLUG_TAKEN`. | NTF-310 |
| F-18 | High | Concurrency | The publish toggle PUTs the full stale row, so the last write wins. | PATCH only changed fields. `updated_at` check → 409. | NTF-310 |
| F-19 | High | Config | The custom admin path comes from env in middleware but from the DB in the auth callback. | One source (env), validated `^[a-z0-9-]+$`. | NTF-308 |
| F-20 | High | RBAC | `roles.ts` frontend and API lists differ. Owner rules exist only in the browser. `OWNER_EMAIL` is hardcoded to `admin@mommantum.com`. | Server-side RBAC and owner protection (§4). | NTF-309 |
| F-21 | High | Users | `POST users` isn't atomic: the auth user is created and the profile update can then fail. | Compensating delete, or a DB function. | NTF-310 |
| F-22 | High | Build | `next.config.js` has `ignoreBuildErrors` and `ignoreDuringBuilds` turned on. | Remove both. CI gates. | NTF-323 |
| F-23 | High | Canonical/robots | The root layout sets canonical `/` and reads robots from the `site/default` row. | Per-page canonical and robots only, via the resolver. | NTF-313 |
| F-24 | Med | 404s | Unknown blog/service/work slugs do a `redirect()` 307 to the listing. | `notFound()`, plus 301s from the redirects table. | NTF-313 |
| F-25 | Med | Schema | The schema base URL is hardcoded to www while `metadataBase` comes from the DB. The homepage `@id` has a trailing-slash mismatch. | One base-URL constant. Home `@id` uses `/`. | NTF-312 |
| F-26 | Med | Schema | No `Service` schema on service pages. ItemList is never emitted (unreachable branch). | Service node and dynamic ItemList on index pages. | NTF-312 |
| F-27 | Med | Breadcrumbs | The home breadcrumb is the 7-item nav menu. The service breadcrumb has a "Contact" step the page doesn't show. | Breadcrumbs follow the real hierarchy. Home has only "Home". | NTF-312 |
| F-28 | Low | Indexing | `indexer.ts` uses the Google Indexing API, which only supports JobPosting/BroadcastEvent pages. | Delete it. | NTF-313 |
| F-29 | Med | AI SEO | Auto-fill uses raw `JSON.parse` (no Zod), isn't grounded in page content, runs at temp 0.7, `force` overwrites human edits, alt text is never saved, the `page` type isn't implemented, and the service scan isn't filtered. | Rebuild per §5.5. | NTF-315 |
| F-30 | Med | Blog data | The badge shows the raw `category_id` (UUID). The publish API stores "Digital Marketing" in `category_id`. | Category table and FK. Show the name. | NTF-310 |
| F-31 | Med | OG tags | No OG width/height. No `og:image` when the DB field is empty, even though the JSON-LD names one. No `og:locale`/`twitter:site`. | Rules in §5.1. | NTF-313 |
| F-32 | Med | robots.txt | The AI-bot group lacks the common disallows. Ahrefs and Semrush are blocked. | Add the disallows. CEO decides on the SEO-tool bots (§14). | NTF-313 |
| F-33 | Med | Internal links | Drafts get embeddings, keywords come from `meta_title`, the freshness boost never applies, rows are deleted then re-inserted (not atomic), and the anchor is always the exact title. | Hybrid engine (§5.4). | NTF-314 |
| F-34 | Low | FAQ schema | Google shows FAQ rich results only for gov/health sites. FAQs must stay visible. | Keep the markup only for visible FAQs. | NTF-312 |
| F-35 | High | Contact | The form posts from the browser to a Google Form through a hidden iframe: no DB record, no email, no spam protection, no consent. | Pipeline in §6. | NTF-317 |
| F-36 | High | Design | `globals.css` has 0 CSS variables, and 860 hardcoded uses of the top 12 colours sit across 54 files. | Tokens in §7. | NTF-318 |
| F-37 | Low | Dead code | See §10. | Delete it, or move it to the DB or backend. | NTF-322 |

---

## 3. Target architecture

### 3.1 System map

```
Browser (visitors + admin users) — renders pages, collects input, no business logic
        │ HTTPS · httpOnly cookies
        ▼
Vercel · Next.js 15 App Router
 ├─ app/(site)/   public SSR/ISR pages — render server data only
 ├─ app/admin/    admin UI — forms, tables, loading/empty/error states
 └─ app/api/v1/*  thin route handlers — parse → call src/server → respond
        │
        ▼
src/server/* — ALL business logic (Zod, RBAC, SEO, linking, AI, leads, media, audit)
   │              │                     │                │
   ▼              ▼                     ▼                ▼
Supabase       Cloudflare AI Gateway  Google Sheets   Zoho SMTP (Nodemailer)
Postgres+RLS   → Workers AI: text,    API (append     team notification +
Auth (MFA)       embeddings, images   lead rows)      auto-reply
Storage (media)

Vercel Cron → /api/v1/cron/*  (Bearer CRON_SECRET):
  seo-fill (monthly) · image-fill (monthly) · leads-retry (hourly) · keep-alive (daily)
```

Note: the `cloudflare-coder` MCP server is a **developer tool** used to write code. Production never depends on it. Production calls the Cloudflare REST API / AI Gateway from `src/server/ai`, with the key in server env.

### 3.2 Responsibility rule

**If a rule can be bypassed by editing browser state, it lives in `src/server`.**

| Layer | Owns | Never does | Mommantum example |
|---|---|---|---|
| Frontend (`app/(site)`, `app/admin`, `components/ui`) | Rendering server data, form UX, loading/empty/error states, calling `/api/v1` | Deciding permissions, building meta/JSON-LD, calling Supabase/AI/Sheets/SMTP, holding SEO or content data in TS files | `BlogEditor` shows a "someone else saved this" toast on 409 and refetches |
| Backend (`src/server/*`) | Zod on every input, RBAC and owner locks, slug/canonical rules, meta merge and fallbacks, schema graph, link injection at render, AI via the gateway, audit, revalidation | Trusting client headers or cookies for identity | `PUT /api/v1/admin/blog/:slug` compares `updated_at` → 409. Owner protection reads `profiles.is_owner`, not a hardcoded email |

### 3.3 Target folder structure

```
src/
├── middleware.ts              Edge gate: verify JWT (JWKS), refresh, admin path, redirects lookup
├── app/
│   ├── (site)/                Public pages: home, about, contact, faq, legal, services, work, blog, editz, blog-ai
│   ├── admin/                 Admin UI (served under CUSTOM_ADMIN_PATH)
│   └── api/v1/                Thin handlers only
├── server/                    Backend — never imported by client components ("server-only")
│   ├── http/                  handler.ts (auth ctx, Zod, timing) · errors.ts (AppError → status) · response.ts (ok/fail)
│   ├── auth/                  session verify, refresh rotation, permissions.ts (role → permission map), owner.ts, rate limit
│   ├── users/                 invite, role/status change, atomic auth+profile writes
│   ├── content/               blog/, services/, case-studies/, products/ — CRUD, slugs, soft delete, revalidation
│   ├── seo/                   meta.ts (typed meta objects + fallbacks), resolver.ts, schema/, sitemap.ts, redirects.ts
│   ├── linking/               keyword ownership, candidate detection, scoring, render-time injection
│   ├── ai/                    gateway.ts (only AI egress: retries, budget, kill switch, trace) · prompts/ (versioned) · evals/
│   ├── leads/                 contact.ts, sheets.ts, mailer.ts
│   ├── media/                 upload validation, WebP + 1200×630 variants, review queue
│   └── audit/                 audit_log writes for every admin/AI mutation
├── components/ui/             Design-system primitives using tokens only
└── styles/
    ├── tokens.css             CSS custom properties — single source of truth
    └── globals.css            Tailwind layers + global helpers (.btn, .card, .section, .container)
```

Existing `src/lib/schema/*` is the starting point for `src/server/seo/schema/`. It moves rather than being rewritten (tests in `src/lib/schema/__tests__` move with it).

### 3.4 Data models

**profiles** (the old roles manager/seo/content_manager/editor/viewer migrate per §4.3)

| Field | Type | Rules |
|---|---|---|
| id | uuid PK | = `auth.users.id` |
| email | text | unique |
| role | enum `owner/admin/marketer/customer` | default `customer`; only owner/admin can change it |
| is_owner | boolean | exactly one true row (partial unique index); protected by a trigger |
| status | enum `invited/active/suspended` | login only when `active` |
| mfa_enabled | boolean | required for owner/admin (NTF-320) |

**seo_meta** (replaces `seo_setting`; this also closes memory K-16 about `seo_setting` vs `seo_settings`)

| Field | Type | Rules |
|---|---|---|
| id | uuid PK | |
| entity_type | enum | home, about, contact, faq, legal, services_index, service, work_index, case_study, blog_index, blog_post, product |
| entity_key | text | slug or page key; **unique with entity_type** |
| meta_title / meta_description | text | empty → template fallback (§5.1) |
| primary_keyword | text | must be owned by this entity in `keywords` |
| secondary_keywords | text[] | max 4 (5 target keywords in total) |
| canonical_url | text | absolute; defaults to the page's own URL |
| robots_index / robots_follow | boolean | default true/true; staging is forced to noindex |
| h1 | text | one per page |
| og_title / og_description / og_image / og_url / og_type | text | fall back per §5.1 |
| twitter_card / twitter_title / twitter_description / twitter_image | text | fall back to og_* |
| image_alt | text | ≤125 chars |
| faqs | jsonb | `[{q,a}]`; only rendered and marked up if visible |
| schema_overrides | jsonb | Zod-validated node patches |
| field_sources | jsonb | per field: `human` / `ai` / `template` |
| ai_filled_at | timestamptz | set only by AI jobs |
| updated_by / updated_at | uuid / timestamptz | `updated_at` used as the optimistic lock |

**keywords**: id · keyword (unique, lower-cased) · owner_entity_type · owner_entity_key · is_primary · status `active/retired` · timestamps.

**internal_links**: id · from_entity_type/key · to_entity_type/key · keyword_id → keywords · anchor_text · score numeric · status `suggested/approved/rejected/auto` · decided_by · timestamps. Unique `(from, to, keyword_id)`.

**contact_leads**: id · name · email · phone (optional) · subject · message · source `contact/editz/blog-ai` · source_page · consent bool · consent_text_version · ip_hash (salted SHA-256) · status `new/contacted/qualified/closed` · notes · sheet_status / sheet_attempts · email_status / email_attempts · created_at / updated_at.

**media_assets**: id · storage_path (unique) · mime_type (sniffed from bytes) · size_bytes · width · height · variant `original/og_1200x630` · alt_text · source `upload/ai` · prompt_version · status `pending_review/approved/rejected` · attached_entity_type/key · created_by · created_at.

**audit_log** (append-only, no UPDATE/DELETE grant): id · actor_id · actor_type `user/system/ai/cron` · action (e.g. `seo_meta.update`) · entity_type/key · diff jsonb (changed fields only, never secrets) · created_at.

**redirects**: id · from_path (unique, active) · to_path · status_code `301/308/410` · hits · is_active · timestamps. A row is created automatically on every slug change.

**ai_jobs**: id · type `seo_fill/image_fill/link_recalc` · status `queued/running/succeeded/failed/killed` · items · filled_fields · model · prompt_version · tokens_in/out · cost · error · started_at / finished_at.

**theme_tokens**: token (PK, e.g. `--color-brand`) · value · group `color/spacing/typography` · updated_by · updated_at.

**product_pages**: id · slug (unique: `editz`, `blog-ai`) · title · content_blocks jsonb (Zod union) · status `draft/published` · updated_at.

**Indexes:** `seo_meta (entity_type, entity_key)` unique · `keywords (keyword)` unique · `internal_links` on from/to/status · `contact_leads (created_at desc)`, `(status)`, partial on pending/failed channel status · `media_assets` partial on `pending_review` · `audit_log (created_at desc)`, `(entity_type, entity_key)` · `redirects (from_path)` unique where active · `ai_jobs (status, created_at desc)`.
**RLS:** anon reads only published/approved rows; all writes go through `src/server` with the service role; the owner trigger applies regardless.
**Migrations:** written to `db-proposals/` and run by a human (D-09).

### 3.5 API route map (`/api/v1`)

Standard response: `{ success, data, error: { code, message } | null, meta }`. Zod on every param, query and body. Lists take `?page&limit` (max 100). Mutations compare `updated_at` → 409. Deletes are soft.
Error codes: 400 VALIDATION · 401 UNAUTHENTICATED · 403 FORBIDDEN / OWNER_PROTECTED · 404 · 409 CONFLICT / SLUG_TAKEN / STALE_UPDATE · 413 · 423 AI_DISABLED · 429 RATE_LIMITED · 500.

| Method | Route | Role | Request | Response | Errors |
|---|---|---|---|---|---|
| POST | /auth/login | public | {email, password} | session cookies | 401, 429 |
| POST | /auth/logout | session | — | cookies cleared, refresh revoked | 401 |
| POST | /auth/refresh | session | refresh cookie | rotated tokens | 401 |
| GET | /auth/me | session | — | {user, role, permissions} | 401 |
| GET | /auth/oauth/callback | public | Google code | session + redirect | 400 |
| GET/POST | /admin/{blog,services,case-studies,products} | owner, admin, marketer | `?page&limit&status` / body | list / item | 400, 403, 409 |
| GET/PUT/DELETE | /admin/{type}/:slug | owner, admin, marketer | — / body + updated_at / — | item | 404, 409 |
| GET/PUT | /admin/seo-meta/:entityType/:entityKey | owner, admin, marketer | — / meta + updated_at | merged meta + field_sources | 404, 409 |
| GET | /admin/seo-meta/completeness | owner, admin, marketer | `?type` | per page % | — |
| GET/POST/PUT/DELETE | /admin/keywords[/:id] | owner, admin, marketer | {keyword, owner entity} | keywords | 409 KEYWORD_TAKEN |
| GET | /admin/internal-links/suggestions | owner, admin, marketer | `?entity` | scored suggestions | — |
| POST | /admin/internal-links/:id/{approve,reject} · /recalc | owner, admin, marketer | — | status / {job_id} | 404, 429 |
| POST | /admin/ai/jobs/{seo-fill,images} | owner, admin, marketer | {entity_type?, entity_key?} | {job_id} | 423 |
| GET | /admin/ai/jobs[/:id] | owner, admin, marketer | — | job(s) | 404 |
| POST/GET | /admin/media (upload / list) | owner, admin, marketer | file meta / `?page` | asset / list | 400, 413 |
| POST | /admin/media/:id/approve | owner, admin | {alt_text?} | attached | 404 |
| DELETE | /admin/media/:id | owner, admin, marketer | — | removed | 404 |
| POST | /contact | public, rate limited | {name, email, subject, message, source, consent, turnstileToken, website} | {leadId} | 400, 403, 422, 429 |
| GET | /admin/leads[/:id] | owner, admin, marketer (read) | `?page&limit&status&q` | leads | 404 |
| PATCH | /admin/leads/:id | owner, admin | {status, notes} | lead | 400 |
| GET | /admin/leads/export.csv | owner, admin | filters | text/csv (audited) | — |
| DELETE | /admin/leads/:id | owner, admin | — | erased (DB + sheet row) | 404 |
| GET/POST | /admin/users | owner, admin | `?page` / {email, role} | users / invited | 409 EMAIL_EXISTS |
| PATCH/DELETE | /admin/users/:id | owner, admin | {role?, status?} / typed confirm | user | 403 OWNER_PROTECTED |
| GET/PUT | /admin/settings/{site,theme} | owner, admin | whitelisted fields / tokens | settings | 400 |
| GET/POST/PUT/DELETE | /admin/redirects[/:id] | owner, admin, marketer | {from, to, code} | redirects | 409 |
| GET | /admin/audit | owner, admin | `?page&actor&entity` | rows | — |
| GET | /cron/{seo-fill,image-fill,leads-retry,keep-alive} | Bearer CRON_SECRET | — | {job_id / counts} | 401, 423 |
| POST | /publish/blog | scoped `PUBLISH_API_KEY` | blog payload (Zod) | post (+ queue empty-field fill) | 400, 401 |

Vercel Cron sends `Authorization: Bearer $CRON_SECRET` with GET requests, so all cron routes are GET.

---

## 4. Roles & permissions

Four roles: **owner · admin · marketer · customer**. `customer` is the default for every signup and has no admin access. The role is read only on the server, from `profiles.role`.

### 4.1 Permission matrix

| Permission | owner | admin | marketer | customer |
|---|---|---|---|---|
| View dashboard | ✓ | ✓ | ✓ ¹ | ✗ |
| Blog / services / case studies CRUD | ✓ | ✓ | ✓ | ✗ |
| Product pages (Editz, Blog-AI) | ✓ | ✓ | ✓ | ✗ |
| SEO meta objects | ✓ | ✓ | ✓ | ✗ |
| Keywords & internal links | ✓ | ✓ | ✓ | ✗ |
| Run AI jobs | ✓ | ✓ | ✓ | ✗ |
| Approve AI images | ✓ | ✓ | ✗ | ✗ |
| Leads view | ✓ | ✓ | ✓ (read) | ✗ |
| Leads edit / export / delete | ✓ | ✓ | ✗ | ✗ |
| Media library | ✓ | ✓ | ✓ | ✗ |
| Redirects | ✓ | ✓ | ✓ | ✗ |
| Users manage / change roles | ✓ | ✓ ² | ✗ | ✗ |
| Settings, theme, integrations | ✓ | ✓ | ✗ | ✗ |
| Audit log | ✓ | ✓ | ✗ | ✗ |
| Delete / edit owner account | ✓ (self only) | ✗ | ✗ | ✗ |

¹ Marketing widgets only. ² Admins can never touch the owner row. Anything not ✓ is rejected on the server (default deny).

### 4.2 Owner rules

- **Identity:** the CEO's email is set in `OWNER_EMAIL` (env) and the profile has `is_owner = true`. The email must be confirmed (§14 Q1).
- **Exactly one owner:** a partial unique index on `profiles (is_owner) WHERE is_owner`.
- **Immutable:** a Postgres trigger blocks UPDATE/DELETE of the owner row (role, status, email, is_owner) unless the actor is the owner. This holds even if someone bypasses the app.
- **One backend service** (`src/server/auth/owner.ts`) does all owner checks. The hardcoded `OWNER_EMAIL` in `src/app/admin/users/page.tsx` is removed.
- **Owner self-delete:** requires a fresh login (re-auth), a typed confirmation phrase, and transferring ownership to another active admin first, all in one transaction.
- Only the owner and admins manage users and permissions.

### 4.3 Role migration

| Old role | New role | Note |
|---|---|---|
| admin | admin | — |
| manager | admin or marketer | **CEO decides (§14 Q2)** |
| seo, content_manager, editor | marketer | — |
| viewer | marketer | the 4-role model has no read-only tier (§14 Q2) |
| any other / new signup | customer | no admin access |

This is one audited SQL migration in `db-proposals/`, followed by clearing the role caches.

### 4.4 Enforcement

- `requirePermission(session, "blog.write")` from `src/server/auth/permissions.ts` is the first line of every `/api/v1` handler and runs in middleware for admin pages. It always works on a **verified** session.
- The permission map is defined once. RLS mirrors it as a second line of defence.
- The frontend only hides nav items and buttons, using `permissions` from `/auth/me` (not `localStorage`).

---

## 5. SEO system

### 5.1 Meta objects per page type

One typed meta object per page, resolved by a single backend resolver that feeds both `generateMetadata()` and JSON-LD (D-06). **Resolution order: human value > AI-filled value > template fallback.**

| Page type | Route | Entity source | Title fallback |
|---|---|---|---|
| Home | `/` | `home` | "Mommantum \| Digital Marketing Agency Jaipur" (from `page-defaults.ts`) |
| About | `/about` | `about` | `{H1} \| Mommantum` |
| Contact | `/contact` | `contact` | `{H1} \| Mommantum` |
| FAQ | `/faq` | `faq` | "FAQ \| Mommantum" |
| Legal | `/privacy-policy`, `/terms-and-conditions` | `legal:{slug}` | `{H1} \| Mommantum` |
| Services index | `/services` | `services_index` | "Digital Marketing Services \| Mommantum" |
| Service detail | `/services/[slug]` | `service:{slug}` | `{service title} \| Mommantum` |
| Work index | `/work` | `work_index` | "Our Work \| Mommantum" |
| Case study | `/work/[slug]` | `case_study:{slug}` | `{title} \| Mommantum` |
| Blog index | `/blog` | `blog_index` | "Blog \| Mommantum" |
| Blog post | `/blog/[slug]` | `blog_post:{slug}` | `{post title} \| Mommantum` |
| Product: Editz | `/editz` | `product:editz` | from `page-defaults.ts` |
| Product: Blog-AI | `/blog-ai` | `product:blog-ai` | from `page-defaults.ts` |

| Field | Rule | Fallback when empty |
|---|---|---|
| meta_title | 50–60 chars | template above |
| meta_description | 140–160 chars | excerpt / first paragraph, trimmed at a word boundary (no space padding) |
| primary_keyword | exactly 1 | required, so it is flagged in admin; AI fills it if empty |
| secondary_keywords | 0–4 | none |
| canonical_url | `https://www.mommantum.com` + path; no trailing slash except home `/` | the page's own URL |
| robots | index/follow default true; staging always noindex | — |
| h1 | exactly one per page | entity title |
| og_title / og_description | — | meta_title / meta_description |
| og_image | 1200×630, width/height always emitted | entity image → `/opengraph-image.jpg` |
| og_url | = canonical | canonical |
| og_type | `website`; `article` for blog posts and case studies | `website` |
| og:locale | `en_IN` | fixed |
| twitter_card | `summary_large_image` | fixed |
| twitter_title / description / image | — | og_* |
| twitter:site | handle from the organization profile | omitted if no handle exists (§14 Q11) |
| image_alt | ≤125 chars | entity title |
| faqs | marked up only if visible on the page | no FAQPage node |
| schema_overrides | Zod-validated, merged last; dropped nodes are logged | none |

The admin shows a **completeness %** per page and site-wide (dashboard + SEO manager), computed by the same resolver. Hardcoded FAQ files (`all-faqs.ts`, `page-faqs.ts`, `home-faqs.ts`) move into `seo_meta.faqs`.

### 5.2 Schema matrix

`Organization` (`https://www.mommantum.com/#organization`) and `WebSite` (`https://www.mommantum.com/#website`) are emitted in full on the homepage. Every other page references them by `@id` (`isPartOf` → #website, `publisher` → #organization).

| Page type | Nodes | Breadcrumb (must match the visible one) |
|---|---|---|
| Home | Organization, WebSite, WebPage (`@id https://www.mommantum.com/#webpage`), BreadcrumbList | Home |
| About / Contact / FAQ | AboutPage / ContactPage / FAQPage (only if FAQs are visible), BreadcrumbList | Home > {Page} |
| Legal | WebPage, BreadcrumbList | Home > {Page} |
| Blog index | CollectionPage + ItemList of the latest N posts (dynamic, revalidated on publish), BreadcrumbList | Home > Blog |
| Blog post | BlogPosting (headline, image 1200×630, datePublished, dateModified only on content change, author Person, publisher @id), BreadcrumbList, FAQPage if visible | Home > Blog > {Post} |
| Services index | CollectionPage + ItemList of services, BreadcrumbList | Home > Services |
| Service detail | Service (name, serviceType, provider @id, areaServed IN) + WebPage, BreadcrumbList, FAQPage if visible | Home > Services > {Service} |
| Work index | CollectionPage + ItemList of the latest case studies (dynamic), BreadcrumbList | Home > Work |
| Case study | Article (about the client project), BreadcrumbList | Home > Work > {Case study} |
| Editz | WebPage + Service, BreadcrumbList | Home > Editz |
| Blog-AI | WebPage + Service **or** SoftwareApplication (§14 Q6), BreadcrumbList | Home > Blog AI |

Rules:
- No `Review`/`aggregateRating` (D-07).
- FAQ markup only for visible FAQs. Google limits FAQ rich results to gov/health sites, so the markup is kept for other engines and AI assistants.
- One base-URL constant feeds `metadataBase`, canonicals and every `@id`.
- The unreachable `category/product/store` branches are deleted.
- Vitest snapshot and validation per page type, plus a manual Rich Results Test before launch.

### 5.3 Sitemaps, robots, canonicals, redirects

- **Sitemaps:**
  - Build `/sitemap/{pages,services,blogs,work}.xml` from the DB.
  - Use a real `lastmod` (`max(updated_at)` per index entry, `updated_at` per URL).
  - Include only published pages with `robots_index = true`.
  - XML-escape every value.
  - `pages.xml` includes `/editz`, `/blog-ai`, `/faq`, `/about`, `/contact` and the legal pages.
- **robots.txt:**
  - The AI-bot group gets the same disallows as `*` (`/admin`, `/admin-login`, `/api/`, auth pages). Use no trailing slash so `/admin` itself is blocked.
  - SEO-tool bots (Ahrefs, Semrush) are the CEO's call (§14 Q10).
  - Add the auth pages to the `no-store` header rule in `next.config.js`.
- **Canonicals:**
  - Remove `canonicalPath: "/"` and the `site/default` robots read from the root layout. Each page declares its own metadata through the resolver.
  - `metadataBase` uses the shared constant.
  - Staging is noindex via env.
- **404s and redirects:**
  - Unknown slugs → `notFound()`.
  - A `redirects` table is checked in middleware; a 301 row is created automatically on every slug change; there is an admin Redirects UI; slug edits revalidate the old and new paths.
- **Remove** `src/lib/services/indexer.ts` and the `GOOGLE_*` Indexing API variables. Sitemap `lastmod` and revalidation are what get pages recrawled.
- **Blog category:**
  - Show the category name, never the UUID.
  - The publish API stores a real category reference.

### 5.4 Internal linking engine

**Decision: hybrid.** Deterministic keyword ownership is the base and works with AI fully off. Cloudflare Workers AI embeddings only *rank relevance* between candidates; no link is ever created from embedding similarity alone.

1. **Keyword ownership:**
   - Each page's primary keyword is owned by exactly one URL (`keywords.keyword` is unique).
   - Two pages claiming the same keyword are flagged in admin as **cannibalization**.
2. **Candidate detection:**
   - For each published, indexable page, scan its plain text for keywords owned by *other* pages.
   - Matching is case-insensitive and on word boundaries.
   - Secondary keywords are lower-priority anchors.
3. **Relevance:**
   - Embed both pages with `@cf/baai/bge-base-en-v1.5` via AI Gateway and store the vectors in pgvector.
   - Link if cosine ≥ 0.75 (starting value, tuned with evals) or the pages share a topic cluster (same service category).
   - With AI off, this step is skipped and steps 1–2 decide.
4. **Placement rules:**
   - First occurrence only.
   - Never inside headings, existing links, buttons, nav or FAQ questions.
   - At most one link per target per page, and 3–5 links per 1,000 words.
   - No self-links, and no links to noindex or draft pages.
   - Always dofollow.
5. **Anchor:** the keyword text exactly as written on the page (it varies naturally), never the target's full title.
6. **Rendering:** injected on the server from `approved`/`auto` rows at ISR time. Zero client JS.
7. **Admin queue:**
   - Statuses are suggested / approved / rejected / auto.
   - An auto-approve toggle, per-link preview and override.
8. **Recalculation:**
   - Runs on content or keyword change, plus monthly.
   - Writes are atomic upserts keyed on (from, to, keyword). Never delete-all-then-insert.

The current `linking-service.ts` bugs (drafts embedded, keywords = meta_title, freshness never applied, non-atomic rebuild, exact-title anchors) are fixed by this design.

### 5.5 Monthly AI empty-field fill

1. **Trigger:** Vercel Cron, monthly → `GET /api/v1/cron/seo-fill` (Bearer `CRON_SECRET`). The same job can be started for one page from the admin.
2. **Target:** published pages with at least one empty meta field. Pages with too little text to ground on are skipped.
3. **Prompt:**
   - A grounded prompt with the fixed part first, then the page content and target keywords: *"use only the provided content; never invent numbers, prices, results or client names"*.
   - Versioned at `src/server/ai/prompts/seo-fill.v1.txt`.
   - Page content is wrapped and marked as data (protection against prompt injection).
4. **Model:** Workers AI text model via AI Gateway, temperature 0.2, JSON-schema output, a max-tokens cap, 20–30 s timeout, 2 retries.
5. **Validate:** Zod checks lengths, keyword counts and forbidden claims. Invalid output is discarded and logged.
6. **Write only fields that are still empty:**
   - A conditional `UPDATE … WHERE field IS NULL OR field = ''` per field, so a concurrent human edit always wins.
   - Sets `field_sources.field = 'ai'`.
7. **Log:** an `ai_jobs` row (items, fields, tokens, cost) and `audit_log` entries.
8. **Report and revert:** the admin sees what was filled per run, with a one-click revert per job.

**Guarantees:**
- It never overwrites a human value; the current `force` mode is removed.
- Kill switch `AI_ENABLED`.
- A monthly budget with an alert at 80%.
- 30 golden eval cases before shipping (SOP Layer 9), covering grounding, lengths, Hindi/Hinglish content and injection hidden in page text.

### 5.6 AI images for services and blogs

1. **Trigger:** an admin button per item, plus the monthly `GET /api/v1/cron/image-fill` for services and blogs with no image.
2. **Prompt:**
   - Built from the title, primary keyword and a brand style guide (palette `#e61e73` / `#0e2547`, editorial and clean; no text in the image, no real people's faces, no logos).
   - Versioned like the text prompts.
3. **Model:** Workers AI `@cf/black-forest-labs/flux-1-schnell` via AI Gateway.
4. **Post-process:** `sharp` creates a WebP hero and a 1200×630 OG variant, stored in a Supabase Storage `media` bucket. `media_assets` status is set to `pending_review`.
5. **Alt text:** AI-generated, Zod-checked to ≤125 chars.
6. **Approve:**
   - Attaches the image **only if the item still has no image**; human images are never replaced.
   - Rejected images are deleted from storage.
7. **Controls:** image budget, the `AI_ENABLED` kill switch, and an audit log.

Whether images auto-attach without review is the CEO's choice (§14 Q8). The default is review first.

---

## 6. Contact leads pipeline

This replaces `src/modules/contact/components/google-form-contact.tsx` (hidden-iframe Google Form, which gets deleted). **Supabase is the source of truth.** The Google Sheet and the emails are copies made from it.

```
Contact form (contact page, Editz, Blog-AI — tagged by source)
   │ POST /api/v1/contact
   ▼
Zod → honeypot → Cloudflare Turnstile → rate limit (5 / 10 min per ip_hash)
   ▼
INSERT contact_leads (status=new)  →  200 { success: true, data: { leadId } }
   ▼  after() — background, never blocks the visitor
   ├─ Google Sheets append (service account) → sheet_status
   └─ Nodemailer via Zoho SMTP: team notification + auto-reply → email_status
   ▼
hourly cron /api/v1/cron/leads-retry: retries failed channels, max 5 attempts, then flags on dashboard
```

**Runtime decision:** the contact handler runs in a Next.js route on the Node runtime (`export const runtime = "nodejs"`), not in a Supabase Edge Function. Edge Functions run on Deno, where Nodemailer and `googleapis` service-account signing need workarounds; on Node both work, and the route shares Zod schemas and the rate limiter with the rest of the backend. (The alternative is a Supabase Edge Function with `denomailer`, kept on record only.)

**Environment variables** (added to `.env.example`, values only in Vercel secrets):

| Var | Purpose |
|---|---|
| `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | append rows; the sheet is shared with the service account as Editor |
| `ZOHO_SMTP_HOST` (`smtp.zoho.in` for India-region accounts, else `smtp.zoho.com`), `ZOHO_SMTP_PORT` (465), `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS`, `LEADS_NOTIFY_TO` | email |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | spam protection |

**Admin:**
- **Leads inbox** at `/admin/leads`: paginated, search, filters for status and source, notes, an "Open Google Sheet" link, CSV export (owner/admin, audited).
- **Dashboard counters:** today, 7 days, 30 days, total, unread, and failed deliveries, plus counts per source (contact, Editz, Blog-AI).

**DPDP Act 2023:**
- A required consent checkbox, with `consent_text_version` stored for each lead.
- A purpose notice ("used only to respond to your enquiry").
- Retention of 24 months, then a monthly delete from both the DB and the sheet row.
- An admin "Erase lead" action for deletion requests.
- Only the hashed IP is stored, and logs carry `leadId` only, never names, emails or messages.
- The sheet is never shared publicly.

**Deliverability:** set SPF, DKIM (Zoho key) and DMARC (start with `p=quarantine` and `rua` reports) on the sender domain. The `From:` address must match the authenticated Zoho domain.

---

## 7. Design system centralisation

**Goal: the site looks exactly the same.** This reverses memory **D-05** (the token rule exemption).

### 7.1 Colour tokens (from the 2026-11-08 count of hardcoded hex in `.tsx`)

| Token | Value | Uses | Note |
|---|---|---|---|
| `--color-brand` | #e61e73 | 250 | brand pink (primary) |
| `--color-text` | #1f2937 | 205 | body / subheadings |
| `--color-navy` | #0e2547 | 159 | brand navy, dark sections |
| `--color-ink` | #111827 | 45 | darkest text |
| `--color-accent-purple` | #9333ea | 34 | accent |
| `--color-black` | #111111 | 33 | near-black surfaces |
| `--color-brand-alt` | #E32759 | 32 | off-palette; keep for now, review in a later design pass |
| `--color-brand-strong` | #ca155f | 25 | off-palette (hover/pressed); keep |
| `--color-bg-dark` | #0b0f17 | 21 | dark section background |
| `--color-text-muted` | #374151 | 20 | muted text |
| `--color-surface-pink` | #fff0f6 | 18 | pink tint |
| `--color-surface-muted` | #F2F2F2 | 18 | near-duplicate of grey-10 #F3F4F6; kept separate |

These 12 cover 860 uses. The codemod reports every remaining literal for manual mapping. **Merge rule:** two colours merge into one token only if a side-by-side render is identical; otherwise each hex keeps its own token. Spacing, radius, shadow and font tokens (`--font-display` Epilogue, `--font-ui` Outfit, `--font-body` DM Sans, `--font-serif` Cormorant, `--font-hand` Mansalva, from `src/lib/fonts.ts`) also go in `tokens.css`.

### 7.2 Steps

1. Create `src/styles/tokens.css` (`:root`), imported first in `globals.css`.
2. Point the Tailwind theme colours at the variables so existing classes keep working.
   - **Gotcha:** Tailwind 3 opacity modifiers (`bg-brand/50`) need channel format. Store `--color-brand-rgb: 230 30 115` and map `brand: "rgb(var(--color-brand-rgb) / <alpha-value>)"`.
3. Run a codemod that replaces literal hex in `className` arbitrary values (`text-[#1f2937]`) and inline `style` across the 54 files. Gradients, SVG fills and anything unmapped are flagged for manual review.
4. Add global helpers in `globals.css` (`.btn`, `.btn-primary`, `.card`, `.section`, `.container`), built only from tokens. Adopt them only where the markup already matches; no restyling.
5. Add an ESLint/CI check that bans raw hex outside `tokens.css`.
6. **Screenshot gate:** a Playwright diff on 10 key pages (home, about, contact, services, a service page, work, a case study, the blog index, a blog post, /editz) at 375 / 768 / 1440, before vs after. **Target 0 diff; nothing merges with a diff.**
7. Update `design.md` §1 and `BRAND_GUIDELINES.md`, and record D-12 in `memory.md`.

### 7.3 Settings → Theme (admin-editable)

| Aspect | Implementation |
|---|---|
| Editable | brand colour tokens only (brand, brand-strong, navy, accent, tints) |
| Stored | `theme_tokens` |
| Applied | the root layout emits `<style id="theme-tokens">:root{…}</style>` from cached data (`revalidateTag("theme")` on save), with no redeploy |
| Guardrails | Zod hex validation; WCAG 4.5:1 contrast check on text/background pairs before saving; reset to defaults; audit log |
| Access | owner, admin |

Editz uses the same tokens. A `--editz-*` sub-palette is added only where its current look differs.

---

## 8. Admin panel target

```
Dashboard
Content:  Blog · Services · Case studies · Products (Editz, Blog-AI) · Pages
SEO:      Meta objects · Keywords & internal links · Redirects · Sitemap & robots · AI jobs
Leads
Media library (+ AI image review)
Settings: Site · Theme · Users & roles · Integrations (Sheets, SMTP, AI, Search Console)
Audit log
```

| Section | Today | Added | Roles | Task |
|---|---|---|---|---|
| Dashboard | blog and service counts; errors show as "0" | full widget set below, each with an error state | owner, admin, marketer (marketing widgets) | NTF-319 |
| Blog | editor + media modal; edit/delete broken | working edit/delete, revisions, scheduling, draft preview links, bulk actions, unsaved-changes guard | owner, admin, marketer | 310, 320 |
| Services | editor; edit/delete broken | working edit/delete, media library, AI image fill | owner, admin, marketer | 310, 316, 320 |
| Case studies | editor; edit/delete broken | working edit/delete, media library | owner, admin, marketer | 310, 320 |
| Products | none | Editz and Blog-AI block editors with meta tab | owner, admin, marketer | 321 |
| Pages | 10 hardcoded `CORE_PAGES` | pages listed from the DB | owner, admin, marketer | 311 |
| Meta objects | SEO manager; blog SEO gets wiped | typed objects, completeness %, keyword slots | owner, admin, marketer | 311 |
| Keywords & internal links | API only, no delete | ownership registry, cannibalization alerts, link queue | owner, admin, marketer | 314 |
| Redirects | none | manager + 404 log | owner, admin, marketer | 313 |
| Sitemap & robots | static list, hardcoded `BASE_URL` | live status of each child sitemap | owner, admin, marketer | 313 |
| AI jobs | none (endpoint only) | runs, status, cost, revert, kill switch | owner, admin (marketer can run) | 315, 316 |
| Leads | none | inbox, counters, sheet link, export | owner, admin (marketer read) | 317 |
| Media library | blog modal only | site-wide library + AI image review queue | owner, admin, marketer | 316, 320 |
| Settings ▸ Site | partial (`seo/site`) | whitelisted site settings | owner, admin | 319 |
| Settings ▸ Theme | none | token editor (§7.3) | owner, admin | 318, 319 |
| Settings ▸ Users & roles | CRUD, owner rules in browser only | 4 roles, owner lock, invite flow, 2FA | owner, admin | 309, 320 |
| Settings ▸ Integrations | none | live health of Sheets, SMTP, AI Gateway, Search Console | owner, admin | 319 |
| Audit log | none | who / what / when for every write | owner, admin | 320 |

**Dashboard widgets:**
- **Leads:** today / 7d / total, unread, failed deliveries.
- **Content:** counts for posts, services, case studies, products, pages.
- **SEO:** completeness %, pages missing meta, keyword cannibalization alerts, 404s and broken internal links.
- **AI:** items missing images, last AI job status and cost.
- **Activity:** recent audit entries.

If its API fails, a widget shows "data unavailable", never "0".

**Platform-wide admin rules:**
- Pagination on every list.
- 300 ms debounce on search and the schema preview.
- Error banners instead of silent `catch`.
- The ⌘K search either works or is removed.
- TOTP 2FA (Supabase MFA) is required for owner and admin.

---

## 9. Products: Editz and Blog-AI

Both become first-class **`product_pages`** entities (§3.4), with admin-editable content blocks, their own meta object (`product:editz`, `product:blog-ai`), schema and breadcrumb. Both keep their current design.

- **Editz:**
  - Keep `src/modules/editz/components/*`, including its own Navbar and Footer, because it is a standalone single-pager.
  - Move the content in `src/modules/editz/lib/data.ts` into `content_blocks`. Each block type maps 1:1 to an existing component: hero, brand marquee, services, process, projects/video showcase, benefits, audience, testimonials, FAQ, CTA. The visuals don't change.
- **Blog-AI:**
  - Today it is a placeholder page.
  - Build the landing in order: hero, how it works (3 steps), features, pricing/CTA, visible FAQ, and a lead form (`source=blog-ai`).
- **Shared:**
  - Both product forms post to `/api/v1/contact` with a source tag that can be filtered in the inbox and is counted per product on the dashboard.
  - The external auto-blog engine keeps publishing through the secured `POST /api/v1/publish/blog` contract.
  - Whether that engine lives in this repo is an open question (§14 Q6).

---

## 10. Cleanup: dead code and logic held in the frontend

| Item | Action | Task |
|---|---|---|
| `generate-graph.ts` category/product/store branches, `createItemListSchema` import (replaced by the new ItemList) | delete | 312, 322 |
| `config.ts` dead `SchemaContentType` members, unused `@id` conventions | delete | 322 |
| Service resolver `serviceType`/`deliverables`/`offers` | used by the new Service node (312), otherwise delete | 312 |
| `validate.ts` `isValidAbsoluteUrl`, `isValidIsoDate` | delete (or use them in the new validators) | 322 |
| `site.ts` `openingHours`, `hasMap` (points to Cochin), `geo`, `clientsCanVisitOffice` | delete, or emit after correcting them (CEO, §14 Q11) | 322 |
| `src/lib/services/indexer.ts` | delete | 313 |
| Duplicate `parseJwt` (middleware + auth-helpers) | delete; one verified helper | 307/308 |
| Duplicate base-URL helpers (robots, sitemap, site) | one constant | 313 |
| Unused `supabaseAdmin` import in `api/auth/me` | delete | 322 |
| `db-proposals/archive/` | delete after confirming nothing references it | 322 |
| Hardcoded Supabase URL / anon-key fallbacks | delete; fail fast on missing env | 307 |
| Legacy `sb-role` cookie deletes | delete | 308 |
| Medusa starter leftovers (K-11) | delete | 322 |
| `/api/auth/dev-login` | delete | 307 |
| `src/lib/data/fallback-services.ts` (447 lines) | move to the DB | 322 |
| `all-faqs.ts`, `page-faqs.ts`, `home-faqs.ts` | move to `seo_meta.faqs` | 311 |
| Client-side owner/role checks, `OWNER_EMAIL` constant | move to the backend | 309 |
| 4 hardcoded blog categories in `BlogEditor` | move to a categories table | 310 |
| Hardcoded `BASE_URL` in the admin sitemap page | use the shared constant | 313 |
| Admin nav permissions read from `localStorage` | use `/auth/me` permissions | 309 |
| `google-form-contact.tsx` | delete after NTF-317 | 317 |

---

## 11. Implementation plan (phase-wise, updated 2026-11-08)

Each phase ends with a check that must pass before the next one starts (SOP "Implementation plan").

**Status key:**
- ✅ done in code and verified locally (type check, lint, 73 tests, production build)
- 🟡 code done, waiting on your keys or actions
- ⏳ next
- ⬜ not started

Estimates assume one developer.

### 11.0 Overview

| # | Phase | Tasks | Status | Est. | Ends when |
|---|---|---|---|---|---|
| 0 | Review & design | CTO review, this plan, SOP alignment | ✅ | — | Plan written (this file) |
| 1 | Security & foundation | NTF-307, 308, 309, 310, 323a | ✅ | done | Forged logins rejected; owner protected; admin edit/delete works; type/lint errors fail the build |
| 2 | SEO / AEO / GEO system | NTF-311, 312, 313, 314 | ✅ | done | Meta objects drive `<head>` and schema; real sitemaps; correct breadcrumbs; keyword internal links |
| 3 | Leads, admin, design | NTF-317, 318, 319 | 🟡 | done | Leads saved → Sheet → Zoho; dashboard, notifications, SEO report, settings, tokens.css |
| 4 | AI layers | NTF-315, 316 + evals | 🟡 keys only | done | Code + 30 golden evals done (offline evals pass in CI); live evals run once Cloudflare keys are set |
| **5** | **Go-live** | Migration M-04, keys, deploy, checklist | ⏳ **next** | 1 day | Setup-guide §10 checklist all ticked on production |
| 6 | Admin hardening | NTF-320 | ✅ | done | Audit log + restore, 2FA, scheduling, draft preview, media library, bulk actions |
| 7 | Products (EDITZ, Blog AI) | NTF-321 | ✅ | done | Both pages' content editable in admin; Blog AI lead form |
| 8 | Polish & tech debt | NTF-324…328 | ✅ | done | 0 raw hex classes (lint-enforced); `/api/v1` alias; next/image on EDITZ; CI + Lighthouse budgets; error boundaries; docs synced |
| 9 | Run & improve | Monthly / quarterly routines | ongoing | — | Routines running, each with an owner |

**Final status 2026-11-08:** every phase that can be done in code is complete — 1, 2, 3, 4, 6, 7 and 8. Verified locally: type check clean, lint 0 errors, 132 tests pass (30 live AI evals wait for keys), fresh production build passes, and a smoke test of the built site. **Only Phase 5 (go-live) remains, and it needs the owner:** run migrations M-04 + M-05, add the keys, deploy, turn on 2FA. Service pages now use on-brand hero illustrations (`public/images/services`, generated by `scripts/generate-service-images.mjs`).

**Status 2026-11-08 (later):** Phases 6 and 7 are built and verified locally (type check, lint, 100 tests, production build). They need migration M-05. **Remaining order: 5 (go-live, now including M-05) → 8.**

**Original order: 5 → 6 → 7 → 8.** Phase 5 comes first because everything in phases 1–4 waits on the database migration and keys. Phases 6 and 7 can run in parallel if two people work on them.

---

### Phase 1 — Security & foundation ✅

| Task | What was built | Verified by |
|---|---|---|
| NTF-307 | Auth on the AI job, meta-listing and linking routes; dev-login and admin_auth deleted; uploads use magic bytes, a 5 MB cap and no SVG; HTML sanitised; settings whitelist; separate `PUBLISH_API_KEY` | Code review + tests |
| NTF-308 | Signature-verified access tokens; rotating refresh token in httpOnly cookies; middleware auto-refresh; global logout revoke; 5 tries per 10 min login limit; generic errors; origin allowlist; security headers | `platform.test.ts`: forged and expired tokens are rejected |
| NTF-309 | 4 roles; legacy roles mapped; owner from the verified `OWNER_EMAIL`; owner rules in the API and a DB trigger; Google sign-ups become pending customers | Tests: admins cannot modify the owner |
| NTF-310 | PUT/PATCH/DELETE for blog, services, case studies and users; slug 409s; stale-write 409; soft-delete for posts; atomic user creation; approval emails | Build + type check |
| NTF-323a | `ignoreBuildErrors` and `ignoreDuringBuilds` off; 0 lint errors; 73 tests | `npm run build` passes |

### Phase 2 — SEO / AEO / GEO system ✅

| Task | What was built |
|---|---|
| NTF-311 | One meta object per page (`seo_setting`). Blank values never erase saved ones. Every human edit is locked (`field_sources`). OG, Twitter, robots, canonical and image alt now reach the live `<head>`. Staging is noindex. |
| NTF-312 | Schema matrix: Organization + WebSite on home; CollectionPage + dynamic ItemList on `/services`, `/work` and `/blog`; Service on service pages, EDITZ and Blog AI; BlogPosting on posts. Real breadcrumbs everywhere. One FAQ source per page feeds the visible accordion, the page schema and the `/faq` hub. |
| NTF-313 | 4 child sitemaps built from the DB, with real lastmod and images. robots.txt open to AI answer engines. Real 404s and an automatic 301 on slug rename. Root-layout canonical and the Indexing API removed. |
| NTF-314 | Keyword-ownership linking: a page's primary and secondary keywords link to it from other pages. First mention only, one link per target, never in headings, about 1 link per 150 words. Manual rules override; cannibalization is reported. |

### Phase 3 — Leads, admin, design 🟡

| Task | What was built | Waiting on |
|---|---|---|
| NTF-317 | `POST /api/contact` → Supabase → Google Sheet (API or the existing Form) → Zoho team email + auto-reply. Daily retry, 24-month retention, Leads inbox with CSV export. | M-04, Zoho app password |
| NTF-318 | `tokens.css` with brand, text, EDITZ, admin and font tokens. 903 colour uses converted with identical values. Settings → Theme with a contrast check. | M-04 (theme column) |
| NTF-319 | Dashboard analytics (leads trend, sources, SEO health, content, AI jobs), notification bell, SEO report + CSV, Settings (site, integrations, SMTP test) | M-04 |

### Phase 4 — AI layers 🟡

| Task | Status | Remaining |
|---|---|---|
| NTF-315 Empty-field meta fill (monthly and on demand) | Code done | Add `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN`; write 30 golden eval cases (grounding, length, Hindi/Hinglish, prompt injection); bring `ai-setup-guide.md` up to all 10 SOP layers |
| NTF-316 AI images for items without one | Code done | The same keys; first run from SEO Report, then review the images in the `media` bucket |

**Ends when:** a staging run changes only empty fields, the evals pass, and the cost shows in AI Gateway.

### Phase 5 — Go-live ⏳ (next · ~1 day · mostly owner/admin actions)

| Step | Who | Done when |
|---|---|---|
| 5.1 Rotate the Supabase service key; generate `CRON_SECRET`, `PUBLISH_API_KEY` and `IP_HASH_SALT`; delete `ADMIN_SECRET` | Owner | New values are in Vercel |
| 5.2 Set Zoho SMTP and Cloudflare AI keys; optionally a Sheets service account and Turnstile | Owner | Settings → Integrations shows all green |
| 5.3 Run migrations M-04 then M-05 in the Supabase SQL editor | Owner | Tables exist; your profile shows role `owner` |
| 5.3b Turn on 2FA for the owner account (Admin → Security) | Owner | Sign-in asks for a code |
| 5.4 Deploy to a Vercel **preview** with `NEXT_PUBLIC_NOINDEX=true`; run the setup-guide §10 checklist | Dev + owner | Every item passes on preview |
| 5.5 Promote to production; submit `/sitemap.xml` in Search Console and Bing | Owner | Sitemaps show "Success"; Rich Results Test passes for home, a service, a blog post and /faq |
| 5.6 Give `PUBLISH_API_KEY` to the n8n / Blog-AI publisher | Owner | A test post publishes |
| 5.7 Run SEO Report → AI fill of empty fields → AI images | Marketer | Average score ≥ 80%, 0 errors |

**Rollback:** redeploy the previous Vercel build. M-04 only adds things; the role mapping can be reversed by hand (old → new values are in §4.3).

### Phase 6 — Admin hardening (NTF-320) ✅ built 2026-11-08 · needs M-05

| # | Deliverable | Done when | Days |
|---|---|---|---|
| 6.1 | **Audit log**: who / what / when, with before/after values, for every admin write (content, SEO, users, settings, leads, AI). `/admin/audit` page for owner and admin. | Every write creates a row; marketers cannot see the log | 1 |
| 6.2 | **One-click restore** from the audit log for posts, services, case studies and meta objects | A restore brings back the exact previous values and refreshes the page | 1 |
| 6.3 | **2FA (TOTP)** with Supabase MFA: enable or disable in Settings → Security; a code step at login (password and Google); enforced for every account that has 2FA on; optional `REQUIRE_ADMIN_MFA` forces it for owner and admins | A stolen password alone cannot open the admin or call admin APIs | 2 |
| 6.4 | **Scheduled publishing** (`publish_at`, daily cron) and **draft preview links** (signed, expiring) | A scheduled post goes live on its date; a draft can only be viewed through its link | 1 |
| 6.5 | **Media library** for services and case studies (pick or upload instead of pasting URLs); unsaved-changes warning; pagination and bulk publish/delete on list pages | Long lists stay fast; no edits are lost | 1 |

### Phase 7 — Products: EDITZ and Blog AI (NTF-321) ✅ built 2026-11-08 · needs M-05

| # | Deliverable | Done when |
|---|---|---|
| 7.1 | A `product_pages` table. EDITZ content (services, projects, testimonials, process, benefits, audience, marquee) moves from `modules/editz/lib/data.ts` into the DB, with today's values as defaults. | EDITZ looks identical but reads from the DB |
| 7.2 | Admin → Products → EDITZ editor: section-by-section forms with validation and a preview link | A marketer edits a testimonial and it is live after saving |
| 7.3 | Blog AI page: editable hero, features, steps and CTA; an optional lead form tagged `blog-ai`, off by default so the design doesn't change | Blog AI leads show in the inbox under their own source |
| 7.4 | Meta object, Service schema, breadcrumb and FAQs for both pages | Already done in Phase 2 |

### Phase 8 — Polish & tech debt ⬜ · 4–5 days

| Task | Deliverable |
|---|---|
| NTF-324 | Tokenise the remaining ~76 one-off colours; ESLint rule banning raw hex in components |
| NTF-325 | Move admin routes to `/api/v1` with the standard `{success, data, error, meta}` response; old paths redirect |
| NTF-326 | Performance: EDITZ `<img>` → `next/image`; Lighthouse CI on every PR (≥ 80); Core Web Vitals checked against `performance.md` |
| NTF-327 | Monitoring: error tracking (e.g. Sentry) and an uptime alert; Playwright screenshot comparison on 10 key pages |
| NTF-328 | Docs sync: update `prd.md`, `architecture.md`, `design.md`, `performance.md` and `ai-setup-guide.md` from this plan (SOP rule 16) |

### Phase 9 — Run & improve (ongoing)

| When | Routine | Owner |
|---|---|---|
| Daily (automatic) | Keep-alive; retry failed lead deliveries | Cron |
| Monthly (automatic) | AI fill of empty meta fields and missing images | Cron |
| Monthly | Run the SEO report; fix errors; review keyword cannibalization; check Search Console | Marketer |
| Quarterly | CTO reviews every `docs/` file and bumps versions; dependency updates | CTO |
| Every PR | Typecheck, lint, tests and build pass; docs updated along with the code | Developer |

### 11.1 Task list (all)

| NTF | Title | Phase | Status | Depends on |
|---|---|---|---|---|
| 307 | P0 security hotfix | 1 | ✅ | — |
| 308 | Verified sessions, refresh rotation, rate limits | 1 | ✅ | 307 |
| 309 | 4 roles + protected owner | 1 | ✅ (DB part needs M-04) | 308 |
| 310 | Missing CRUD routes, 409s | 1 | ✅ | 308 |
| 311 | Meta objects + locks | 2 | ✅ | 310 |
| 312 | Schema matrix, breadcrumbs, FAQ hub | 2 | ✅ | 311 |
| 313 | Sitemaps, robots, 404/301 | 2 | ✅ | 311 |
| 314 | Keyword internal linking | 2 | ✅ | 311 |
| 315 | AI empty-field fill | 4 | 🟡 keys + evals | 311 |
| 316 | AI images | 4 | 🟡 keys | 310 |
| 317 | Contact leads pipeline | 3 | 🟡 M-04 + Zoho | 310 |
| 318 | Design tokens + theme | 3 | ✅ (76 literals → 324) | — |
| 319 | Dashboard, notifications, SEO report, settings | 3 | 🟡 M-04 | 317 |
| — | Go-live | 5 | ⏳ | 1–4 |
| 320 | Audit log, restore, 2FA, scheduling, media, bulk | 6 | ✅ (needs M-05) | 5 |
| 321 | EDITZ / Blog AI editable | 7 | ✅ (needs M-05) | 5 |
| 323 | Build gates (✅) + launch checklist | 1 / 5 | partial | — |
| 324–328 | Polish & tech debt | 8 | ⬜ | 6, 7 |

## 12. Task plans

### 12.1 NTF-307 — P0 security hotfix (full SOP plan)

**1. Problem and objective.** Production has these holes:
- token signatures are never verified;
- four admin APIs have no auth (including the `isDev` bypasses);
- `dev-login` can create an admin session;
- uploads have no limits or validation;
- `/api/admin/seo/site` accepts any field;
- the raw `ADMIN_SECRET` is stored in a cookie and reused as the publish bearer;
- blog HTML is a stored-XSS risk.

Two data-loss bugs also need an immediate patch: blog SEO is wiped on edit, and the sitemaps 404. The objective is to close all of them in one emergency release within 2 days, failing closed.

**2. Acceptance criteria.**
- [ ] Given a forged `sb-access-token` with an approved user's `sub`, when any admin page or `/api/admin/*` route is called, then the result is 401/403.
- [ ] Given no session, when calling `seo-auto-fill`, `custom/meta-listing`, `internal-linking/sync` or `/test`, then 401, in every environment.
- [ ] Given any build, when calling `GET /api/auth/dev-login`, then 404 (the file is deleted).
- [ ] Given an upload over 5 MB, an SVG, or bytes that don't match png/jpeg/webp, then 413/415. An image DELETE with a name outside the sanitiser format → 400.
- [ ] Given extra fields in `POST /api/admin/seo/site`, then only whitelisted columns change.
- [ ] Given a wrong publish key, then 401 via `timingSafeEqual`. The `admin_auth` cookie never contains the secret.
- [ ] Given `<script>`/`onerror` in blog content, when it is saved or rendered (public page and admin preview), then it is stripped.
- [ ] Given a saved blog SEO row, when the post is edited and saved, then the stored SEO values are unchanged unless edited. A failed SEO save shows an error.
- [ ] Given `/sitemap.xml`, then every listed child sitemap returns 200 with valid XML.

**3. Where the logic lives.** Backend only: `src/middleware.ts`, `src/lib/auth-helpers.ts`, the route handlers. The frontend change is limited to surfacing the SEO save error.

**4. Routes and objects.**
- **Protected:** `/api/admin/jobs/seo-auto-fill`, `/api/admin/custom/meta-listing`, `/api/admin/seo/internal-linking/*`.
- **Removed:** `/api/auth/dev-login`.
- **Hardened:** `/api/blog/upload`, `/api/admin/blog/images`, `/api/admin/seo/site`, `/api/admin/auth`, `/api/blog/publish`.
- **New (minimal):** `/sitemap/[name]` route serving pages/services/blogs/work from the DB. New env: `PUBLISH_API_KEY`.

**5. Files to change; code reused.**
- `src/lib/auth-helpers.ts`, `src/middleware.ts`: verify the token with `supabaseAnon.auth.getUser(token)` before the profile lookup, cache only verified tokens (keyed by a token hash), reject expired tokens, run the path check before the RSC fast path.
- `src/app/api/admin/jobs/seo-auto-fill/route.ts`: `verifyUserRole(req, ["admin"])`.
- `src/app/api/admin/custom/meta-listing/route.ts`: role check.
- `src/app/api/admin/seo/internal-linking/{sync,test}/route.ts`: remove the `isDev` bypass.
- Delete `src/app/api/auth/dev-login/route.ts`.
- `src/app/api/blog/upload/route.ts`, `src/app/api/admin/blog/images/route.ts`: size cap, magic-byte check, allowlist, delete-name regex.
- `src/app/api/admin/seo/site/route.ts`: Zod field whitelist.
- `src/app/api/admin/auth/route.ts`, `src/app/api/blog/publish/route.ts`, `src/app/api/blog/upload/route.ts`: separate `PUBLISH_API_KEY`, `timingSafeEqual`, opaque cookie value.
- `src/app/(site)/blog/[slug]/page.tsx`, `src/app/admin/blog/_components/BlogEditor.tsx`, `src/app/api/admin/blog/route.ts`: sanitise with `sanitize-html` (allowlist) on save and render.
- `src/app/admin/_components/SharedEntityEditor.tsx`, `src/app/api/admin/seo/route.ts`: load by `page_key` (add `?page_key=`), never upsert untouched blank fields, check `res.ok` in `BlogEditor`.
- `src/app/sitemap/route.ts` + a new child sitemap route: reuse `getSiteSetting`, the existing blog/service/case-study data functions.
- Remove the hardcoded Supabase URL/key fallbacks in `supabase-admin.ts`, `supabase.ts` and `middleware.ts`.
- Rotate `ADMIN_SECRET`, `CRON_SECRET` and the service-role key (K-09).

**6. Edge and failure cases.**
- **Supabase Auth unreachable:** fail closed (redirect to login / 401).
- **Latency of `getUser` on every admin request:** a 5-min cache of verified results only.
- **SVGs already in the bucket:** list and quarantine them.
- **The sanitiser changes existing posts:** run it in dry-run mode over all live posts and review the diff before deploying.
- **Key rotation logs everyone out:** deploy in a low-traffic window and tell the team.
- **External blog publisher:** give the n8n/auto-blog sender the new `PUBLISH_API_KEY` before cut-over.

**7. Impact check + memory.md checked.** Closes F-01 (interim), F-02, F-03, F-05 (interim), F-06 (interim), F-07, F-11, F-12, F-15, F-16. No visual change. No DB migration. Users have to log in again. Memory: K-01 to K-09 reviewed. Add K-21 (forged JWT), K-22 (missing CRUD routes), K-23 (sitemap 404).

**8. Security, performance and SEO.** Inputs validated, auth on every touched route, fail-closed. The 5-min verified cache keeps admin TTFB flat, and there are no DB calls for public routes (D-11 kept). SEO: sitemaps become crawlable, and blog SEO stops being destroyed.

**9. AI.** No prompt or model change. The AI route only gains auth.

**10. Test plan.**
- **Vitest unit tests:** forged and expired token rejection, the whitelist filter, sanitiser payloads (`<script>`, `onerror`, `javascript:` URLs, `<iframe>`), magic-byte detection.
- **Integration:** a 401/403 matrix over every touched route; upload fuzzing (6 MB file, `.svg`, SVG renamed to `.png`); wrong publish key.
- **Regression on staging:** Google and email login; edit a blog post and confirm its SEO is unchanged; all sitemaps return 200.
- **Build:** `grep -r isDev src/app/api` = 0, and `dev-login` is absent.

**11. Daily deliverables.**

| Day | Deliverable by 6:30 PM | Done when |
|---|---|---|
| 1 | Verified-token helper + middleware fix; auth on the 4 routes; dev-login deleted; Supabase fallbacks removed; on staging | forged-token and unauth tests pass on staging |
| 2 | Upload validation, site whitelist, publish key split, sanitiser, SEO hydration fix, child sitemaps; keys rotated; production deploy | all criteria in §2 pass on production |

**12. Better way?** This is a deliberately minimal patch. The durable fixes are local JWKS verification with refresh rotation (NTF-308), signed-URL uploads (NTF-320), and CSP headers plus Gitleaks in CI (NTF-323).

### 12.2 NTF-310 part A (Phase 0)

Add `src/app/api/admin/{blog,services,case-studies}/[slug]/route.ts` (or `[id]` where the UI sends an id) and `src/app/api/admin/users/[id]/route.ts`, exporting PUT/PATCH/DELETE. Use the hotfixed `verifyUserRole`, Zod field whitelists, call `revalidateContent()` (including `oldSlug` on rename), and apply the owner check on users from the server. The publish toggle sends only `{status}`. **Done when** edit, delete, publish toggle and user edit work from the current admin UI.

### 12.3 Remaining tasks (full 12-section plans are written in `task.md` before each one starts)

**NTF-308 — Auth & sessions**
- **Objective:** verified sessions with refresh-token rotation; login rate limit; generic errors; an origin allowlist from env; one source for the admin path.
- **Acceptance:**
  - Given an expired access token, when the user navigates the admin, then a silent refresh succeeds or they are redirected to login (no loop).
  - Given 5 failed logins per IP+email within 10 min, then 429.
  - Given a spoofed `Host`/`Origin`, then a mutating request → 403.
  - Given a role change, then the user's next request sees the new role.
- **Files:** `src/middleware.ts`, `src/server/auth/*`, `/api/v1/auth/*`, `src/lib/util/origin-check.ts`.
- **Done when:** sessions last more than 1h, every forged-token test fails closed, and logout revokes the refresh token.

**NTF-309 — Roles & owner**
- **Objective:** the 4 roles from §4, a permissions map, the owner trigger and service, the role migration, and invites that default to `customer`.
- **Acceptance:**
  - Given a marketer, when calling users/settings, then 403.
  - Given an admin, when editing or deleting the owner, then 403 OWNER_PROTECTED (also at the DB).
  - Given the owner deleting themselves without re-auth, confirmation and transfer, then blocked.
  - Given a new Google signup, then role `customer` and no admin access.
- **Files:** `src/server/auth/{permissions,owner}.ts`, the migration in `db-proposals/`, `src/app/admin/users/page.tsx`, `src/lib/config/roles.ts` (replaced).
- **Done when:** permission-matrix tests pass on the server, and no role or owner logic remains in the browser.

**NTF-310 — API v1, error handler, rest of CRUD**
- **Objective:** `src/server/http` (handler, errors, response), every admin route under `/api/v1` with Zod, pagination, `updated_at` 409s, slug 409s, atomic user creation, a categories table.
- **Acceptance:**
  - Given a duplicate slug, then 409 SLUG_TAKEN.
  - Given an invalid body, then 400 in the standard shape.
  - Given an unhandled error, then 500 with no internals leaked.
  - Given 500 posts, then the list is paginated and excludes `content`.
- **Files:** `src/app/api/v1/**`, `src/server/http/*`, `src/server/content/*`.
- **Done when:** the old `/api/admin/*` routes are removed or redirected and the admin uses only `/api/v1`.

**NTF-311 — SEO meta objects**
- **Objective:**
  - The `seo_meta` model, the resolver, fallbacks (§5.1) and the completeness %.
  - FAQs and the `CORE_PAGES` list move into the DB.
  - The current `seo_setting` data migrates across.
- **Acceptance:**
  - Given a page with no meta object, then the template values render.
  - Given a human-filled field, then it is shown, and no job overwrites it.
  - Given a blog SEO edit, then it persists.
  - Given any page, then `generateMetadata` and JSON-LD come from the same resolver output.
- **Files:** `src/server/seo/{meta,resolver}.ts`, the migration, `SharedEntityEditor`, the page `generateMetadata` functions.
- **Done when:** every route renders complete meta/OG/Twitter, and the completeness % is visible in admin.

**NTF-312 — Schema & breadcrumbs**
- **Objective:** the §5.2 matrix, with dynamic ItemLists, a Service node, real breadcrumbs everywhere and a single base URL.
- **Acceptance:**
  - Given `/blog` or `/work`, then an ItemList of the latest items comes from the DB and updates on publish.
  - Given a service page, then Service + BreadcrumbList with no Contact step.
  - Given home, then Organization + WebSite + WebPage + Breadcrumb(Home).
  - Given each page type, then snapshot tests pass.
- **Files:** `src/lib/schema/*` → `src/server/seo/schema/*`, `src/modules/common/components/json-ld`.
- **Done when:** the Rich Results Test is clean for each page type.

**NTF-313 — Sitemaps, robots, canonicals, redirects**
- **Objective:** everything in §5.3.
- **Acceptance:**
  - Given an unknown slug, then 404.
  - Given a slug rename, then the old URL 301s to the new one.
  - Given staging, then noindex.
  - Given `/sitemap.xml`, then only indexable, published URLs with a real `lastmod`.
- **Files:** `src/app/sitemap/*`, `src/app/robots.ts`, `src/app/layout.tsx`, `src/middleware.ts`, `next.config.js`, redirects admin.
- **Done when:** Search Console reads the sitemap index cleanly and every page has a self-canonical.

**NTF-314 — Internal linking**
- **Objective:** the §5.4 engine and admin UI.
- **Acceptance:**
  - Given page A owns keyword K, when page B contains K, then B's first valid occurrence links to A.
  - Given two pages owning K, then a cannibalization alert.
  - Given AI disabled, then keyword-only linking still works.
  - Given a rejected link, then it never renders.
- **Files:** `src/server/linking/*`, `src/server/ai/gateway.ts`, the keywords/links admin.
- **Done when:** links are live sitewide, the rebuild is atomic, and evals pass.

**NTF-315 — Monthly AI empty-field fill**
- **Objective:** everything in §5.5, plus the `ai-setup-guide.md` layers and 30 golden evals.
- **Acceptance:**
  - Given a filled field, then it is untouched.
  - Given an empty description, then it is filled, Zod-valid and audited.
  - Given `AI_ENABLED=false`, then a no-op.
  - Given a revert, then the job's fields are emptied again.
- **Files:** `src/server/ai/*`, `/api/v1/cron/seo-fill`, `vercel.json`, the AI jobs admin.
- **Done when:** a staging run changes only empty fields and the eval threshold is met.

**NTF-316 — AI images**
- **Objective:** everything in §5.6.
- **Acceptance:**
  - Given a service with no image, then a candidate goes to the review queue.
  - Given approval, then it is attached with alt text and an OG variant.
  - Given an item that already has an image, then it is skipped.
- **Files:** `src/server/media/*`, `src/server/ai/*`, `/api/v1/cron/image-fill`, the media review UI.
- **Done when:** the missing-images count drops to 0 after review, and cost is logged per job.

**NTF-317 — Contact leads**
- **Objective:** everything in §6.
- **Acceptance:**
  - Given a valid submission, then the row is saved, a sheet row is appended, and the team email and auto-reply are sent.
  - Given the honeypot is filled, then it is silently dropped.
  - Given more than 5 submissions in 10 min from one IP, then 429.
  - Given Sheets is down, then the lead is still saved and retried hourly.
- **Files:** `src/server/leads/*`, `/api/v1/contact`, `ContactClient.tsx`, `/admin/leads`.
- **Done when:** the lead shows in the inbox, the counter and the sheet, and the iframe form is deleted.

**NTF-318 — Design tokens**
- **Objective:** everything in §7.
- **Acceptance:**
  - Given the components, then no raw hex outside `tokens.css` (CI).
  - Given the screenshot gate, then 0 diff at 3 widths on 10 pages.
  - Given a theme change in admin, then the site recolours without a redeploy.
- **Files:** `src/styles/tokens.css`, `globals.css`, `tailwind.config.js`, the 54 `.tsx` files.
- **Done when:** the gate is green and D-12 is recorded.

**NTF-319 — Admin settings + dashboard**
- **Objective:** the Settings area and the §8 widgets.
- **Acceptance:**
  - Given an API failure, then the widget shows "unavailable".
  - Given Integrations, then the live status of Sheets/SMTP/AI/Search Console.
  - Given a marketer, then Settings is hidden and returns 403.
- **Files:** `src/app/admin/page.tsx`, `src/app/admin/settings/*`, aggregate endpoints (cached, cleared on mutation).
- **Done when:** every widget has real data or an error state.

**NTF-320 — Content ops**
- **Objective:** audit log, revisions with rollback, site-wide media library (signed uploads), pagination, bulk actions, scheduled publishing, draft preview tokens, unsaved-changes guard, TOTP 2FA for owner/admin.
- **Acceptance:**
  - Given any admin write, then an audit row and a revision.
  - Given a scheduled post, then it publishes on time (cron).
  - Given a dirty editor, when leaving, then a confirmation prompt.
  - Given an admin login, then TOTP is required.
- **Files:** `src/server/{audit,media,content}/*`, the editors.
- **Done when:** the flow is demoed end to end and 2FA is enforced.

**NTF-321 — Products**
- **Objective:** everything in §9.
- **Acceptance:**
  - Given `/editz`, then it renders from `product_pages` with an identical look (screenshot gate).
  - Given an admin edit to an Editz block, then it is live after revalidation.
  - Given `/blog-ai`, then the full landing with a lead form tagged `blog-ai`.
- **Files:** `src/modules/editz/*`, `src/app/(site)/{editz,blog-ai}/page.tsx`, the products admin.
- **Done when:** both pages are admin-editable and schema-valid, and `data.ts` is removed.

**NTF-322 — Cleanup**
- **Objective:** close every row in §10.
- **Acceptance:**
  - Given the repo, then a search for every §10 item returns 0 hits.
  - Given the build, then no unused exports (lint) and no `console.log`.
  - Given the pages, then no visual or behaviour change.
- **Done when:** all §10 rows are closed.

**NTF-323 — Build gates & launch**
- **Objective:**
  - Remove `ignoreBuildErrors`/`ignoreDuringBuilds`.
  - Run typecheck, lint, Vitest and build in CI on every PR, plus Lighthouse CI (≥80), Gitleaks and pinned `@medusajs/*` versions (K-10).
  - Then the SOP P12 launch check.
- **Acceptance:**
  - Given a PR with a TS error, then CI blocks it.
  - Given launch, then every P12 item passes with evidence.
- **Done when:** the CEO approves the launch.

---

## 13. Scenario checklist (SOP, before Gate 2)

| Area | Covered in | Status |
|---|---|---|
| Users and roles | §4 | covered (Q2 open) |
| Auth (login, Google, reset, refresh, logout everywhere, lockout) | §3.5, NTF-308 | covered; password reset flow → add to NTF-308 plan |
| SEO (title, description, slug, canonical, H1, schema, OG, sitemap, robots by env, 301 on slug change, SSR/ISR) | §5 | covered |
| Performance | `performance.md` (existing) + NTF-323 Lighthouse CI | covered; caching table to be updated for new routes |
| Errors (API fails, slow network, empty data) | §3.5, §8 widget rule, NTF-310 | covered |
| Payments | — | not applicable: no payments on the site |
| Files and uploads | NTF-307, §5.6, NTF-320 | covered |
| Email and notifications | §6 | covered (team + auto-reply); unsubscribe not applicable (transactional only) |
| Search | §8 (⌘K) | gap: decide whether to build or remove (NTF-320) |
| Data (backups, restore test, migrations, soft delete) | §3.4 (soft delete, db-proposals) | gap: backups and a monthly restore test go into the NTF-323 launch check |
| Privacy (DPDP) | §6 | covered for leads; gap: privacy policy text update for leads and AI use (NTF-317) |
| Security (rate limits, CORS, headers, secrets, dependency updates, admin 2FA) | NTF-307/308/320/323 | covered |
| Integrations (Sheets, SMTP, Cloudflare AI) down | §6 retry, §5.5 kill switch | covered |
| Environments (dev/staging/prod, staging noindex) | §5.3 | gap: confirm a staging environment exists (Q9) |
| Admin panel (what admins edit, audit log) | §8 | covered |
| Analytics (GA4 with consent, conversion goals) | — | gap: GTM is present; define the lead-submit conversion event and consent mode (NTF-317) |
| Accessibility and devices | `design.md` + §7 contrast check | covered |
| Languages | §5.5 evals (Hindi/Hinglish content) | English UI only; dates and ₹ in en-IN |
| AI | §5.4–5.6 → `ai-setup-guide.md` | covered at plan level; the 10 layers get written in Phase 1 |
| Scale | `performance.md` | covered |
| Monitoring (errors, uptime, alerts) | — | gap: add error tracking (e.g. Sentry) and uptime alerts to NTF-323 |
| Launch (domain, SSL, redirects, Search Console, rollback) | NTF-323 | covered |

---

## 14. Open questions for the CEO

1. **Owner account:** which email gets owner access? (Proposed: the account email you use for this workspace. Please confirm in writing.)
2. **Role mapping:** should existing `manager` users become admin or marketer? Should `viewer` become marketer or customer?
3. **AI text provider:** move SEO fill from OpenAI `gpt-4o-mini` to Cloudflare Workers AI (one gateway, cost on Cloudflare credits), or keep OpenAI behind the same gateway?
4. **Zoho:** which mailbox and sender domain is used for lead emails? Is the account India-region (`smtp.zoho.in`)? Who can set the SPF/DKIM/DMARC DNS records?
5. **Google Sheet:** the sheet ID, and who owns the Google Cloud project for the service account?
6. **Blog-AI:** is the auto-blog engine a separate product or app (this site keeps only its landing page and the publish API)? Schema: Service or SoftwareApplication?
7. **Turnstile:** is Cloudflare Turnstile acceptable on the contact form?
8. **AI images:** review queue first (recommended), or auto-attach?
9. **Staging:** does a staging environment exist? It is needed for every gate.
10. **SEO tool bots:** allow AhrefsBot and SemrushBot so your own SEO tools can audit the site?
11. **Organization facts:** the correct `foundingDate`, social profiles (`sameAs`, X/Twitter handle), and whether the Google Maps link (currently pointing to Cochin) should be fixed or dropped.
12. **Customer role:** is any customer-facing login planned? If not, signups stay closed and `customer` only exists as a safe default.

---

## 14a. Change request — 2026-11-08 (CEO, approved to implement)

Answers and new scope from the CEO. These override the matching open questions above.

| # | Requirement | Decision / implementation |
|---|---|---|
| CR-1 | Owner = `sharmasaurabh2604@gmail.com` | `OWNER_EMAIL` env with that default (`src/lib/config/owner.ts`). The owner is recognised from the **verified** email, cannot be edited, demoted or deleted by anyone else, and always has full access. The DB trigger is in `db-proposals/migrations/2026-11-08_roles_owner_leads_notifications.sql`. |
| CR-2 | Roles: owner, admin, marketer, customer | `src/lib/config/roles.ts`. Legacy roles map automatically (admin→admin; manager/seo/content_manager/editor/viewer→marketer; anything else→customer), so the site works before and after the migration. Answers Q2: manager → marketer. |
| CR-3 | Google sign-in to admin | Kept (Supabase OAuth, PKCE). The callback now creates new Google accounts as `customer` + `pending`, notifies the owner, and auto-approves only the owner. |
| CR-4 | "Use refresh tokens instead of JWT" | The session is a **short-lived access token + rotating refresh token**, both httpOnly cookies. The access token is only trusted after cryptographic verification. Middleware refreshes it automatically with the refresh token (Supabase rotates it on every use), and logout revokes the session globally. The browser never holds a token. (Supabase access tokens are JWTs by design; what changed is that they are verified, short-lived and backed by refresh rotation.) |
| CR-5 | AI fills only empty meta fields, and image alt/title follow the keywords; once filled or corrected, never change | Per-field locks: a field that has a value is never written by AI, and every field a human saves is marked `human` in `field_sources` and locked permanently. AI writes use a conditional "still empty" update. No force mode. |
| CR-6 | SEO report on request in admin | `GET /api/admin/seo/report`: per-page completeness, title/description length checks, missing keywords, missing images/alt text, duplicate titles, cannibalised primary keywords, and sitemap coverage. Shown on the admin SEO Report page, exportable as CSV. |
| CR-7 | Notifications in admin | `admin_notifications` table plus a bell in the admin header: new lead, access request, AI job finished, failed email/sheet sync. The owner also gets email through Zoho SMTP. |
| CR-8 | Analytics dashboard | The dashboard shows leads (today/7d/30d/total, by source, 30-day trend), content counts, SEO completeness, missing images, AI jobs, and recent notifications. Every widget has an error state. |
| CR-9 | Centralised CSS for the whole website (blog, pages, Editz colours, fonts) | `src/styles/tokens.css` defines site, blog, pages, Editz and admin palettes plus font tokens. Tailwind maps to them. Values equal the current colours, so the site looks the same. |
| CR-10 | Zoho SMTP for all mail | One mailer (`src/lib/services/mailer.ts`) used for lead notifications, lead auto-replies, access-request alerts and approval emails. |
| CR-11 | Caching without Redis | In-process TTL caches (`src/lib/util/ttl-cache.ts`) plus Next ISR / `unstable_cache` tags. No external cache service. |
| CR-12 | Admin panel design fix | Admin only. The public website design is not touched. |
| CR-13 | No unnecessary changes | Public markup and styles stay identical. Changes are limited to logic, data, SEO metadata/schema, and admin. |

---

## 15. Decisions to record in `memory.md` (on approval)

| ID | Decision | Why |
|---|---|---|
| D-12 | Reverse D-05: all colours, spacing and fonts come from `tokens.css`; raw hex is banned by CI | SOP rule 9; admin-editable theme |
| D-13 | 4-role model owner/admin/marketer/customer; owner protected at the DB | CEO requirement; least privilege |
| D-14 | `seo_meta` replaces `seo_setting` (closes K-16); human > AI > template | One SEO source, metadata/JSON-LD parity (D-06) |
| D-15 | All AI goes through `src/server/ai` → Cloudflare AI Gateway; MCP servers are dev tools only | SOP AI Layer 1; budgets, logs, kill switch |
| D-16 | Internal linking is hybrid (keyword ownership + embedding relevance), server-rendered | Predictable, works with AI off, stops cannibalization |
| D-17 | Supabase is the source of truth for leads; the Sheet and emails are copies | No lost leads when Google or Zoho is down |
| D-18 | Google Indexing API removed | Only supported for JobPosting/BroadcastEvent |
| D-19 | FAQPage markup only for visible FAQs; no expectation of FAQ rich results | Google's 2023 FAQ restriction |
| D-20 | AI jobs only fill empty fields; no force mode | Protects human SEO work |
