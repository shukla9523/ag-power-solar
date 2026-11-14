# Design · AG POWER Website · v1.0

Approved brand tokens are the *initial* approved values. Direction: premium, clean, confident, approachable. Keep Forest Green dominant, Gold the recognisable accent, Ivory as breathing room. Do not use every colour equally.

## 1. Tokens (tokens.css)

### Colour
| Token | Value | Use |
|---|---|---|
| --color-primary (Deep Forest Green) | #173F32 | Primary brand; hero sections, footer, primary brand areas, important banners, calculator result panels, selected navigation states |
| --color-accent (Solar Gold) | #E9B949 | Primary CTA buttons, highlights, icons, important figures, interactive accents |
| --color-bg (Warm Ivory) | #F7F6EF | Main page background, large content sections, whitespace |
| --color-secondary (Sage Green) | #A8C5A0 | Supporting illustrations, secondary cards, small highlights, informational elements |
| --color-text (Charcoal) | #26332C | Headings, body text, descriptions, labels |
| --color-card (Soft Sage Mist) | #E8EDE5 | Card backgrounds |
| --color-surface (Pure White) | #FFFFFF | Cards, forms, product information, content surfaces |

Success / warning / danger / muted colours and **dark-mode values**: not defined in the brief — see prd.md §12 (Q14). Do not invent them.

### Usage by element
| Website element | Colour |
|---|---|
| Navbar | Warm Ivory (Forest Green typography) |
| Hero section | Deep Forest Green |
| Primary buttons | Solar Gold |
| Secondary buttons | Forest Green |
| Main backgrounds | Warm Ivory |
| Service cards | White / Soft Sage |
| Calculator | Forest Green + Ivory |
| Testimonials | Soft Sage Mist |
| Footer | Deep Forest Green |
| Icons and highlights | Solar Gold |

### Contrast rules
- Gold buttons use dark Forest Green or Charcoal text.
- Never green text on Sage Green.
- Body text highly readable; WCAG AA (4.5:1 for text) wherever applicable.
- Hover and focus states remain accessible.

### Typography
- **Manrope** (primary): main/hero/section/card headings, important statistics, calculator results, large numerical values. Weights 400, 500, 600, 700; 800 only for selected display elements. Numbers: Manrope SemiBold.
- **Inter** (secondary): body paragraphs, navigation, buttons, form fields, labels, FAQ content, blog text, descriptions, tables. Weights 400, 500, 600, 700.
- Use tabular numerals for financial figures and calculator results. No additional fonts without approval.
- Self-host variable font files where practical; provide fallback fonts; avoid unnecessary external font dependencies.
- Clear hierarchy, readable paragraph widths, consistent line heights.

| Element | Desktop | Mobile |
|---|---|---|
| Hero H1 | 56–68px | 36–42px |
| Page H1 | 44–56px | 32–38px |
| Section H2 | 36–44px | 28–34px |
| Card H3 | 22–26px | 20–24px |
| Body | 16–18px | 15–17px |
| Small text | 13–14px | 12–14px |
Starting tokens, not rigid rules; adapt to actual layouts.

### Spacing, radius, shadow
- --space-1 … --space-8 (4px steps).
- Radius: generally 10–14px (--radius-sm / -md / -lg within this range); avoid excessive radii.
- Flat UI, restrained shadows (--shadow-sm / -md).
- Generous whitespace; consistent container widths.

## 2. Global helpers (global.css)
Utility classes (.stack, .row, .card, .btn, .btn-primary …) defined once; styles only from tokens.css and global.css.

## 3. Components (components/ui) — reuse existing Momentum blocks first; create new only when necessary
| Component | Notes |
|---|---|
| Button | primary (Gold), secondary (Forest Green), ghost; states default, hover, focus, loading, disabled; subtle interaction |
| Input / form fields | labelled, validated, error text; reusable enquiry form system |
| Card | white / Soft Sage Mist; consistent heights |
| Navigation + dropdown + mobile menu | sticky behaviour; accessible |
| Footer | Forest Green |
| Hero | image handling with fixed dimensions |
| Service cards | image, description, benefits, Learn More |
| Benefits grid | icons Solar Gold, consistent icon style |
| Process timeline | 6 steps |
| Testimonials | carousel, Soft Sage Mist background |
| FAQ accordion | reusable dynamic block |
| CTA | |
| Enquiry form | |
| Solar calculator | Forest Green + Ivory; result panels Forest Green |
| Panel catalogue cards | search, filters, sort, enquiry action |
| Statistics | animated counters |
| Blog cards | |
| Contact section | |
Every list screen: loading skeleton, empty state, error state. Every component lists its loading, empty and error states.

## 4. Layout and responsive
Breakpoints 375 / 768 / 1024 / 1440. Mobile first, designed intentionally. Touch targets ≥ 44px. No horizontal scroll at 375px; wide content scrolls inside its own container. No overlapping text, no broken image ratios, consistent card heights.

## 5. Accessibility
Contrast 4.5:1 for text; every input labelled; keyboard reachable; visible focus; alt text required (enforced by the image component); accessible forms; reduced-motion support.

## 6. Images and media
- WebP/AVIF; lazy-load below the fold; prioritise hero; fixed dimensions; responsive image handling.
- Beautiful real photography preferred over generic stock illustrations.
- Hero: premium residential rooftop with solar panels, bright natural daylight, clean architectural photography.
- Panel images: actual product images per catalogue item, usage permission/licence required.
- Max sizes per slot, OG image 1200×630 template, alt-text guidance: to be set at implementation.

## 7. Animation guidelines
Professional and subtle: scroll-triggered section reveals; fade/slide transitions; subtle image parallax; card hover; animated counters; solar energy flow illustrations; smooth calculator result updates; testimonial carousel; sticky navigation transitions; subtle button interactions. Use existing animation dependencies; no large new library without reason; respect reduced-motion; never block content or interaction. Avoid excessive gradients, too many floating elements, glassmorphism, unnecessary animations, random icon styles.

## 8. Admin-editable settings
Existing in Momentum: theme tokens editable in Admin → Settings → Theme (stored in `site_setting.theme_tokens`, injected into :root, no redeploy; text colours must keep WCAG AA contrast); SEO fields per page in `seo_setting`; services, blog, FAQs, case studies via the admin. Changes apply without redeploy; changes are audit-logged (existing audit log).

## 9. Content and tone
Premium, clean, confident, approachable. Button wording as specified in PRD (e.g. "Calculate Your Solar Savings", "Get Free Consultation", "Enquire About This Panel"). Error messages: what happened + what to do. No unverified savings claims; calculator output labelled as estimate with disclaimer.

Gate check: no colour, size or font appears anywhere except section 1; every component lists loading/empty/error states.
