/**
 * Purpose: monthly Vercel Cron (vercel.json, "0 0 1 * *") — fill EMPTY meta fields on every
 * page, then generate missing images. Authenticated with Bearer CRON_SECRET.
 * Failures notify admins and return a generic 500 (runCronJob).
 */

import { NextRequest } from "next/server"
import { isCronRequest } from "@lib/util/api-key"
import { AiSeoService } from "@lib/services/ai-seo-service"
import { ImageFillService } from "@lib/services/image-fill-service"
import { ok, unauthorized } from "@lib/util/api-response"
import { runCronJob } from "../_lib/run-job"

export const maxDuration = 300

export async function GET(req: NextRequest) {
  return runCronJob("Monthly SEO and image fill", async () => {
    if (!isCronRequest(req)) return unauthorized()

    const seo = await AiSeoService.runAutoFillJob({ limit: 200, trigger: "cron" })
    const images = await ImageFillService.run({ limit: 10, trigger: "cron" })
    return ok({ seo, images })
  })
}
