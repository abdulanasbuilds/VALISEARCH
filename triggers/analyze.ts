import { task, metadata } from "@trigger.dev/sdk"
import { runAnalysis as runOrchestrator } from "@/agents/orchestrator"
import { createClient } from "@supabase/supabase-js"

export const analyzeStartupIdea = task({
  id: "analyze-startup-idea",
  retry: { maxAttempts: 2 },
  machine: { preset: "medium-1x" },
  run: async (payload: {
    idea: string
    userId: string
    analysisId: string
    userPlan: "free" | "pro" | "premium"
    analysisType: "quick" | "full"
  }) => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from("analysis")
      .update({
        status: "processing",
        trigger_job_id: metadata.current()?.runId ?? null,
      })
      .eq("id", payload.analysisId)

    await metadata.set("status", "running")
    await metadata.set("agentsComplete", 0)
    await metadata.set("totalAgents", 12)

    let agentsCompleted = 0

    const result = await runOrchestrator(
      {
        ideaText: payload.idea,
        userId: payload.userId,
        analysisId: payload.analysisId,
        plan: payload.userPlan,
      },
      async (agentName, status) => {
        agentsCompleted++
        await metadata.set("agentsComplete", agentsCompleted)
        await metadata.set(`agent_${agentName}`, status)

        await supabase
          .from("analysis_progress")
          .upsert({
            analysis_id: payload.analysisId,
            agent_name: agentName,
            status,
            completed_at: new Date().toISOString(),
          })
      }
    )

    await supabase
      .from("analysis")
      .update({
        status: "complete",
        result_json: result as unknown as Record<string, unknown>,
        overall_score: result.synthesis?.overall_score ?? null,
        verdict: result.synthesis?.verdict ?? null,
        completed_at: new Date().toISOString(),
        processing_time_ms: Date.now(),
      })
      .eq("id", payload.analysisId)

    const creditsToDeduct = payload.analysisType === "quick" ? 1 : 2

    const { data: creditsData } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", payload.userId)
      .single()

    const currentBalance = creditsData?.balance ?? 0
    const newBalance = Math.max(0, currentBalance - creditsToDeduct)

    await supabase
      .from("credits")
      .update({ balance: newBalance })
      .eq("user_id", payload.userId)

    await supabase.from("credit_transactions").insert({
      user_id: payload.userId,
      amount: -creditsToDeduct,
      reason: payload.analysisType === "quick"
        ? "quick_analysis"
        : "full_analysis",
      analysis_id: payload.analysisId,
    })

    await metadata.set("status", "complete")
    return result
  },
})
