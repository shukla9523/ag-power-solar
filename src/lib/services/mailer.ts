/**
 * Purpose: the only module that sends email — Zoho SMTP through Nodemailer.
 * Used for lead notifications, lead auto-replies, access requests and approvals.
 *
 * Why one module: a single transport (pooled, TLS) with one place for the sender
 * identity, timeouts and HTML escaping. Callers never build raw SMTP config.
 * Server-only; never import from client components.
 */

import "server-only"
import nodemailer, { Transporter } from "nodemailer"

let transporter: Transporter | null = null

export function isMailerConfigured(): boolean {
  return Boolean(process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS)
}

function getTransporter(): Transporter {
  if (transporter) return transporter
  const port = Number(process.env.ZOHO_SMTP_PORT || 465)
  transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.in",
    port,
    secure: port === 465,
    auth: { user: process.env.ZOHO_SMTP_USER, pass: process.env.ZOHO_SMTP_PASS },
    pool: true,
    maxConnections: 2,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
  return transporter
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export interface MailInput {
  to: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

export interface MailResult {
  sent: boolean
  error?: string
}

/** Sends an email; never throws (callers record the status and retry later). */
export async function sendMail(input: MailInput): Promise<MailResult> {
  if (!isMailerConfigured()) return { sent: false, error: "SMTP not configured" }
  try {
    const fromAddress = process.env.ZOHO_SMTP_FROM || process.env.ZOHO_SMTP_USER
    await getTransporter().sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "Mommantum"}" <${fromAddress}>`,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message.slice(0, 300) : "Send failed" }
  }
}

/** Wraps body HTML in a minimal branded layout. */
export function brandedEmail(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0e2547;padding:20px 28px;color:#ffffff;font-size:18px;font-weight:bold">Mommantum</td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 16px;font-size:20px;color:#0e2547">${escapeHtml(title)}</h1>${bodyHtml}</td></tr>
<tr><td style="padding:16px 28px;background:#fff0f6;font-size:12px;color:#6b7280">Mommantum · Jaipur, India · www.mommantum.com</td></tr>
</table></td></tr></table></body></html>`
}
