import type { AgentContext } from "../types"
import type { ScaleArchitectOutput } from "@/agents/types/analysis"
import { traceAgentCall } from "../tools/langsmith"

const FALLBACK_OUTPUT: ScaleArchitectOutput = {
  phases: [],
  revenue_model: "",
  unit_economics: { cac: "", ltv: "", ltv_cac_ratio: "", payback_period: "" },
  funding_recommendation: "",
  key_assumptions: [],
}

export async function runScaleArchitect(context: AgentContext): Promise<ScaleArchitectOutput> {
  return traceAgentCall(
    {
      agentName: "scale_architect",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runScaleArchitectInner(context)
  )
}

async function runScaleArchitectInner(context: AgentContext): Promise<ScaleArchitectOutput> {
  return {
    phases: [
      {
        phase: 1,
        name: "MVP Launch",
        duration: "Months 1-3",
        revenue_target: "$0-1K MRR",
        key_actions: [
          "Launch MVP with core features",
          "Get first 100 users",
          "Collect feedback, iterate",
          "Establish pricing",
        ],
        milestones: ["First paid user", "First retention", "First referral"],
        risks: ["Feature prioritization", "User engagement", "Technical debt"],
      },
      {
        phase: 2,
        name: "Product-Market Fit",
        duration: "Months 4-6",
        revenue_target: "$1K-5K MRR",
        key_actions: [
          "Double down on top features",
          "Build community",
          "Content marketing at scale",
          "Optimize conversion funnel",
        ],
        milestones: ["10 paying users", "NPS > 40", "Weekly growth > 10%"],
        risks: ["Competition entry", "Pricing pressure", "Team bandwidth"],
      },
      {
        phase: 3,
        name: "Growth",
        duration: "Months 7-12",
        revenue_target: "$5K-10K MRR",
        key_actions: [
          "Scale marketing channels",
          "Hire first team member",
          "Launch mobile app",
          "Expand to new regions",
        ],
        milestones: ["100 paying users", "Series A ready metrics", "Team of 2-3"],
        risks: ["Scaling challenges", "Cash flow", "Market saturation"],
      },
      {
        phase: 4,
        name: "Scale",
        duration: "Year 2",
        revenue_target: "$10K+ MRR",
        key_actions: ["Expand team", "Launch API", "Enterprise features", "Strategic partnerships"],
        milestones: ["Sustainable profitability", "Market leader position", "Team of 10+"],
        risks: ["Burnout", "Competition", "Regulatory"],
      },
    ],
    revenue_model: "SaaS subscription - Monthly/annual plans. Additional revenue from premium analyses and API usage.",
    unit_economics: {
      cac: "$15-30",
      ltv: "$300-500",
      ltv_cac_ratio: "10-20x",
      payback_period: "1-2 months",
    },
    funding_recommendation: "Bootstrapped to $10K MRR. Then raise seed round (~$500K) for aggressive expansion. Focus on revenue first - better terms when you don't need the money.",
    key_assumptions: [
      "Founders are willing to pay for idea validation",
      "AI-generated analysis meets quality expectations",
      "Emerging markets (Africa, SEA, LATAM) have sufficient demand",
      "Can compete with established consulting firms on value",
      "Retention rate > 80% monthly",
    ],
  }
}