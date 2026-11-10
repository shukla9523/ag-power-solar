/**
 * Purpose: daily Vercel Cron — retry failed sheet/email deliveries and delete leads past
 * the retention window. Bearer CRON_SECRET required. Failures notify admins (runCronJob).
 */
import { NextRequest } from "next/server"
import { isCronRequest } from "@lib/util/api-key"
import { retryAndCleanLeads } from "@lib/services/leads-service"
import { ok, unauthorized } from "@lib/util/api-response"
import { runCronJob } from "../_lib/run-job"

export const maxDuration = 120

export async function GET(req: NextRequest) {
  return runCronJob("Lead delivery retry", async () => {
    if (!isCronRequest(req)) return unauthorized()
    return ok({ ...(await retryAndCleanLeads()) })
  })
}
