/**
 * @file fonts.ts
 * @description Self-hosted brand fonts for AG POWER: Manrope (headings, numbers) + Inter (body, UI).
 *
 * Uses @fontsource-variable packages loaded locally via next/font/local for zero external network requests.
 * Backward compatible exports preserve epilogue / outfit / dmSans aliases mapping to Manrope / Inter.
 */
import localFont from "next/font/local"

const manropeLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-manrope-latin",
})

const manropeLatinExt = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-manrope-latin-ext",
})

const interLatin = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" }],
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  variable: "--font-inter-latin",
})

const interLatinExt = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF" }],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-inter-latin-ext",
})

/** Put on <html>: defines every --font-*-latin(-ext) variable used by the font tokens. */
export const fontVariables = [
  manropeLatin,
  manropeLatinExt,
  interLatin,
  interLatinExt,
]
  .map((font) => font.variable)
  .join(" ")

export type FontClass = {
  className: string
}

export const manrope: FontClass = { className: "font-manrope" }
export const inter: FontClass = { className: "font-inter" }

// Aliases for backward-compatibility with existing Momentum code
export const epilogue: FontClass = { className: "font-manrope" }
export const outfit: FontClass = { className: "font-inter" }
export const mansalva: FontClass = { className: "font-inter" }
export const dmSans: FontClass = { className: "font-inter" }
