-- =====================================================================================
-- M-06 · 2026-11-09 · Security hardening (review findings S1, S5, S9, S14).
-- Run AFTER M-04 and M-05. Idempotent. Run in the Supabase SQL editor as a human (D-09).
--
-- What it does
--   1. profiles  : signed-in users may read ONLY their own row; nobody but the server
--                  (service role) or the SQL editor may change role / status / mfa_enabled.
--   2. post      : the public (anon) key may read only published, non-deleted posts.
--   3. site_setting: no public access at all. The website reads it with the server key and
--                  keeps public columns only (it also stores the private leads-sheet link).
--   4. Functions : increment_redirect_hits can no longer be called with public keys, and
--                  every SECURITY DEFINER function gets a fixed search_path.
--
-- The app already uses the service role for every write and for these reads, so nothing in
-- the website or admin panel changes behaviour. Check section 5 queries after running.
-- =====================================================================================

begin;

-- ── 1. profiles ─────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Remove every existing policy (an "update own profile" policy would let a pending user make
-- themselves admin or switch off their own 2FA flag through the public API).
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'profiles' loop
    execute format('drop policy %I on public.profiles', p.policyname);
  end loop;
end $$;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id);
-- No insert / update / delete policies: only the service role (which bypasses RLS) writes.

-- Belt and braces: even if a policy is added later by mistake, API callers using the anon or
-- authenticated role can never change these columns.
create or replace function public.guard_profile_privileges() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare caller text := coalesce(current_setting('request.jwt.claim.role', true), '');
begin
  if caller in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      raise exception 'Profiles are created by the server only';
    end if;
    if new.role is distinct from old.role
       or new.status is distinct from old.status
       or new.mfa_enabled is distinct from old.mfa_enabled
       or new.id is distinct from old.id
       or lower(new.email) is distinct from lower(old.email) then
      raise exception 'Role, status, email and 2FA settings can only be changed by the server';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_guard_profile_privileges on public.profiles;
create trigger trg_guard_profile_privileges
  before insert or update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- ── 2. post (blog) ──────────────────────────────────────────────────────────────────────
alter table public.post enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'post' loop
    execute format('drop policy %I on public.post', p.policyname);
  end loop;
end $$;

-- Drafts and scheduled posts stay private; previews read them with the server key.
create policy post_public_read_published on public.post
  for select to anon, authenticated
  using (status = 'published' and deleted_at is null);

-- ── 3. site_setting (holds private values such as leads_sheet_url) ──────────────────────
alter table public.site_setting enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'site_setting' loop
    execute format('drop policy %I on public.site_setting', p.policyname);
  end loop;
end $$;
-- No policies on purpose: anon / authenticated cannot read or write; the service role can.
revoke all on public.site_setting from anon, authenticated;

-- ── 4. Functions ────────────────────────────────────────────────────────────────────────
revoke all on function public.increment_redirect_hits(text) from public, anon, authenticated;
grant execute on function public.increment_redirect_hits(text) to service_role;

alter function public.increment_redirect_hits(text) set search_path = public, pg_temp;
alter function public.protect_owner_profile() set search_path = public, pg_temp;
alter function public.delete_owner_profile(uuid) set search_path = public, pg_temp;

commit;

-- ── 5. Checks (run after the migration; read-only) ──────────────────────────────────────
-- Expect exactly one policy, profiles_select_own:
--   select policyname, cmd, roles from pg_policies where tablename = 'profiles';
-- Expect post_public_read_published only:
--   select policyname, cmd, roles from pg_policies where tablename = 'post';
-- Expect no rows (no public access to site settings):
--   select policyname from pg_policies where tablename = 'site_setting';
-- Expect false for anon:
--   select has_function_privilege('anon', 'public.increment_redirect_hits(text)', 'execute');
-- Every SECURITY DEFINER function in public should list a search_path:
--   select proname, proconfig from pg_proc
--    where pronamespace = 'public'::regnamespace and prosecdef;
