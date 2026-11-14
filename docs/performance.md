# Performance · AG POWER Website · v1.0

## Budgets
| Measure | Target | Checked by |
|---|---|---|
| Largest Contentful Paint (mobile) | under 2.5 s | Lighthouse CI |
| Cumulative Layout Shift | under 0.1 | Lighthouse CI |
| Interaction to Next Paint | under 200 ms | Lighthouse / field data |
| Lighthouse performance | 80+ minimum | CI on every PR |
| Lighthouse SEO | 90+ | CI |
| Lighthouse accessibility | 90+ | CI |
| Lighthouse best practices | 90+ | CI |
| API response, p95 (SOP default) | under 300 ms (lists), 800 ms (heavy, e.g. calculator/lead write) | Logs / monitoring |
| JavaScript per page, compressed (SOP default) | under 200 KB first load | Build report |
| API calls on first load of a screen (SOP default) | 3 or fewer | Review |

Brief-specific requirements: optimise images (WebP/AVIF); lazy-load below-the-fold imagery; prioritise hero imagery; split code by route; avoid unnecessary dependencies; avoid excessive animations; optimise font delivery (self-host Manrope/Inter variable fonts, fallbacks); minimise layout shifts.

## The 20-point checklist
Stack: Next.js 15 + Supabase on Vercel (audit).

| # | Item | Applies? | Method for this project | Checked by |
|---|---|---|---|---|
| 1 | Compress all images | Applies | Image component serves WebP/AVIF at right size; fixed dimensions; hero prioritised | Lighthouse "properly size images", CI image size limit |
| 2 | Lazy loading | Applies | Below-the-fold images and heavy widgets (calculator, carousel, catalogue) load on scroll | Lighthouse "offscreen images" |
| 3 | Split code into chunks | Applies | Route-based splitting; dynamic import for calculator and heavy widgets | Build report per route |
| 4 | Cache API responses | Applies | `unstable_cache` per resource; HTTP Cache-Control/ETag on public GETs | Network tab |
| 5 | Add a CDN | Applies | Static files and images via Vercel CDN | Cache HIT header |
| 6 | Minify JS and CSS | Applies | Production build | Lighthouse "minify" |
| 7 | Index the database | Applies | Index slug, panel brand/wattage/technology filters | EXPLAIN |
| 8 | Reduce unnecessary re-renders | Applies | Stable props; local state; memo only where profiling shows need | React Profiler |
| 9 | Debounce input handlers | Applies | Panel catalogue search/filter debounced 300 ms | Network tab |
| 10 | Paginate large lists | Applies | Panels and blog lists take page/limit; max 100 | company-rules + review |
| 11 | Remove unused dependencies | Applies | depcheck monthly; new package needs reason in PR; no large animation library | Bundle report |
| 12 | Defer non-critical scripts | Applies | Analytics/WhatsApp/maps widgets loaded after interaction or with defer | Lighthouse "render-blocking" |
| 13 | Loading skeleton | Applies | Skeletons on catalogue, blog, panel detail, calculator results (same layout; protects CLS) | Design review; CLS budget |
| 14 | Load balancer | Managed platform default (Vercel) | Platform handles it | Uptime / p95 under load test |
| 15 | Compress API payloads | Applies | gzip/brotli; return only needed fields | Response headers |
| 16 | DB connection pooling | Applies (Supabase) | One pool per service / pooler; no connection per request | Connection count flat under load |
| 17 | Cache expensive computed results | Decide in the calculator task plan | Cache with expiry if the calculation proves expensive | Hit rate in logs |
| 18 | Fix N+1 queries | Applies | Join/batch for panel lists and blog related articles | Query count per request |
| 19 | Server-side caching | Applies | ISR + `unstable_cache` with tag revalidation (existing) for public pages | Response time + cache headers |
| 20 | Run a Lighthouse audit | Applies | Lighthouse CI on every PR; production check weekly | Scores in CI and weekly report |

## Caching table
| What | Where | TTL | Cleared by |
|---|---|---|---|
| Static assets/images | Vercel CDN | long | new build/hash |
| Public pages | ISR | TBD | content change |
| Panel list/detail GET | HTTP cache + client cache | TBD | panel update |
| Calculator configuration | decide in task plan | TBD | config change |
Lead and calculator POST requests are never cached.

## Load test and third-party scripts
- Load-test note: expected users now/12 months not provided (prd.md §12 Q12). A k6 (or similar) test is run before launch, including POST /leads and /calculator/estimate.
- Third-party scripts and sizes: to be listed (analytics, maps, WhatsApp, spam protection — not yet chosen).

Gate check: all 20 items marked ✔ · every budget has a number ✔.
