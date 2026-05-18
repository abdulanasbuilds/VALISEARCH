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
    <div className="flex min-h-screen flex-col bg-gradient-premium relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none -z-10" />
      <AppNavbar />
      <div className="flex flex-1 max-w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
           {children}
        </main>
      </div>
    </div>
  )
}
