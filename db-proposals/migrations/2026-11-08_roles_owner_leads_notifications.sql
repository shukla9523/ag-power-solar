-- =====================================================================================
-- M-04 · 2026-11-08 · Roles + owner lock, leads, notifications, redirects, AI jobs, media,
--        meta-object ownership columns.
-- Idempotent: safe to run more than once. Run in the Supabase SQL editor as a human (D-09).
-- The application already works before this runs (it falls back gracefully); running it
-- enables the leads inbox, notifications, redirects, AI job history and field locks.
-- =====================================================================================

begin;

-- ── 1. Roles: owner / admin / marketer / customer ──────────────────────────────────────
-- Drop any old CHECK constraint on profiles.role so the new values are accepted.
do $$
declare c record;
begin
  for c in
    select con.conname from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    where rel.relname = 'profiles' and con.contype = 'c' and pg_get_constraintdef(con.oid) ilike '%role%'
  loop
    execute format('alter table public.profiles drop constraint %I', c.conname);
  end loop;
end $$;

-- Map legacy roles to the new model.
update public.profiles set role = 'marketer' where role in ('manager', 'seo', 'content_manager', 'editor', 'viewer');
update public.profiles set role = 'customer' where role is null or role not in ('owner', 'admin', 'marketer', 'customer');

alter table public.profiles
  add constraint profiles_role_check check (role in ('owner', 'admin', 'marketer', 'customer'));

-- New sign-ups default to customer / pending (no admin access).
alter table public.profiles alter column role set default 'customer';

-- ── 2. Owner account (CEO) ─────────────────────────────────────────────────────────────
-- The app recognises the owner from OWNER_EMAIL; this makes the database agree and adds a
-- trigger so nobody but the owner can change or delete the owner row, even via SQL/API keys.
update public.profiles
   set role = 'owner', status = 'approved'
 where lower(email) = 'sharmasaurabh2604@gmail.com';

create unique index if not exists profiles_single_owner on public.profiles ((role)) where role = 'owner';

create or replace function public.protect_owner_profile() returns trigger
language plpgsql security definer as $$
begin
  if tg_op = 'DELETE' then
    -- Allowed only through delete_owner_profile() (typed confirmation in the admin) or by the owner's own session.
    if old.role = 'owner'
       and coalesce(current_setting('app.allow_owner_delete', true), '') <> 'on'
       and coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) <> old.id then
      raise exception 'The owner account can only be deleted by the owner';
    end if;
    return old;
  end if;
  if old.role = 'owner' then
    if new.role <> 'owner' or lower(new.email) <> lower(old.email) or new.status <> 'approved' then
      if coalesce(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid) <> old.id then
        raise exception 'The owner account is protected';
      end if;
    end if;
  end if;
  if new.role = 'owner' and old.role <> 'owner' then
    raise exception 'The owner role cannot be assigned';
  end if;
  return new;
end $$;

-- Called by the admin API after the owner typed their email + "DELETE OWNER ACCOUNT".
create or replace function public.delete_owner_profile(p_id uuid) returns void
language plpgsql security definer as $$
begin
  perform set_config('app.allow_owner_delete', 'on', true);
  delete from public.profiles where id = p_id and role = 'owner';
end $$;
revoke all on function public.delete_owner_profile(uuid) from public, anon, authenticated;

drop trigger if exists trg_protect_owner_profile on public.profiles;
create trigger trg_protect_owner_profile
  before update or delete on public.profiles
  for each row execute function public.protect_owner_profile();

-- ── 3. Meta-object ownership columns (AI fills empty fields only; human values locked) ──
alter table public.seo_setting add column if not exists field_sources jsonb not null default '{}'::jsonb;
alter table public.seo_setting add column if not exists image_alt text;
alter table public.seo_setting add column if not exists image_title text;
alter table public.seo_setting add column if not exists og_image_alt text;
alter table public.seo_setting add column if not exists ai_filled_at timestamptz;
create unique index if not exists seo_setting_page_key_unique on public.seo_setting (page_key);

-- ── 4. Contact leads ────────────────────────────────────────────────────────────────────
create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  source text not null default 'contact',
  source_page text,
  consent boolean not null default false,
  consent_text_version text,
  ip_hash text,
  user_agent text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  notes text,
  sheet_status text not null default 'pending',
  sheet_attempts int not null default 0,
  email_status text not null default 'pending',
  email_attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_leads_created_idx on public.contact_leads (created_at desc);
create index if not exists contact_leads_status_idx on public.contact_leads (status);
create index if not exists contact_leads_pending_idx on public.contact_leads (created_at)
  where sheet_status <> 'sent' or email_status <> 'sent';
alter table public.contact_leads enable row level security; -- service role only

-- ── 5. Admin notifications ──────────────────────────────────────────────────────────────
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text not null,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists admin_notifications_created_idx on public.admin_notifications (created_at desc);
create index if not exists admin_notifications_unread_idx on public.admin_notifications (created_at desc) where read_at is null;
alter table public.admin_notifications enable row level security;

-- ── 6. Redirects (301 on slug change) ───────────────────────────────────────────────────
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  status_code int not null default 301,
  is_active boolean not null default true,
  hits int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.redirects enable row level security;

create or replace function public.increment_redirect_hits(p_from_path text) returns void
language sql security definer as $$
  update public.redirects set hits = hits + 1 where from_path = p_from_path;
$$;

-- ── 7. AI jobs and media assets ─────────────────────────────────────────────────────────
create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  trigger text,
  status text not null,
  items int not null default 0,
  filled_fields int not null default 0,
  prompt_version text,
  output jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists ai_jobs_created_idx on public.ai_jobs (created_at desc);
alter table public.ai_jobs enable row level security;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  url text not null,
  mime_type text,
  width int,
  height int,
  variant text,
  source text not null default 'upload',
  status text not null default 'approved',
  prompt_version text,
  alt_text text,
  attached_entity text,
  created_at timestamptz not null default now()
);
create index if not exists media_assets_entity_idx on public.media_assets (attached_entity);
alter table public.media_assets enable row level security;

-- ── 8. Site settings additions ──────────────────────────────────────────────────────────
alter table public.site_setting add column if not exists default_og_image text;
alter table public.site_setting add column if not exists twitter_handle text;
alter table public.site_setting add column if not exists google_site_verification text;
alter table public.site_setting add column if not exists leads_sheet_url text;
alter table public.site_setting add column if not exists theme_tokens jsonb not null default '{}'::jsonb;

-- ── 9. Content timestamps used for sitemap <lastmod> ────────────────────────────────────
alter table public.services add column if not exists updated_at timestamptz default now();
alter table public.case_studies add column if not exists updated_at timestamptz default now();

commit;
