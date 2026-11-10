/**
 * Purpose: one place that turns any uploaded image into an optimised WebP.
 *
 * Every image that enters the site (admin media library, external blog publisher, AI images,
 * images referenced by a newly published post) goes through here, so the site only ever
 * serves WebP. EXIF rotation is applied, metadata is stripped, very large images are scaled
 * down to 2000 px wide, and animated GIFs stay animated.
 */

import "server-only"
import sharp from "sharp"

export const WEBP_MAX_WIDTH = 2000

export interface WebpResult {
  buffer: Buffer
  width: number
  height: number
}

/** Converts PNG / JPEG / GIF / WebP bytes to WebP. Throws if the bytes are not an image. */
export async function toWebp(input: Uint8Array | Buffer, options: { maxWidth?: number; quality?: number } = {}): Promise<WebpResult> {
  const maxWidth = options.maxWidth ?? WEBP_MAX_WIDTH
  const source = Buffer.isBuffer(input) ? input : Buffer.from(input)
  const meta = await sharp(source, { animated: true }).metadata()
  const animated = (meta.pages || 1) > 1

  const { data, info } = await sharp(source, { animated })
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({
      quality: options.quality ?? (meta.hasAlpha ? 88 : 82),
      alphaQuality: 90,
      effort: 5,
      smartSubsample: true,
    })
    .toBuffer({ resolveWithObject: true })

  return { buffer: data, width: info.width, height: info.pageHeight || info.height }
}

/** "photo.final.PNG" → "photo.final.webp" */
export function webpName(name: string): string {
  return name.replace(/\.(png|jpe?g|gif|webp)$/i, "") + ".webp"
}
