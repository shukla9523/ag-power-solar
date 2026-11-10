# Mommantum — Go-Live Guide, Step by Step

**For:** Saurabh Sharma (owner) · **Time needed:** about 2–3 hours the first time · **Last updated:** 2026-11-08

Follow the parts **in order**. Every step says **where to click**, **what to copy or paste**, and **how to check it worked** (✅). Don't skip a ✅ check: if one fails, look at the *Troubleshooting* table at the end before moving on.

> 🔒 **Golden rule for secrets.** Keys, passwords and tokens go **only** into Vercel → Settings → Environment Variables (and into your local `.env.local` if you develop). Never paste them into chat, email, WhatsApp, a document, or a GitHub file.

---

## Contents

| Part | What you do | Time |
|---|---|---|
| 0 | Get ready (accounts + a notepad) | 5 min |
| 1 | Back up the database | 5 min |
| 2 | Supabase: keys, Google sign-in, 2FA, migrations | 30 min |
| 3 | Create your secret keys | 5 min |
| 4 | Zoho Mail (emails) | 20 min |
| 5 | Google Sheet for leads | 5–20 min |
| 6 | Cloudflare AI | 15 min |
| 7 | Spam protection (optional) | 10 min |
| 8 | Put everything into Vercel | 20 min |
| 9 | Test on a preview link | 30 min |
| 10 | Go live + Google Search Console | 20 min |
| 11 | Update the blog publisher (n8n / Blog AI) | 5 min |
| 12 | First day in the admin panel | 20 min |
| 13 | Monthly routine | — |
| — | Troubleshooting · Rollback | — |

---

## Part 0 — Get ready

You need logins for these accounts. Open each one in a browser tab:

- [ ] **Supabase**: https://supabase.com/dashboard (your Mommantum project)
- [ ] **Vercel**: https://vercel.com (the project that hosts www.mommantum.com)
- [ ] **Zoho Mail**: https://mail.zoho.in (or mail.zoho.com if your account is not India-region)
- [ ] **Cloudflare**: https://dash.cloudflare.com (create a free account if you don't have one)
- [ ] **Google**: the Google account that owns the Mommantum contact Form / Sheet, plus Google Search Console
- [ ] **Your domain's DNS**: wherever mommantum.com DNS is managed (often Cloudflare, GoDaddy or Hostinger)

Open a **private notepad** on your computer (not a shared doc). You'll collect values there for a few minutes and then delete it at the end of Part 8.

---

## Part 1 — Back up the database (do this first)

1. Supabase → your project → **Database** (left menu) → **Backups**.
2. If you're on a paid plan, check that today's automatic backup exists. If you're on the free plan, go to **Table Editor**, open the tables `profiles`, `post`, `services`, `case_studies`, `seo_setting` and `site_setting` one by one → **⋯** → **Export to CSV**, and save the files in a folder named `mommantum-backup-YYYY-MM-DD`.

✅ **Check:** you have a backup from today (or the 6 CSV files saved).

---

## Part 2 — Supabase

### 2.1 Copy the project keys

1. Supabase → **Project Settings** (gear icon) → **API** (or **Data API** / **API Keys**, depending on the dashboard version).
2. Copy these into your notepad:

| Copy this from Supabase | Name it in your notepad |
|---|---|
| Project URL (`https://xxxx.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key (click *Reveal*) | `SUPABASE_SERVICE_ROLE_KEY` |

3. Go to **Project Settings → API → JWT Settings** (newer dashboards: **JWT Keys → Legacy JWT secret**) and copy the **JWT Secret** as `SUPABASE_JWT_SECRET`.
   *If you only see "JWT signing keys" and no legacy secret, skip this; the site will check logins with Supabase directly instead, which is a little slower but just as safe.*

> ⚠️ **Rotate the service-role key.** An old copy of the keys was once shared inside a zip file, so treat the old key as public.
> 1. In **API Keys** (or JWT Settings), use **Roll / Generate new** for the service role (and the JWT secret if offered).
> 2. Copy the **new** values into your notepad.
> 3. Do this before Part 8, because the old values stop working after a roll.

✅ **Check:** your notepad has 3 values (4 with the JWT secret), and none of them is empty.

### 2.2 Turn on Google sign-in for the admin panel

**A. Google Cloud (create the OAuth client)**
1. Go to https://console.cloud.google.com → choose (or create) a project named "Mommantum".
2. **APIs & Services → OAuth consent screen**: User type **External**, app name "Mommantum Admin", support email = your email → Save. (Status "Testing" is fine; add your own email under *Test users*.)
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** → Application type **Web application**.
4. Under **Authorised redirect URIs** add exactly:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
   (Replace `<your-project-ref>` with the part of your Supabase URL before `.supabase.co`.)
5. Click **Create** and copy the **Client ID** and **Client secret**.

**B. Supabase (switch Google on)**
1. Supabase → **Authentication → Sign In / Providers → Google** → Enable.
2. Paste the Client ID and Client secret → **Save**.
3. **Authentication → URL Configuration**:
   - **Site URL:** `https://www.mommantum.com`
   - **Redirect URLs**, add all three:
     - `https://www.mommantum.com/api/auth/callback`
     - `https://*.vercel.app/api/auth/callback` (for preview links)
     - `http://localhost:8000/api/auth/callback` (for local testing)
   - Click **Save**.

✅ **Check:** Google shows as **Enabled** in the providers list.

### 2.3 Turn on two-factor authentication (TOTP)

Supabase → **Authentication → Multi-Factor** (or *Sign In / Providers → MFA*) → make sure **TOTP (Authenticator app)** is **Enabled** → Save.

✅ **Check:** TOTP shows as enabled.

### 2.4 Run the two database migrations

These files are in your project under `db-proposals/migrations/`. They are safe to run twice.

1. Supabase → **SQL Editor** → **New query**.
2. Open `db-proposals/migrations/2026-11-08_roles_owner_leads_notifications.sql` in a text editor (Notepad or VS Code), **select all**, copy, paste it into the SQL Editor → **Run**.
   ✅ You should see **"Success. No rows returned"**.
3. **New query** again. Do the same with `db-proposals/migrations/2026-11-08b_audit_mfa_scheduling_products.sql` → **Run**.
   ✅ Again you should see **"Success. No rows returned"**.
4. Check everything was created by running this query:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('contact_leads','admin_notifications','redirects','ai_jobs','media_assets','audit_log','product_pages')
order by 1;
```

✅ **Check:** **7 rows** come back.

5. Check your owner account:

```sql
select email, role, status from public.profiles
where lower(email) = 'sharmasaurabh2604@gmail.com';
```

✅ **Check:** one row with role **owner** and status **approved**.
*No row?* That's fine if you have never signed in with that email. You become owner automatically the first time you sign in (Part 9), and the owner is also recognised from `OWNER_EMAIL`.

6. Record the run in `db-proposals/README.md`: add rows **M-04** and **M-05** with today's date.

> ❗ If a migration shows an error, **don't run the next one.** Copy the error message and see *Troubleshooting*. Nothing is half-applied, because each file runs inside a transaction (`begin … commit`).

---

## Part 3 — Create your secret keys

You need 4 random secrets. Make each one **separately**, so none are the same.

**Option A (easiest):** open https://generate-secret.vercel.app/32 and refresh it 4 times, copying a new value each time.
**Option B (Git Bash / Mac / Linux terminal):** run this 4 times:

```bash
openssl rand -hex 32
```

| Notepad name | Used for |
|---|---|
| `CRON_SECRET` | Lets Vercel run the scheduled jobs (monthly AI fill, daily lead retry, scheduled posts) |
| `PUBLISH_API_KEY` | The key your blog publisher (n8n / Blog AI) uses to post articles |
| `PREVIEW_SECRET` | Signs private draft-preview links |
| `IP_HASH_SALT` | Hides visitor IPs on leads (privacy law) |

✅ **Check:** 4 different long values in your notepad.

---

## Part 4 — Zoho Mail (all website emails)

The website sends these emails through your Zoho mailbox:
- new-lead alerts to the team;
- an automatic "thank you" reply to visitors;
- access-request alerts;
- account approvals.

### 4.1 Create an app password
1. Sign in to https://accounts.zoho.in (India) or https://accounts.zoho.com.
2. **Security → Multi-Factor Authentication**: turn it on if it isn't (Zoho requires it for app passwords).
3. **Security → App Passwords → Generate New Password** → name it "Mommantum website" → **Generate**.
4. Copy it into your notepad as `ZOHO_SMTP_PASS`. It's shown only once.

| Notepad name | Value |
|---|---|
| `ZOHO_SMTP_HOST` | `smtp.zoho.in` if your Zoho login is at zoho**.in**, otherwise `smtp.zoho.com` |
| `ZOHO_SMTP_PORT` | `465` |
| `ZOHO_SMTP_USER` | the full mailbox address, e.g. `hello@mommantum.com` |
| `ZOHO_SMTP_PASS` | the app password you just made |
| `LEADS_NOTIFY_TO` | who gets new-lead emails, comma separated, e.g. `sharmasaurabh2604@gmail.com,hello@mommantum.com` |
| `LEADS_REPLY_TO` | the address visitors reply to, e.g. `hello@mommantum.com` |
| `MAIL_FROM_NAME` | `Mommantum` |

### 4.2 Make sure the emails don't land in spam (DNS)
1. Zoho Mail Admin Console → **Domains → mommantum.com → Email Configuration**. Zoho shows the exact records.
2. In your DNS provider, add or confirm:
   - **SPF** (TXT on `@`): `v=spf1 include:zoho.in ~all` (use `zoho.com` for a non-India account; if an SPF record already exists, add the `include:` to it rather than creating a second one)
   - **DKIM** (TXT): the selector and value Zoho shows (e.g. `zmail._domainkey`)
   - **DMARC** (TXT on `_dmarc`): `v=DMARC1; p=quarantine; rua=mailto:sharmasaurabh2604@gmail.com`
3. Back in Zoho, click **Verify** for SPF and DKIM.

✅ **Check:** Zoho shows SPF and DKIM as **Verified**. DNS can take up to a few hours, but you can carry on meanwhile.

---

## Part 5 — Google Sheet for leads

Every lead is **always** saved in Supabase first (Admin → Leads). The Google Sheet is a copy for the team. Choose one option.

### Option A: zero setup (uses your existing Google Form)
The site already sends each lead to the existing Mommantum Google Form, whose answers go into its linked Sheet.
1. Open the Google Form → **Responses** tab → click the green **Sheets** icon to open the linked sheet.
2. Copy that sheet's URL as `LEADS_SHEET_URL`. This gives you the "Open Google Sheet" button in Admin → Leads.

✅ Nothing else to do.

### Option B: direct to your own Sheet (recommended long-term)
1. Create a Google Sheet, rename the first tab to **`Leads`**, and put these headers in row 1:
   `Date | Name | Email | Phone | Subject | Message | Source | Page | Lead ID`
2. Copy the **Sheet ID** from its URL, the long part between `/d/` and `/edit`, as `GOOGLE_SHEETS_ID`.
3. Google Cloud console (same project as Part 2.2) → **APIs & Services → Library** → search **Google Sheets API** → **Enable**.
4. **IAM & Admin → Service Accounts → Create service account** → name "mommantum-leads" → **Done**.
5. Open it → **Keys → Add key → Create new key → JSON** → a file downloads.
6. Open that JSON file in Notepad:
   - copy `client_email` as `GOOGLE_SERVICE_ACCOUNT_EMAIL`;
   - copy `private_key` (the whole value, starting `-----BEGIN PRIVATE KEY-----` and ending `-----END PRIVATE KEY-----\n`) as `GOOGLE_PRIVATE_KEY`. **Keep the `\n` characters exactly as they are.**
7. In your Google Sheet: **Share** → paste the service-account email → role **Editor** → untick "Notify" → **Share**.
8. Copy the sheet URL as `LEADS_SHEET_URL`.
9. **Delete the downloaded JSON file** from your computer once the values are in Vercel.

✅ **Check:** the sheet shows the service-account email under "People with access".

---

## Part 6 — Cloudflare AI (empty-field SEO fill and missing images)

1. https://dash.cloudflare.com → copy your **Account ID** (right sidebar on the account home page, or in the URL after `dash.cloudflare.com/`) as `CLOUDFLARE_ACCOUNT_ID`.
2. Top-right profile → **My Profile → API Tokens → Create Token** → use the **"Workers AI"** template (permissions *Workers AI: Read* and *Edit*), limited to your account → **Continue → Create Token**.
3. Copy the token as `CLOUDFLARE_API_TOKEN` (shown once).
4. *(Recommended)* **AI → AI Gateway → Create Gateway** → name it `mommantum` → open it → **Settings** → turn on **Cache** and set a **daily spend limit** (for example ₹500 / $5) → save. Put `CLOUDFLARE_AI_GATEWAY=mommantum` in your notepad.
5. Put `AI_ENABLED=true` in your notepad. (Later, `false` stops all AI immediately.)

✅ **Check:** the token shows as **Active** in API Tokens.

> The AI only fills fields that are **empty**, and never changes anything you or your team wrote. Anything you correct is locked forever. It only creates an image where an item has **no** image.

---

## Part 7 — Spam protection on the contact form (optional, recommended)

1. Cloudflare → **Turnstile → Add widget** → name "Mommantum contact" → domains `mommantum.com` and `vercel.app` → mode **Managed** → **Create**.
2. Copy the **Site Key** as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and the **Secret Key** as `TURNSTILE_SECRET_KEY`.

> Set **both** or **neither**. Setting only one breaks the form.

---

## Part 8 — Put everything into Vercel

1. Vercel → your Mommantum project → **Settings → Environment Variables**.
2. For **each row** below: click **Add New**, type the **Key**, paste the **Value**, tick the environments shown, then **Save**.

### 8.1 Required

| Key | Value | Production | Preview |
|---|---|:-:|:-:|
| `NEXT_PUBLIC_SUPABASE_URL` | from Part 2.1 | ✔ | ✔ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Part 2.1 | ✔ | ✔ |
| `SUPABASE_SERVICE_ROLE_KEY` | from Part 2.1 (the **new** one) | ✔ | ✔ |
| `SUPABASE_JWT_SECRET` | from Part 2.1 (if you have it) | ✔ | ✔ |
| `NEXT_PUBLIC_BASE_URL` | `https://www.mommantum.com` | ✔ | — |
| `OWNER_EMAIL` | `sharmasaurabh2604@gmail.com` | ✔ | ✔ |
| `CRON_SECRET` | from Part 3 | ✔ | ✔ |
| `PUBLISH_API_KEY` | from Part 3 | ✔ | ✔ |
| `PREVIEW_SECRET` | from Part 3 | ✔ | ✔ |
| `IP_HASH_SALT` | from Part 3 | ✔ | ✔ |
| `ZOHO_SMTP_HOST`, `ZOHO_SMTP_PORT`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS` | from Part 4 | ✔ | ✔ |
| `LEADS_NOTIFY_TO`, `LEADS_REPLY_TO`, `MAIL_FROM_NAME` | from Part 4 | ✔ | ✔ |

### 8.2 Recommended / optional

| Key | Value | Production | Preview |
|---|---|:-:|:-:|
| `NEXT_PUBLIC_NOINDEX` | `true` (keeps preview links out of Google) | **—** | ✔ |
| `LEADS_SHEET_URL` | from Part 5 | ✔ | ✔ |
| `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` | Part 5 Option B only | ✔ | ✔ |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` | from Part 6 | ✔ | ✔ |
| `CLOUDFLARE_AI_GATEWAY` | `mommantum` | ✔ | ✔ |
| `AI_ENABLED` | `true` | ✔ | ✔ |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | from Part 7 (both or neither) | ✔ | ✔ |
| `REQUIRE_ADMIN_MFA` | `true` once you have set up your own 2FA (Part 12.1) | ✔ | ✔ |
| `NEXT_PUBLIC_TWITTER_HANDLE` | e.g. `@mommantum` (only if the account exists) | ✔ | ✔ |
| `GOOGLE_SITE_VERIFICATION` | from Part 10.3 (if you use the HTML-tag method) | ✔ | — |
| `CUSTOM_ADMIN_PATH` | optional hidden admin URL, e.g. `studio` → admin at `/studio`, login at `/studio-login` | ✔ | ✔ |

### 8.3 Remove old variables
**Delete** `ADMIN_SECRET` if it exists; nothing uses it now. Keep `N8N_API_KEY` only until Part 11 is done, then delete it too.

### 8.4 Clean up
Close and **delete your notepad**. Every value now lives in Vercel.

✅ **Check:** in Vercel's variable list you can see every *Required* key for Production.

---

## Part 9 — Test on a preview link (before real visitors see it)

### 9.1 Make a preview deployment
- If the code is on GitHub: push it to a branch (not `main`). Vercel builds a **Preview** automatically and shows a link like `mommantum-git-xyz.vercel.app`.
- Or: Vercel → **Deployments** → the latest one → **⋯ → Redeploy** and choose **Preview**.

✅ **Check:** the deployment shows **Ready** (green). If it shows **Error**, open it → **Build Logs** → see *Troubleshooting*.

### 9.2 Test checklist (on the preview link)
Tick each line.

**Public site**
- [ ] Home page opens and looks the same as before.
- [ ] `/services`, then open **AI Agents**: the right side shows the new pink illustration (not the plain text card).
- [ ] `/editz`, `/blog-ai`, `/faq`, `/work` and `/blog` all open.
- [ ] `/sitemap.xml` opens and lists 4 sitemaps; open `/sitemap/services.xml` and it lists your services.
- [ ] Open a made-up address like `/services/does-not-exist`: you see the **404 "Page not found"** page.

**Contact form**
- [ ] `/contact` → fill the form with your own email → **Send Message** → a green "Message sent successfully" appears.
- [ ] Within a minute: the team email arrives at `LEADS_NOTIFY_TO`, the "Thanks for contacting Mommantum" email arrives at the address you typed, and a new row appears in the Google Sheet.

**Admin**
- [ ] Open `/admin-login` (or `/<CUSTOM_ADMIN_PATH>-login`) → **Continue with Google** → choose `sharmasaurabh2604@gmail.com` → you land on the **Dashboard**. Your role at top right says **Owner**.
- [ ] **Leads**: your test enquiry is there. Click it → set the status to **Contacted**.
- [ ] **Settings**: Integrations show green ticks for Zoho SMTP, AI and CRON_SECRET → click **Send test email** → it arrives.
- [ ] **Blog**: open a post → change one word → **Save** → **Audit Log** shows the change with the before → after. Click **Restore** → the word goes back.
- [ ] **SEO Report** → **Run report** → you see a score per page.
- [ ] **Products** → EDITZ → open **Testimonials** → it shows the current content (nothing changed).

✅ **Check:** every box ticked. If anything fails, fix it (*Troubleshooting*) and test again on a new preview.

---

## Part 10 — Go live

### 10.1 Deploy to production
- With GitHub: merge the branch into `main`. Vercel deploys Production automatically.
- Without GitHub: Vercel → **Deployments** → your tested preview → **⋯ → Promote to Production**.

✅ **Check:** https://www.mommantum.com shows the new version (the AI Agents service page has the pink illustration).

### 10.2 Check the scheduled jobs
Vercel → project → **Settings → Cron Jobs** (or the **Cron Jobs** tab). You should see 4:

| Path | When (UTC) |
|---|---|
| `/api/keep-alive` | every day 00:00 |
| `/api/cron/publish-scheduled` | every day 00:15 |
| `/api/cron/leads-retry` | every day 02:30 |
| `/api/cron/seo-auto-fill` | 1st of each month 03:00 |

✅ **Check:** all 4 are listed. Click **Run** on `/api/keep-alive` and it returns `"ok": true`.

### 10.3 Google Search Console
1. https://search.google.com/search-console → **Add property** → **Domain** → `mommantum.com` → verify with the TXT record it gives you (add it in DNS).
   *Or* the **URL prefix** method with the HTML tag: copy the `content="…"` value, put it in Vercel as `GOOGLE_SITE_VERIFICATION`, redeploy, then click **Verify**.
2. **Sitemaps** (left menu) → enter `sitemap.xml` → **Submit**.
3. **URL Inspection** → paste `https://www.mommantum.com/` → **Request indexing**. Repeat for `/services` and `/editz`.

✅ **Check:** after a few hours, the sitemap status shows **Success**.

### 10.4 Bing (also feeds ChatGPT search and Copilot)
https://www.bing.com/webmasters → **Import from Google Search Console** (one click) → confirm the sitemap is listed.

### 10.5 Rich results test
Open https://search.google.com/test/rich-results and test each of these: the homepage, one service page, one blog post, and `/faq`.

✅ **Check:** each shows **valid items** (Organization / Breadcrumb / Service / Article / FAQ) and **no errors**.

---

## Part 11 — Update the blog publisher (n8n / Blog AI)

1. Open your n8n workflow (or whatever posts blogs to `https://www.mommantum.com/api/blog/publish` and `/api/blog/upload`).
2. In the HTTP Request node(s), change the header to:
   `Authorization: Bearer <your PUBLISH_API_KEY>`
   (Store it as an n8n credential, not as plain text in the node.)
3. Run the workflow once with a **draft** test post: set `"status": "draft"` in the JSON.

✅ **Check:**
- The response is `{"success": true, …}`.
- The draft appears in Admin → Blog.
- It is **not** visible on `/blog`, because drafts are private now.

4. Delete `N8N_API_KEY` from Vercel.

---

## Part 12 — Your first day in the admin panel

### 12.1 Turn on 2FA for your account (do this first)
1. Admin → **Security (2FA)** → **Set up 2FA**.
2. On your phone, open **Google Authenticator** (or Microsoft Authenticator, 1Password or Authy) → **+** → **Scan QR code**.
3. Type the 6-digit code → **Verify & turn on**.
4. **Sign out and sign in again**: it now asks for a code after Google sign-in.
5. Optional: set `REQUIRE_ADMIN_MFA=true` in Vercel (Part 8.2) so every admin must use 2FA.

✅ **Check:** sign-in asks for the 6-digit code.

> 📱 **If you ever lose your phone:**
> 1. Supabase → **Authentication → Users** → your user → **Factors** → delete the factor.
> 2. In the SQL Editor, run:
>    ```sql
>    update profiles set mfa_enabled = false where lower(email) = 'sharmasaurabh2604@gmail.com';
>    ```
> 3. Sign in and set 2FA up again.

### 12.2 Your team
- People who sign in with Google appear in **Users & Roles** as **pending customer**, and you get a notification and an email. Choose their role and set **Approved**; they get an approval email.
- **Roles:**

  | Role | What they can do |
  |---|---|
  | **Marketer** | Blog, services, case studies, products, SEO, leads (read only), media. No Users or Settings. |
  | **Admin** | Everything except changing you (the owner) or other admins |
  | **Owner** | You only. Protected: nobody else can edit, demote or delete you. |

### 12.3 SEO tidy-up
1. **SEO Report** → **Run report**.
2. Fix the **errors** first: a missing primary keyword, missing image, or duplicate title.
3. Click **AI: fill empty meta fields (all pages)**. It only fills blanks.
4. Click **AI: generate missing images**. It only adds images to blog posts and case studies that have none.
5. Run the report again.

✅ **Target:** average score **80% or higher**, **0 errors**.

### 12.4 Optional settings
**Settings → Site details**: add your X/Twitter handle, the default share image, and the leads sheet URL.
**Settings → Theme**: brand colours. Change them only if you really want to; *Reset to defaults* undoes it.

---

## Part 13 — Monthly routine (15 minutes, first week of every month)

| Task | Where |
|---|---|
| Check the automatic AI fill ran (notification on the 1st) | Bell icon / Dashboard → Recent AI jobs |
| Run the SEO report, fix errors and keyword cannibalization | Admin → SEO Report |
| Check leads were answered (no "new" older than 2 days) | Admin → Leads → filter **new** |
| Check Search Console for errors and coverage | search.google.com/search-console |
| Look at the audit log for anything unexpected | Admin → Audit Log |
| Every 3 months: review users and roles; rotate `CRON_SECRET` and `PUBLISH_API_KEY` | Users & Roles · Vercel |

---

## Troubleshooting

| Problem | Most likely cause | Fix |
|---|---|---|
| Vercel build fails with **"Type error"** or an ESLint error | Code was changed without running the checks | Run `npm run typecheck` and `npm run lint` locally and fix what they report; the build now refuses broken code on purpose |
| Build fails: "supabaseUrl is required" | `NEXT_PUBLIC_SUPABASE_URL` missing for that environment | Add it for **Production and Preview** (Part 8) and redeploy |
| Google sign-in returns to the login page with **"pending approval"** | Someone other than the owner signed in | Approve them in Users & Roles (you'll see a notification) |
| Google sign-in shows **"redirect_uri_mismatch"** | Callback URL not added | Part 2.2: the Google redirect URI must be the **supabase.co/auth/v1/callback** one; Supabase must list `…/api/auth/callback` for your domain and `*.vercel.app` |
| Owner can't get in at all | Wrong `OWNER_EMAIL`, or the login is a different Google account | Check `OWNER_EMAIL` in Vercel; use exactly `sharmasaurabh2604@gmail.com` |
| Contact form says **"Verification failed"** | Only one Turnstile key set, or the domain isn't added | Set both keys or neither (Part 7); add the domain in the Turnstile widget |
| Form works but **no email** | Wrong SMTP host/password, or 2FA off in Zoho | Settings → **Send test email** shows the error. Check `smtp.zoho.in` vs `.com` and regenerate the app password. Failed emails retry daily for 5 days. |
| Emails go to **spam** | SPF/DKIM not verified | Part 4.2; wait for DNS, then press Verify in Zoho |
| **No row** in the Google Sheet | Option B sheet not shared with the service account, or the tab isn't named `Leads` | Part 5 B.1 and B.7. The lead is still safe in Admin → Leads and retries daily. |
| Admin shows **"run database migration"** messages | Part 2.4 not completed | Run M-04 then M-05 |
| Admin → Settings shows AI **not configured** | Cloudflare keys missing, or `AI_ENABLED=false` | Part 6 + Part 8, then redeploy |
| AI fill says it filled **0 pages** | Every field is already filled, or pages have too little text | That's expected; it never overwrites |
| Search Console says the sitemap **couldn't be fetched** | Production wasn't deployed yet, or `NEXT_PUBLIC_NOINDEX=true` set on Production | Remove `NEXT_PUBLIC_NOINDEX` from **Production** (Preview only) and redeploy |
| A scheduled post didn't go live at the exact minute | On the Hobby plan, scheduled posts are published once a day (00:15 UTC) | Expected; upgrade to Vercel Pro and change the schedule to hourly in `vercel.json` |
| Something got edited by mistake | — | Admin → **Audit Log** → find the change → **Restore** |

---

## Rollback (if something goes badly wrong after go-live)

1. Vercel → **Deployments** → the last good deployment from before → **⋯ → Promote to Production**. The site is back within about a minute.
2. The database changes (M-04 / M-05) only **add** tables and columns, so the old version keeps working with them. You do **not** need to undo them.
3. If you restored the old site, also put `ADMIN_SECRET` / `N8N_API_KEY` back in Vercel for the old blog publisher.
4. Tell the developer which step failed and the exact error message from **Vercel → Deployments → Build Logs / Runtime Logs**.

---

### Where to find more detail
- [setup-guide.md](setup-guide.md): technical reference for every feature
- [platform-remediation-plan.md](platform-remediation-plan.md): what was built and why (phase-wise)
- [ai-setup-guide.md](ai-setup-guide.md): how the AI is kept safe and cheap
- `.env.example`: every variable with a comment
