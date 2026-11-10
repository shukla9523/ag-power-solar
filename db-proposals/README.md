# Mommantum Database Proposals & Migration Registry (`db-proposals/`)

This directory maintains the complete versioned history of database schema migrations, production seeds, live backups, rollback scripts, and validation utilities for **Mommantum** (Supabase PostgreSQL 15).

> **Core Operating Rule:** Implemented scripts are archived and maintained for auditability and schema reproduction, not automatically deleted. Temporary/obsolete scripts are removed after verification. All production SQL changes are reviewed and executed by an authorized administrator only.

---

## Directory Structure

```text
db-proposals/
├── migrations/        # Schema DDL modifications (CREATE, ALTER, DROP COLUMN)
├── seeds/             # Seed data and content inserts (Services, FAQs, SEO, Metadata)
├── backups/           # Point-in-time database snapshots and JSON backups
├── rollback/          # Reversible down-migrations and emergency rollback scripts
├── validation/        # Python/JSON validation scripts for checking string lengths and schemas
├── archive/           # Obsolete proposals, drafts, and templates retained for historical reference
└── README.md          # Execution tracking table and operational guidelines
```

---

## Migration & Seed Execution Tracking Table

| ID | Category | File Path | Status | Executed On | Purpose & Scope |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **M-01** | `migrations` | `migrations/add_organization_profile.sql` | **Applied** | 2026-10 | Creates `organization_profile` table for brand facts and schema grounding. |
| **M-02** | `migrations` | `migrations/cleanup_schema_json.sql` | **Applied** | 2026-10 | Deprecates hardcoded `schema_json` column across content tables. |
| **M-03** | `migrations` | `migrations/clean_meta_titles.sql` | **Applied** | 2026-10 | Standardizes title constraints across SEO settings. |
| **S-01** | `seeds` | `seeds/seed_organization_profile.sql` | **Applied** | 2026-10 | Seeds official Mommantum company profile, founder details, and addresses. |
| **S-02** | `seeds` | `seeds/seed_home_faqs.sql` | **Applied** | 2026-10 | Seeds verified homepage FAQs (40–60 words each). |
| **S-03** | `seeds` | `seeds/seed_service_faqs.sql` | **Applied** | 2026-10 | Seeds service-specific FAQs for all active agency offerings. |
| **S-04** | `seeds` | `seeds/seed_service_faqs_8_10.sql` | **Applied** | 2026-10 | Expands FAQ coverage to 8-10 items per core service offering. |
| **S-05** | `seeds` | `seeds/seed_page_meta_and_keywords.sql` | **Applied** | 2026-10 | Seeds page-level SEO meta titles, descriptions, and primary keywords. |
| **S-06** | `seeds` | `seeds/seed_service_meta_descriptions_LIVE.sql` | **Applied** | 2026-10 | Live production meta descriptions for 16 services. |
| **S-07** | `seeds` | `seeds/seed_keywords_LIVE.sql` | **Applied** | 2026-10 | Live production keyword clustering for SEO indexing. |
| **S-08** | `seeds` | `seeds/seed_share_images_LIVE.sql` | **Applied** | 2026-10 | Links OpenGraph and Twitter card preview images. |
| **B-01** | `backups` | `backups/before_go_live.json` | **Secure** | 2026-10 | Pre-launch database snapshot. |
| **R-01** | `rollback` | `rollback/rollback_go_live.sql` | **Standby** | — | Emergency rollback script to restore pre-go-live state if needed. |
| **V-01** | `validation` | `validation/check_service_lengths.py` | **Utility** | — | Validates that all service descriptions meet 140–160 char constraints. |
| **V-02** | `validation` | `validation/page_faqs_validated.json` | **Reference** | — | Validated FAQ dataset matching Schema.org requirements. |
| **A-01** | `archive` | `archive/drop_store_tables_PROPOSAL.sql` | **Archived** | — | Proposal to drop Medusa store tables (intentionally kept unexecuted). |
| **A-02** | `archive` | `archive/seed_static_page_keywords_DRAFT.sql` | **Archived** | — | Draft static keywords superseded by `seed_keywords_LIVE.sql`. |

---

## Guidelines for New SQL Proposals

1. **Write Once, Review Twice:** All database changes must be written as an idempotent SQL script in `db-proposals/migrations/` or `db-proposals/seeds/` before running against Supabase.
2. **Idempotency:** Always use `CREATE TABLE IF NOT EXISTS`, `ON CONFLICT DO UPDATE`, or check constraints so that re-running a script does not corrupt existing data.
3. **No Secret Keys:** Never include API tokens, passwords, or sensitive keys in SQL files.
4. **Update This Registry:** When a new script is executed in production, update this `README.md` tracking table with the execution date and status.

