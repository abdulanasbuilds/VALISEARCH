import { task, metadata } from "@trigger.dev/sdk/v3"
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

    const result = await runOrchestrator({
      idea: payload.idea,
      userPlan: payload.userPlan,
      analysisType: payload.analysisType,
      onAgentComplete: async (agentName: string, status: string) => {
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
      },
    })

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

    await supabase
      .from("credits")
      .update({
        balance: supabase.rpc("decrement_credits", {
          user_id_input: payload.userId,
          amount: creditsToDeduct,
        }),
      })
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