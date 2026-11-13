/**
 * Purpose: public contact-form endpoint (contact page, EDITZ, Blog AI).
 * Zod validation, honeypot, per-IP rate limit (5 per 10 min), optional Cloudflare
 * Turnstile, DPDP consent. The lead is saved first; sheet + emails run in the background.
 */

import { NextRequest, NextResponse, after } from "next/server"
import { z } from "zod"
import { LEAD_SOURCES } from "@lib/config/leads"
import { createLead, deliverLead } from "@lib/services/leads-service"
import { notifyAdmins } from "@lib/services/notifications"
import { clientIp, hashIp, rateLimit } from "@lib/util/rate-limit"

export const runtime = "nodejs"

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(254),
  phone: z.string().trim().max(20).regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Please add a subject").max(150),
  message: z.string().trim().min(10, "Please tell us a little more").max(5000),
  source: z.enum(LEAD_SOURCES).default("contact"),
  sourcePage: z.string().trim().max(300).optional(),
  consent: z.literal(true, { message: "Please accept the privacy notice" }),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot: must stay empty
  turnstileToken: z.string().max(4096).optional(),
})

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  // Allow local development and testing environments without Turnstile token
  const isLocal =
    process.env.NODE_ENV !== "production" ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "::ffff:127.0.0.1" ||
    ip.includes("localhost")
  if (isLocal && !token) {
    return true
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true // Turnstile is optional; enable by setting both Turnstile keys
  if (!token) return false
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    })
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  const raw = await req.json().catch(() => null)
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).website) {
    return NextResponse.json({ success: true }) // bot filled the honeypot: pretend success
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Please check the form" },
      { status: 400 }
    )
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json({ success: false, error: "Verification failed. Please try again." }, { status: 403 })
  }

  try {
    const lead = await createLead(
      {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
        source: parsed.data.source,
        sourcePage: parsed.data.sourcePage,
      },
      await hashIp(ip),
      req.headers.get("user-agent")
    )

    after(async () => {
      // The lead is saved; delivery sends Google Sheet webhook & MailX confirmation email
      try {
        await deliverLead(lead)
      } catch (err) {
        console.error("Contact lead delivery error:", err)
      }
      try {
        await notifyAdmins({
          type: "lead",
          title: "New lead",
          body: `${lead.name} (${lead.email}) — ${lead.subject} [${lead.source}]`,
          link: "/admin/leads",
        })
      } catch {
        // Notification error safe to ignore
      }
    })

    return NextResponse.json({ success: true, data: { leadId: lead.id } })
  } catch {
    return NextResponse.json(
      { success: false, error: "We could not send your message right now. Please email us instead." },
      { status: 500 }
    )
  }
}
