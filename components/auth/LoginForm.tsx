"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { SupabaseClient } from "@supabase/supabase-js"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabaseRef = useRef<SupabaseClient | null>(null)

  useEffect(() => {
    supabaseRef.current = createClient()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginInput) {
    if (!supabaseRef.current) return
    setIsLoading(true)
    try {
      const { error } = await supabaseRef.current.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success("Welcome back!")
      window.location.assign("/workspace")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  )
}