/**
 * Purpose: one response shape for every API route (review item C3).
 *
 * Success: `{ success: true, ...body }` — the route's existing top-level keys are kept
 * (e.g. `{ success: true, leads, meta }`), so admin pages that read `data.leads` keep working.
 * Lists use `{ success: true, data: [...], meta? }`.
 * Failure: `{ success: false, error: "<readable message>", code }` — `error` stays a string
 * because the admin UI shows `data.error` directly. Never pass raw database or exception
 * messages to `fail()`; use a fixed, user-readable sentence.
 */

import { NextResponse } from "next/server"
import type { ZodError } from "zod"

export interface ApiResponseMeta {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
  [key: string]: unknown
}

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SLUG_TAKEN"
  | "STALE_UPDATE"
  | "PAYLOAD_TOO_LARGE"
  | "UNAVAILABLE"
  | "UPSTREAM_ERROR"
  | "SERVER_ERROR"
  | (string & {})

export type ApiSuccessBody<T extends object> = { success: true } & T

export interface ApiErrorBody {
  success: false
  error: string
  code: ApiErrorCode
  [key: string]: unknown
}

/** Success response; keeps every key of `body` at the top level. */
export function ok<T extends object = Record<string, never>>(
  body?: T,
  status = 200
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json({ success: true as const, ...(body ?? ({} as T)) }, { status })
}

/** Success response for a list: `{ success: true, data, meta? }`. */
export function okList<T>(data: T[], meta?: ApiResponseMeta) {
  return ok(meta ? { data, meta } : { data })
}

/** Failure response; `extra` adds documented keys such as `details` (never raw errors). */
export function fail(
  message: string,
  code: ApiErrorCode = "BAD_REQUEST",
  status = 400,
  extra?: Record<string, unknown>
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ ...(extra ?? {}), success: false as const, error: message, code }, { status })
}

const STATUS_CODES: Record<number, ApiErrorCode> = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  413: "PAYLOAD_TOO_LARGE",
  415: "BAD_REQUEST",
  502: "UPSTREAM_ERROR",
  503: "UNAVAILABLE",
}

/** Failure whose status comes from a service result; the code is derived from the status. */
export function failWithStatus(message: string, status: number): NextResponse<ApiErrorBody> {
  return fail(message, STATUS_CODES[status] ?? (status >= 500 ? "SERVER_ERROR" : "BAD_REQUEST"), status)
}

export const forbidden =(message = "Unauthorized") => fail(message, "FORBIDDEN", 403)
export const unauthorized = (message = "Unauthorized") => fail(message, "UNAUTHORIZED", 401)
export const notFound = (message = "Not found") => fail(message, "NOT_FOUND", 404)
export const serverError = (message = "Something went wrong") => fail(message, "SERVER_ERROR", 500)
export const slugTakenFail = (slug: string) => fail(`Slug '${slug}' is already used`, "SLUG_TAKEN", 409)

/**
 * First Zod issue as one readable sentence, e.g. "faqs.1.answer: FAQ answer is required".
 * The path is left out when the message already names the field ("Title is required").
 */
export function firstIssueMessage(error: ZodError, fallback = "Invalid input"): string {
  const issue = error.issues[0]
  if (!issue) return fallback
  const path = issue.path.map(String).join(".")
  const field = String(issue.path[issue.path.length - 1] ?? "").replace(/_/g, " ").toLowerCase()
  if (!path || (field && issue.message.toLowerCase().startsWith(field))) return issue.message
  return `${path}: ${issue.message}`
}

/** 400 response for a failed Zod parse, carrying the first readable issue. */
export function validationFail(error: ZodError, fallback?: string) {
  return fail(firstIssueMessage(error, fallback), "VALIDATION_ERROR", 400)
}

/** Pagination meta for list endpoints that page with `range()`. */
export function pageMeta(page: number, limit: number, total: number): ApiResponseMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
}
