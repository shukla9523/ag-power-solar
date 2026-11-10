# performance.md — Performance Budgets, Caching, and Optimization Standards

> **Document Question:** *How fast must it be, and what keeps it fast?*  
> **Required:** Always  
> **Owner:** CTO (Technical Lead)  
> **Ready Before:** First line of code  
> **Status:** Production Standard v1.0 (Next.js 15 App Router + Supabase + Vercel)

---

## 1. Core Web Vitals Budgets & Production Targets

Mommantum is a high-performance growth studio and digital marketing web platform. Page speed directly determines organic search rankings (SEO/AEO/GEO), user conversion rates, and client trust.

Every route must meet the following strict budgets under mobile 4G network emulation (Lighthouse mobile profile):

| Metric | Target Budget | Description & Impact | Where Monitored |
| :--- | :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | **≤ 2.5 s** | The main hero headline, banner image, or primary content block is visible. | Vercel Analytics, PageSpeed Insights |
| **CLS** (Cumulative Layout Shift) | **≤ 0.1** | No visual jumps or layout shifting as fonts, images, or ads load. | Chrome User Experience Report (CrUX) |
| **INP** (Interaction to Next Paint) | **≤ 200 ms** | UI immediately reacts to clicks, drawer toggles, and form inputs. | Search Console, Core Web Vitals |
| **TTFB** (Time to First Byte) | **≤ 200 ms** | Edge middleware responds instantly; no DB queries on public routes. | Vercel Edge Server Logs |
| **FCP** (First Contentful Paint) | **≤ 1.2 s** | Initial DOM paint starts rapidly. | Lighthouse, Web Vitals |
| **First Load JS** | **≤ 120 KB** | Shared framework + route chunks per page. | `next build` output |

---

## 2. Zero-Blocking Edge Middleware Architecture (TTFB Rule)

Next.js Edge Middleware runs on **every incoming HTTP request** prior to page rendering. Executing database calls, external network fetches, or complex cryptography in middleware destroys TTFB and causes severe serverless latency spikes.

### The Standard:
1. **Public Route Fast Path:** All public storefront routes (`/`, `/about`, `/services/*`, `/work/*`, `/blog/*`, `/contact`, `/editz`, `/faq`, `/legal/*`, `/sitemap*`) bypass database lookups entirely.
2. **Zero Database Queries in Middleware:** Middleware never imports or invokes Supabase clients (`supabase-admin.ts` or `supabase.ts`).
3. **Session Verification Offload:** Authentication validation is performed only on protected `/admin/*` and mutating `/api/admin/*` endpoints via lightweight JWT parsing and cached role evaluation.

```typescript
// src/middleware.ts pattern
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Static asset and internal next bypass
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/keep-alive') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Zero-blocking public storefront bypass
  if (
    pathname === '/' ||
    pathname.startsWith('/services') ||
    pathname.startsWith('/work') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/editz') ||
    pathname.startsWith('/faq')
  ) {
    return NextResponse.next()
  }

  // 3. Admin routes handling
  return handleAdminAuth(req)
}
```

---

## 3. Caching Strategy & On-Demand Revalidation

Mommantum leverages **Server Components (RSC)** with **Incremental Static Regeneration (ISR)** and Tag-based Invalidation.

### 3.1 Caching Hierarchy

```
Browser Cache (Cache-Control headers)
      │
      ▼
Vercel Edge Network Cache (s-maxage, stale-while-revalidate)
      │
      ▼
Next.js Data Cache (unstable_cache with explicit tags)
      │
      ▼
Supabase Database (PostgreSQL 15 via Supavisor Pooler)
```

### 3.2 Cache Configuration by Route

| Route Pattern | Rendering Mode | Cache Duration | Cache Tag | Revalidation Trigger |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Homepage) | ISR | 3600s (1 hr) | `home`, `services`, `faqs` | Admin home update, service edit |
| `/services/[slug]` | ISR | 86400s (24 hr) | `services`, `service-${slug}` | Admin service mutation |
| `/work/[slug]` | ISR | 86400s (24 hr) | `case-studies`, `case-study-${slug}` | Admin case study mutation |
| `/blog/[slug]` | ISR | 86400s (24 hr) | `blog-posts`, `blog-${slug}` | Automated publish (`/api/blog/publish`), admin edit |
| `/editz` | ISR | 86400s (24 hr) | `editz` | Editz portfolio update |
| `/admin/*` | Dynamic SSR | `no-store` | None (private) | Never cached |
| `/api/blog/publish` | Dynamic Route | `no-store` | Revalidates `blog-posts` | On incoming POST |

### 3.3 Revalidation API Pattern
Whenever content is created, updated, or deleted through admin endpoints or automation APIs, `revalidateContent` MUST be called:

```typescript
import { revalidateContent } from "@lib/revalidate"

// In route handlers:
await revalidateContent({ 
  type: "blog", 
  slug: post.slug, 
  oldSlug: previousSlug 
})
```

---

## 4. Image Delivery & Layout Stability (CLS & LCP)

Images account for over 70% of network payload on visual agency pages.

### 4.1 Strict Image Rules:
1. **Always Use `next/image`:** Never use plain `<img>` tags for site content or author/portfolio media.
2. **Explicit `sizes` Attribute:** Never omit the `sizes` attribute on `<Image />`. Omission causes Next.js to generate fallback 100vw source sets, causing mobile devices to download huge 1920px images.
3. **Responsive Layout Containers:**
   ```tsx
   <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
     <Image
       src={coverImage}
       alt={title}
       fill
       sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
       className="object-cover"
       priority={isHero}
     />
   </div>
   ```
4. **No DOM Layout Duplication:** Never create duplicate desktop and mobile HTML trees (e.g. `hidden md:block` alongside `block md:hidden`). Browsers download images in both trees even if one is display-none. Use CSS Grid/Flex `order` properties instead.
5. **Pre-Optimized OG Assets:** Social preview images live pre-rendered as WebP/JPEG under `public/og/` to ensure zero generation delay when search crawlers fetch them.

---

## 5. Typography & Font Loading Performance

1. **Centralized Font Loader (`src/lib/fonts.ts`):** All Google fonts (`Epilogue`, `Outfit`, `Mansalva`, `Cormorant Garamond`, `DM Sans`) are instantiated via `next/font/google`.
2. **`display: 'swap'` Enforced:** Prevents Flash of Invisible Text (FOIT). Text remains immediately readable with system fallbacks while webfonts stream in.
3. **No External `@import` in CSS:** No third-party font `@import` or `<link rel="stylesheet">` calls inside `globals.css` or components. External font imports block the critical rendering path.

---

## 6. Code Splitting & Dynamic Imports

1. **Heavy Interactive Modals:** Client-heavy dialogs, video modal players, rich text editors, and complex chart components must be dynamically imported using `next/dynamic`:
   ```typescript
   const VideoShowcaseModal = dynamic(
     () => import('@modules/editz/components/VideoModal'),
     { ssr: false, loading: () => <LoadingSpinner /> }
   )
   ```
2. **Bundle Budget:**
   - Framework & Shared Chunk: ≤ 80 KB
   - Route-specific page chunk: ≤ 40 KB
   - Total First Load JS for any public page: ≤ 120 KB
3. **Analyze Bundle:** Run `npm run build` periodically to verify that tree-shaking is stripping server-only utilities from client bundles.

---

## 7. Database & Query Performance (Supabase & PostgreSQL)

1. **Explicit Column Selection:** Never run `SELECT *` in database queries. Always list explicit columns (`.select('id, title, slug, excerpt, published_at')`).
2. **Mandatory Indexes:** All columns used in `.eq()`, `.order()`, or foreign key joins must have corresponding database indexes:
   - `post(slug)` (Unique index)
   - `post(status, published_at DESC)`
   - `services(slug)` (Unique index)
   - `services(is_active)`
   - `case_studies(slug)`
   - `link_embedding(resource_type, resource_id)`
3. **Connection Pooling:**
   - Production route handlers and background jobs connect via Supavisor Transaction Pooler (`port 6543`) rather than direct database ports.
4. **No N+1 Database Loops:** Fetch related data in single batched `.in('id', array)` queries or PostgreSQL JSON aggregation functions, never in `for` loops.

---

## 8. Mommantum Performance Checklist (19 Verification Points)

Every PR and major release must verify against this checklist before merging:

### Frontend & Delivery
- [ ] **1. Public Route Bypass:** Middleware bypasses database queries for all storefront routes.
- [ ] **2. Responsive Image `sizes`:** All `<Image />` tags include accurate `sizes` matching container widths.
- [ ] **3. No Duplicated Mobile DOM:** Layout shifts use CSS `order` or Tailwind responsive grids without duplicating media tags.
- [ ] **4. LCP Image Priority:** Exactly one above-the-fold hero image has `priority={true}` per page; all other images have lazy loading.
- [ ] **5. WebP / AVIF Formats:** Images uploaded or stored in Supabase buckets (`blog-images`) use WebP or AVIF compression.
- [ ] **6. No External Font `@import`:** All fonts loaded strictly via `src/lib/fonts.ts` with `display: swap`.
- [ ] **7. Dynamic Modal Imports:** Video players, lead capture dialogs, and admin editors use `next/dynamic`.
- [ ] **8. Clean Bundles:** Unused dependencies removed; client bundles contain zero Node.js built-ins (`crypto`, `fs`).
- [ ] **9. Layout Shift (CLS ≤ 0.1):** All images and videos have explicit aspect ratios or width/height reserved.
- [ ] **10. Debounced Search Inputs:** All search and filter inputs are debounced to 300 ms.

### Backend, Cache & Database
- [ ] **11. Next.js Data Cache Tags:** Public queries wrapped in `unstable_cache` with specific tags.
- [ ] **12. Cache Revalidation:** Content mutation endpoints call `revalidateContent()` for both index and entity slugs.
- [ ] **13. Explicit Column Projections:** Zero `.select('*')` queries in data layer modules.
- [ ] **14. Database Indexes:** Indexes exist for all queried slugs, foreign keys, and filter flags.
- [ ] **15. Vector Caching:** Embeddings for internal links check `content_hash` before calling OpenAI API.
- [ ] **16. Connection Pooling:** Serverless functions use Supavisor connection pooling for database queries.
- [ ] **17. Gzip / Brotli Enabled:** Vercel edge compression active for all text/JSON payloads.
- [ ] **18. Error Boundary Containment:** Every route group has `error.tsx` and `loading.tsx` skeletons to prevent full-page crashes.
- [ ] **19. Lighthouse Mobile Audit:** Mobile Performance score ≥ 90 on `/`, `/services`, `/blog`, and `/editz`.

