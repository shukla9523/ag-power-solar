/**
 * Purpose: converts every PNG / JPG image in public/ to optimised WebP, rewrites every
 * reference in src/ to the new .webp path, and removes the old files.
 *
 * Kept as PNG / JPG on purpose (formats other systems require):
 *   - public/og/**, src/app/opengraph-image.jpg, twitter-image.jpg  → social share cards
 *   - favicon*, android-chrome-*, apple-touch-icon*                 → browser / OS icons
 *   - logo.png, mommantum_logo.png originals stay as well (may be referenced from the database
 *     or external tools), but the code uses their .webp versions.
 * Also generates the PWA / Apple icons the web manifest needs.
 *
 *   node scripts/convert-images-to-webp.mjs            (convert + rewrite + delete originals)
 *   node scripts/convert-images-to-webp.mjs --dry-run  (report only)
 */

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..")
const PUBLIC = path.join(ROOT, "public")
const SRC = path.join(ROOT, "src")
const DRY = process.argv.includes("--dry-run")

const KEEP_FORMAT = [/^og\//, /^favicon/i, /^android-chrome-/i, /^apple-touch-icon/i, /^mstile-/i]
const KEEP_ORIGINAL_FILE = new Set(["logo.png", "mommantum_logo.png"])
const UNUSED_DUPLICATES = ["favicon1.png", "faviconn.png"] // byte-identical / unused copies of favicon.png

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? walk(full) : [full]
  })
}

const rel = (full, base) => path.relative(base, full).split(path.sep).join("/")
const kb = (n) => `${(n / 1024).toFixed(0)} KB`

async function convert(file) {
  const input = fs.readFileSync(file)
  const meta = await sharp(input).metadata()
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp")
  const buffer = await sharp(input)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: meta.hasAlpha ? 88 : 80, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toBuffer()
  if (!DRY) fs.writeFileSync(out, buffer)
  return { out, before: input.length, after: buffer.length }
}

async function makeIcons() {
  const source = path.join(PUBLIC, "favicon.png")
  if (!fs.existsSync(source)) return
  const icons = [
    ["android-chrome-192x192.png", 192],
    ["android-chrome-512x512.png", 512],
    ["apple-touch-icon.png", 180],
  ]
  for (const [name, size] of icons) {
    if (!DRY) await sharp(source).resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(path.join(PUBLIC, name))
  }
  // favicon.png itself was 900 KB; a 512 px PNG is all browsers need.
  if (!DRY) {
    const small = await sharp(source).resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer()
    fs.writeFileSync(source, small)
  }
  const manifest = {
    name: "Mommantum",
    short_name: "Mommantum",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  }
  if (!DRY) fs.writeFileSync(path.join(PUBLIC, "site.webmanifest"), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log("✓ icons: android-chrome 192/512, apple-touch-icon 180, favicon.png → 512 px, manifest name set")
}

async function main() {
  const images = walk(PUBLIC).filter((f) => /\.(png|jpe?g)$/i.test(f))
  const sourceFiles = walk(SRC).filter((f) => /\.(tsx?|css|json|mjs)$/.test(f))
  let saved = 0
  const converted = []

  for (const file of images) {
    const r = rel(file, PUBLIC)
    if (KEEP_FORMAT.some((re) => re.test(r)) || UNUSED_DUPLICATES.includes(r)) continue
    const { out, before, after } = await convert(file)
    saved += before - after
    converted.push({ from: `/${r}`, to: `/${rel(out, PUBLIC)}`, file, keepOriginal: KEEP_ORIGINAL_FILE.has(r) })
    console.log(`✓ /${r} ${kb(before)} → ${kb(after)}`)
  }

  // Rewrite references in src/ (exact path strings only).
  let rewrites = 0
  for (const src of sourceFiles) {
    let text = fs.readFileSync(src, "utf8")
    const before = text
    for (const { from, to } of converted) {
      const re = new RegExp(`(["'\`(])${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=["'\`)?#])`, "g")
      text = text.replace(re, `$1${to}`)
    }
    if (text !== before) {
      rewrites++
      if (!DRY) fs.writeFileSync(src, text)
      console.log(`↻ ${rel(src, ROOT)}`)
    }
  }

  // Remove originals that are no longer referenced (and the unused duplicates).
  for (const { from, file, keepOriginal } of converted) {
    if (keepOriginal) continue
    const stillUsed = sourceFiles.some((s) => fs.readFileSync(s, "utf8").includes(from))
    if (!stillUsed && !DRY) fs.unlinkSync(file)
  }
  for (const dup of UNUSED_DUPLICATES) {
    const full = path.join(PUBLIC, dup)
    if (fs.existsSync(full) && !DRY) fs.unlinkSync(full)
  }

  await makeIcons()
  console.log(`\n${converted.length} images converted, ${rewrites} source files updated, ${kb(saved)} saved${DRY ? " (dry run)" : ""}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
