/**
 * @file telegram.ts
 * @description Secure Telegram Bot notification service for AG POWER lead submissions.
 * 
 * Follows brief Part 12:
 * Every accepted enquiry sends a Telegram notification alert with full lead details.
 * Telegram failures do not discard accepted leads (fail-safe and idempotent).
 */

import "server-only"

export interface TelegramLeadNotification {
  enquiryId: string
  name: string
  phone: string
  email?: string | null
  category?: string | null
  service?: string | null
  city?: string | null
  monthlyBill?: string | null
  enquiryType?: string | null
  sourcePage?: string | null
  message?: string | null
}

export type TelegramResult = { ok: true } | { ok: false; error: string }

export async function sendTelegramNotification(
  lead: TelegramLeadNotification
): Promise<TelegramResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured in environment.")
    return { ok: false, error: "Telegram credentials not configured in env" }
  }

  // Format message text with clear hierarchy
  const text = `
☀️ *NEW AG POWER SOLAR ENQUIRY*

👤 *Name:* ${escapeMarkdown(lead.name)}
📞 *Phone:* ${escapeMarkdown(lead.phone)}
📧 *Email:* ${escapeMarkdown(lead.email || "N/A")}
🏢 *Category:* ${escapeMarkdown(lead.category || "General")}
⚡ *Service / Panel:* ${escapeMarkdown(lead.service || "Solar Installation")}
📍 *City:* ${escapeMarkdown(lead.city || "N/A")}
💰 *Monthly Bill:* ${escapeMarkdown(lead.monthlyBill ? `₹${lead.monthlyBill}` : "N/A")}
🏷️ *Enquiry Type:* ${escapeMarkdown(lead.enquiryType || "Website Lead")}
🔗 *Source Page:* ${escapeMarkdown(lead.sourcePage || "/")}
🆔 *Lead ID:* \`${escapeMarkdown(lead.enquiryId)}\`

📝 *Message / Calculation:*
${escapeMarkdown(lead.message || "No message provided")}
`.trim()

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      return { ok: false, error: `Telegram HTTP ${res.status}: ${errText.slice(0, 150)}` }
    }

    return { ok: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Telegram network error"
    return { ok: false, error: msg }
  }
}

function escapeMarkdown(text: string): string {
  if (!text) return ""
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&")
}
