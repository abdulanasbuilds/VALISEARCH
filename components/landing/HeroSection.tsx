"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH, LS_PENDING_IDEA_KEY } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { Zap, ShieldCheck, ArrowRight } from "lucide-react"
import { AuthGateModal } from "@/components/auth/AuthGateModal"
import { createClient } from "@/lib/supabase/client"

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
}

export function HeroSection() {
  const [idea, setIdea] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const wordCount = getWordCount(idea)
  const canSubmit = wordCount >= 3 && idea.trim().length >= IDEA_MIN_LENGTH

  async function handleValidate() {
    try {
      localStorage.setItem(LS_PENDING_IDEA_KEY, idea)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        window.location.href = "/workspace/new"
      } else {
        setShowAuthModal(true)
      }
    } catch (err) {
      console.error("[Hero] Validation handler failed:", err)
      setShowAuthModal(true)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 border-b border-subtle">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } }
            }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Trust Badge */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mb-6 inline-flex items-center gap-2 rounded-full border border-subtle bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              ValiSearch Engine v2.0 is live
            </motion.div>
            
            {/* Clean, Bold Headline */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl leading-[1.05]">
                Validate your startup idea before building it.
              </h1>
            </motion.div>
            
            {/* Direct, Clear Subheadline */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                Stop guessing what the market wants. Input your idea and get a definitive viability score backed by 12 parallel research agents analyzing real-time competitor and market data.
              </p>
            </motion.div>
          </motion.div>

          {/* Interactive Input Box (The striking product interaction) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="mx-auto max-w-3xl"
          >
            <div className={`relative rounded-xl border bg-card shadow-sm transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/20 border-primary/50 shadow-md' : 'border-subtle'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canSubmit) handleValidate()
                }}
              >
                <div className="p-1">
                  <Textarea
                    placeholder="Describe your startup idea in a few sentences. E.g., 'A developer tool that uses AI to automatically write pull request summaries...'"
                    className="min-h-[140px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 px-5 py-5 rounded-t-lg placeholder:text-muted-foreground/60"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={IDEA_MAX_LENGTH}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-subtle px-5 py-3 bg-muted/30 rounded-b-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">
                      {wordCount} / 3 min words
                    </span>
                  </div>
                  <Button type="submit" disabled={!canSubmit} className="h-10 px-5 font-medium rounded-lg">
                    Analyze Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="mt-5 flex items-center justify-center gap-3 text-sm font-medium text-muted-foreground/80">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> No credit card required</span>
              <span className="h-1 w-1 rounded-full bg-border"></span>
              <span>2 free validation reports included</span>
            </div>
          </motion.div>
          
          {/* High-Trust Banner (Logos) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-24 pt-12 border-t border-subtle"
          >
            <p className="text-center text-sm font-medium text-muted-foreground mb-8">
              Trusted by founders building the next generation of software
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale">
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight"><div className="h-5 w-5 bg-foreground rounded-sm"></div> Combinator</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight"><div className="h-5 w-5 rounded-full border-4 border-foreground"></div> Techstars</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight italic"><div className="h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-foreground"></div> Stripe</div>
              <div className="flex items-center gap-2 font-bold text-xl tracking-tight"><div className="h-5 w-5 bg-foreground rounded-full"></div> Vercel</div>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthGateModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}