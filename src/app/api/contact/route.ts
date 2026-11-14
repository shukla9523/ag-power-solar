/**
 * Purpose: AG POWER unified enquiry submission endpoint (Contact form, Solar Calculator,
 * Panel Catalogue, Customer Service).
 * 
 * Features:
 * - Zod validation
 * - In-memory rate-limiting
 * - Optional Cloudflare Turnstile verification
 * - Bot honeypot protection
 * - Google Sheets lead synchronization
 * - Telegram Bot notification dispatch
 */

import { NextRequest, NextResponse, after } from "next/server"
import { z } from "zod"
import { LEAD_SOURCES } from "@lib/config/leads"
import { createLead, deliverLead } from "@lib/services/leads-service"
import { appendLeadToSheet } from "@lib/services/google-sheets"
import { sendTelegramNotification } from "@lib/services/telegram"
import { notifyAdmins } from "@lib/services/notifications"
import { clientIp, hashIp, rateLimit } from "@lib/util/rate-limit"

export const runtime = "nodejs"

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(20),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().max(5000).optional(),
  category: z.string().trim().max(50).optional(),
  service: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  pincode: z.string().trim().max(10).optional(),
  monthly_bill: z.string().trim().max(20).optional(),
  enquiry_type: z.string().trim().max(50).default("Contact"),
  source: z.string().default("contact"),
  sourcePage: z.string().trim().max(300).optional(),
  calculation_details: z.any().optional(),
  consent: z.boolean().default(true),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
  turnstileToken: z.string().max(4096).optional(),
})

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
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
  if (!secret) return true // Turnstile is optional unless configured
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
  const limit = rateLimit(`contact:${ip}`, 10, 10 * 60 * 1000)
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a few moments before trying again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    )
  }

  const raw = await req.json().catch(() => null)
  if (raw && typeof raw === "object" && (raw as Record<string, unknown>).website) {
    return NextResponse.json({ success: true }) // bot filled honeypot
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Please check your inputs" },
      { status: 400 }
    )
  }

  if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
    return NextResponse.json(
      { success: false, error: "Security verification failed. Please try again." },
      { status: 403 }
    )
  }

  const derivedEmail = parsed.data.email || `${parsed.data.phone.replace(/[^0-9]/g, "")}@agpower.in`
  const derivedSubject = parsed.data.subject || `AG POWER Enquiry: ${parsed.data.enquiry_type || "Solar"}`
  const derivedMessage = parsed.data.message || `Enquiry for ${parsed.data.service || parsed.data.category || "Solar Installation"}`

  try {
    const lead = await createLead(
      {
        name: parsed.data.name,
        email: derivedEmail,
        phone: parsed.data.phone,
        subject: derivedSubject,
        message: derivedMessage,
        source: (parsed.data.source as any) || "contact",
        sourcePage: parsed.data.sourcePage || "/contact",
      },
      await hashIp(ip),
      req.headers.get("user-agent")
    )

    // Schedule background asynchronous jobs without blocking response
    after(async () => {
      // 1. Google Sheets Append (with 13-field AG POWER structure)
      try {
        await appendLeadToSheet({
          id: lead.id,
          createdAt: lead.created_at,
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: derivedEmail,
          category: parsed.data.category || "General",
          service: parsed.data.service || "Solar Installation",
          city: parsed.data.city || "",
          monthlyBill: parsed.data.monthly_bill || "",
          sourcePage: parsed.data.sourcePage || "/contact",
          enquiryType: parsed.data.enquiry_type || "Contact",
          message: derivedMessage,
          status: "New",
        })
      } catch (sheetErr) {
        console.error("Google Sheets append failed:", sheetErr)
      }

      // 2. Telegram Bot Notification
      try {
        await sendTelegramNotification({
          enquiryId: lead.id,
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: derivedEmail,
          category: parsed.data.category || "General",
          service: parsed.data.service || "Solar Installation",
          city: parsed.data.city || "",
          monthlyBill: parsed.data.monthly_bill || "",
          enquiryType: parsed.data.enquiry_type || "Contact",
          sourcePage: parsed.data.sourcePage || "/contact",
          message: derivedMessage,
        })
      } catch (tgErr) {
        console.error("Telegram notification failed:", tgErr)
      }

      // 3. Fallback MailX / Admin Notifications
      try {
        await deliverLead(lead).catch(() => null)
        await notifyAdmins({
          type: "lead",
          title: "New AG POWER Enquiry",
          body: `${parsed.data.name} (${parsed.data.phone}) — ${derivedSubject}`,
          link: "/admin/leads",
        }).catch(() => null)
      } catch {}
    })

    return NextResponse.json({
      success: true,
      data: { leadId: lead.id, message: "Enquiry submitted successfully" },
    })
  } catch (error) {
    console.error("Enquiry submission error:", error)
    return NextResponse.json(
      { success: false, error: "We could not process your enquiry. Please call +91 98765 43210." },
      { status: 500 }
    )
  }
}
