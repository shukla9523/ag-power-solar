/**
 * Purpose: admin-editable theme tokens (Admin → Settings → Theme).
 *
 * Defaults mirror src/styles/tokens.css. Overrides are stored in site_setting.theme_tokens
 * as { "brand": "#e61e73", ... } and injected into :root by the root layout, so colours change
 * without a redeploy. Only listed tokens and valid 6-digit hex values are accepted, and text
 * colours must keep WCAG AA contrast (4.5:1) on white.
 */

export interface ThemeTokenDef {
  key: string
  label: string
  group: "Brand" | "Text" | "Surfaces" | "EDITZ" | "Admin"
  default: string
  /** Used as text on white — contrast is enforced. */
  isText?: boolean
}

export const THEME_TOKENS: ThemeTokenDef[] = [
  { key: "brand", label: "Brand Forest Green (primary)", group: "Brand", default: "#173f32", isText: true },
  { key: "brand-hover", label: "Brand hover", group: "Brand", default: "#113026" },
  { key: "brand-tint", label: "Brand tint background", group: "Brand", default: "#f7f6ef" },
  { key: "navy", label: "Forest Green (headings, dark sections)", group: "Brand", default: "#173f32", isText: true },
  { key: "accent-gold", label: "Solar Gold (CTAs, accents)", group: "Brand", default: "#e9b949", isText: false },
  { key: "ink", label: "Darkest text", group: "Text", default: "#26332c", isText: true },
  { key: "charcoal", label: "Body text", group: "Text", default: "#26332c", isText: true },
  { key: "graphite", label: "Secondary text", group: "Text", default: "#506158", isText: true },
  { key: "cloud", label: "Page background", group: "Surfaces", default: "#f7f6ef" },
  { key: "field", label: "Input background", group: "Surfaces", default: "#ffffff" },
  { key: "sage", label: "Sage Green", group: "Brand", default: "#a8c5a0" },
  { key: "admin-bg", label: "Admin background", group: "Admin", default: "#0b0f17" },
  { key: "admin-panel", label: "Admin panels", group: "Admin", default: "#182337" },
]

const HEX = /^#[0-9a-f]{6}$/i

export function hexToChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastOnWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05)
}

/** Returns only valid overrides, or the first validation error. */
export function validateThemeTokens(input: unknown): { tokens: Record<string, string> } | { error: string } {
  if (!input || typeof input !== "object") return { tokens: {} }
  const out: Record<string, string> = {}
  for (const [key, raw] of Object.entries(input as Record<string, unknown>)) {
    const def = THEME_TOKENS.find((t) => t.key === key)
    if (!def) continue
    const value = String(raw || "").trim().toLowerCase()
    if (!value || value === def.default) continue
    if (!HEX.test(value)) return { error: `${def.label}: use a 6-digit hex colour like #e61e73` }
    if (def.isText && contrastOnWhite(value) < 4.5) {
      return { error: `${def.label}: contrast ${contrastOnWhite(value).toFixed(2)}:1 on white is below the 4.5:1 minimum` }
    }
    out[key] = value
  }
  return { tokens: out }
}

/** CSS injected into <head>; empty when there are no overrides. */
export function buildThemeCss(overrides: unknown): string {
  const result = validateThemeTokens(overrides)
  if ("error" in result) return ""
  const lines = Object.entries(result.tokens).map(([k, v]) => `--color-${k}:${hexToChannels(v)};`)
  return lines.length ? `:root{${lines.join("")}}` : ""
}
