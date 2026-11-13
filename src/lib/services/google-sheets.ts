/**
 * Purpose: copy a lead into the team's Google Sheet.
 *
 * Priority 1: Webhook via Google Apps Script (GOOGLE_SHEET_WEBHOOK_URL) — zero-setup webhook,
 * appends rows in real-time with IST timestamp and formula safety.
 * Priority 2: Sheets API with a service account (GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL,
 * GOOGLE_PRIVATE_KEY).
 * Priority 3: Fallback Google Form server-side submission.
 */

import "server-only"
import { google } from "googleapis"
import { GOOGLE_FORM } from "@lib/config/leads"
import { formatIST } from "./mailx"

export interface SheetLead {
  id: string
  createdAt: string
  name: string
  email: string
  phone?: string | null
  subject: string
  message: string
  source: string
  sourcePage?: string | null
}

export type SheetResult = { ok: true; via: "webhook" | "sheets-api" | "google-form" } | { ok: false; error: string }

function hasWebhook(): boolean {
  return Boolean(process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_URL)
}

function hasServiceAccount(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
}

/** Prefixes cells that a spreadsheet could read as a formula, so a CSV/sheet export stays safe. */
export function neutralizeFormula(value: string): string {
  if (!value) return ""
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

async function appendViaWebhook(lead: SheetLead): Promise<SheetResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.GOOGLE_APPS_SCRIPT_URL
  if (!webhookUrl) return { ok: false, error: "No Google Sheet Webhook URL configured" }

  const istTimestamp = formatIST(lead.createdAt ? new Date(lead.createdAt) : new Date())
  const payload = {
    timestamp: istTimestamp,
    name: neutralizeFormula(lead.name),
    email: neutralizeFormula(lead.email),
    subject: neutralizeFormula(lead.subject),
    message: neutralizeFormula(lead.message),
    phone: lead.phone ? neutralizeFormula(lead.phone) : "",
    source: lead.source || "contact",
    sourcePage: lead.sourcePage || "",
    id: lead.id,
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok && res.status !== 302) {
    const text = await res.text().catch(() => "")
    return { ok: false, error: `Google Apps Script HTTP ${res.status}: ${text.slice(0, 200)}` }
  }

  return { ok: true, via: "webhook" }
}

async function appendViaApi(lead: SheetLead): Promise<SheetResult> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: process.env.GOOGLE_SHEETS_RANGE || "Leads!A:I",
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        lead.createdAt, lead.name, lead.email, lead.phone || "", lead.subject,
        lead.message, lead.source, lead.sourcePage || "", lead.id,
      ].map(neutralizeFormula)],
    },
  })
  return { ok: true, via: "sheets-api" }
}

async function submitGoogleForm(lead: SheetLead): Promise<SheetResult> {
  const body = new URLSearchParams({
    [GOOGLE_FORM.fields.name]: lead.name,
    [GOOGLE_FORM.fields.email]: lead.email,
    [GOOGLE_FORM.fields.subject]: lead.source === "contact" ? lead.subject : `[${lead.source}] ${lead.subject}`,
    [GOOGLE_FORM.fields.message]: lead.phone ? `${lead.message}\n\nPhone: ${lead.phone}` : lead.message,
  })
  const res = await fetch(`https://docs.google.com/forms/d/e/${GOOGLE_FORM.id}/formResponse`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  })
  if (res.status >= 400) return { ok: false, error: `Google Form HTTP ${res.status}` }
  return { ok: true, via: "google-form" }
}

export async function appendLeadToSheet(lead: SheetLead): Promise<SheetResult> {
  try {
    if (hasWebhook()) return await appendViaWebhook(lead)
    return hasServiceAccount() ? await appendViaApi(lead) : await submitGoogleForm(lead)
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 300) : "Sheet append failed" }
  }
}

export function sheetTarget(): "webhook" | "sheets-api" | "google-form" {
  if (hasWebhook()) return "webhook"
  return hasServiceAccount() ? "sheets-api" : "google-form"
}

export interface GoogleSheetRow {
  id: string
  rowNumber: number
  values: string[]
  record: Record<string, string>
}

export interface GoogleSheetTableData {
  title: string
  sheetId: string
  sheetUrl: string
  headers: string[]
  rows: GoogleSheetRow[]
  totalRows: number
  lastUpdated: string
}

/**
 * Fetches all headers and rows directly from the configured Google Sheet in real-time.
 * Strictly dynamic: returns exact columns and rows from the sheet with no hardcoding.
 */
export async function readSheetData(): Promise<GoogleSheetTableData> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  const sheetUrl = spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` : ""

  if (!hasServiceAccount() || !spreadsheetId) {
    return {
      title: "Google Sheet",
      sheetId: spreadsheetId || "",
      sheetUrl,
      headers: [],
      rows: [],
      totalRows: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/spreadsheets"],
  })
  const sheets = google.sheets({ version: "v4", auth })

  let title = "Mommantum Leads"
  let sheetTab = "Leads"

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId })
    title = meta.data.properties?.title || title
    sheetTab = meta.data.sheets?.[0]?.properties?.title || sheetTab
  } catch (err) {
    console.warn("Could not fetch spreadsheet metadata:", err)
  }

  const range = process.env.GOOGLE_SHEETS_RANGE || `${sheetTab}!A1:Z500`
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rawValues = res.data.values || []
  if (rawValues.length === 0) {
    return {
      title,
      sheetId: spreadsheetId,
      sheetUrl,
      headers: [],
      rows: [],
      totalRows: 0,
      lastUpdated: new Date().toISOString(),
    }
  }

  // Row 1 contains the headers exactly as configured in the user's sheet
  const headers = (rawValues[0] || []).map((h) => String(h).trim()).filter(Boolean)
  const rawRows = rawValues.slice(1)

  const rows: GoogleSheetRow[] = []
  rawRows.forEach((rowArr, index) => {
    if (!Array.isArray(rowArr) || !rowArr.some((c) => String(c).trim().length > 0)) {
      return
    }
    const record: Record<string, string> = {}
    const values: string[] = []
    headers.forEach((header, colIndex) => {
      let cell = rowArr[colIndex] !== undefined && rowArr[colIndex] !== null ? String(rowArr[colIndex]).trim() : ""
      // Clean leading single quote from formula neutralization so it displays cleanly in the UI
      if (cell.startsWith("'")) {
        cell = cell.slice(1)
      }
      record[header] = cell
      values.push(cell)
    })

    rows.push({
      id: `row_${index + 2}`,
      rowNumber: index + 2,
      values,
      record,
    })
  })

  return {
    title,
    sheetId: spreadsheetId,
    sheetUrl,
    headers,
    rows,
    totalRows: rows.length,
    lastUpdated: new Date().toISOString(),
  }
}

