"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LS_PENDING_IDEA_KEY } from "@/lib/constants"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function NewAnalysisPage() {
  const router = useRouter()

  useEffect(() => {
    async function initializeAnalysis() {
      const pendingIdea = localStorage.getItem(LS_PENDING_IDEA_KEY)
      
      if (!pendingIdea) {
        router.push("/workspace")
        return
      }

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idea: pendingIdea, analysisType: "full" }), 
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

        // Clear local storage after successful creation
        localStorage.removeItem(LS_PENDING_IDEA_KEY)

        // Redirect to the actual analysis progress/dashboard page
        router.push(`/workspace/${data.analysisId}`)
      } catch (error) {
        toast.error("Failed to start analysis from your idea. Please try again in the workspace.")
        console.error(error)
        localStorage.removeItem(LS_PENDING_IDEA_KEY)
        router.push("/workspace")
      }
    }

    initializeAnalysis()
  }, [router])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h1 className="text-2xl font-bold tracking-tight">Initializing ValiSearch Agents...</h1>
        <p className="text-muted-foreground max-w-sm">Uploading your idea and spinning up the intelligence cluster. This will just take a second.</p>
      </div>
    </div>
  )
}