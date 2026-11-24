-- ==============================================================================
-- AG POWER Solar - Company Profile & Site Settings Migration
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'AG POWER Solar',
  legal_name TEXT NOT NULL DEFAULT 'AG POWER (Electro Global)',
  tagline TEXT DEFAULT 'Enterprise Solar EPC & Rooftop Energy Solutions',
  base_url TEXT NOT NULL DEFAULT 'https://agpower.in',
  logo_url TEXT DEFAULT '/assets/ag-logo.png',
  default_og_image TEXT DEFAULT 'https://agpower.in/og-image.jpg',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  phone TEXT DEFAULT '+91 95234 67849',
  whatsapp TEXT DEFAULT '+91 95234 67849',
  email TEXT DEFAULT 'contact@agpower.in',
  address TEXT DEFAULT 'Electro Global, Corporate Office, Sector 4, Bokaro Steel City, Jharkhand 827004',
  google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=AG+Power+Solar',
  instagram_url TEXT DEFAULT 'https://instagram.com/agpowersolar',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/company/agpowersolar',
  facebook_url TEXT DEFAULT 'https://facebook.com/agpowersolar',
  youtube_url TEXT DEFAULT 'https://youtube.com/@agpowersolar',
  twitter_url TEXT DEFAULT 'https://x.com/agpowersolar',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default AG POWER Solar configuration if empty
INSERT INTO public.site_settings (
  id,
  site_name,
  legal_name,
  tagline,
  base_url,
  logo_url,
  default_og_image,
  timezone,
  phone,
  whatsapp,
  email,
  address,
  google_maps_url,
  instagram_url,
  linkedin_url,
  facebook_url,
  youtube_url,
  twitter_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AG POWER Solar',
  'AG POWER (Electro Global)',
  'Enterprise Solar EPC & Rooftop Energy Solutions',
  'https://agpower.in',
  '/assets/ag-logo.png',
  'https://agpower.in/og-image.jpg',
  'Asia/Kolkata',
  '+91 95234 67849',
  '+91 95234 67849',
  'contact@agpower.in',
  'Electro Global, Corporate Office, Sector 4, Bokaro Steel City, Jharkhand 827004',
  'https://maps.google.com/?q=AG+Power+Solar',
  'https://instagram.com/agpowersolar',
  'https://linkedin.com/company/agpowersolar',
  'https://facebook.com/agpowersolar',
  'https://youtube.com/@agpowersolar',
  'https://x.com/agpowersolar'
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  legal_name = EXCLUDED.legal_name,
  tagline = EXCLUDED.tagline,
  base_url = EXCLUDED.base_url,
  phone = EXCLUDED.phone,
  whatsapp = EXCLUDED.whatsapp,
  email = EXCLUDED.email,
  address = EXCLUDED.address,
  updated_at = NOW();

-- Enable Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owner can update site settings" ON public.site_settings;
CREATE POLICY "Owner can update site settings"
  ON public.site_settings FOR ALL
  USING (
    auth.jwt()->>'role' IN ('owner', 'admin') OR
    auth.jwt()->>'email' = 'akashshukla9523@gmail.com'
  )
  WITH CHECK (
    auth.jwt()->>'role' IN ('owner', 'admin') OR
    auth.jwt()->>'email' = 'akashshukla9523@gmail.com'
  );
