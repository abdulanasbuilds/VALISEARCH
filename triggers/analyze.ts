// Trigger.dev task definition
// This file would be deployed to Trigger.dev, not part of Next.js build

import { eventTrigger, task } from "@trigger.dev/sdk"
import { z } from "zod"

// This is a template - deploy separately to Trigger.dev
export const analyzeJob = eventTrigger({
  name: "analyze.idea",
  id: "analyze-idea",
  schema: z.object({
    ideaText: z.string(),
    userId: z.string(),
    analysisId: z.string(),
    analysisType: z.enum(["quick", "full", "deep"]),
  }),
})

// Task definition (run in Trigger.dev, not Next.js)
export const runAnalysisTask = task({
  id: "run-analysis",
  run: async (payload, { ctx }) => {
    const { ideaText, userId, analysisId, analysisType } = payload
    
    console.log(`Starting analysis ${analysisId}`)
    
    // Import and run the orchestrator
    // In production, this would run all 12 agents
    
    return { analysisId, status: "completed" }
  },
})

// Credit checking function
export async function checkCredits(supabase: any, userId: string, analysisType: string) {
  const costs = { quick: 1, full: 2, deep: 3 }
  const cost = costs[analysisType] ?? 2
  
  const { data: credits } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", userId)
    .single()
  
  return {
    hasCredits: (credits?.balance ?? 0) >= cost,
    balance: credits?.balance ?? 0,
    cost,
  }
}