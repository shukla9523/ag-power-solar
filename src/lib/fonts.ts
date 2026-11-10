/**
 * @file fonts.ts
 * @description Self-hosted brand fonts (no render-blocking Google Fonts request).
 *
 * The woff2 files come from the pinned @fontsource packages and are byte-identical to the files
 * Google Fonts served before (verified with `cmp`), so glyphs and metrics do not change.
 * `next/font/local` is used instead of `next/font/google` because the Google loader crashed on
 * Vercel (regex URL parsing) — local files need no network at build time.
 *
 * Each family mirrors the old Google CSS exactly:
 * - the same discrete weights (one @font-face per weight pointing at the same variable file), so
 *   weight matching (e.g. DM Sans `font-semibold` → 700) is unchanged;
 * - the same latin / latin-ext `unicode-range` split, so latin-ext glyphs only download when used.
 *
 * The generated CSS variables are set on <html> (`fontVariables`) and composed into the existing
 * tokens (--font-display, --font-ui, --font-body, --font-hand) in src/styles/globals.css, so the
 * `font-epilogue` / `font-outfit` / `font-mansalva` / `font-dmsans` classes keep working.
 * Cormorant Garamond was dropped: no element used it.
 */
import localFont from "next/font/local"

// unicode-range values are written inline: next/font only accepts literal option values.

// next/font requires literal arguments, so each call is written out in full.
// Latin faces carry the size-adjusted fallback and are preloaded; latin-ext faces are not.

const epilogueLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-wght-normal.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-epilogue-latin",
})

const epilogueLatinExt = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-ext-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-ext-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-ext-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-ext-wght-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/epilogue/files/epilogue-latin-ext-wght-normal.woff2", weight: "800", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-epilogue-latin-ext",
})

const outfitLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-outfit-latin",
})

const outfitLatinExt = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/outfit/files/outfit-latin-ext-wght-normal.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-outfit-latin-ext",
})

const dmSansLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-dm-sans-latin",
})

const dmSansLatinExt = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-ext-wght-normal.woff2", weight: "700", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-dm-sans-latin-ext",
})

const mansalvaLatin = localFont({
  src: "../../node_modules/@fontsource/mansalva/files/mansalva-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: false,
  adjustFontFallback: "Arial",
  variable: "--font-mansalva-latin",
})

const mansalvaLatinExt = localFont({
  src: "../../node_modules/@fontsource/mansalva/files/mansalva-latin-ext-400-normal.woff2",
  weight: "400",
  style: "normal",
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-mansalva-latin-ext",
})

/** Put on <html>: defines every --font-*-latin(-ext) variable used by the font tokens. */
export const fontVariables = [
  epilogueLatin,
  epilogueLatinExt,
  outfitLatin,
  outfitLatinExt,
  dmSansLatin,
  dmSansLatinExt,
  mansalvaLatin,
  mansalvaLatinExt,
]
  .map((font) => font.variable)
  .join(" ")

export type FontClass = {
  className: string
}

export const epilogue: FontClass = { className: "font-epilogue" }

export const outfit: FontClass = { className: "font-outfit" }

export const mansalva: FontClass = { className: "font-mansalva" }

export const dmSans: FontClass = { className: "font-dmsans" }
