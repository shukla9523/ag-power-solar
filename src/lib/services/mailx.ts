/**
 * Purpose: MailX (Mailflare) HTTPS REST API client for Mommantum.
 * Strictly uses HTTPS REST API (no SMTP / Nodemailer), ensuring full compatibility
 * with serverless and cloud hosting platforms like Vercel where SMTP ports are blocked.
 *
 * Endpoint: POST https://mailx.rapidchip.in/api/v1/send
 * Sender: AG POWER <akashshukla9523@gmail.com>
 * Recipient: Submitter's email
 * CC: akashshukla9523@gmail.com
 * Resilience: Automatically retries sending without CC if the CC send fails (e.g., suppression list error).
 */

import "server-only"

export interface MailXInput {
  to: string
  cc?: string[]
  subject: string
  html: string
  text: string
}

export interface MailXResult {
  ok: boolean
  messageId?: string
  error?: string
  retriedWithoutCc?: boolean
}

export const DEFAULT_MAILX_URL = ""
export const DEFAULT_MAILX_API_KEY = ""
export const DEFAULT_MAILX_MAILBOX_ID = ""
export const DEFAULT_MAIL_FROM = "AG POWER <akashshukla9523@gmail.com>"
export const DEFAULT_CALENDAR_URL = ""
export const DEFAULT_CC_RECIPIENTS = ["akashshukla9523@gmail.com"]

export function getMailXConfig() {
  return {
    url: (process.env.MAILFLARE_URL || process.env.MAILX_URL || DEFAULT_MAILX_URL).replace(/\/+$/, ""),
    apiKey: process.env.MAILFLARE_API_KEY || process.env.MAILX_API_KEY || DEFAULT_MAILX_API_KEY,
    mailboxId: process.env.MAILFLARE_MAILBOX_ID || process.env.MAILX_MAILBOX_ID || DEFAULT_MAILX_MAILBOX_ID,
    from: process.env.MAIL_FROM || process.env.EMAIL_FROM || DEFAULT_MAIL_FROM,
    calendarUrl: process.env.CALENDAR_BOOKING_URL || DEFAULT_CALENDAR_URL,
  }
}

export function isMailXConfigured(): boolean {
  const config = getMailXConfig()
  return Boolean(config.url && config.apiKey && config.mailboxId)
}

/** Formats a timestamp into Indian Standard Time (IST). */
export function formatIST(date = new Date()): string {
  try {
    return (
      date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }) + " IST"
    )
  } catch {
    return date.toISOString()
  }
}

async function postMailX(
  config: ReturnType<typeof getMailXConfig>,
  input: MailXInput,
  includeCc: boolean
): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const payload: Record<string, unknown> = {
    mailboxId: config.mailboxId,
    from: config.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  }

  if (includeCc && input.cc && input.cc.length > 0) {
    payload.cc = input.cc
  }

  const res = await fetch(`${config.url}/api/v1/send`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => "")
    return { ok: false, error: `MailX HTTP ${res.status}: ${errText.slice(0, 300)}` }
  }

  const data = (await res.json().catch(() => ({}))) as { messageId?: string }
  return { ok: true, messageId: data.messageId }
}

/**
 * Sends an email via MailX HTTPS REST API with built-in resilience.
 * If sending with CC fails (e.g. suppression list error), automatically retries sending to the primary recipient alone.
 */
export async function sendMailX(input: MailXInput): Promise<MailXResult> {
  const config = getMailXConfig()
  const hasCc = Boolean(input.cc && input.cc.length > 0)

  try {
    const firstAttempt = await postMailX(config, input, hasCc)
    if (firstAttempt.ok) {
      return { ok: true, messageId: firstAttempt.messageId }
    }

    if (hasCc) {
      console.warn("MailX send with CC failed, retrying primary recipient alone:", firstAttempt.error)
      const secondAttempt = await postMailX(config, input, false)
      if (secondAttempt.ok) {
        return { ok: true, messageId: secondAttempt.messageId, retriedWithoutCc: true }
      }
      return { ok: false, error: secondAttempt.error }
    }

    return { ok: false, error: firstAttempt.error }
  } catch (err) {
    if (hasCc) {
      console.warn("MailX exception with CC, retrying primary recipient alone:", err)
      try {
        const secondAttempt = await postMailX(config, input, false)
        if (secondAttempt.ok) {
          return { ok: true, messageId: secondAttempt.messageId, retriedWithoutCc: true }
        }
        return { ok: false, error: secondAttempt.error }
      } catch (retryErr) {
        return { ok: false, error: retryErr instanceof Error ? retryErr.message : "Retry failed" }
      }
    }
    return { ok: false, error: err instanceof Error ? err.message : "MailX send failed" }
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Builds the branded confirmation email HTML & plaintext for a contact inquiry.
 */
export function buildContactConfirmationEmail(lead: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string | null
  timestampIST?: string
}): { html: string; text: string; subject: string } {
  const istTime = lead.timestampIST || formatIST()
  const config = getMailXConfig()
  const calendarBookingUrl = config.calendarUrl
  const safeName = escapeHtml(lead.name)
  const safeSubject = escapeHtml(lead.subject)
  const safeMessage = escapeHtml(lead.message)
  const safePhone = lead.phone ? escapeHtml(lead.phone) : null

  const emailSubject = `Thank you for contacting AG POWER Solar – Consultation Confirmation`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting AG POWER Solar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 36px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- BRAND ACCENT BAR -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #173F32 0%, #E9B949 50%, #173F32 100%);"></td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background-color: #173F32; padding: 30px 36px; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.03em;">
                      AG POWER<span style="color: #E9B949;">.</span>
                    </span>
                  </td>
                  <td align="right" valign="middle">
                    <span style="color: #A8C5A0; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;">
                      Clean Energy. Smarter Living.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- MAIN CONTENT -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <h1 style="font-size: 22px; font-weight: 800; color: #173F32; margin: 0 0 14px 0; line-height: 1.3;">
                Thank you for contacting AG POWER Solar!
              </h1>

              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Hi <strong>${safeName}</strong>,<br/>
                We have received your enquiry regarding <strong>${safeSubject}</strong>. Our solar engineering team is reviewing your requirements and will reach out shortly with an initial feasibility assessment.
              </p>

              <!-- DIRECT SUPPORT DETAILS -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 22px; margin-top: 26px;">
                <p style="font-size: 14.5px; font-weight: 700; color: #173F32; margin: 0 0 6px 0;">
                  Need immediate support or have urgent questions?
                </p>
                <p style="font-size: 13.5px; color: #475569; margin: 0 0 10px 0; line-height: 1.5;">
                  You can reply directly to this email or reach our solar advisory desk:
                </p>
                <table cellpadding="0" cellspacing="0" style="margin: 8px 0;">
                  <tr>
                    <td style="padding: 4px 16px 4px 0;">
                      ✉️ <a href="mailto:akashshukla9523@gmail.com" style="color: #173F32; font-weight: 600; text-decoration: none; font-size: 13.5px;">akashshukla9523@gmail.com</a>
                    </td>
                    <td style="padding: 4px 0;">
                      📞 <a href="tel:+919523467849" style="color: #173F32; font-weight: 600; text-decoration: none; font-size: 13.5px;">+91 95234 67849</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- SUBMISSION RECAP -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin-top: 24px; font-size: 12.5px; color: #64748b; line-height: 1.6;">
                <strong style="color: #334155;">Your Submitted Details:</strong><br/>
                &bull; <strong>Name:</strong> ${safeName}<br/>
                &bull; <strong>Email:</strong> ${escapeHtml(lead.email)}<br/>
                ${safePhone ? `&bull; <strong>Phone:</strong> ${safePhone}<br/>` : ""}
                &bull; <strong>Subject:</strong> ${safeSubject}<br/>
                &bull; <strong>Message:</strong> ${safeMessage}<br/>
                &bull; <strong>Logged At:</strong> ${istTime}
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #f8fafc; padding: 22px 36px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;">
              &copy; 2026 AG POWER (Electro Global). All rights reserved.<br/>
              Corporate Office, India &bull; <a href="https://ag-power-solar.vercel.app" style="color: #94a3b8; text-decoration: underline;">ag-power-solar.vercel.app</a><br/>
              Sent automatically from <strong>akashshukla9523@gmail.com</strong>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const text = `Thank you for contacting AG POWER Solar!

Hi ${lead.name},

We have received your message regarding "${lead.subject}". Our solar engineering team is reviewing your requirements.

============================================================
DIRECT SUPPORT & CONTACT
============================================================
• Email: akashshukla9523@gmail.com
• Phone: +91 95234 67849

Your Submitted Details:
• Name: ${lead.name}
• Email: ${lead.email}
${lead.phone ? `• Phone: ${lead.phone}\n` : ""}• Subject: ${lead.subject}
• Message: ${lead.message}
• Logged At: ${istTime}

Best regards,
The AG POWER Team
https://ag-power-solar.vercel.app
akashshukla9523@gmail.com`

  return { html, text, subject: emailSubject }
}

