import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // During build time without env vars, use placeholder that will be replaced at runtime
  const url = supabaseUrl ?? "https://placeholder.supabase.co"
  const key = supabaseKey ?? "placeholder"

  return createBrowserClient(url, key)
}