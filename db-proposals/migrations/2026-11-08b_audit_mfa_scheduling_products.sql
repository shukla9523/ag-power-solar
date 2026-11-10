-- =====================================================================================
-- M-05 · 2026-11-08 · Audit log, 2FA flag, scheduled publishing, product pages.
-- Run AFTER M-04. Idempotent. Run in the Supabase SQL editor as a human (D-09).
-- =====================================================================================

begin;

-- ── 1. Audit log (append-only) ──────────────────────────────────────────────────────────
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  actor_type text not null default 'user' check (actor_type in ('user', 'system', 'ai', 'cron', 'api')),
  action text not null,                 -- e.g. blog.update, service.delete, seo.update, user.role
  entity_type text not null,            -- post | service | case_study | seo | site | user | lead | keyword | product
  entity_key text not null,             -- id / slug / page_key
  changed_fields text[] not null default '{}',
  before jsonb,
  after jsonb,
  restored_from uuid,
  created_at timestamptz not null default now()
);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);
create index if not exists audit_log_entity_idx on public.audit_log (entity_type, entity_key, created_at desc);
create index if not exists audit_log_actor_idx on public.audit_log (actor_email, created_at desc);
alter table public.audit_log enable row level security; -- service role only

-- Nobody (not even the service role through the API) may edit or delete history.
create or replace function public.audit_log_immutable() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_log is append-only';
end $$;
drop trigger if exists trg_audit_log_immutable on public.audit_log;
create trigger trg_audit_log_immutable before update or delete on public.audit_log
  for each row execute function public.audit_log_immutable();

-- ── 2. Two-factor authentication flag (factors themselves live in Supabase Auth) ────────
alter table public.profiles add column if not exists mfa_enabled boolean not null default false;

-- ── 3. Scheduled publishing + draft preview ─────────────────────────────────────────────
alter table public.post add column if not exists publish_at timestamptz;
create index if not exists post_publish_at_idx on public.post (publish_at) where status = 'scheduled';
-- 'scheduled' is a new post status; drop any old CHECK on post.status that would reject it.
do $$
declare c record;
begin
  for c in
    select con.conname from pg_constraint con join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'post' and con.contype = 'c' and pg_get_constraintdef(con.oid) ilike '%status%'
  loop
    execute format('alter table public.post drop constraint %I', c.conname);
  end loop;
end $$;

-- ── 4. Product pages (EDITZ, Blog AI) ───────────────────────────────────────────────────
create table if not exists public.product_pages (
  slug text primary key check (slug in ('editz', 'blog-ai')),
  content jsonb not null default '{}'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now()
);
alter table public.product_pages enable row level security;
-- Public pages read product content with the anon key.
drop policy if exists product_pages_public_read on public.product_pages;
create policy product_pages_public_read on public.product_pages for select using (true);
insert into public.product_pages (slug) values ('editz'), ('blog-ai') on conflict (slug) do nothing;

commit;
