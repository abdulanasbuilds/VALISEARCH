import { createClient } from "@/lib/supabase/server"
import { AppNavbar } from "@/components/layout/AppNavbar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { redirect } from "next/navigation"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}