/**
 * Purpose: generates the hero illustration for every service page (public/images/services/<slug>.webp).
 *
 * Each image is drawn as SVG in the website's own design language — brand pink (#e61e73),
 * navy (#0e2547), soft pink tints and white cards — with a service-specific Lucide icon and a
 * small product-style scene (ads chart, search results, video timeline …), then rendered with
 * sharp to 1200×630 WebP (matches the hero frame's 1200/630 aspect). No AI service or network
 * access is needed, so images are reproducible and can be regenerated after a brand change:
 *
 *   node scripts/generate-service-images.mjs            (all services)
 *   node scripts/generate-service-images.mjs seo-slug   (one service)
 */

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..")
const OUT_DIR = path.join(ROOT, "public", "images", "services")
const ICON_DIR = path.join(ROOT, "node_modules", "lucide-react", "dist", "esm", "icons")

// Brand palette (same values as src/styles/tokens.css)
const C = {
  brand: "#e61e73",
  brandDeep: "#c91863",
  brandSoft: "#ef6a99",
  tint: "#fff0f6",
  blush: "#fce7ed",
  navy: "#0e2547",
  navyLight: "#163b67",
  ink: "#111827",
  muted: "#94a3b8",
  line: "#e2e8f0",
  cloud: "#f3f4f6",
  white: "#ffffff",
  purple: "#9333ea",
  sky: "#99dcf8",
}
const FONT = "Arial, Helvetica, sans-serif"

const SERVICES = [
  { slug: "performance-marketing", label: "Performance Marketing", icon: "megaphone", scene: "ads", chips: ["Higher ROAS", "Lower CPA"] },
  { slug: "social-media-marketing", label: "Social Media", icon: "heart", scene: "social", chips: ["More reach", "Real engagement"] },
  { slug: "search-engine-optimization", label: "SEO · AEO · GEO", icon: "search", scene: "search", chips: ["Top rankings", "Cited by AI"] },
  { slug: "d2c-branding-scale-growth", label: "D2C Branding", icon: "gem", scene: "brand", chips: ["Brand system", "Built to scale"] },
  { slug: "conversion-rate-optimization", label: "Conversion Rate Optimization", icon: "mouse-pointer-click", scene: "funnel", chips: ["More conversions", "A/B tested"] },
  { slug: "script-copywriting", label: "Script & Copywriting", icon: "pen-tool", scene: "doc", chips: ["Hooks that sell", "Ad-ready copy"] },
  { slug: "strategy-consulting", label: "Growth Strategy", icon: "target", scene: "strategy", chips: ["Clear roadmap", "Measured growth"] },
  { slug: "web-app-development", label: "Web & App Development", icon: "code-xml", scene: "code", chips: ["Fast & scalable", "Core Web Vitals"] },
  { slug: "ai-automation", label: "AI Automation", icon: "workflow", scene: "workflow", chips: ["Hours saved", "Auto workflows"] },
  { slug: "ai-agentic-service", label: "AI Agents", icon: "bot", scene: "agent", chips: ["24/7 agents", "Real actions"] },
  { slug: "ai-video-generation", label: "AI Video Generation", icon: "sparkles", scene: "video", variant: "generate", chips: ["Ads in hours", "On-brand AI"] },
  { slug: "content-video-scripting", label: "Content & Video Scripting", icon: "clapperboard", scene: "doc", chips: ["Story-first", "Scroll-stopping"] },
  { slug: "video-editing", label: "Video Editing", icon: "film", scene: "video", chips: ["Retention edits", "Reels · YouTube"] },
  { slug: "ai-video-editing", label: "AI Video Editing", icon: "wand-sparkles", scene: "video", variant: "ai-edit", chips: ["AI-assisted", "Faster delivery"] },
  { slug: "podcast-editing", label: "Podcast Editing", icon: "mic", scene: "podcast", chips: ["Studio sound", "Video podcast"] },
  { slug: "motion-graphics", label: "Motion Graphics", icon: "shapes", scene: "motion", chips: ["2D / 3D", "Brand motion"] },
]

// ── Helpers ────────────────────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/** Reads a Lucide icon's SVG elements from lucide-react's ESM build. */
function lucide(name) {
  const file = path.join(ICON_DIR, `${name}.js`)
  if (!fs.existsSync(file)) throw new Error(`Lucide icon not found: ${name}`)
  const src = fs.readFileSync(file, "utf8")
  const body = src.slice(src.indexOf("__iconNode = [") + "__iconNode = ".length, src.indexOf("];", src.indexOf("__iconNode = [")) + 1)
  const nodes = Function(`"use strict"; return (${body})`)()
  return nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ")
      return `<${tag} ${a}/>`
    })
    .join("")
}

function icon(name, x, y, size, color, stroke = 2) {
  const s = size / 24
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${lucide(name)}</g>`
}

const rect = (x, y, w, h, r, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`
const text = (x, y, s, size, fill, weight = 700, anchor = "start") =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`

function chip(x, y, label, iconName) {
  const w = 54 + label.length * 11.5
  return `<g filter="url(#shadowSm)">${rect(x, y, w, 52, 26, C.white)}</g>
    <circle cx="${x + 26}" cy="${y + 26}" r="15" fill="${C.tint}"/>${icon(iconName, x + 17, y + 17, 18, C.brand, 2.4)}
    ${text(x + 50, y + 33, label, 19, C.navy, 700)}`
}

// ── Scenes (drawn inside the card area: x 360…1080, y 160…520) ─────────────────────────
const SCENES = {
  ads() {
    const bars = [90, 130, 120, 175, 210, 260]
    const out = bars.map((h, i) => rect(420 + i * 92, 480 - h, 56, h, 12, i === bars.length - 1 ? C.brand : i % 2 ? C.blush : C.tint)).join("")
    const pts = bars.map((h, i) => `${448 + i * 92},${470 - h}`).join(" ")
    return `${out}<polyline points="${pts}" fill="none" stroke="${C.navy}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      ${bars.map((h, i) => `<circle cx="${448 + i * 92}" cy="${470 - h}" r="7" fill="${C.white}" stroke="${C.navy}" stroke-width="4"/>`).join("")}
      ${rect(420, 186, 210, 58, 14, C.cloud)}${text(440, 213, "ROAS", 15, C.muted, 700)}${text(440, 236, "Trending up", 18, C.navy, 800)}
      ${icon("trending-up", 586, 200, 30, C.brand, 2.6)}`
  },
  social() {
    let out = ""
    for (let r = 0; r < 2; r++)
      for (let c = 0; c < 3; c++) {
        const x = 420 + c * 190
        const y = 196 + r * 160
        const hot = r === 0 && c === 1
        out += `${rect(x, y, 170, 140, 18, hot ? C.brand : c % 2 ? C.blush : C.tint)}
          ${icon(hot ? "play" : "image", x + 63, y + 40, 44, hot ? C.white : C.brandSoft, 2)}
          ${icon("heart", x + 14, y + 104, 22, hot ? C.white : C.brand, 2.4)}${rect(x + 44, y + 110, 60, 10, 5, hot ? "#ffffff88" : C.line)}`
      }
    return out
  },
  search() {
    let out = `${rect(420, 190, 600, 64, 32, C.cloud)}${icon("search", 444, 208, 28, C.navy, 2.6)}${rect(490, 216, 300, 12, 6, C.muted, 'opacity="0.5"')}`
    const rows = [
      [C.brand, "#1", true],
      [C.navy, "#2", false],
      [C.navy, "#3", false],
    ]
    rows.forEach(([col, rank, top], i) => {
      const y = 282 + i * 78
      out += `${rect(420, y, 600, 64, 16, top ? C.tint : C.white, `stroke="${top ? C.brand : C.line}" stroke-width="2"`)}
        ${rect(436, y + 14, 48, 36, 10, top ? C.brand : C.cloud)}${text(460, y + 39, rank, 18, top ? C.white : C.navy, 800, "middle")}
        ${rect(500, y + 16, top ? 300 : 260, 12, 6, top ? C.navy : C.muted, top ? "" : 'opacity="0.55"')}
        ${rect(500, y + 38, top ? 400 : 340, 10, 5, C.line)}`
      if (top) out += icon("sparkles", 975, y + 18, 28, C.brand, 2.4)
    })
    return out
  },
  brand() {
    const sw = [C.brand, C.navy, C.brandSoft, C.blush, C.sky]
    let out = sw.map((c, i) => `<circle cx="${470 + i * 92}" cy="236" r="36" fill="${c}" stroke="${C.white}" stroke-width="6"/>`).join("")
    out += `${rect(420, 300, 280, 190, 22, C.navy)}${text(560, 420, "Aa", 92, C.white, 800, "middle")}
      ${rect(724, 300, 296, 86, 22, C.tint)}${icon("gem", 744, 322, 42, C.brand, 2.4)}${rect(800, 330, 180, 12, 6, C.brand)}${rect(800, 352, 120, 10, 5, C.brandSoft)}
      ${rect(724, 404, 296, 86, 22, C.cloud)}${icon("package", 744, 426, 42, C.navy, 2.2)}${rect(800, 434, 170, 12, 6, C.navy)}${rect(800, 456, 110, 10, 5, C.muted)}`
    return out
  },
  funnel() {
    const levels = [
      [520, C.tint],
      [420, C.blush],
      [320, C.brandSoft],
      [220, C.brand],
    ]
    let out = levels
      .map(([w, col], i) => {
        const y = 196 + i * 76
        const x = 650 - w / 2
        return `<path d="M${x} ${y} h${w} l-50 62 h${-(w - 100)} z" fill="${col}"/>`
      })
      .join("")
    out += `${rect(860, 318, 160, 58, 16, C.navy)}${icon("shopping-cart", 878, 332, 30, C.white, 2.4)}${text(950, 354, "Buy", 20, C.white, 800, "middle")}`
    out += icon("mouse-pointer-2", 975, 360, 44, C.brand, 2.6)
    return out
  },
  doc() {
    let out = `${rect(420, 190, 420, 300, 20, C.white, `stroke="${C.line}" stroke-width="2"`)}`
    const widths = [300, 360, 250, 330, 210, 290]
    widths.forEach((w, i) => {
      const y = 222 + i * 42
      const hl = i === 1 || i === 4
      if (hl) out += rect(436, y - 12, w + 20, 30, 8, C.blush)
      out += rect(446, y, w, 10, 5, hl ? C.brand : i === 0 ? C.navy : C.muted, hl || i === 0 ? "" : 'opacity="0.5"')
    })
    out += `${rect(866, 190, 154, 154, 24, C.brand)}${text(943, 300, "“", 140, C.white, 800, "middle")}
      ${rect(866, 366, 154, 124, 24, C.navy)}${icon("pen-line", 916, 400, 54, C.white, 2.2)}`
    return out
  },
  strategy() {
    let out = [110, 80, 50, 20].map((r, i) => `<circle cx="560" cy="342" r="${r * 1.3}" fill="${i % 2 ? C.white : i === 3 ? C.brand : C.tint}" stroke="${C.brand}" stroke-width="${i === 3 ? 0 : 3}"/>`).join("")
    out += `<path d="M560 342 L700 230" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/>${icon("arrow-up-right", 684, 208, 40, C.navy, 3)}`
    const steps = ["Audit", "Plan", "Launch", "Scale"]
    steps.forEach((s, i) => {
      const y = 210 + i * 72
      out += `<circle cx="780" cy="${y + 22}" r="14" fill="${i === 3 ? C.brand : C.navy}"/>
        ${i < 3 ? `<line x1="780" y1="${y + 36}" x2="780" y2="${y + 80}" stroke="${C.line}" stroke-width="4"/>` : ""}
        ${rect(810, y, 210, 44, 12, i === 3 ? C.tint : C.cloud)}${text(830, y + 29, s, 19, C.navy, 700)}`
    })
    return out
  },
  code() {
    let out = `${rect(420, 190, 600, 300, 20, C.navy)}${rect(420, 190, 600, 44, 20, C.navyLight)}${rect(420, 214, 600, 20, 0, C.navyLight)}
      <circle cx="446" cy="212" r="7" fill="#ff5f57"/><circle cx="470" cy="212" r="7" fill="#febc2e"/><circle cx="494" cy="212" r="7" fill="#28c840"/>`
    const lines = [
      [40, 140, C.brandSoft],
      [70, 220, C.sky],
      [70, 170, C.white],
      [100, 260, C.brandSoft],
      [70, 120, C.sky],
      [40, 90, C.white],
    ]
    lines.forEach(([indent, w, col], i) => {
      out += rect(450 + indent, 262 + i * 34, w, 12, 6, col, col === C.white ? 'opacity="0.55"' : "")
    })
    out += `${rect(860, 300, 130, 170, 22, C.white, `stroke="${C.line}" stroke-width="3"`)}${rect(878, 324, 94, 70, 10, C.tint)}
      ${icon("zap", 905, 339, 40, C.brand, 2.6)}${rect(878, 408, 94, 10, 5, C.navy)}${rect(878, 428, 64, 10, 5, C.muted)}`
    return out
  },
  workflow() {
    const nodes = [
      [440, 220, "webhook", C.navy],
      [440, 400, "mail", C.navy],
      [660, 310, "cpu", C.brand],
      [880, 220, "database", C.navy],
      [880, 400, "message-square", C.navy],
    ]
    const links = [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
    ]
    let out = links
      .map(([a, b]) => {
        const [x1, y1] = nodes[a]
        const [x2, y2] = nodes[b]
        return `<path d="M${x1 + 110} ${y1 + 40} C ${x1 + 170} ${y1 + 40}, ${x2 - 60} ${y2 + 40}, ${x2} ${y2 + 40}" fill="none" stroke="${C.brandSoft}" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>`
      })
      .join("")
    out += nodes
      .map(([x, y, ic, col], i) => `${rect(x, y, 110, 80, 22, i === 2 ? C.brand : C.white, i === 2 ? "" : `stroke="${C.line}" stroke-width="3"`)}${icon(ic, x + 35, y + 20, 40, i === 2 ? C.white : col, 2.2)}`)
      .join("")
    return out
  },
  agent() {
    return `${rect(420, 196, 380, 70, 22, C.cloud)}${rect(444, 220, 240, 12, 6, C.muted, 'opacity="0.6"')}${rect(444, 240, 160, 10, 5, C.line)}
      ${rect(560, 290, 460, 92, 22, C.brand)}${rect(588, 316, 330, 12, 6, C.white)}${rect(588, 338, 250, 12, 6, "#ffffffaa")}${icon("bot", 952, 314, 44, C.white, 2.2)}
      ${rect(420, 406, 270, 84, 20, C.white, `stroke="${C.line}" stroke-width="3"`)}${icon("database", 440, 428, 40, C.navy, 2.2)}${rect(496, 436, 160, 12, 6, C.navy)}${rect(496, 456, 110, 10, 5, C.muted)}
      ${rect(712, 406, 308, 84, 20, C.white, `stroke="${C.line}" stroke-width="3"`)}${icon("circle-check", 732, 428, 40, C.brand, 2.4)}${rect(788, 436, 190, 12, 6, C.navy)}${rect(788, 456, 130, 10, 5, C.muted)}`
  },
  video(variant) {
    let out = `${rect(420, 190, 600, 210, 20, C.navy)}<circle cx="720" cy="295" r="46" fill="${C.brand}"/>
      <path d="M708 272 L746 295 L708 318 Z" fill="${C.white}"/>${rect(440, 372, 560, 8, 4, C.navyLight)}${rect(440, 372, 230, 8, 4, C.brand)}`
    if (variant === "generate") {
      // Prompt box over the player: text-to-video
      out += `${rect(440, 210, 330, 44, 14, C.navyLight)}${icon("sparkles", 454, 220, 24, C.brandSoft, 2.4)}${rect(490, 228, 220, 10, 5, C.white, 'opacity="0.6"')}`
    }
    if (variant === "ai-edit") {
      // AI badge in the player: automatic cuts
      out += `${rect(880, 206, 120, 40, 20, C.brand)}${icon("wand-sparkles", 894, 214, 24, C.white, 2.4)}${text(956, 232, "Auto", 16, C.white, 800, "middle")}`
    }
    const tracks = [
      [[0, 140, C.brand], [150, 120, C.brandSoft], [280, 170, C.brand], [460, 100, C.brandSoft]],
      [[0, 260, C.navy], [270, 200, C.navyLight], [480, 80, C.navy]],
    ]
    tracks.forEach((clips, t) => {
      clips.forEach(([x, w, col]) => (out += rect(440 + x, 420 + t * 40, w, 28, 8, col)))
    })
    out += `<line x1="670" y1="410" x2="670" y2="496" stroke="${C.ink}" stroke-width="4"/><circle cx="670" cy="410" r="8" fill="${C.ink}"/>`
    return out
  },
  podcast() {
    let out = `${rect(420, 196, 170, 290, 30, C.brand)}${icon("mic", 455, 255, 100, C.white, 1.8)}${rect(460, 420, 90, 12, 6, "#ffffffaa")}`
    const amps = [30, 60, 90, 50, 120, 80, 140, 70, 110, 40, 95, 130, 60, 85, 45, 100, 70, 35]
    amps.forEach((a, i) => {
      out += rect(626 + i * 22, 340 - a / 2, 12, a, 6, i % 3 === 0 ? C.brand : i % 3 === 1 ? C.navy : C.brandSoft)
    })
    out += `${rect(626, 440, 394, 46, 14, C.cloud)}${icon("headphones", 642, 450, 26, C.navy, 2.4)}${rect(682, 459, 200, 10, 5, C.muted, 'opacity="0.6"')}`
    return out
  },
  motion() {
    return `<path d="M440 470 C 560 200, 760 520, 980 230" fill="none" stroke="${C.blush}" stroke-width="12" stroke-linecap="round"/>
      <path d="M440 470 C 560 200, 760 520, 980 230" fill="none" stroke="${C.brand}" stroke-width="4" stroke-dasharray="4 14" stroke-linecap="round"/>
      <circle cx="470" cy="420" r="40" fill="${C.tint}" stroke="${C.brand}" stroke-width="4"/>
      ${rect(640, 300, 90, 90, 22, C.brandSoft, 'transform="rotate(18 685 345)"')}
      <polygon points="940,180 1010,300 870,300" fill="${C.navy}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${520 + i * 110}" y="492" width="16" height="16" rx="3" fill="${i === 2 ? C.brand : C.navy}" transform="rotate(45 ${528 + i * 110} 500)"/>`).join("")}
      <line x1="460" y1="500" x2="1000" y2="500" stroke="${C.line}" stroke-width="3"/>`
  },
}

// ── Composition ────────────────────────────────────────────────────────────────────────
function compose(service) {
  const scene = SCENES[service.scene](service.variant)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${C.tint}"/></linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.brand}"/><stop offset="1" stop-color="${C.brandDeep}"/></linearGradient>
    <radialGradient id="blobPink" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.brand}" stop-opacity="0.22"/><stop offset="1" stop-color="${C.brand}" stop-opacity="0"/></radialGradient>
    <radialGradient id="blobNavy" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${C.navy}" stop-opacity="0.12"/><stop offset="1" stop-color="${C.navy}" stop-opacity="0"/></radialGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="${C.navy}" opacity="0.08"/></pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="${C.navy}" flood-opacity="0.14"/></filter>
    <filter id="shadowSm" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${C.navy}" flood-opacity="0.16"/></filter>
    <filter id="shadowPink" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="${C.brand}" flood-opacity="0.35"/></filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="1080" cy="80" r="300" fill="url(#blobPink)"/>
  <circle cx="120" cy="600" r="320" fill="url(#blobNavy)"/>

  <g filter="url(#shadow)">${rect(330, 110, 760, 430, 30, C.white)}</g>
  ${rect(330, 110, 760, 430, 30, "none", `stroke="${C.line}" stroke-width="2"`)}
  <circle cx="366" cy="144" r="7" fill="${C.line}"/><circle cx="390" cy="144" r="7" fill="${C.line}"/><circle cx="414" cy="144" r="7" fill="${C.line}"/>
  ${rect(842, 128, 224, 32, 16, C.tint)}${text(954, 150, service.label.length > 20 ? service.label.split(" ")[0] : service.label, 15, C.brand, 800, "middle")}
  ${scene}

  <g filter="url(#shadowPink)">${rect(84, 196, 210, 210, 48, "url(#tile)")}</g>
  ${icon(service.icon, 129, 241, 120, C.white, 1.9)}

  ${chip(110, 452, service.chips[0], "trending-up")}
  ${chip(890, 486, service.chips[1], "circle-check")}

  <circle cx="1118" cy="584" r="18" fill="${C.brand}"/>${text(1118, 591, "m", 20, C.white, 800, "middle")}
</svg>`
}

async function main() {
  const only = process.argv[2]
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const list = only ? SERVICES.filter((s) => s.slug === only) : SERVICES
  if (!list.length) throw new Error(`Unknown service slug: ${only}`)
  for (const service of list) {
    const svg = compose(service)
    const out = path.join(OUT_DIR, `${service.slug}.webp`)
    await sharp(Buffer.from(svg), { density: 144 }).resize(1200, 630).webp({ quality: 90 }).toFile(out)
    process.stdout.write(`✓ ${path.relative(ROOT, out)}\n`)
  }
  // Manifest read by src/lib/data/services.ts so pages know which slugs have a hero image.
  const generated = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".webp"))
    .map((f) => f.slice(0, -".webp".length))
    .sort()
  fs.writeFileSync(path.join(ROOT, "src", "lib", "data", "service-images.json"), `${JSON.stringify(generated, null, 2)}\n`)
}

main().catch((err) => {
  process.stderr.write(`${err.stack || err}\n`)
  process.exit(1)
})
