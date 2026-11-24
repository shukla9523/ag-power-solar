import { createBrowserClient } from "@supabase/ssr"
import { Database } from "../../types/database"
import { getPublicEnv } from "@lib/env"

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv()
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()
