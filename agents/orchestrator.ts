import type { AgentContext } from "./prompts"
import type { FullAnalysisOutput, AgentName, AgentStatus } from "@/agents/types/analysis"
import { runIdeaValidator } from "./agents/idea-validator"
import { runMarketResearcher } from "./agents/market-researcher"
import { runCompetitorIntel } from "./agents/competitor-intel"
import { runProblemPrioritizer } from "./agents/problem-prioritizer"
import { runProductManager } from "./agents/product-manager"
import { runOfferArchitect } from "./agents/offer-architect"
import { runGrowthStrategist } from "./agents/growth-strategist"
import { runDistributionPlanner } from "./agents/distribution-planner"
import { runContentCreator } from "./agents/content-creator"
import { runBrandNamer } from "./agents/brand-namer"
import { runScaleArchitect } from "./agents/scale-architect"
import { runSynthesis } from "./agents/synthesis"

export interface AgentResult<T> {
  success: boolean
  data?: T
  error?: string
}

// All 12 agents (11 parallel + 1 synthesis)
const AGENT_FUNCTIONS: Record<AgentName, (context: AgentContext, results?: FullAnalysisOutput) => Promise<unknown>> = {
  idea_validator: runIdeaValidator as (context: AgentContext) => Promise<unknown>,
  market_researcher: runMarketResearcher,
  competitor_intel: runCompetitorIntel,
  problem_prioritizer: runProblemPrioritizer,
  product_manager: runProductManager,
  offer_architect: runOfferArchitect,
  growth_strategist: runGrowthStrategist,
  distribution_planner: runDistributionPlanner,
  content_creator: runContentCreator,
  brand_namer: runBrandNamer,
  scale_architect: runScaleArchitect,
  synthesis: runSynthesis as (context: AgentContext, results?: FullAnalysisOutput) => Promise<unknown>,
}

// Agent execution order
const PARALLEL_AGENTS: AgentName[] = [
  "idea_validator",
  "market_researcher",
  "competitor_intel",
  "problem_prioritizer",
  "product_manager",
  "offer_architect",
  "growth_strategist",
  "distribution_planner",
  "content_creator",
  "brand_namer",
  "scale_architect",
]

export async function runAnalysis(
  context: AgentContext,
  onProgress?: (agentName: AgentName, status: AgentStatus) => void
): Promise<FullAnalysisOutput> {
  // Track results
  const results: Partial<FullAnalysisOutput> = {}

  // Phase 1: Run all 11 agents in parallel using Promise.allSettled
  console.log("Starting parallel agent execution...")
  
  const agentPromises = PARALLEL_AGENTS.map(async (agentName) => {
    try {
      onProgress?.(agentName, "running")
      
      const startTime = Date.now()
      const data = await AGENT_FUNCTIONS[agentName](context)
      const duration = Date.now() - startTime
      
      console.log(`${agentName} completed in ${duration}ms`)
      
      onProgress?.(agentName, "completed")
      
      return { agentName, success: true, data }
    } catch (error) {
      console.error(`${agentName} failed:`, error)
      onProgress?.(agentName, "failed")
      
      return { agentName, success: false, error: String(error) }
    }
  })

  const settledResults = await Promise.allSettled(agentPromises)

  // Extract results
  for (const result of settledResults) {
    if (result.status === "fulfilled") {
      const { agentName, success, data } = result.value
      if (success && data) {
        (results as Record<string, unknown>)[agentName] = data
      }
    }
  }

  // Phase 2: Run synthesis agent (always runs last, always Claude Sonnet)
  console.log("Starting synthesis agent...")
  onProgress?.("synthesis", "running")
  
  try {
    const synthesisResult = await runSynthesis(context, results as FullAnalysisOutput)
    results.synthesis = synthesisResult
    onProgress?.("synthesis", "completed")
  } catch (error) {
    console.error("Synthesis failed:", error)
    onProgress?.("synthesis", "failed")
  }

  return results as FullAnalysisOutput
}

// Helper to get agent by name
export function getAgentFunction(agentName: AgentName) {
  return AGENT_FUNCTIONS[agentName]
}

// Helper to get all agent names
export function getAllAgentNames(): AgentName[] {
  return [...PARALLEL_AGENTS, "synthesis"]
}