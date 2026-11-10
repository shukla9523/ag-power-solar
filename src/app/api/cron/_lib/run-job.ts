/**
 * Purpose: shared failure handling for scheduled jobs (review item C7).
 * Runs a cron handler body; if it throws, the admins get a "Scheduled job failed"
 * notification (job name + short reason) and the caller gets a generic 500 JSON body.
 * The error text is never returned to the HTTP client.
 */
import "server-only"
import { notifyAdmins } from "@lib/services/notifications"
import { serverError } from "@lib/util/api-response"

function shortReason(error: unknown): string {
  const text = error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error"
  return text.replace(/\s+/g, " ").trim().slice(0, 200) || "Unknown error"
}

export async function runCronJob(name: string, job: () => Promise<Response>): Promise<Response> {
  try {
    return await job()
  } catch (error) {
    const reason = shortReason(error)
    console.error(`[cron:${name}] failed: ${reason}`)
    await notifyAdmins({ type: "system", title: "Scheduled job failed", body: `${name}: ${reason}`, link: "/admin" }).catch(
      () => undefined
    )
    return serverError("Scheduled job failed")
  }
}
