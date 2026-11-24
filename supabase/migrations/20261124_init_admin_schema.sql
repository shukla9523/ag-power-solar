-- ==============================================================================
-- AG POWER Solar - Production Administration Database Schema Migration
-- Standardized for Next.js 15 + React 19 + Supabase PostgreSQL
-- ==============================================================================

-- 1. Profiles & Role Management (owner | editor)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor')) DEFAULT 'editor',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Dynamic Site Settings Table (Brand, Domain, OG Image, Timezone)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'AG POWER Solar',
  base_url TEXT NOT NULL DEFAULT 'https://ag-power-solar.vercel.app',
  logo_url TEXT,
  default_og_image TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Core Content Tables (pages, blog_posts, services, case_studies)
-- Canonical schema: title, slug (unique), content, excerpt, featured_image,
-- status (draft|published), published_at, meta_title, meta_description, canonical_url,
-- primary_keyword, og_title, og_description, og_image, faq (jsonb), custom_json_ld (jsonb)

CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  primary_keyword TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_json_ld JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  primary_keyword TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_json_ld JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  primary_keyword TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_json_ld JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  primary_keyword TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  custom_json_ld JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Leads Management Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  source_page TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'closed')) DEFAULT 'new',
  is_read BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SEO Audits and Per-Page Issues
CREATE TABLE IF NOT EXISTS public.seo_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  average_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_pages INTEGER NOT NULL DEFAULT 0,
  total_errors INTEGER NOT NULL DEFAULT 0,
  total_warnings INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seo_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES public.seo_audits(id) ON DELETE CASCADE,
  page_path TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('error', 'warning', 'info')),
  message TEXT NOT NULL,
  fix_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes on (slug, status, created_at)
CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON public.pages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON public.services(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);
CREATE INDEX IF NOT EXISTS idx_case_studies_created_at ON public.case_studies(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_is_read ON public.leads(is_read);

CREATE INDEX IF NOT EXISTS idx_seo_issues_audit_id ON public.seo_issues(audit_id);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON public.seo_issues(severity);

-- 7. Security Helper Functions
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('owner', 'editor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$;

-- 8. Row Level Security (RLS) Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_issues ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies

-- Public Policies:
-- Anyone can view published content
CREATE POLICY "Public can view published pages" ON public.pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published blog_posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published services" ON public.services
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published case_studies" ON public.case_studies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view site settings" ON public.site_settings
  FOR SELECT USING (true);

-- Anyone can submit a lead enquiry
CREATE POLICY "Public can insert leads" ON public.leads
  FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Owner & Editor):
-- Content & Leads management
CREATE POLICY "Admins have full access to pages" ON public.pages
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to blog_posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to services" ON public.services
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to case_studies" ON public.case_studies
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to leads" ON public.leads
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to seo_audits" ON public.seo_audits
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to seo_issues" ON public.seo_issues
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- User Profiles:
-- Any admin can view profiles
CREATE POLICY "Admins can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin());

-- Only owner can modify profiles
CREATE POLICY "Owners can manage profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

-- Site Settings:
-- Only owner can modify site settings
CREATE POLICY "Owners can update site settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_owner()) WITH CHECK (public.is_owner());

-- 10. Seed Initial Site Settings (AG POWER Solar)
INSERT INTO public.site_settings (site_name, base_url, logo_url, default_og_image, timezone)
SELECT 'AG POWER Solar', 'https://ag-power-solar.vercel.app', '/opengraph-image.jpg', 'https://ag-power-solar.vercel.app/opengraph-image.jpg', 'Asia/Kolkata'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings LIMIT 1);
