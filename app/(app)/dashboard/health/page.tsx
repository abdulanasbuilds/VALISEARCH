"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Activity, Target, Zap, Code, Globe, BarChart } from "lucide-react"

interface HealthScore {
  id: string
  validation_strength: number
  differentiation: number
  monetization_readiness: number
  technical_feasibility: number
  market_opportunity: number
  execution_progress: number
  overall_score: number
  recorded_at: string
}

const metrics = [
  { key: "validation_strength", label: "Validation Strength", icon: Target, color: "text-blue-500" },
  { key: "differentiation", label: "Differentiation", icon: Zap, color: "text-purple-500" },
  { key: "monetization_readiness", label: "Monetization", icon: BarChart, color: "text-green-500" },
  { key: "technical_feasibility", label: "Technical Feasibility", icon: Code, color: "text-amber-500" },
  { key: "market_opportunity", label: "Market Opportunity", icon: Globe, color: "text-cyan-500" },
  { key: "execution_progress", label: "Execution", icon: Activity, color: "text-red-500" },
]

export default function HealthPage() {
  const supabase = createClient()
  const [scores, setScores] = useState<HealthScore[]>([])
  const [loading, setLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [calculating, setCalculating] = useState(false)

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: memberships } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single()

    if (memberships?.workspace_id) {
      setWorkspaceId(memberships.workspace_id)
      loadScores(memberships.workspace_id)
    } else {
      setLoading(false)
    }
  }

  async function loadScores(wsId: string) {
    const { data: scoreData } = await supabase
      .from("health_scores")
      .select("*")
      .eq("workspace_id", wsId)
      .order("recorded_at", { ascending: false })
      .limit(10)

    if (scoreData) {
      setScores(scoreData)
    }
    setLoading(false)
  }

  async function calculateHealth() {
    if (!workspaceId) return
    setCalculating(true)

    const [tasks, notes, flows] = await Promise.all([
      supabase.from("tasks").select("status, category").eq("workspace_id", workspaceId),
      supabase.from("founder_notes").select("id").eq("workspace_id", workspaceId),
      supabase.from("startup_flows").select("id").eq("workspace_id", workspaceId),
    ])

    const taskCompletion = tasks.data?.length 
      ? Math.round((tasks.data.filter(t => t.status === "done").length / tasks.data.length) * 100) 
      : 0

    const validation_strength = Math.min(100, 40 + taskCompletion * 0.6)
    const differentiation = Math.min(100, 50 + (notes.data?.length || 0) * 5)
    const monetization_readiness = Math.min(100, 30 + taskCompletion * 0.5 + (flows.data?.length || 0) * 10)
    const technical_feasibility = Math.min(100, 60 + (flows.data?.length || 0) * 5)
    const market_opportunity = Math.min(100, 55 + (notes.data?.length || 0) * 3)
    const execution_progress = Math.min(100, taskCompletion)

    const { data: newScore } = await supabase
      .from("health_scores")
      .insert({
        workspace_id: workspaceId,
        validation_strength,
        differentiation,
        monetization_readiness,
        technical_feasibility,
        market_opportunity,
        execution_progress,
        overall_score: Math.round((validation_strength + differentiation + monetization_readiness + technical_feasibility + market_opportunity + execution_progress) / 6),
        risks: [],
        recommendations: [
          taskCompletion < 50 ? "Focus on completing more tasks to improve execution" : null,
          !flows.data?.length ? "Create visual flows to improve planning" : null,
          !notes.data?.length ? "Add more strategic notes for better differentiation" : null,
        ].filter(Boolean),
      })
      .select()
      .single()

    if (newScore) {
      setScores([newScore, ...scores])
    }

    setCalculating(false)
  }

  const latestScore = scores[0]

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-100"
    if (score >= 40) return "bg-amber-100"
    return "bg-red-100"
  }

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center">Loading...</div>
  }

  if (!workspaceId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Create a workspace first to track health scores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Startup Health</h1>
            <p className="text-muted-foreground">Track your startup's readiness and progress</p>
          </div>
          <Button onClick={calculateHealth} disabled={calculating}>
            {calculating ? "Calculating..." : "Calculate Health Score"}
          </Button>
        </div>

        {!latestScore ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No health scores recorded yet</p>
              <Button onClick={calculateHealth}>Calculate Your First Score</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  Overall Health Score
                  <Badge className={`${getScoreBg(latestScore.overall_score)} ${getScoreColor(latestScore.overall_score)}`}>
                    {latestScore.overall_score}/100
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.map((m) => {
                    const value = latestScore[m.key as keyof typeof latestScore] as number
                    return (
                      <div key={m.key}>
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <m.icon className={`h-4 w-4 ${m.color}`} />
                            <span className="text-sm font-medium">{m.label}</span>
                          </div>
                          <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* History */}
            {scores.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Score History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {scores.slice(0, 5).map((s, i) => (
                      <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                        <span className="text-sm text-muted-foreground">
                          {new Date(s.recorded_at).toLocaleDateString()}
                        </span>
                        <Badge className={getScoreBg(s.overall_score)}>
                          {s.overall_score}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
