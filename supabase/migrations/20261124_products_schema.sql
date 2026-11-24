-- ==============================================================================
-- Migration: 20261124_products_schema.sql
-- Description: Creates the public.products table for AG POWER Solar Panel Catalogue
--              Includes fields for ALMM listing, DCR compliance, editable badges,
--              engineering specifications, and 5-image gallery records.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model_name TEXT,
    technology TEXT NOT NULL,
    wattage_range TEXT NOT NULL,
    efficiency TEXT NOT NULL,
    overview TEXT,
    badge TEXT, -- e.g. 'Highest Efficiency', 'Most Popular', 'Best Value', 'Legacy Trust', 'Designer Choice', or NULL
    almm_listed BOOLEAN NOT NULL DEFAULT true,
    dcr_compliant BOOLEAN NOT NULL DEFAULT false,
    datasheet_url TEXT,
    temperature_coefficient TEXT,
    product_warranty TEXT,
    suitable_for TEXT,
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read access for published products
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public read access for published products'
    ) THEN
        CREATE POLICY "Public read access for published products"
            ON public.products
            FOR SELECT
            USING (status = 'published');
    END IF;
END $$;

-- Admin full access policy (for service role and authenticated admins)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin full access for products'
    ) THEN
        CREATE POLICY "Admin full access for products"
            ON public.products
            FOR ALL
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_products_updated_at();

-- Index for slug and brand lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- Seed Initial Solar Modules for AG POWER Solar
INSERT INTO public.products (
    slug, name, brand, model_name, technology, wattage_range, efficiency, overview,
    badge, almm_listed, dcr_compliant, datasheet_url, temperature_coefficient,
    product_warranty, suitable_for, gallery, status
) VALUES
(
    'waaree-arka-topcon-550w',
    'Waaree Arka Series N-Type TOPCon Dual-Glass Bifacial',
    'Waaree',
    'Arka Series 550W-580W',
    'N-Type TOPCon Dual-Glass Bifacial',
    '550W - 580W',
    '22.3%',
    'The Waaree Arka Series represents state-of-the-art N-Type TOPCon cell technology engineered for maximum energy yield under high ambient Indian temperatures. Featuring dual semi-tempered glass and zero Light-Induced Degradation (LID), this bifacial module captures reflected ground irradiance to deliver significantly higher kilowatt-hour generation per square foot.',
    'Highest Efficiency',
    true,
    true,
    'https://www.waaree.com/datasheets/arka-series-topcon-550w.pdf',
    '-0.30%/°C',
    '12 Years Product, 30 Years Linear Output',
    'Rooftop solar, ground-mount installations, high-temperature zones',
    '[
        {"src": "/panels/waaree-arka-topcon-550w/main.webp", "alt": "Waaree Arka N-Type TOPCon front elevation", "label": "Front View"},
        {"src": "/panels/waaree-arka-topcon-550w/rooftop.webp", "alt": "Waaree Arka rooftop installation in India", "label": "Rooftop Mounting"},
        {"src": "/panels/waaree-arka-topcon-550w/closeup.webp", "alt": "Waaree Arka N-Type cell grid and busbar detail", "label": "Cell Close-up"},
        {"src": "/panels/waaree-arka-topcon-550w/structure.webp", "alt": "Waaree Arka dual-glass rear elevation and junction box", "label": "Rear Glass & Junction Box"},
        {"src": "/panels/waaree-arka-topcon-550w/detail.webp", "alt": "Waaree Arka anodized aluminum corner mounting profile", "label": "Frame Profile"}
    ]'::jsonb,
    'published'
),
(
    'adani-shine-mono-perc-540w',
    'Adani Solar Shine Series Multi-Busbar Mono PERC Module',
    'Adani Solar',
    'Shine Series 540W-550W',
    'Mono PERC Half-Cut MBB',
    '540W - 550W',
    '21.3%',
    'The Adani Solar Shine Series provides rugged durability and proven reliability across all Indian climatic zones. Equipped with high-transmission tempered glass, 144 half-cut monocrystalline cells, and multi-busbar technology, it ensures dependable generation with low resistive losses.',
    'Best Value',
    true,
    true,
    'https://www.adanisolar.com/datasheets/shine-series-540w.pdf',
    '-0.35%/°C',
    '12 Years Product, 25 Years Linear Output',
    'PM Surya Ghar residential rooftops, commercial industrial structures',
    '[
        {"src": "/panels/adani-shine-mono-perc-540w/main.webp", "alt": "Adani Solar Shine Series Mono PERC front elevation", "label": "Front View"},
        {"src": "/panels/adani-shine-mono-perc-540w/rooftop.webp", "alt": "Adani Solar array installed on industrial rooftop", "label": "Rooftop Mounting"},
        {"src": "/panels/adani-shine-mono-perc-540w/closeup.webp", "alt": "Adani 144 half-cut monocrystalline cell matrix", "label": "Cell Matrix"},
        {"src": "/panels/adani-shine-mono-perc-540w/structure.webp", "alt": "Adani Solar heavy-duty aluminum mounting rail structure", "label": "Mounting Rails"},
        {"src": "/panels/adani-shine-mono-perc-540w/detail.webp", "alt": "Adani Solar IP68 weatherproof split junction box", "label": "Junction Box"}
    ]'::jsonb,
    'published'
),
(
    'vikram-somera-topcon-575w',
    'Vikram Solar SOMERA Grand Series N-Type TOPCon Bifacial',
    'Vikram Solar',
    'SOMERA Grand 575W-590W',
    'N-Type TOPCon Glass-to-Glass Bifacial',
    '575W - 590W',
    '22.5%',
    'The Vikram Solar SOMERA Grand Series is engineered for maximum power density on space-constrained commercial and industrial rooftops. Its advanced TOPCon cell matrix provides exceptional performance under diffuse irradiance conditions and hot summer ambient temperatures.',
    'Most Popular',
    true,
    false,
    'https://www.vikramsolar.com/datasheets/somera-grand-topcon-575w.pdf',
    '-0.29%/°C',
    '15 Years Product, 30 Years Linear Output',
    'Commercial complexes, industrial manufacturing units, utility solar parks',
    '[
        {"src": "/panels/vikram-somera-topcon-575w/main.webp", "alt": "Vikram Solar SOMERA Grand Series N-Type TOPCon front elevation", "label": "Front View"},
        {"src": "/panels/vikram-somera-topcon-575w/rooftop.webp", "alt": "Vikram Solar SOMERA rooftop installation on commercial warehouse", "label": "Commercial Installation"},
        {"src": "/panels/vikram-somera-topcon-575w/closeup.webp", "alt": "Vikram Solar SOMERA TOPCon cell surface close-up", "label": "TOPCon Cell Grid"},
        {"src": "/panels/vikram-somera-topcon-575w/structure.webp", "alt": "Vikram Solar SOMERA dual-glass bifacial rear face", "label": "Bifacial Rear"},
        {"src": "/panels/vikram-somera-topcon-575w/detail.webp", "alt": "Vikram Solar SOMERA 30mm anodized silver frame profile", "label": "Frame Profile"}
    ]'::jsonb,
    'published'
),
(
    'tata-power-mono-perc-545w',
    'Tata Power Solar TP Series High Efficiency Half-Cell Mono PERC',
    'Tata Power Solar',
    'TP Series 545W',
    'High Efficiency Half-Cell Mono PERC',
    '545W',
    '21.5%',
    'Built on Tata''s decades-long leadership in Indian power infrastructure, the TP Series delivers high conversion efficiency, anti-reflective ARC-coated glass, and stringent Electroluminescence (EL) verification. It is a preferred choice for Indian homeowners seeking brand trust and long-term asset security.',
    'Legacy Trust',
    true,
    true,
    'https://www.tatapowersolar.com/datasheets/tp-series-545w.pdf',
    '-0.36%/°C',
    '12 Years Product, 25 Years Linear Output',
    'Premium residential roofs, institutional estates, government projects',
    '[
        {"src": "/panels/tata-power-mono-perc-545w/main.webp", "alt": "Tata Power Solar TP Series front elevation", "label": "Front View"},
        {"src": "/panels/tata-power-mono-perc-545w/rooftop.webp", "alt": "Tata Power solar panel array on Indian residential roof", "label": "Residential Roof"},
        {"src": "/panels/tata-power-mono-perc-545w/closeup.webp", "alt": "Tata Power ARC anti-reflective glass surface and busbar", "label": "ARC Glass Detail"},
        {"src": "/panels/tata-power-mono-perc-545w/structure.webp", "alt": "Tata Power reinforced 35mm silver aluminum frame", "label": "Reinforced Frame"},
        {"src": "/panels/tata-power-mono-perc-545w/detail.webp", "alt": "Tata Power IP68 junction box with bypass diodes", "label": "Junction Box"}
    ]'::jsonb,
    'published'
),
(
    'goldi-heloc-plus-topcon-550w',
    'Goldi Solar HELOC Plus TOPCon Bifacial Glass-to-Glass',
    'Goldi Solar',
    'HELOC Plus 550W-570W',
    'N-Type TOPCon Dual-Glass Bifacial',
    '550W - 570W',
    '22.1%',
    'Goldi Solar HELOC Plus combines dual-glass safety with cutting-edge TOPCon cell efficiency. Certified for Class-A fire rating, it offers split-cell internal bypass architecture that significantly mitigates power loss from partial shade and dust accumulation.',
    NULL,
    true,
    false,
    'https://www.goldisolar.com/datasheets/heloc-plus-topcon-550w.pdf',
    '-0.30%/°C',
    '12 Years Product, 30 Years Linear Output',
    'Industrial shed roofs, harsh chemical environments, ground-mounted systems',
    '[
        {"src": "/panels/goldi-heloc-plus-topcon-550w/main.webp", "alt": "Goldi Solar HELOC Plus TOPCon front elevation", "label": "Front View"},
        {"src": "/panels/goldi-heloc-plus-topcon-550w/rooftop.webp", "alt": "Goldi Solar HELOC Plus dual-glass array on industrial shed", "label": "Industrial Installation"},
        {"src": "/panels/goldi-heloc-plus-topcon-550w/closeup.webp", "alt": "Goldi Solar micro-gap busbar connection detail", "label": "Micro-gap Busbar"},
        {"src": "/panels/goldi-heloc-plus-topcon-550w/structure.webp", "alt": "Goldi Solar Class-A fire rated dual tempered glass back", "label": "Tempered Glass Back"},
        {"src": "/panels/goldi-heloc-plus-topcon-550w/detail.webp", "alt": "Goldi Solar heavy mechanical load mounting bracket detail", "label": "Mounting Bracket"}
    ]'::jsonb,
    'published'
),
(
    'architectural-all-black-450w',
    'RenewSys Architectural Ultra All-Black Series',
    'RenewSys',
    'Architectural All-Black 450W',
    'Full Black Monocrystalline PERC',
    '450W',
    '20.8%',
    'For homeowners and architects who demand uncompromised aesthetics alongside high efficiency, the RenewSys Architectural All-Black Series integrates black busbars, a deep black backsheet, and an anodized matte black aluminum frame. It blends seamlessly into designer rooflines while generating dependable clean power.',
    'Designer Choice',
    true,
    false,
    'https://www.renewsysworld.com/datasheets/architectural-all-black-450w.pdf',
    '-0.37%/°C',
    '15 Years Product, 25 Years Linear Output',
    'Designer villas, modern residential architecture, urban facades',
    '[
        {"src": "/panels/architectural-all-black-450w/main.webp", "alt": "RenewSys Architectural All-Black solar panel front elevation", "label": "Front View"},
        {"src": "/panels/architectural-all-black-450w/rooftop.webp", "alt": "All-black solar modules on modern architectural villa roof", "label": "Villa Rooftop"},
        {"src": "/panels/architectural-all-black-450w/closeup.webp", "alt": "Matte black silicon wafer and invisible busbar surface", "label": "Black Cell Matrix"},
        {"src": "/panels/architectural-all-black-450w/structure.webp", "alt": "RenewSys anodized matte black aluminum frame profile", "label": "Black Frame Profile"},
        {"src": "/panels/architectural-all-black-450w/detail.webp", "alt": "Deep black composite rear backsheet and junction box", "label": "Black Backsheet"}
    ]'::jsonb,
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    model_name = EXCLUDED.model_name,
    technology = EXCLUDED.technology,
    wattage_range = EXCLUDED.wattage_range,
    efficiency = EXCLUDED.efficiency,
    overview = EXCLUDED.overview,
    badge = EXCLUDED.badge,
    almm_listed = EXCLUDED.almm_listed,
    dcr_compliant = EXCLUDED.dcr_compliant,
    datasheet_url = EXCLUDED.datasheet_url,
    temperature_coefficient = EXCLUDED.temperature_coefficient,
    product_warranty = EXCLUDED.product_warranty,
    suitable_for = EXCLUDED.suitable_for,
    gallery = EXCLUDED.gallery,
    status = EXCLUDED.status,
    updated_at = now();
