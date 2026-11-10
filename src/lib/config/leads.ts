/**
 * Purpose: configuration for the contact-lead pipeline (sources, statuses, Google targets).
 *
 * Google Sheet delivery order:
 *  1. GOOGLE_SHEETS_ID + service account → row appended directly to the sheet.
 *  2. Otherwise the existing Google Form (whose responses already feed the team's sheet)
 *     is submitted server-side. Override with GOOGLE_FORM_ID if the form changes.
 */

export const LEAD_SOURCES = ["contact", "editz", "blog-ai", "other"] as const
export type LeadSource = (typeof LEAD_SOURCES)[number]

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const CONSENT_TEXT_VERSION = "2026-11-08"
export const CONSENT_TEXT =
  "By sending this form you agree that Mommantum may store your details and contact you about your enquiry."

/** Leads older than this are deleted automatically (DPDP Act 2023 retention). */
export const LEAD_RETENTION_DAYS = 730

export const GOOGLE_FORM = {
  id: process.env.GOOGLE_FORM_ID || "1FAIpQLSem6lb8eN0u1fpRKFP4r6dEGe4MosfuycS5sKs6kH5aS6uGSQ",
  fields: {
    name: process.env.GOOGLE_FORM_ENTRY_NAME || "entry.1367143699",
    email: process.env.GOOGLE_FORM_ENTRY_EMAIL || "entry.1044504228",
    subject: process.env.GOOGLE_FORM_ENTRY_SUBJECT || "entry.737988115",
    message: process.env.GOOGLE_FORM_ENTRY_MESSAGE || "entry.506165373",
  },
}

export const MAX_DELIVERY_ATTEMPTS = 5
