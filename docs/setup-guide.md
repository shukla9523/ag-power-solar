# Mommantum — Setup Guide (v1.0 · 2026-11-08)

How to deploy and operate the platform after the 2026-11-08 remediation. Follow the steps in
order. Every secret goes into **Vercel → Project → Settings → Environment Variables** (Production
and Preview). `.env.example` at the repo root lists every variable, with comments.

---

## 1. Before you deploy (one time, about 30 minutes)

### 1.1 Rotate exposed keys
Memory K-09 notes that `.env.local` once shipped inside a zip, so treat the old keys as public:

1. Supabase → Settings → API → **Roll** the service-role key. Update `SUPABASE_SERVICE_ROLE_KEY`.
2. Generate fresh machine keys and set them in Vercel:
   ```bash
   openssl rand -hex 32
   ```
   Use a different value for each of `CRON_SECRET`, `PUBLISH_API_KEY` and `IP_HASH_SALT`.
3. Give the new `PUBLISH_API_KEY` to whoever runs the n8n / Blog-AI publisher. It replaces the
   old `N8N_API_KEY` / `ADMIN_SECRET`, which are no longer accepted for publishing (the old
   `N8N_API_KEY` still works as a fallback until you remove it).
4. Delete `ADMIN_SECRET` from Vercel. Nothing uses it any more.

### 1.2 Required variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `SUPABASE_JWT_SECRET` (recommended) | Supabase → Settings → API → JWT Settings → JWT Secret. Enables fast local verification of login tokens; without it, every admin request is checked with Supabase Auth instead (still secure, a little slower). |
| `OWNER_EMAIL` | `sharmasaurabh2604@gmail.com` (this is also the built-in default) |
| `CRON_SECRET`, `PUBLISH_API_KEY`, `IP_HASH_SALT` | Generated in 1.1 |
| `NEXT_PUBLIC_BASE_URL` | `https://www.mommantum.com` |

### 1.3 Run the database migration (by a person, per decision D-09)
Supabase → SQL Editor → paste and run
`db-proposals/migrations/2026-11-08_roles_owner_leads_notifications.sql`.

It is idempotent, so running it twice is safe. It:
- maps old roles (manager/seo/content_manager/editor/viewer → **marketer**) and enforces the 4 roles;
- makes `sharmasaurabh2604@gmail.com` the **owner**, with a database trigger so nobody else can edit, demote or delete that row;
- creates `contact_leads`, `admin_notifications`, `redirects`, `ai_jobs` and `media_assets`;
- adds the meta-object lock columns (`field_sources`, `image_alt`, `image_title`, `og_image_alt`) and the site-setting columns (theme, share image, Twitter handle, sheet URL).

The site keeps working **before** the migration (features degrade gracefully). After it, the
leads inbox, notifications, redirects, AI history and field locks are fully active.
Record the run in `db-proposals/README.md` as **M-04**.

Then run **M-05**, `db-proposals/migrations/2026-11-08b_audit_mfa_scheduling_products.sql`.
It adds:
- the append-only `audit_log` (a trigger blocks edits and deletes);
- `profiles.mfa_enabled`;
- `post.publish_at` and the `scheduled` status;
- the `product_pages` table for EDITZ and Blog AI content.

Like M-04, it is idempotent. Record it as **M-05**.

Then run **M-06**, `db-proposals/migrations/2026-11-09_security_hardening.sql` (security review fixes S1, S5, S9 and S14).
It:
- lets a signed-in user read **only their own** `profiles` row, and adds a trigger so the role, status, email and 2FA flag can be changed only by the server;
- lets the public key read **only published** blog posts (drafts and scheduled posts stay private);
- removes all public access to `site_setting` (it holds the private leads-sheet link). The website now reads it with the server key and keeps only the public columns;
- blocks public calls to `increment_redirect_hits` and fixes the `search_path` of every SECURITY DEFINER function.

The checks at the bottom of the file confirm the result. Record it as **M-06**.

### 1.4 Supabase Auth rate limits (review S16)

The app's own login limit (5 tries per 10 minutes) applies per server instance, and attackers can call Supabase Auth directly.
In Supabase → Authentication → Rate Limits, set:
- sign-ins and sign-ups: **30 per 5 minutes per IP**;
- token refreshes: **150 per 5 minutes per IP**;
- verification (OTP/2FA) requests: **30 per 5 minutes per IP**.

Also turn on **leaked-password protection** and set the minimum password length to **10**.

### 1.5 Content-Security-Policy (review S7)

`next.config.js` sends two headers:
- an **enforced** policy (`object-src 'none'; base-uri 'self'; frame-ancestors 'self'`), which can't break pages;
- a **Report-Only** policy with the full allowlist (GTM/Analytics, Turnstile, Supabase, the Maps embed and video hosts).

After deploying, open the site and the admin panel with DevTools → Console for a week.
If no `Content-Security-Policy-Report-Only` warnings appear, rename that header to `Content-Security-Policy` to enforce it.
If you add a new third-party script, add its host to the matching list first.

---

## 2. Owner access and sign-in

- Sign in at `/admin-login` (or `/<CUSTOM_ADMIN_PATH>-login` if you set a disguised path) with
  **Google** or email and password, using `sharmasaurabh2604@gmail.com`.
- The owner is recognised from the **verified** email, so owner access works even before the
  migration runs.
- **Owner rules** (enforced on the server and in the database):
  - nobody else can edit, demote, suspend or delete the owner;
  - nobody can be given the `owner` role;
  - only the owner can create or promote admins.
- **Deleting the owner account:** only the owner can do it. Users & Roles → Delete, then type
  the owner email and `DELETE OWNER ACCOUNT`. To hand ownership to someone else, change
  `OWNER_EMAIL` in Vercel and redeploy first.

### Roles

| Role | Can do |
|---|---|
| **owner** | Everything, including other admins. Protected account. |
| **admin** | Everything except changing the owner or other admins: users, settings, theme, leads export/delete. |
| **marketer** | Blog, services, case studies, pages & SEO, SEO report, AI fill, keywords, leads (read), media. No users or settings. |
| **customer** | Default for every new sign-up (including Google). No admin access until an admin approves and assigns a role. |

New Google sign-ins create a pending `customer` profile, and the owner gets a notification and
an email. Approve the user in **Users & Roles** and pick a role; they receive an approval email.

### Two-factor authentication (2FA)
- **Turn it on:** Admin → **Security (2FA)** → *Set up 2FA* → scan the QR code with Google Authenticator, Microsoft Authenticator, 1Password or Authy → enter the 6-digit code.
- **What changes:** from then on, every sign-in (password or Google) asks for the code. Until the code is entered, the session cannot open admin pages or call admin APIs.
- **Turn it off:** enter a current code in the Security page.
- **Force it for owner and admins:** set `REQUIRE_ADMIN_MFA=true`. Those accounts are then sent to the Security page until 2FA is set up, and cannot turn it off.
- **Prerequisite:** Supabase → Authentication → Multi-Factor must have **TOTP** enabled. It is on by default.
- **Lost phone:** another admin cannot remove your factor. The owner can remove it in Supabase → Authentication → Users → *the user* → **Factors**, then clear `profiles.mfa_enabled`.

### Sessions (the "refresh token" setup)
- Login sets two **httpOnly, Secure, SameSite=Lax** cookies:
  - a short-lived access token (~1 h);
  - a 30-day refresh token.
- The browser never holds a token in JavaScript.
- On every admin request the access token is cryptographically verified. When it expires,
  middleware swaps the refresh token for a new pair (Supabase rotates the refresh token on every
  use), so you stay signed in without re-entering your password.
- **Sign out** revokes all of your sessions server-side.

---

## 3. Email (Zoho SMTP)

1. Zoho Mail → My Account → Security → **App Passwords** → create one for "Mommantum website".
2. Set these in Vercel:
   - `ZOHO_SMTP_HOST`: `smtp.zoho.in` for India-region accounts (`smtp.zoho.com` otherwise)
   - `ZOHO_SMTP_PORT`: `465`
   - `ZOHO_SMTP_USER`: the full mailbox address
   - `ZOHO_SMTP_PASS`: the app password
   - optionally `ZOHO_SMTP_FROM`, `LEADS_NOTIFY_TO` and `LEADS_REPLY_TO`
3. DNS on the sending domain (Zoho shows the exact records):
   - **SPF:** `v=spf1 include:zoho.in ~all`
   - **DKIM:** the Zoho selector record
   - **DMARC:** start with `v=DMARC1; p=quarantine; rua=mailto:<you>`
4. Admin → **Settings → Send test email**.

Emails sent:
- new lead → team, with Reply-To set to the visitor;
- visitor auto-reply;
- new access request → owner;
- account created / approved → user;
- failed deliveries and other notifications → owner and `NOTIFY_EMAILS`.

---

## 4. Contact form → Supabase → Google Sheet → email

The flow is: visitor submits → `POST /api/contact` (validated, honeypot, 5 per 10 minutes per IP,
optional Turnstile) → **saved in `contact_leads` first** → in the background, copied to the Google
Sheet and emailed. Failed copies retry daily (cron `leads-retry`) up to 5 times.

**Google Sheet, two options:**
- **Zero setup (default):** leads are posted to the existing Google Form, whose responses sheet the team already uses.
- **Direct Sheets API (recommended):**
  1. Google Cloud → create a service account → create a JSON key.
  2. Share the sheet with the service-account email as **Editor**.
  3. Add a tab named `Leads` with headers: Date, Name, Email, Phone, Subject, Message, Source, Page, Lead ID.
  4. Set `GOOGLE_SHEETS_ID` (from the sheet URL), `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` (keep `\n` for newlines).

**Admin → Leads:** search, filters, status, notes, CSV export and an "Open Google Sheet" link.
Put the sheet URL in Settings → Leads Google Sheet URL. The dashboard shows today / 7-day /
30-day / total counts, counts by source, and a 30-day trend.

**Spam protection (optional):** create a Cloudflare Turnstile widget and set both
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Set both or neither.

**DPDP:** the form shows a consent notice linking to the privacy policy. IPs are stored only as
salted hashes, and leads are auto-deleted after 24 months. Add a line to the privacy policy
saying that contact details go to Supabase, Google Sheets and Zoho.

---

## 5. AI: meta fill (empty fields only) and images

### 5.1 Configure
1. Cloudflare → Workers AI → copy the **Account ID**, then create an API token with
   *Workers AI: Read & Edit*. Set `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.
2. Optional: Cloudflare → AI → **AI Gateway** → create a gateway (for example `mommantum`) with a
   daily spend limit and caching. Set `CLOUDFLARE_AI_GATEWAY=mommantum`.
3. `AI_ENABLED=false` stops every AI call immediately (kill switch). `OPENAI_API_KEY` is used only
   if Cloudflare is not configured.

> The `cloudflare-coder` MCP server in Claude Code is a **developer tool**. The live website calls
> Cloudflare's API directly from the server; it never depends on the MCP server.

### 5.2 How the meta fill behaves
- Runs monthly (1st of the month, 03:00 UTC) and on demand from **Admin → SEO Report**, for all pages or one page.
- For each page it finds the meta fields that are **empty** (title, description, primary + 4
  secondary keywords, OG/Twitter title and description, image alt, image title, share-image alt)
  and generates **only those**, grounded in the page's own text.
- A field that already has a value is never sent and never overwritten, and that is re-checked at
  the moment of writing. A field a person saves or corrects is marked `human` and locked forever.
- Pages with nothing missing cost no AI calls. Every run is logged in `ai_jobs` and shows up in notifications.

### 5.3 Images
For items that have no image (no DB image and no `/og/services/<slug>.jpg` file), the job:
1. generates a brand-styled, text-free image with FLUX (Workers AI);
2. converts it to WebP 1600×900 plus a 1200×630 share image;
3. uploads both to the Supabase `media` bucket;
4. attaches them **only if the item still has no image**, and fills the empty image alt / title from the primary keyword.

Every service has a static image today, so the job mainly covers blogs and case studies without
one.

**WebP everywhere (automatic).**
- **New images:** every image uploaded through the admin media library or the blog publisher (`/api/blog/upload`) is converted to WebP on the server before it's stored (max 2000 px wide, EXIF rotation applied, transparency and animation kept).
- **Published posts:** when a post is published or saved, any of its images in your Supabase Storage that are not WebP are converted and the post's URLs are switched to the WebP files.
- **Site images:** all images in `public/` are WebP (converted with `node scripts/convert-images-to-webp.mjs`, which saved about 9.7 MB). Social share cards (`/og/`) and favicons/app icons stay JPG/PNG on purpose, because social networks and browsers expect those.
- **One-time backfill of old storage images:** run `node scripts/convert-storage-images-to-webp.mjs` (dry run) and then add `--apply`. Originals are kept.
- **Guard:** `src/lib/__tests__/assets.test.ts` fails the build if any image or video referenced in the code is missing, or if a site image isn't WebP.

**Service hero illustrations (no AI needed).**
- Each service page's hero shows an on-brand illustration from `public/images/services/<slug>.webp`. Each one has a pink icon tile, a product-style scene for that service, and two benefit chips.
- To regenerate after a brand change, or when you add a service:
  1. Add the service to the `SERVICES` list in `scripts/generate-service-images.mjs`.
  2. Run the generator:
     ```bash
     node scripts/generate-service-images.mjs
     ```
- An image uploaded in the admin always takes priority.
- Social share previews keep the title card (`/og/services/<slug>.jpg`), because it shows the service name. Run it from Admin → SEO Report → "AI: generate missing images".

---

## 6. SEO, AEO and GEO: what is automatic now

**Meta objects.** Each page has one, stored in `seo_setting` under its `page_key`:
`homepage`, `about`, `services`, `work`, `blog`, `editz`, `blog-ai`, `faq`, `contact`, the legal
pages, `service:<slug>`, `blog:<slug>` and `work:<slug>`. Each holds a title, description,
1 primary + 4 secondary keywords, canonical, robots, OG and Twitter fields, image alt/title and
FAQs. Empty fields fall back to templates. `generateMetadata` and the JSON-LD are built from the
same values.

**Schema.**
- Home: Organization + WebSite + WebPage + breadcrumb.
- `/services`, `/work`, `/blog`: CollectionPage + **ItemList that updates automatically** (latest first).
- Services, EDITZ and Blog AI: WebPage + **Service**.
- Blog posts: BlogPosting.
- Every page has a breadcrumb matching its real position (Home › Section › Page).

**FAQs.** One source per page feeds three places:
- the visible accordion;
- that page's FAQPage schema;
- the **/faq hub**, which shows every page's FAQs as accordion categories, plus the knowledge base, under one FAQPage schema.

Edit a page's FAQs in the admin and all three update together.

**Internal links.**
- Every page's primary and secondary keywords are "owned" by that page. When the phrase appears
  in a blog post or service copy elsewhere, it becomes a link to the owner, using the keyword as
  anchor text.
- Limits: first mention only, once per target, never inside headings or existing links, and about 1 link per 150 words (2–8 per page).
- Manual rules in `site_keywords` take priority.
- Two pages sharing a primary keyword are flagged as cannibalization in the SEO report.

**Sitemaps.**
- `/sitemap.xml` is the index of `pages`, `services`, `blogs` and `work`. Each is built from the DB, with real `lastmod`, image entries and no noindex pages.
- Submit `https://www.mommantum.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

**Robots.**
- Search engines and AI answer engines (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) may read and cite public pages.
- Admin, API and auth paths are blocked.
- Previews and staging are blocked entirely (`NEXT_PUBLIC_NOINDEX=true`).

**404s and redirects.**
- Unknown URLs return a real 404.
- Renaming a slug creates a 301 automatically (`redirects` table).

**SEO report.** Admin → SEO Report → Run. It gives a score per page, issues, duplicate titles and
descriptions, cannibalization and missing images, and exports to CSV.

---

## 7. Design: centralised CSS

- **Colours and fonts** live in one file: `src/styles/tokens.css`.
  - Groups: brand, neutrals for site and blog text, EDITZ palette, admin palette, fonts.
  - Tailwind classes such as `bg-brand`, `text-navy`, `border-admin-line` and `font-epilogue` read those variables.
  - The values equal the previous colours, so the website looks the same.
- **Admin → Settings → Theme** changes the main colours without a redeploy. Text colours must keep 4.5:1 contrast on white. *Reset to defaults* undoes everything.
- **Rule from now on:** no raw hex colours in components. Add a token first (lint and review check this).
- About 76 one-off colour uses (gradients, single accents) still use literal values; they are listed as a follow-up in the plan.

---

## 7a. Audit log, restore, scheduling, previews, media, bulk actions

**Audit Log** (Admin → Audit Log, owner/admin only):
- Records who, what and when for every change: content, SEO, users, roles, 2FA, settings, leads, keywords and product pages.
- Also records AI fills (`ai`), the publishing API (`api`) and cron jobs (`cron`).
- Each entry shows the changed fields as before → after.
- **Restore** puts a post, service, case study or meta object back exactly as it was before that change, and re-creates deleted services and case studies.
- The restore itself is logged.
- Lead erasures are logged without any personal data (DPDP).

**Scheduled posts:**
1. In the blog editor, set the status to **Scheduled** and pick a date and time.
2. `/api/cron/publish-scheduled` publishes due posts daily at 00:15 UTC. On Vercel Pro you can change the schedule in `vercel.json` to hourly (`0 * * * *`).

**Private preview:**
- In the blog editor, *Create private preview link* gives a signed link (valid 7 days) that shows the draft or scheduled post with a "Preview" banner.
- The preview is never indexed or cached.
- Needs `PREVIEW_SECRET` (or `CRON_SECRET`).

**Media library:** the service and case-study editors have *Choose from media library*: browse, upload (PNG/JPEG/WebP/GIF, 5 MB max) and pick.

**Unsaved changes:** blog, service and case-study editors warn before you close or reload with unsaved edits.

**Bulk actions:** the blog list is paginated (25 per page) and supports select-all with Publish / Move to draft / Delete. Each change is a separate audited request, so deletes can be restored.

## 7b. EDITZ and Blog AI content (Admin → Products)

- EDITZ sections you can edit:
  - hero (badge, headline, subtitle, CTA, 3 videos)
  - hero ticker, services, brand logos, benefits copy, projects, audience, process steps, testimonials
  - CTA (heading, button, social links)
- Blog AI: hero texts, plus an optional lead form (off by default; when on, its leads arrive in the inbox tagged `blog-ai`).
- Each section shows **Edited** or **Default**.
- *Reset section to default* goes back to the original built-in content.
- Until you edit a section, the page shows exactly what it showed before.
- Content is validated (safe links and image paths only) and audited.
- Changes are live within seconds of saving.
- FAQs for both pages are edited in **Pages & SEO** (they feed the visible FAQ, the schema and /faq).
- Known limit: two people saving the *same* product page at the same moment can overwrite each other's change. The audit log keeps both versions, so it can be restored.

## 8. Scheduled jobs (vercel.json)

| Path | Schedule (UTC) | Does |
|---|---|---|
| `/api/keep-alive` | daily 00:00 | One tiny query so Supabase never pauses |
| `/api/cron/publish-scheduled` | daily 00:15 | Publishes scheduled blog posts that are due |
| `/api/cron/leads-retry` | daily 02:30 | Retries failed sheet/email deliveries; deletes leads older than 24 months |
| `/api/cron/seo-auto-fill` | 1st of the month 03:00 | Empty-field meta fill, then missing images |

All require `CRON_SECRET`. On the Vercel Hobby plan, crons run at most once a day, which these schedules respect.

---

## 9. Local development and checks

```bash
npm install
```
```bash
npm run dev
```
```bash
npm run typecheck
```
```bash
npm run lint
```
```bash
npm test
```
```bash
npm run build
```

Type errors and lint errors now **fail the build** (`next.config.js`). Run all four checks before every PR.

## 10. After go-live checklist

- [ ] Migrations M-04, M-05 and M-06 run and recorded
- [ ] `PREVIEW_SECRET` and `IP_HASH_SALT` set (dedicated secrets, no fallbacks)
- [ ] Supabase Auth rate limits set (§1.4); CSP report-only console clean for a week (§1.5)
- [ ] Owner turned on 2FA (Admin → Security); consider `REQUIRE_ADMIN_MFA=true`
- [ ] A test edit appears in the Audit Log, and Restore brings it back
- [ ] Owner can sign in with Google; a test marketer account sees no Users/Settings
- [ ] Contact form test: lead in Admin → Leads, row in the sheet, team email plus auto-reply received
- [ ] Settings → all integrations green (SMTP, AI, CRON_SECRET, publish key)
- [ ] `/sitemap.xml` and the 4 child sitemaps return 200 and are submitted in Search Console
- [ ] Rich Results Test passes for home, a service page, a blog post and /faq
- [ ] SEO Report run; errors fixed or AI fill run for empty fields
- [ ] Old `ADMIN_SECRET` removed; publisher switched to `PUBLISH_API_KEY`
