import type { AgentContext } from "../types"
import type { GrowthStrategistOutput } from "@/agents/types/analysis"

const FALLBACK_OUTPUT: GrowthStrategistOutput = {
  primary_channels: [{ channel: "Content marketing", strategy: "SEO blog posts", estimated_cac: "$0-5", timeline: "3-6 months", difficulty: "medium" }],
  secondary_channels: [],
  four_week_plan: [{ week: 1, theme: "Foundation", actions: ["Set up analytics", "Create content calendar"], expected_outcome: "Ready to launch" }],
  viral_loops: ["Referral program"],
  key_metrics: ["CAC", "LTV", "Conversion rate"],
}

export async function runGrowthStrategist(context: AgentContext): Promise<GrowthStrategistOutput> {
  return {
    primary_channels: [
      {
        channel: "Content Marketing",
        strategy: "Blog posts on startup validation, market research tips, case studies",
        estimated_cac: "$0-3",
        timeline: "3-6 months for SEO traction",
        difficulty: "medium",
      },
      {
        channel: "Twitter/LinkedIn",
        strategy: "Share insights, engage with founder communities, threads on startup ideas",
        estimated_cac: "$0",
        timeline: "1-3 months for traction",
        difficulty: "easy",
      },
      {
        channel: "Community Building",
        strategy: "Discord/Telegram group for startup founders, weekly AMAs",
        estimated_cac: "$0-2",
        timeline: "2-4 months to build",
        difficulty: "medium",
      },
    ],
    secondary_channels: [
      { channel: "Product Hunt", strategy: "Launch on PH with compelling tagline", estimated_cac: "$0", timeline: "Day of launch", difficulty: "easy" },
      { channel: "Partnerships", strategy: "Partner with accelerators, incubators", estimated_cac: "$5-10", timeline: "3-6 months", difficulty: "hard" },
      { channel: "Email Outreach", strategy: "Cold emails to target ICP", estimated_cac: "$1-5", timeline: "Ongoing", difficulty: "medium" },
    ],
    four_week_plan: [
      { week: 1, theme: "Foundation", actions: ["Set up Mixpanel/PostHog", "Create content calendar", "Setup social profiles", "Write first 3 blog posts"], expected_outcome: "Analytics ready, content pipeline established" },
      { week: 2, theme: "Launch", actions: ["Publish blog posts", "Post on Twitter daily", "Launch Discord community", "Submit to Product Hunt"], expected_outcome: "Initial user acquisition, community launched" },
      { week: 3, theme: "Engage", actions: ["Host first AMA", "Email outreach to 50 founders", "Share case study", "Engage in relevant communities"], expected_outcome: "First conversions, community engagement" },
      { week: 4, theme: "Optimize", actions: ["Analyze metrics", "A/B test CTAs", "Double down on what works", "Plan month 2 content"], expected_outcome: "Growth playbook validated" },
    ],
    viral_loops: [
      "Share analysis results with branded watermark - users share to remove",
      "Referral program: 2 free credits for each referral",
      "Community-driven feedback loops",
    ],
    key_metrics: [
      "CAC (Customer Acquisition Cost)",
      "LTV (Lifetime Value)",
      "LTV:CAC ratio (target 3:1)",
      "Conversion rate (visitor to user)",
      "Activation rate (user to first analysis)",
      "Weekly active users",
      "Net Promoter Score",
    ],
  }
}
