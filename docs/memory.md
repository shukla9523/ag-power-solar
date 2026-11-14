# Memory & Architectural Decisions · AG POWER Solar Website Transformation

> Purpose: Central log of all technical decisions, architecture choices, known issues, and lessons learned.
> Standard: System Design SOP memory tracking.

---

## 1. Architectural & Technical Decisions

- **2026-11-14 · Single Project Repository & Single Docs Directory:**
  - *Decision:* Consolidated strictly into `c:\Users\BIT\Desktop\AG POWER Solar Website Transformation` with a single, authoritative `docs/` folder. Removed all duplicate and conflicting doc structures.
  - *Why:* User directive to maintain a unified, clean project structure without duplicate clouds of documentation.

- **2026-11-14 · Zero Arbitrary Additions ("Strict Compliance"):**
  - *Decision:* Strictly zero invented claims, fake reviews, imaginary certifications, or ecommerce features.
  - *Why:* Preserves engineering integrity and aligns 100% with the AG POWER assignment specifications.

- **2026-11-14 · Full CSS Token Sweep (896 Replacements):**
  - *Decision:* Replaced all raw hex arbitrary Tailwind classes (`-[#[0-9a-fA-F]]`) across 25 `.tsx` files with official AG POWER token classes: `forest`, `forest-deep`, `gold`, `gold-hover`, `ivory`, `sage`, `sage-mist`, `charcoal`, `charcoal-muted`, and `social-whatsapp`.
  - *Why:* Enforces ESLint `no-restricted-syntax` guard and guarantees full adherence to System Design SOP Rule #9.

- **2026-11-14 · Next.js 15.3.9 Production Build Verification:**
  - *Decision:* Verified `npm run build` end-to-end.
  - *Result:* All 173 routes compiled and statically generated with zero errors. All public page bundle sizes remain between 107 kB and 158 kB (well under the 200 kB budget).

- **2026-11-14 · Resilient Lead Dispatch Pipeline:**
  - *Decision:* Leads saved to Supabase `contact_leads` first; then dispatched to Google Sheets (13 columns) and Telegram Bot.
  - *Why:* External API downtime or rate-limits never discard customer enquiries.

---

## 2. Status of Known Issues

1. **ESLint Raw Hex Classes:** RESOLVED (systematically mapped all raw hex classes to semantic Tailwind tokens; `next lint` passes with 0 errors).
2. **TypeScript Compilation:** RESOLVED (zero `tsc` errors, `npm run typecheck` exits with code 0).
3. **Next.js Production Build:** RESOLVED (all 173 pages generated statically and dynamically with `next build`).
4. **Vitest Test Suite:** RESOLVED (18/18 test suites pass with 247 tests passing and 0 failures).
5. **Project Organization & Cleanup:** RESOLVED (single `docs/` folder maintained, temporary archives and unused legacy video files purged).

---

## 3. Lessons Learned

- **Enforce Linter Guards Early:** Running `next lint` caught raw hex usages before production deployment, ensuring the design system is 100% tokenized.
- **Backwards Compatibility in Helpers:** Preserving legacy export signatures (`sheetTarget`, `readSheetData`) in `google-sheets.ts` while implementing the new 13 AG POWER fields ensured both new customer forms and existing admin tools work without conflict.
