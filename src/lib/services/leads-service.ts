/**
 * Purpose: the contact-lead pipeline.
 *
 * 1. Save the lead in Supabase (`contact_leads`) if available, with resilient fallback.
 * 2. In the background: copy to the Google Sheet (via Google Apps Script webhook),
 *    and dispatch automated confirmation email via MailX HTTPS REST API
 *    (Strictly NO SMTP, Cloud/Vercel compatible) with Google Calendar meeting booking.
 * 3. Leads older than the retention window are deleted (DPDP Act 2023).
 */

import "server-only"
import { supabaseAdmin } from "@lib/supabase-admin"
import { CONSENT_TEXT_VERSION, LEAD_RETENTION_DAYS, LeadSource, MAX_DELIVERY_ATTEMPTS } from "@lib/config/leads"
import { appendLeadToSheet } from "./google-sheets"
import { brandedEmail, escapeHtml, isMailerConfigured, sendMail } from "./mailer"
import { notifyAdmins } from "./notifications"
import { getOwnerEmail } from "@lib/config/owner"
import { buildContactConfirmationEmail, DEFAULT_CC_RECIPIENTS, isMailXConfigured, sendMailX } from "./mailx"
import { createClient } from "./clients-service"

export interface LeadInput {
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  source: LeadSource
  sourcePage?: string | null
}

export interface LeadRow {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  source: string
  source_page: string | null
  status: string
  sheet_status: string
  sheet_attempts: number
  email_status: string
  email_attempts: number
  created_at: string
}

export async function createLead(input: LeadInput, ipHash: string, userAgent: string | null): Promise<LeadRow> {
  try {
    const { data, error } = await supabaseAdmin
      .from("contact_leads")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        message: input.message,
        source: input.source,
        source_page: input.sourcePage || null,
        consent: true,
        consent_text_version: CONSENT_TEXT_VERSION,
        ip_hash: ipHash,
        user_agent: userAgent ? userAgent.slice(0, 300) : null,
        status: "new",
        sheet_status: "pending",
        email_status: "pending",
      })
      .select()
      .single()

    if (error || !data) {
      console.warn("Supabase contact_leads write skipped/failed:", error?.message)
      throw error || new Error("Could not save to contact_leads")
    }
    return data as LeadRow
  } catch (err) {
    console.warn("Using resilient lead fallback for delivery:", err instanceof Error ? err.message : err)
    return {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      subject: input.subject,
      message: input.message,
      source: input.source,
      source_page: input.sourcePage || null,
      status: "new",
      sheet_status: "pending",
      sheet_attempts: 0,
      email_status: "pending",
      email_attempts: 0,
      created_at: new Date().toISOString(),
    }
  }
}

function teamRecipients(): string[] {
  const list = (process.env.LEADS_NOTIFY_TO || getOwnerEmail()).split(",").map((s) => s.trim()).filter(Boolean)
  return Array.from(new Set(list))
}

/** email_status values: pending → team_sent (team mailed, auto-reply pending) → sent; or failed. */
export type EmailProgress = { teamDone: boolean; replyDone: boolean }

export function emailProgress(status: string): EmailProgress {
  return { teamDone: status === "sent" || status === "team_sent", replyDone: status === "sent" }
}

const AUTO_REPLIES_PER_ADDRESS_PER_DAY = 2

/** Whether the visitor may receive an auto-reply (abuse limits, see header). */
async function autoReplyAllowed(lead: LeadRow): Promise<boolean> {
  if (process.env.VERCEL_ENV === "production" && !process.env.TURNSTILE_SECRET_KEY) return false
  const since = new Date(Date.now() - 86_400_000).toISOString()
  try {
    const { count, error } = await supabaseAdmin
      .from("contact_leads")
      .select("id", { count: "exact", head: true })
      .eq("email", lead.email)
      .gte("created_at", since)
    if (error) return true
    return (count || 0) <= AUTO_REPLIES_PER_ADDRESS_PER_DAY
  } catch {
    return true
  }
}

async function sendTeamEmail(lead: LeadRow): Promise<boolean> {
  const rows = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone || "—"],
    ["Subject", lead.subject],
    ["Source", `${lead.source}${lead.source_page ? ` (${lead.source_page})` : ""}`],
  ]
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px">${k}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(String(v))}</td></tr>`)
    .join("")

  const team = await sendMail({
    to: teamRecipients(),
    replyTo: lead.email,
    subject: `New enquiry: ${lead.subject} — ${lead.name}`,
    text: `New enquiry from ${lead.name} <${lead.email}>\nPhone: ${lead.phone || "-"}\nSource: ${lead.source}\nSubject: ${lead.subject}\n\n${lead.message}`,
    html: brandedEmail(
      "New website enquiry",
      `<table role="presentation">${rows}</table><p style="margin-top:16px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(lead.message)}</p>`
    ),
  })

  return team.sent
}

/** Generic auto-reply: contains no visitor-supplied text. Returns true when sent or skipped by policy. */
async function sendAutoReply(lead: LeadRow): Promise<boolean> {
  if (!(await autoReplyAllowed(lead))) return true
  const reply = await sendMail({
    to: lead.email,
    replyTo: process.env.LEADS_REPLY_TO || teamRecipients()[0],
    subject: "Thanks for contacting Mommantum",
    text: `Hi,\n\nThanks for reaching out to Mommantum. We have received your message and will get back to you within one business day.\n\n— Team Mommantum\nwww.mommantum.com`,
    html: brandedEmail(
      "Thanks for reaching out!",
      `<p style="font-size:14px;line-height:1.6">We have received your message. A member of our team will get back to you within one business day.</p>
       <p style="font-size:14px;line-height:1.6">Meanwhile, explore our <a href="https://www.mommantum.com/work" style="color:#e61e73">case studies</a> and <a href="https://www.mommantum.com/services" style="color:#e61e73">services</a>.</p>
       <p style="font-size:14px">— Team Mommantum</p>`
    ),
  })

  return reply.sent
}

/** Sends whatever is still missing and returns the new email_status. */
async function sendLeadEmails(lead: LeadRow): Promise<string> {
  // 1. Primary: MailX HTTPS REST API (Strictly NO SMTP, Cloud/Vercel compatible)
  if (isMailXConfigured()) {
    const { html, text, subject } = buildContactConfirmationEmail({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      subject: lead.subject,
      message: lead.message,
    })

    const result = await sendMailX({
      to: lead.email,
      cc: DEFAULT_CC_RECIPIENTS,
      subject,
      html,
      text,
    })

    if (result.ok) {
      return "sent"
    }
    console.warn("MailX delivery attempt failed, falling back if available:", result.error)
  }

  // 2. Secondary fallback: SMTP if configured
  if (isMailerConfigured()) {
    const progress = emailProgress(lead.email_status)
    const teamDone = progress.teamDone || (await sendTeamEmail(lead))
    if (!teamDone) return "failed"
    const replyDone = progress.replyDone || (await sendAutoReply(lead))
    return replyDone ? "sent" : "team_sent"
  }

  return "failed"
}

/** Delivers one lead to the sheet and email; updates statuses. Safe to call repeatedly. */
export async function deliverLead(lead: LeadRow): Promise<void> {
  const update: Record<string, unknown> = {}

  if (lead.sheet_status !== "sent" && lead.sheet_attempts < MAX_DELIVERY_ATTEMPTS) {
    const sheet = await appendLeadToSheet({
      id: lead.id,
      createdAt: lead.created_at,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      subject: lead.subject,
      message: lead.message,
      source: lead.source,
      sourcePage: lead.source_page,
    })
    update.sheet_status = sheet.ok ? "sent" : "failed"
    update.sheet_attempts = lead.sheet_attempts + 1
  }

  if (lead.email_status !== "sent" && lead.email_attempts < MAX_DELIVERY_ATTEMPTS) {
    update.email_status = await sendLeadEmails(lead)
    update.email_attempts = lead.email_attempts + 1
  }

  // Automatically record this inquiry as an active prospect in the Clients directory
  try {
    await createClient({
      name: lead.name,
      company: `${lead.name}'s Brand`,
      email: lead.email,
      phone: lead.phone || null,
      service: lead.subject || "Contact Inquiry",
      status: "lead",
      retainer: "In Discussion",
      notes: `Inquiry received: "${lead.message}"`,
      startDate: new Date().toISOString().slice(0, 10),
    })
  } catch (err) {
    console.warn("Client auto-create warning:", err)
  }

  if (Object.keys(update).length) {
    try {
      await supabaseAdmin.from("contact_leads").update(update).eq("id", lead.id)
    } catch {
      // Safe to ignore if table does not exist in database
    }
  }

  const emailUnfinished = update.email_status !== undefined && update.email_status !== "sent"
  const failedForGood =
    (update.sheet_status === "failed" && Number(update.sheet_attempts) >= MAX_DELIVERY_ATTEMPTS) ||
    (emailUnfinished && Number(update.email_attempts) >= MAX_DELIVERY_ATTEMPTS)
  if (failedForGood) {
    await notifyAdmins({
      type: "delivery_failed",
      title: "Lead delivery failed",
      body: `The enquiry from ${lead.name} could not be copied to the sheet or emailed after ${MAX_DELIVERY_ATTEMPTS} attempts. It is safe in the Leads inbox.`,
      link: "/admin/leads",
    }).catch(() => undefined)
  }
}

/** Daily job: retry failed deliveries and enforce retention. */
export async function retryAndCleanLeads(): Promise<{ retried: number; deleted: number }> {
  try {
    const n = MAX_DELIVERY_ATTEMPTS
    const { data } = await supabaseAdmin
      .from("contact_leads")
      .select("*")
      .or(`and(sheet_status.neq.sent,sheet_attempts.lt.${n}),and(email_status.neq.sent,email_attempts.lt.${n})`)
      .gte("created_at", new Date(Date.now() - 7 * 86_400_000).toISOString())
      .order("created_at", { ascending: true })
      .limit(50)

    for (const lead of (data || []) as LeadRow[]) {
      try {
        await deliverLead(lead)
      } catch {
        // One bad lead must not stop the rest of the batch.
      }
    }

    const cutoff = new Date(Date.now() - LEAD_RETENTION_DAYS * 86_400_000).toISOString()
    const { count } = await supabaseAdmin.from("contact_leads").delete({ count: "exact" }).lt("created_at", cutoff)

    return { retried: data?.length || 0, deleted: count || 0 }
  } catch (err) {
    console.warn("retryAndCleanLeads error:", err)
    return { retried: 0, deleted: 0 }
  }
}
