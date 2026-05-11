"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { IDEA_MIN_LENGTH, IDEA_MAX_LENGTH } from "@/lib/constants"
import { getWordCount } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function IdeaInputBox() {
  const router = useRouter()
  const [idea, setIdea] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const wordCount = getWordCount(idea)
  const canSubmit = wordCount >= 3

  async function handleSubmit() {
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
        body: JSON.stringify({ ideaText: idea, analysisType: "full" }),
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
    <Card className="border-2 border-primary/10">
      <CardContent className="p-6">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Validate a new idea</h2>
        </div>
        <Textarea
          placeholder="Describe your startup idea in a few sentences. For example: A mobile app that helps small businesses in Africa manage their inventory and accept mobile payments..."
          className="min-h-[100px] resize-none"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          maxLength={IDEA_MAX_LENGTH}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {wordCount} words • {idea.length}/{IDEA_MAX_LENGTH}
          </span>
          <Button onClick={handleSubmit} disabled={!canSubmit || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Validate Idea"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}