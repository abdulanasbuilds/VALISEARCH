import type { AgentContext } from "../types"
import type { OfferArchitectOutput } from "@/agents/types/analysis"
import { traceAgentCall } from "../tools/langsmith"

const FALLBACK_OUTPUT: OfferArchitectOutput = {
  headline: "Transform Your Startup Idea into Action",
  subheadline: "Get AI-powered insights in minutes",
  value_proposition: "Comprehensive analysis to validate your startup idea",
  ideal_customer_profile: "Early-stage founders in emerging markets",
  pricing_tiers: [
    { name: "Free", price: "$0", billing_period: "forever", features: ["6 credits/month"], target_user: "New users", recommended: false },
    { name: "Pro", price: "$29", billing_period: "month", features: ["100 credits/month", "Priority support"], target_user: "Active founders", recommended: true },
    { name: "Premium", price: "$79", billing_period: "month", features: ["Unlimited credits", "API access"], target_user: "Teams", recommended: false },
  ],
  objection_handlers: [],
  urgency_hook: "Start validating your idea today - your next big opportunity awaits",
}

export async function runOfferArchitect(context: AgentContext): Promise<OfferArchitectOutput> {
  return traceAgentCall(
    {
      agentName: "offer_architect",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runOfferArchitectInner(context)
  )
}

async function runOfferArchitectInner(context: AgentContext): Promise<OfferArchitectOutput> {
  const { ideaText, plan } = context

  const tier0 = FALLBACK_OUTPUT.pricing_tiers[0]
  const tier1 = FALLBACK_OUTPUT.pricing_tiers[1]

  if (!tier0 || !tier1) {
    return FALLBACK_OUTPUT
  }

  const pricingBasedOnPlan = plan === "free"
    ? FALLBACK_OUTPUT.pricing_tiers
    : plan === "premium"
    ? [
        { ...tier0, recommended: false },
        { ...tier1, price: "$29", recommended: false },
        { name: "Premium", price: "$79", billing_period: "month", features: ["Unlimited credits", "Deep analysis", "API access"], target_user: "Teams & agencies", recommended: true },
      ]
    : FALLBACK_OUTPUT.pricing_tiers

  return {
    headline: "Validate Your Startup Idea in Minutes",
    subheadline: "12 AI agents analyze market, competitors, and growth strategy",
    value_proposition: "Get comprehensive startup intelligence - market sizing, competitor analysis, growth strategy - all in one report. Built specifically for founders in Africa, Southeast Asia, and Latin America.",
    ideal_customer_profile: "Early-stage founders, solo entrepreneurs, and small teams in emerging markets who need fast, actionable insights without expensive consulting",
    pricing_tiers: pricingBasedOnPlan,
    objection_handlers: [
      { objection: "This seems expensive for a startup", response: "Our $29/month plan gives you 100 credits - that's 50 full analyses. Compare to $500+ for a single consultant report." },
      { objection: "How accurate is this?", response: "We cite real sources for every data point. Our 12 agents cross-reference to flag contradictions." },
      { objection: "I can do this myself", response: "Our agents search the live web, Reddit, and HackerNews in minutes - what would take you hours of research." },
    ],
    urgency_hook: "The best time to validate your idea was yesterday. The second best time is today. Start with 6 free credits.",
  }
}
