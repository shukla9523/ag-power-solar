# Mommantum Project Documentation (`docs/`)

This directory houses the foundational engineering, design, and architectural specifications for **Mommantum** following the official Development Planning System SOP.

---

## Complete SOP Documentation Index

| File | Answers | Required | Owner | Ready Before |
| :--- | :--- | :--- | :--- | :--- |
| [prd.md](prd.md) | **What are we building, for whom, and how do we know it worked?** Target personas, user stories, acceptance criteria, SEO targets, constraints, and out-of-scope boundaries. | Always | Product, CEO approves | Architecture starts |
| [architecture.md](architecture.md) | **Where does every piece live, how does data flow, what is each API?** System map, responsibility split, folder structure, Supabase data models, API route contracts, auth flow, and schema engine. | Always | CTO | First line of code |
| [rules.md](rules.md) | **What must every line of code follow?** 14 core coding rules, styling exceptions, security standards, stack conventions, and performance checklists. | Always | CTO, CEO approves | First line of code |
| [design.md](design.md) | **How does it look, which tokens and components exist?** Color & typography tokens, component locations, responsive breakpoints, image/OG standards, and interactive form feedback. | Always (UI projects) | CTO + UI owner | First UI task |
| [performance.md](performance.md) | **How fast must it be, and what keeps it fast?** Core Web Vitals budgets (LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms, TTFB ≤ 200ms), zero-blocking middleware, ISR caching, image optimization, and 19-point performance checklist. | Always | CTO | First line of code |
| [ai-setup-guide.md](ai-setup-guide.md) | **How does the AI stay grounded, secure, cheap and tested?** AI SEO auto-fill, vector embeddings, semantic internal linking, automated blog ingestion, anti-hallucination guardrails, and token cost controls. | Only if AI is used | CTO | First AI task |
| [task.md](task.md) | **What is the technical plan for this task?** Active technical task plans (NTF-301 to NTF-306), backlog candidates, finished work archive, and 10-section plan template. | Always (grows per task) | Developer, lead approves | Each task's coding |
| [memory.md](memory.md) | **What did we decide and learn?** Architectural decisions (D-01 to D-11), known issues and gotchas (K-01 to K-20), patterns to follow, and change log. | Always (grows) | Everyone, lead curates | Same day as each lesson |

---

## Supporting Operational Guides

| File | Purpose |
| :--- | :--- |
| [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md) | Visual identity, official brand color hex values, typography scale, and brand voice standards. |
| [GO-LIVE-STEP-BY-STEP.md](GO-LIVE-STEP-BY-STEP.md) | **Owner's step-by-step go-live guide:** every click, value and check, plus troubleshooting and rollback. |
| [setup-guide.md](setup-guide.md) | **Start here for deployment:** env variables, migration M-04, owner access, Zoho SMTP, Google Sheet leads, AI keys, cron jobs, go-live checklist. |
| [platform-remediation-plan.md](platform-remediation-plan.md) | 2026-11-08 CTO review findings, target architecture, roles, SEO/AEO/GEO system and implementation plan (NTF-307…323). |
| [BLOG_INTEGRATION_SPEC.md](BLOG_INTEGRATION_SPEC.md) | Specifications for automated blog publishing via Claude, n8n, or external webhooks (`POST /api/blog/publish` and `/api/blog/upload`). |

---

## Core Working Guidelines
1. **Plan First:** Any feature or modification requires an approved 10-section task plan in `task.md` before coding begins.
2. **Architecture Sync:** Any change to architecture, data models, or routes must be reflected in `architecture.md` and `memory.md` in the same PR.
3. **Decisions Recorded:** Any architectural trade-off or lesson learned the hard way must be added to `memory.md` the same day.
4. **Local Rules:** Private local agent configurations and working rules are preserved in `.agents/AGENTS.md` and `.workrules/RULES.md`.
