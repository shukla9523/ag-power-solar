# Mommantum Project Guide

> **MANDATORY INSTRUCTION:** Before planning or implementing any code changes in this repository, you MUST read the core project documentation in `docs/` and review the standing directives in `.agents/AGENTS.md`.

---

## 1. Project Overview & Tech Stack

- **Framework:** Next.js 15.3.9 (App Router) + React 19 + TypeScript 5
- **Database & Auth:** Supabase PostgreSQL 15 + Row Level Security (RLS) + GoTrue Auth
- **Styling:** Tailwind CSS + Radix UI + Motion + Medusa UI preset
- **SEO & Structured Data:** Unified Linked Data Engine in `src/lib/schema` producing a single connected JSON-LD `@graph` per page
- **AI Automation:** AI SEO Auto-Fill Service (`ai-seo-service.ts`) + Vector Semantic Linking (`linking-service.ts`) + Automated Publishing API (`/api/blog/publish`)
- **Deployment:** Vercel serverless (`https://www.mommantum.com`)

---

## 2. Core Documentation Structure (`docs/`)

All engineering and product guidelines are strictly maintained in the `docs/` directory per the official Development Planning System SOP:

1. [docs/prd.md](docs/prd.md): Product Requirements, user personas, acceptance criteria, and out-of-scope boundaries.
2. [docs/architecture.md](docs/architecture.md): Technical architecture, directory tree, Supabase data models, API route contracts, and request lifecycle.
3. [docs/rules.md](docs/rules.md): 14 core coding rules, security standards, stack add-ons, and performance standards.
4. [docs/design.md](docs/design.md): Design tokens, typography hierarchy, component directories, breakpoints, and OpenGraph/alt-text standards.
5. [docs/performance.md](docs/performance.md): Core Web Vitals budgets (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms, TTFB ≤ 200ms), zero-blocking middleware, ISR caching, image optimization, and 19-point checklist.
6. [docs/ai-setup-guide.md](docs/ai-setup-guide.md): AI SEO auto-fill, vector embeddings, semantic internal linking, automated blog ingestion, anti-hallucination guardrails, and token cost controls.
7. [docs/task.md](docs/task.md): Technical task plans (NTF-301 through NTF-306), backlog, archive, and 10-section task plan template.
8. [docs/memory.md](docs/memory.md): Architectural decisions (D-01 to D-11), known issues & gotchas (K-01 to K-20), patterns, and change log.
9. [docs/BRAND_GUIDELINES.md](docs/BRAND_GUIDELINES.md): Visual identity, official color palette, typography weights, and brand voice.
10. [docs/BLOG_INTEGRATION_SPEC.md](docs/BLOG_INTEGRATION_SPEC.md): Publishing API specs (`POST /api/blog/publish` and `/api/blog/upload`).

---

## 3. Essential Commands

```bash
# Install dependencies
npm install

# Start local development server (port 8000)
npm run dev

# Clean .next cache and start dev server
npm run dev:clean

# Run TypeScript type check
npm run typecheck

# Run ESLint validation
npm run lint

# Run Vitest test suite (schema, vector math, and revalidation tests)
npm test

# Build for production
npm run build
```

---

## 4. Fundamental Development Rules

1. **Plan First:** Write and verify a 10-section task plan in `docs/task.md` before writing implementation code.
2. **Logic in Backend Only:** Cart totals, prices, discounts, permissions, and roles are calculated on the server. Frontend components only display data.
3. **No Hardcoding:** Brand facts and organization profile live strictly in `src/lib/schema/site.ts` (`DEFAULT_ORGANIZATION_PROFILE`) or the `organization_profile` database table.
4. **Security & Auth:** Never trust the `sb-role` cookie. Roles are always verified server-side against the Supabase `profiles` table. Never commit `.env.local` or service-role keys.
5. **Dynamic SEO & Metadata Parity:** Metadata (`generateMetadata`) and JSON-LD `@graph` must always originate from the same route entity resolver to prevent drift.
6. **Revalidation:** Every admin content mutation must invoke `revalidateContent()` from `src/lib/revalidate.ts`.
7. **Performance Budgets:** Maintain LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; zero database queries in middleware for public routes.
8. **AI Grounding:** AI-generated SEO and FAQs must satisfy strict Schema.org standards (40–60 words per answer) and parse against Zod schemas before database insertion.
