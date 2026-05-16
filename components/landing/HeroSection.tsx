"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { Sparkles, Zap, ShieldCheck } from "lucide-react"
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
        {/* Modern Vibrant AI Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70 -z-10 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-20" />
        
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Glowing Pill Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] transition-all hover:shadow-[0_0_25px_rgba(var(--primary),0.3)]">
              <Sparkles className="h-4 w-4" />
              <span>ValiSearch Engine v2.0 is now live</span>
            </div>
            
            {/* Massive Gradient Headline */}
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-7xl leading-[1.1]">
              Validate your <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">startup idea</span> in minutes.
            </h1>
            
            {/* Subheadline Explaining Mechanism */}
            <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Deploy 12 specialized analytical AI agents to research your market, evaluate competitors, and generate a deterministic viability score.
            </p>
          </div>

          {/* Floating Glassmorphic Input Card */}
          <div className="mx-auto max-w-2xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 transition duration-1000 hover:opacity-100 hover:duration-200"></div>
            <div className={`relative rounded-2xl border bg-background/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${isFocused ? 'border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.15)]' : 'border-border/50 hover:border-border'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canSubmit) {
                    handleValidate()
                  }
                }}
              >
                <div className="p-2">
                  <Textarea
                    placeholder="Describe your startup idea in a few sentences... E.g., 'An AI tool that helps YouTube creators remix their long-form videos into viral TikToks.'"
                    className="min-h-[160px] resize-none border-0 bg-transparent text-base md:text-lg focus-visible:ring-0 px-5 py-5 rounded-t-xl placeholder:text-muted-foreground/60"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={IDEA_MAX_LENGTH}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border/40 px-5 py-4 bg-muted/30 rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      {wordCount} <span className="opacity-70">words</span>
                    </span>
                    <div className="h-4 w-[1px] bg-border"></div>
                    <span className="text-sm font-medium text-muted-foreground">
                       {idea.length}/{IDEA_MAX_LENGTH} <span className="opacity-70">chars</span>
                    </span>
                  </div>
                  <Button type="submit" disabled={!canSubmit} size="lg" className="h-11 px-6 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-xl">
                    <Zap className="mr-2 h-4 w-4" />
                    Start Validation
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> No credit card required</span>
              <span className="h-1 w-1 rounded-full bg-border"></span>
              <span>First 2 analyses are free</span>
            </div>
          </div>
          
          {/* Dashboard UI Preview Hero Shot (Show, Don't Tell) */}
          <div className="relative mx-auto -mt-12 max-w-4xl px-4 sm:px-6 lg:px-8 z-0 pointer-events-none hidden md:block">
            <div 
              className="relative rounded-t-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden pt-12"
              style={{ maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}
            >
              {/* Fake Mac Window Header */}
              <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 border-b border-border/40 bg-muted/20 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <div className="mx-auto text-[10px] font-mono text-muted-foreground/50">valisearch-synthesis-report.pdf</div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="p-8 grid md:grid-cols-3 gap-8 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:16px_16px]">
                <div className="col-span-2 space-y-6">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-xl font-bold tracking-tight">Market Validation Analysis</h3>
                       <p className="text-sm text-muted-foreground mt-1">Generated by 12 parallel agents</p>
                     </div>
                     <div className="text-right">
                       <div className="text-4xl font-bold tracking-tighter text-primary">82<span className="text-lg text-muted-foreground font-normal">/100</span></div>
                       <div className="text-[10px] font-mono text-primary/80 uppercase tracking-wider mt-1">Viability Score</div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-green-500"></div></div>
                          <span className="text-sm font-medium">Market Size</span>
                        </div>
                        <div className="text-lg font-mono text-muted-foreground">$14.2B TAM</div>
                     </div>
                     <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-primary"></div></div>
                          <span className="text-sm font-medium">Competitors</span>
                        </div>
                        <div className="text-lg font-mono text-muted-foreground">42 Identified</div>
                     </div>
                   </div>
                </div>
                
                <div className="col-span-1 border-l border-border/40 pl-8">
                   <div className="flex items-center gap-2 mb-4">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                     <span className="text-sm font-semibold">Executive Verdict</span>
                   </div>
                   <div className="space-y-3 mt-4">
                     <div className="h-2 w-full bg-muted-foreground/20 rounded-full animate-pulse"></div>
                     <div className="h-2 w-5/6 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                     <div className="h-2 w-full bg-muted-foreground/20 rounded-full animate-pulse"></div>
                     <div className="h-2 w-4/6 bg-muted-foreground/20 rounded-full animate-pulse"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Proof / Trust Band */}
          <div className="mt-24 pt-10 border-t border-border/40">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-muted-foreground/60 mb-8">
              Empowering founders from top incubators
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter"><div className="h-6 w-6 bg-foreground rounded-md"></div> YC Alumni</div>
              <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter"><div className="h-6 w-6 rounded-full border-4 border-foreground"></div> Techstars</div>
              <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter italic"><div className="h-0 w-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-foreground"></div> 500 Startups</div>
            </div>
          </div>
        </div>
      </section>

      <AuthGateModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}