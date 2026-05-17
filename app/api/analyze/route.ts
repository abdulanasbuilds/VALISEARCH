import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sanitizeIdea } from "@/lib/utils"
import { runAnalysis } from "@/agents/orchestrator"

async function triggerTask(taskId: string, payload: any) {
  if (process.env.TRIGGER_SECRET_KEY) {
    try {
      const { tasks } = await import("@trigger.dev/sdk")
      return await tasks.trigger(taskId, payload)
    } catch (e) {
      console.error("[Trigger.dev] Failed to trigger task:", e)
    }
  }
  
  console.log(`[Local Mode] Running analysis orchestrator directly for task ${taskId}`);
  
  // Run in background (don't await)
  (async () => {
    try {
      const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabase
        .from("analysis")
        .update({
          status: "processing",
        })
        .eq("id", payload.analysisId)

      let agentsCompleted = 0

      const result = await runAnalysis(
        {
          ideaText: payload.idea,
          userId: payload.userId,
          analysisId: payload.analysisId,
          plan: payload.userPlan,
        },
        async (agentName, status) => {
          agentsCompleted++
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
    } catch (err) {
      console.error("[Local Mode] Analysis failed:", err)
      try {
        const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
        const supabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        await supabase
          .from("analysis")
          .update({
            status: "failed",
          })
          .eq("id", payload.analysisId)
      } catch (dbErr) {
        console.error("[Local Mode] Failed to mark analysis as failed:", dbErr)
      }
    }
  })()
  
  return { id: `local-${Date.now()}` }
}

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } =
      await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { checkRateLimit } = await import("@/lib/rate-limit")
    const { success } = await checkRateLimit(`analyze:${user.id}`, 20, 3600)
    if (!success) {
      return NextResponse.json(
        { error: "Too many analysis requests. Please try again in an hour." },
        { status: 429 }
      )
    }

    const { idea, analysisType = "full" } =
      await request.json() as {
        idea: string
        analysisType?: "quick" | "full"
      }

    if (!idea || idea.trim().length < 20) {
      return NextResponse.json(
        { error: "Idea must be at least 20 characters" },
        { status: 400 }
      )
    }

    const { data: credits } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    const creditsNeeded = analysisType === "quick" ? 1 : 2

    if (!credits || credits.balance < creditsNeeded) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "NO_CREDITS",
          creditsNeeded,
          creditsAvailable: credits?.balance ?? 0,
        },
        { status: 402 }
      )
    }

    const sanitized = sanitizeIdea(idea)

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single()

    const userPlan = (profile?.plan ?? "free") as
      "free" | "pro" | "premium"

    const { data: savedIdea } = await supabase
      .from("ideas")
      .insert({
        user_id: user.id,
        idea_text: sanitized,
        title: sanitized.slice(0, 80),
        word_count: sanitized.split(" ").length,
      })
      .select()
      .single()

    if (!savedIdea) {
      return NextResponse.json(
        { error: "Failed to save idea" },
        { status: 500 }
      )
    }

    const { createClient: createSupabaseClient } = await import("@supabase/supabase-js")
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: analysis } = await adminSupabase
      .from("analysis")
      .insert({
        idea_id: savedIdea.id,
        user_id: user.id,
        status: "pending",
        analysis_type: analysisType,
        credits_used: creditsNeeded,
      })
      .select()
      .single()

    if (!analysis) {
      return NextResponse.json(
        { error: "Failed to create analysis" },
        { status: 500 }
      )
    }

    const handle = await triggerTask(
      "analyze-startup-idea",
      {
        idea: sanitized,
        userId: user.id,
        analysisId: analysis.id,
        userPlan,
        analysisType,
      }
    )

    return NextResponse.json({
      analysisId: analysis.id,
      jobId: handle.id,
      status: "pending",
    })

  } catch (error) {
    console.error("[analyze route] error:", error)
    return NextResponse.json(
      { error: "Analysis failed to start" },
      { status: 500 }
    )
  }
}