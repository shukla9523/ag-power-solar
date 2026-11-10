/**
 * Asset guard: every local image / video path referenced in the code must exist in public/,
 * and site images must be WebP (except the formats other systems require: social share
 * cards, favicons and app icons). Also checks the WebP converter used for every upload.
 */
import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import { toWebp, webpName } from "../util/to-webp"

const ROOT = path.resolve(__dirname, "../../..")
const PUBLIC = path.join(ROOT, "public")
const SRC = path.join(ROOT, "src")

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? walk(full) : [full]
  })
}

const sourceFiles = walk(SRC).filter((f) => /\.(tsx?|css)$/.test(f) && !f.includes("__tests__"))
const ASSET_REF = /["'`(](\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|gif|webp|avif|svg|mp4|webm|ico))(?=["'`)?#])/g
// Formats kept on purpose (share cards, icons, schema logo kept for external consumers).
const NON_WEBP_ALLOWED = [/^\/og\//, /^\/favicon/, /^\/android-chrome-/, /^\/apple-touch-icon/, /^\/opengraph-image/, /^\/twitter-image/]

describe("public assets", () => {
  const refs = new Map<string, string>()
  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8")
    for (const m of Array.from(text.matchAll(ASSET_REF))) {
      if (m[1].startsWith("//")) continue
      refs.set(m[1], path.relative(ROOT, file))
    }
  }
  // Template paths built from a slug are checked separately below.
  const literalRefs = Array.from(refs.entries()).filter(([p]) => !p.includes("${"))

  it("finds asset references to check", () => {
    expect(literalRefs.length).toBeGreaterThan(10)
  })

  it("every referenced image / video exists in public/ (no 404s)", () => {
    const missing = literalRefs
      .filter(([p]) => !fs.existsSync(path.join(PUBLIC, p)) && !fs.existsSync(path.join(SRC, "app", p)))
      .map(([p, f]) => `${p} (in ${f})`)
    expect(missing).toEqual([])
  })

  it("site images referenced in code are WebP (except share cards / icons)", () => {
    const nonWebp = literalRefs
      .filter(([p]) => /\.(png|jpe?g|gif)$/i.test(p) && !NON_WEBP_ALLOWED.some((re) => re.test(p)))
      .map(([p, f]) => `${p} (in ${f})`)
    expect(nonWebp).toEqual([])
  })

  it("every service has a generated WebP hero image", () => {
    const slugs = JSON.parse(fs.readFileSync(path.join(SRC, "lib/data/service-images.json"), "utf8")) as string[]
    for (const slug of slugs) expect(fs.existsSync(path.join(PUBLIC, "images/services", `${slug}.webp`))).toBe(true)
  })

  it("the web manifest icons exist", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(PUBLIC, "site.webmanifest"), "utf8")) as { icons: { src: string }[] }
    for (const icon of manifest.icons) expect(fs.existsSync(path.join(PUBLIC, icon.src))).toBe(true)
  })
})

describe("toWebp (used for every upload)", () => {
  it("converts PNG to WebP and keeps transparency", async () => {
    const png = await sharp({ create: { width: 64, height: 32, channels: 4, background: { r: 230, g: 30, b: 115, alpha: 0.5 } } }).png().toBuffer()
    const out = await toWebp(png)
    const meta = await sharp(out.buffer).metadata()
    expect(meta.format).toBe("webp")
    expect(meta.hasAlpha).toBe(true)
    expect([out.width, out.height]).toEqual([64, 32])
  })

  it("converts JPEG to WebP and scales very wide images down to 2000 px", async () => {
    const jpg = await sharp({ create: { width: 3000, height: 1000, channels: 3, background: "#0e2547" } }).jpeg().toBuffer()
    const out = await toWebp(jpg)
    expect((await sharp(out.buffer).metadata()).format).toBe("webp")
    expect(out.width).toBe(2000)
  })

  it("never upscales small images", async () => {
    const small = await sharp({ create: { width: 120, height: 80, channels: 3, background: "#ffffff" } }).png().toBuffer()
    expect((await toWebp(small)).width).toBe(120)
  })

  it("rejects non-images", async () => {
    await expect(toWebp(Buffer.from("<svg><script/></svg>"))).rejects.toThrow()
  })

  it("renames files to .webp", () => {
    expect(webpName("Hero Photo.PNG")).toBe("Hero Photo.webp")
    expect(webpName("a/b/c.jpeg")).toBe("a/b/c.webp")
  })
})
