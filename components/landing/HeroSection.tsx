"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH, LS_PENDING_IDEA_KEY } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { ArrowRight, Shield, Zap } from "lucide-react"
import { AuthGateModal } from "@/components/auth/AuthGateModal"
import { createClient } from "@/lib/supabase/client"

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
} as const

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
      <section className="relative overflow-hidden bg-white pt-28 pb-20 border-b border-gray-100">
        
        {/* Crisp grid pattern on the background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F3F4F6_1px,transparent_1px),linear-gradient(to_bottom,#F3F4F6_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } }
            }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Version Badge */}
            <motion.div 
              variants={FADE_UP_ANIMATION_VARIANTS} 
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/60 px-4 py-1 text-xs font-semibold text-blue-700 shadow-sm"
            >
              <Zap className="h-3 w-3 text-blue-600" />
              <span>ValiSearch Engine v2.0 is live</span>
            </motion.div>
            
            {/* Main Title */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <h1 className="mb-6 text-4xl sm:text-6xl font-black tracking-tight text-[#0C0D0E] leading-[1.08]">
                Validate startup ideas before you spend months building.
              </h1>
            </motion.div>
            
            {/* Paragraph */}
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
              <p className="mx-auto mb-10 max-w-2xl text-base sm:text-lg text-[#52565E] leading-relaxed">
                Skip the guesswork. Enter your product hypothesis and let our 12 parallel analytical research agents query real-time market trends, scrape competitors, and synthesize an investor-ready viability report in 60 seconds.
              </p>
            </motion.div>
          </motion.div>

          {/* Interactive Textarea Box */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 100, damping: 20 }}
            className="mx-auto max-w-2xl"
          >
            <div className={`relative rounded-2xl border bg-white shadow-sm transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-md' : 'border-gray-200'}`}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (canSubmit) handleValidate()
                }}
              >
                <div className="p-1">
                  <Textarea
                    placeholder="Describe your startup idea. For example: 'A scheduling tool that uses calendar sync patterns to automatically negotiate meeting times between clients, eliminating double-bookings...'"
                    className="min-h-[120px] resize-none border-0 bg-transparent text-sm focus-visible:ring-0 px-5 py-4 rounded-t-xl placeholder:text-gray-400 text-[#0C0D0E]"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={IDEA_MAX_LENGTH}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 bg-gray-50/50 rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {wordCount} / 3 min words
                    </span>
                  </div>
                  <Button type="submit" disabled={!canSubmit} className="h-10 px-5 font-semibold rounded-lg bg-[#1B4FFF] hover:bg-[#1240CC] text-white">
                    Analyze Idea
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold text-[#52565E]">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-600" /> 7-day Pro trial included</span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span>No credit card required</span>
            </div>
          </motion.div>
          
          {/* Logo Trust Banner */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20 pt-10 border-t border-gray-100"
          >
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              Trusted by founders building in public
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale hover:opacity-80 transition-opacity">
              <span className="font-extrabold text-sm tracking-wider text-gray-800 uppercase">Y Combinator</span>
              <span className="font-extrabold text-sm tracking-wider text-gray-800 uppercase">Techstars</span>
              <span className="font-extrabold text-sm tracking-wider text-gray-800 uppercase">Stripe</span>
              <span className="font-extrabold text-sm tracking-wider text-gray-800 uppercase">Vercel</span>
            </div>
          </motion.div>
        </div>
      </section>

      <AuthGateModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
