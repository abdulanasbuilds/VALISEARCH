"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { ArrowRight, Sparkles, Cpu, Activity, ShieldCheck, Database } from "lucide-react"
import { AuthGateModal } from "@/components/auth/AuthGateModal"
import { createClient } from "@/lib/supabase/client"

export function HeroSection() {
  const [idea, setIdea] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

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
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/40">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Engineered Pre-Title Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              ValiSearch Engine v2.0 Live
              <div className="h-3 w-[1px] bg-border mx-1"></div>
              <span className="text-primary flex items-center gap-1">
                <Cpu className="h-3 w-3" /> 12 Parallel Agents
              </span>
            </div>
            
            {/* Outcome-Driven Headline */}
            <h1 className="mb-6 text-5xl font-semibold tracking-tighter text-foreground md:text-7xl leading-[1.1]">
              Validate your startup idea <br className="hidden md:block" />
              <span className="text-muted-foreground">before you build.</span>
            </h1>
            
            {/* Subheadline Explaining Mechanism */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Deploy 12 specialized analytical agents to research your market, evaluate competitors, and score your concept with engineered precision in under 90 seconds.
            </p>
          </div>

          {/* Minimalist Command-Line Style Input */}
          <div className="mx-auto max-w-2xl">
            <div className={`relative rounded-xl border bg-background/60 backdrop-blur-xl shadow-sm transition-all duration-300 ${isFocused ? 'border-primary ring-1 ring-primary/20 shadow-md shadow-primary/5' : 'border-border/60 hover:border-border'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canSubmit) {
                    handleValidate()
                  }
                }}
              >
                <div className="flex items-center border-b border-border/40 px-4 py-3 bg-muted/20 rounded-t-xl">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="mx-auto text-xs font-medium text-muted-foreground/70 flex items-center gap-1">
                    <Activity className="h-3 w-3" /> valisearch-cli
                  </div>
                </div>
                <div className="p-1">
                  <Textarea
                    placeholder="Describe your startup idea. E.g., 'A B2B SaaS platform that uses AI to automate local SEO and Google My Business profile management for small clinics...'"
                    className="min-h-[140px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 px-4 py-4 rounded-b-xl"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={IDEA_MAX_LENGTH}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 bg-muted/10 rounded-b-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground">
                      {wordCount} <span className="opacity-70">words</span>
                    </span>
                    <div className="h-3 w-[1px] bg-border"></div>
                    <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                       <Database className="h-3 w-3 opacity-70" /> {idea.length}/{IDEA_MAX_LENGTH} <span className="opacity-70">chars</span>
                    </span>
                  </div>
                  <Button type="submit" disabled={!canSubmit} size="sm" className="h-9 px-4 font-medium transition-all">
                    Initialize Analysis
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground/70">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> No credit card required</span>
              <span className="h-1 w-1 rounded-full bg-border"></span>
              <span>2 free analyses included</span>
            </div>
          </div>
          
          {/* Social Proof / Trust Band */}
          <div className="mt-20 pt-10 border-t border-border/40">
            <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-6">
              Engineered for founders scaling at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-1 font-bold text-xl tracking-tighter"><div className="h-5 w-5 bg-foreground rounded-sm"></div> Acme Corp</div>
              <div className="flex items-center gap-1 font-bold text-xl tracking-tighter"><div className="h-5 w-5 rounded-full border-2 border-foreground"></div> Globex</div>
              <div className="flex items-center gap-1 font-bold text-xl tracking-tighter italic"><div className="h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-foreground"></div> Soylent</div>
              <div className="flex items-center gap-1 font-bold text-xl tracking-tighter"><div className="h-5 w-5 border-2 border-foreground rotate-45"></div> Initech</div>
            </div>
          </div>
        </div>
      </section>

      <AuthGateModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}