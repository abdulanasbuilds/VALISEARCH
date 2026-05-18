"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Check, Sparkles, Target, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { SupabaseClient } from "@supabase/supabase-js"

const steps = [
  {
    icon: Sparkles,
    title: "Welcome to ValiSearch",
    description: "Your AI-powered startup intelligence platform",
  },
  {
    icon: Target,
    title: "Describe Your Idea",
    description: "Type your startup idea and get instant analysis from 12 AI agents",
  },
  {
    icon: Zap,
    title: "Get Results",
    description: "Receive a comprehensive report with market data, competitors, and growth strategy",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const supabaseRef = React.useRef<SupabaseClient | null>(null)

  React.useEffect(() => {
    supabaseRef.current = createClient()
  }, [])

  async function handleComplete() {
    if (!supabaseRef.current) return
    
    const { data: { user } } = await supabaseRef.current.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabaseRef.current
      .from("profiles")
      .update({ onboarding_completed: true })
      .eq("id", user.id)

    if (error) {
      toast.error("Failed to complete onboarding")
      return
    }

    router.push("/workspace/new")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8">
          <Progress value={(currentStep / steps.length) * 100} className="mb-8" />

          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {React.createElement(steps[currentStep]!.icon, {
                className: "h-8 w-8 text-primary"
              })}
            </div>
            <h2 className="mb-2 text-center text-xl font-bold">{steps[currentStep]!.title}</h2>
            <p className="text-center text-muted-foreground">{steps[currentStep]!.description}</p>
          </div>

          <div className="mb-6 flex justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i <= currentStep ? "bg-primary" : "bg-gray-200"}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} className="flex-1">
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(s => s + 1)} className="flex-1">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Get Started
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import React from "react"
