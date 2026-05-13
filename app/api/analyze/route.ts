import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sanitizeIdea } from "@/lib/utils"

async function triggerTask(taskId: string, payload: unknown) {
  console.log(`[Trigger.dev] Would trigger task ${taskId} with:`, payload)
  return { id: `mock-${Date.now()}` }
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

    const { data: analysis } = await supabase
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