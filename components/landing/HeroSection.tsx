"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { ArrowRight, Sparkles } from "lucide-react"
import { AuthGateModal } from "@/components/auth/AuthGateModal"
import { createClient } from "@/lib/supabase/client"

export function HeroSection() {
  const [idea, setIdea] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const wordCount = getWordCount(idea)
  const canSubmit = wordCount >= 3

  async function handleValidate() {
    localStorage.setItem("valisearch_pending_idea", idea)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      window.location.href = "/workspace/new"
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>12 AI Agents Analyzing Your Idea</span>
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Validate your startup idea
              <span className="block text-primary">in minutes, not months</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Describe your idea and get instant analysis on market size, competitors,
              growth strategy, and more. Built for founders who need fast, actionable insights.
            </p>
          </div>

          <Card className="mx-auto max-w-2xl border-2 border-primary/10 shadow-xl">
            <CardContent className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canSubmit) {
                    handleValidate()
                  }
                }}
              >
                <Textarea
                  placeholder="Describe your startup idea in a few sentences. For example: A mobile app that helps small businesses in Africa manage their inventory and accept mobile payments..."
                  className="min-h-[160px] resize-none text-base"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  maxLength={IDEA_MAX_LENGTH}
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {wordCount} words • {idea.length}/{IDEA_MAX_LENGTH} characters
                  </span>
                  <Button type="submit" disabled={!canSubmit} size="lg">
                    Validate My Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Free for first 3 analyses • No credit card required
          </p>
        </div>
      </section>

      <AuthGateModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}