"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AgentStatusCard } from "@/components/analysis/AgentStatusCard"
import { AGENT_DISPLAY_NAMES, AGENT_DESCRIPTIONS } from "@/lib/constants"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"

interface AnalysisProgressProps {
  analysisId: string
}

export function AnalysisProgress({ analysisId }: AnalysisProgressProps) {
  const router = useRouter()
  const supabase = createClient()
  const [analysis, setAnalysis] = useState<any>(null)
  const [progress, setProgress] = useState<any[]>([])

  useEffect(() => {
    async function fetchAnalysis() {
      const { data } = await supabase
        .from("analysis")
        .select("*")
        .eq("id", analysisId)
        .single()
      setAnalysis(data)
    }

    async function fetchProgress() {
      const { data } = await supabase
        .from("analysis_progress")
        .select("*")
        .eq("analysis_id", analysisId)
        .order("agent_name")
      setProgress(data || [])
    }

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`analysis-${analysisId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analysis",
          filter: `id=eq.${analysisId}`,
        },
        (payload: any) => {
          setAnalysis(payload.new)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "analysis_progress",
          filter: `analysis_id=eq.${analysisId}`,
        },
        (payload: any) => {
          // Refresh progress
          fetchProgress()
        }
      )
      .subscribe()

    // Initial fetch
    fetchAnalysis()
    fetchProgress()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [analysisId, supabase])

  if (!analysis) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Completed - redirect to results
  if (analysis.status === "completed") {
    router.push(`/workspace/${analysisId}`)
    return null
  }

  // Failed
  if (analysis.status === "failed") {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Analysis Failed</h2>
          <p className="mb-4 text-muted-foreground">
            Something went wrong. Please try again.
          </p>
          <Button onClick={() => router.push("/workspace")}>
            Back to Workspace
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Running - show progress
  const completedCount = progress.filter((p) => p.status === "completed").length
  const totalAgents = 12
  const percentage = Math.round((completedCount / totalAgents) * 100)

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">Analyzing Your Idea</h1>
        <p className="text-muted-foreground">
          12 AI agents are working on your analysis
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="mt-2 text-center text-sm text-muted-foreground">
            {completedCount} of {totalAgents} agents completed
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(AGENT_DISPLAY_NAMES).map(([key, name]) => {
          const agentProgress = progress.find((p) => p.agent_name === key)
          const status = agentProgress?.status || "pending"
          const description = AGENT_DESCRIPTIONS[key as keyof typeof AGENT_DESCRIPTIONS]

          return (
            <AgentStatusCard
              key={key}
              agentName={name}
              description={description || ""}
              status={status}
            />
          )
        })}
      </div>
    </div>
  )
}
