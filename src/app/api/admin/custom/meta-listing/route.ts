/**
 * Purpose: lightweight list of service and case-study titles/slugs for admin pickers.
 */

import { NextRequest } from "next/server"
import { supabaseAdmin } from "@lib/supabase-admin"
import { verifyUserRole } from "@lib/auth-helpers"
import { forbidden, ok } from "@lib/util/api-response"

export async function GET(req: NextRequest) {
  if (!(await verifyUserRole(req, ["admin", "marketer"]))) {
    return forbidden()
  }
  const [services, work] = await Promise.all([
    supabaseAdmin.from("services").select("title, slug"),
    supabaseAdmin.from("case_studies").select("title, slug"),
  ])
  return ok({ services: services.data || [], work: work.data || [] })
}
