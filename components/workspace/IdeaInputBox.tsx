"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Zap } from "lucide-react"
import { toast } from "sonner"

export function IdeaInputBox() {
  const router = useRouter()
  const [idea, setIdea] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const wordCount = getWordCount(idea)
  const canSubmit = wordCount >= 3 && idea.trim().length >= IDEA_MIN_LENGTH

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!canSubmit) return

    setIsLoading(true)
    try {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login?returnUrl=/workspace/new")
        return
      }

      // Call the analyze API
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, analysisType: "full" }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 402) {
          toast.error("Insufficient credits. Upgrade to get more credits.")
          router.push("/settings/billing")
          return
        }
        throw new Error(data.error || "Failed to start analysis")
      }

      // Redirect to the analysis page
      router.push(`/workspace/${data.analysisId}`)
    } catch (error) {
      toast.error("Failed to start analysis. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative mb-12">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-2xl blur opacity-20 transition duration-1000 hover:opacity-100 hover:duration-200"></div>
      <div className={`relative rounded-2xl border bg-background/80 backdrop-blur-2xl shadow-xl transition-all duration-300 ${isFocused ? 'border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]' : 'border-border/50 hover:border-border'}`}>
        <form onSubmit={handleSubmit}>
          <div className="p-2">
            <Textarea
              placeholder="Describe a new startup idea to analyze... E.g., 'An AI tool that helps YouTube creators remix their long-form videos into viral TikToks.'"
              className="min-h-[120px] resize-none border-0 bg-transparent text-base focus-visible:ring-0 px-5 py-4 rounded-t-xl placeholder:text-muted-foreground/60"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={IDEA_MAX_LENGTH}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border/40 px-5 py-3 bg-muted/30 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {wordCount} <span className="opacity-70">words</span>
              </span>
              <div className="h-4 w-[1px] bg-border"></div>
              <span className="text-sm font-medium text-muted-foreground">
                 {idea.length}/{IDEA_MAX_LENGTH} <span className="opacity-70">chars</span>
              </span>
            </div>
            <Button type="submit" disabled={!canSubmit || isLoading} className="h-9 font-semibold shadow-md transition-all rounded-lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Validate
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}