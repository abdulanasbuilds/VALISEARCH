import type { AgentContext } from "../types"
import type { DistributionPlannerOutput } from "@/agents/types/analysis"
import { traceAgentCall } from "../tools/langsmith"

const FALLBACK_OUTPUT: DistributionPlannerOutput = {
  launch_strategy: [{ phase: "Pre-launch", duration: "2 weeks", actions: ["Build waitlist"], goals: ["500 signups"] }],
  partnerships: [],
  distribution_channels: ["Social media"],
  community_building: ["Start community"],
  pr_angles: [],
}

export async function runDistributionPlanner(context: AgentContext): Promise<DistributionPlannerOutput> {
  return traceAgentCall(
    {
      agentName: "distribution_planner",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runDistributionPlannerInner(context)
  )
}

async function runDistributionPlannerInner(context: AgentContext): Promise<DistributionPlannerOutput> {
  return {
    launch_strategy: [
      {
        phase: "Pre-Launch (Weeks 1-2)",
        duration: "2 weeks",
        actions: [
          "Build waitlist landing page",
          "Share on personal social media",
          "Post in relevant subreddits (r/startups, r/entrepreneur)",
          "Email to personal network",
        ],
        goals: ["500 waitlist signups", "Build initial buzz"],
      },
      {
        phase: "Soft Launch (Weeks 3-4)",
        duration: "2 weeks",
        actions: [
          "Open to waitlist",
          "Collect feedback",
          "Fix critical issues",
          "Encourage testimonials",
        ],
        goals: ["100 active users", "Initial feedback collected"],
      },
      {
        phase: "Public Launch (Weeks 5-6)",
        duration: "2 weeks",
        actions: [
          "Product Hunt launch",
          "Press release distribution",
          "Influencer outreach",
          "Twitter Spaces with founders",
        ],
        goals: ["1000 signups", "First paying customers"],
      },
      {
        phase: "Growth (Weeks 7-12)",
        duration: "6 weeks",
        actions: [
          "Content marketing at scale",
          "Community expansion",
          "Partnership outreach",
          "Iterate on product based on feedback",
        ],
        goals: ["5000 signups", "Product-market fit signals"],
      },
    ],
    partnerships: [
      {
        partner_type: "Accelerators & Incubators",
        examples: ["AfricArena, MEST, TLcom Capital"],
        value_exchange: "Free analysis for their startups, they promote to cohort",
        outreach_template: "Hi [Name], we'd love to offer free ValiSearch analysis to your current cohort. Our 12 AI agents can help validate startup ideas in minutes.",
      },
      {
        partner_type: "Co-working Spaces",
        examples: ["ActivSpaces, Hive Colab, WeWork Africa"],
        value_exchange: "Workshop on startup validation, discounted access for members",
        outreach_template: "We'd love to run a free workshop on validating startup ideas for your members using our AI platform.",
      },
      {
        partner_type: "Startup Communities",
        examples: ["Afropreneur, Founders Africa, Indie Hackers Africa"],
        value_exchange: "Sponsor meetups, provide analysis credits to members",
        outreach_template: "We're building a tool for African founders. Would love to sponsor your next event and offer free analysis to attendees.",
      },
    ],
    distribution_channels: [
      "Twitter (founder community)",
      "LinkedIn (professional network)",
      "Reddit (r/startups, r/entrepreneur)",
      "Product Hunt",
      "Discord/Telegram communities",
      "Email newsletter",
      "SEO/content marketing",
    ],
    community_building: [
      "Launch ValiSearch Discord/Telegram for founders",
      "Weekly threads: \"What's your startup idea?\" + analysis",
      "Monthly \"Pitch Practice\" events",
      "Showcase successful analyses with permission",
      "Create Slack channel for beta testers",
    ],
    pr_angles: [
      "Solo founder from Ghana building AI startup tool",
      "12 AI agents validate startup ideas in minutes",
      "First platform designed for Africa/SEA/LATAM founders",
      "Free tool challenges expensive consulting",
      "From WASSCE student to startup founder story",
    ],
  }
}