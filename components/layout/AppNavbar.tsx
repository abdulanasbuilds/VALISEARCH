"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, User, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState, useRef } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"

export function AppNavbar() {
  const supabaseRef = useRef<SupabaseClient | null>(null)
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; id: string } | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [profile, setProfile] = useState<{ is_trial_active: boolean; trial_ends_at: string | null } | null>(null)

  useEffect(() => {
    supabaseRef.current = createClient()
    
    async function getUser() {
      if (!supabaseRef.current) return
      const { data: { user } } = await supabaseRef.current.auth.getUser()
      if (user) {
        setUser({ email: user.email ?? "", id: user.id })
        
        const [creditData, profileData] = await Promise.all([
          supabaseRef.current.from("credits").select("balance").eq("user_id", user.id).single(),
          supabaseRef.current.from("profiles").select("is_trial_active, trial_ends_at").eq("id", user.id).single()
        ])
        
        setCredits(creditData.data?.balance ?? 0)
        if (profileData.data) {
          setProfile(profileData.data)
        }
      }
    }
    getUser()
  }, [])

  async function handleSignOut() {
    if (!supabaseRef.current) return
    await supabaseRef.current.auth.signOut()
    router.push("/login")
  }

  let daysLeft = 0
  let bannerColor = "bg-[#1B4FFF]"
  
  if (profile?.is_trial_active && profile.trial_ends_at) {
    daysLeft = Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 1) bannerColor = "bg-red-600"
    else if (daysLeft <= 2) bannerColor = "bg-amber-600"
  }

  return (
    <>
      {profile?.is_trial_active && daysLeft > 0 && (
        <div className={`${bannerColor} text-white text-sm py-2 px-4 flex items-center justify-between`}>
          <div className="flex-1 text-center">
            Your Pro trial ends in {daysLeft} day{daysLeft === 1 ? "" : "s"}. Upgrade now to keep full access.
          </div>
          <Link href="/settings/billing">
            <span className="shrink-0 border border-white/40 hover:bg-white/10 rounded-md px-3 py-1 text-xs font-semibold cursor-pointer transition-colors">
              Upgrade &rarr;
            </span>
          </Link>
        </div>
      )}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/workspace" className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-[#1B4FFF]" />
            <span className="text-xl font-bold">ValiSearch</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/workspace" className="text-sm font-medium hover:text-foreground text-muted-foreground">
              Workspace
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-foreground text-muted-foreground">
              Upgrade
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex bg-gray-100 text-gray-800 border-none font-medium">
              {credits} credit{credits === 1 ? "" : "s"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
                <div className="h-8 w-8 rounded-full bg-[#EEF2FF] text-[#1B4FFF] flex items-center justify-center border border-[#C7D2FE]">
                  <User className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings/billing" className="flex w-full items-center cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing & Credits
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
