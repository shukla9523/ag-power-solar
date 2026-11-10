/**
 * Purpose: daily Vercel Cron ping that runs one tiny query so the Supabase project never
 * pauses for inactivity. Bearer CRON_SECRET required. Exceptions notify admins (runCronJob).
 */
import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { isCronRequest } from "@lib/util/api-key"
import { fail, ok, unauthorized } from "@lib/util/api-response"
import { runCronJob } from "../cron/_lib/run-job"

export async function GET(req: NextRequest) {
  return runCronJob("Database keep-alive", async () => {
    if (!isCronRequest(req)) return unauthorized()
    const { error } = await supabaseAdmin.from("site_setting").select("id", { head: true, count: "exact" }).limit(1)
    const timestamp = new Date().toISOString()
    return error ? fail("Database did not respond", "UNAVAILABLE", 503, { ok: false, timestamp }) : ok({ ok: true, timestamp })
  })
}
