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

  useEffect(() => {
    supabaseRef.current = createClient()
    
    async function getUser() {
      if (!supabaseRef.current) return
      const { data: { user } } = await supabaseRef.current.auth.getUser()
      if (user) {
        setUser({ email: user.email ?? "", id: user.id })
        
        const { data: creditData } = await supabaseRef.current
          .from("credits")
          .select("balance")
          .eq("user_id", user.id)
          .single()
        
        setCredits(creditData?.balance ?? 0)
      }
    }
    getUser()
  }, [])

  async function handleSignOut() {
    if (!supabaseRef.current) return
    await supabaseRef.current.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/workspace" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
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
          <Badge variant="secondary" className="hidden sm:flex">
            {credits} credit{credits === 1 ? "" : "s"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
              <User className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing & Credits
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings" className="flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}