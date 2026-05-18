export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; type?: string; next?: string }>
}) {
  const supabase = await createClient()
  const { code, type, next } = await searchParams

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectPath = next || "/workspace"
      redirect(redirectPath)
    }
  }

  if (type === "recovery") {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      redirect("/settings")
    }
  }

  redirect("/login?error=auth_callback_error")
}
