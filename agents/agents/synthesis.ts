import type { AgentContext } from "../types"
import type { FullAnalysisOutput, SynthesisOutput } from "@/agents/types/analysis"
import { traceAgentCall } from "../tools/langsmith"

export async function runSynthesis(context: AgentContext, results: FullAnalysisOutput): Promise<SynthesisOutput> {
  return traceAgentCall(
    {
      agentName: "synthesis",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "claude-sonnet",
      userPlan: "free",
    },
    () => runSynthesisInner(context, results)
  )
}

async function runSynthesisInner(context: AgentContext, results: FullAnalysisOutput): Promise<SynthesisOutput> {
  const { ideaText } = context

  // Cross-reference all agent outputs
  const ideaValidator = results.idea_validator
  const marketResearcher = results.market_researcher
  const competitorIntel = results.competitor_intel
  const problemPrioritizer = results.problem_prioritizer
  const productManager = results.product_manager
  const offerArchitect = results.offer_architect
  const growthStrategist = results.growth_strategist
  const distributionPlanner = results.distribution_planner
  const contentCreator = results.content_creator
  const brandNamer = results.brand_namer
  const scaleArchitect = results.scale_architect

  // Calculate overall score (weighted average)
  const scores = [
    ideaValidator.overall_score,
    marketResearcher.sources.length > 0 ? 65 : 45,
    competitorIntel.competitive_advantage_score,
    problemPrioritizer.problem_market_fit_score,
    productManager.mvp_features.length >= 3 ? 60 : 40,
    offerArchitect.pricing_tiers.length >= 3 ? 60 : 40,
    growthStrategist.primary_channels.length >= 2 ? 65 : 45,
    distributionPlanner.launch_strategy.length >= 3 ? 60 : 40,
    contentCreator.hooks.length >= 5 ? 60 : 40,
    brandNamer.names.length >= 3 ? 60 : 40,
    scaleArchitect.phases.length >= 4 ? 65 : 45,
  ]

  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

  // Determine verdict
  let verdict: SynthesisOutput["verdict"] = "needs-work"
  if (overallScore >= 75) verdict = "strong"
  else if (overallScore >= 60) verdict = "promising"
  else if (overallScore >= 50) verdict = "needs-work"
  else if (overallScore >= 35) verdict = "risky"
  else verdict = "not-recommended"

  // Key insights from cross-referencing
  const insights: SynthesisOutput["key_insights"] = []

  // Market + Problem alignment
  if (marketResearcher.sources.length > 0 && problemPrioritizer.total_signals_found > 5) {
    insights.push({
      insight: "Strong market demand signal combined with real problem pain points",
      confidence: "high",
      supporting_agents: ["market_researcher", "problem_prioritizer"],
      contradictions: [],
    })
  }

  // Competition analysis
  if (competitorIntel.competitive_advantage_score > 55) {
    insights.push({
      insight: "Clear competitive differentiation opportunities identified",
      confidence: "high",
      supporting_agents: ["competitor_intel", "offer_architect"],
      contradictions: [],
    })
  } else {
    insights.push({
      insight: "Competitive landscape is crowded - focus on underserved regions",
      confidence: "medium",
      supporting_agents: ["competitor_intel"],
      contradictions: [],
    })
  }

  // Growth feasibility
  if (growthStrategist.primary_channels.length >= 2 && distributionPlanner.partnerships.length >= 2) {
    insights.push({
      insight: "Multiple growth channels identified with partnership opportunities",
      confidence: "high",
      supporting_agents: ["growth_strategist", "distribution_planner"],
      contradictions: [],
    })
  }

  // Top strengths
  const strengths = [
    "AI-powered analysis is fast and comprehensive",
    "Cost-effective compared to traditional consulting",
    "Designed specifically for emerging markets",
    "Multiple growth channels identified",
    "Clear path to revenue with subscription model",
  ]

  // Top risks
  const risks = [
    "Competition from established players",
    "User adoption in new markets may be slow",
    "AI accuracy needs continuous validation",
    "Need to build trust with skeptical founders",
    "Technical infrastructure scaling challenges",
  ]

  return {
    executive_summary: `Based on comprehensive analysis across 12 specialized AI agents, this startup idea demonstrates ${verdict === "strong" || verdict === "promising" ? "significant potential" : "mixed signals"}. The market research indicates ${marketResearcher.sources.length > 0 ? "real market opportunity" : "uncertain market size"}, while problem prioritization found ${problemPrioritizer.total_signals_found} demand signals from community discussions. The competitive landscape shows ${competitorIntel.differentiation_opportunities.length} differentiation opportunities, particularly in underserved regions. Growth strategy identifies multiple channels with potential for ${scaleArchitect.phases[1]?.revenue_target || "$1K-5K MRR"}.`,
    overall_score: overallScore,
    verdict,
    key_insights: insights.length > 0 ? insights : [{ insight: "Further validation recommended", confidence: "low", supporting_agents: [], contradictions: [] }],
    top_3_strengths: strengths.slice(0, 3),
    top_3_risks: risks.slice(0, 3),
    immediate_next_steps: [
      "Validate core assumption with 10 potential users",
      "Build MVP focusing on must-have features",
      "Launch in one target region first",
      "Collect feedback and iterate quickly",
      "Set up analytics to track key metrics",
    ],
    one_line_pitch: `${brandNamer.recommended_name} helps founders in Africa, SEA, and LATAM validate startup ideas in minutes using 12 specialized AI agents, replacing expensive consultants with instant, data-driven insights.`,
  }
}
