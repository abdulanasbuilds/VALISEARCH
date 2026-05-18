"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, X } from "lucide-react"
import { toast } from "sonner"
import type { SupabaseClient } from "@supabase/supabase-js"
import { LS_PENDING_IDEA_KEY } from "@/lib/constants"

interface AuthGateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthGateModal({ open, onOpenChange }: AuthGateModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabaseRef = React.useRef<SupabaseClient | null>(null)

  useEffect(() => {
    supabaseRef.current = createClient()
  }, [])

  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ email: "", password: "", fullName: "" })

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseRef.current) return
    
    setIsLoading(true)
    const { error } = await supabaseRef.current.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    })
    setIsLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    const pendingIdea = localStorage.getItem(LS_PENDING_IDEA_KEY)
    if (pendingIdea) {
      window.location.href = "/workspace/new"
    } else {
      window.location.href = "/workspace"
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!supabaseRef.current) return

    setIsLoading(true)
    const { error } = await supabaseRef.current.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: { full_name: registerData.fullName },
      },
    })
    setIsLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Check your email to confirm your account!")
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <Card className="relative z-10 mx-4 w-full max-w-md">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to continue</CardTitle>
          <CardDescription>
            Enter your idea above and we&apos;ll analyze it once you sign in
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="John Doe"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
