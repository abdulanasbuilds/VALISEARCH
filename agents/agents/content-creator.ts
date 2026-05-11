import type { AgentContext } from "../types"
import type { ContentCreatorOutput } from "@/agents/types/analysis"

export async function runContentCreator(context: AgentContext): Promise<ContentCreatorOutput> {
  const { ideaText } = context

  return {
    hooks: [
      { hook: "I used to pay consultants $500 for what our 12 AI agents do in 2 minutes", platform: "Twitter", format: "Thread", why_it_works: "Contrasts expensive vs cheap, triggers curiosity" },
      { hook: "The startup idea that got 82/100 vs the one that got 45/100 - here's the difference", platform: "Twitter", format: "Thread", why_it_works: "Shows score difference, creates curiosity" },
      { hook: "Validate your startup idea in 2 minutes. Here's how:", platform: "YouTube", format: "Shorts", why_it_works: "Direct value proposition, visual" },
      { hook: "POV: You're a broke founder but your idea is worth millions", platform: "TikTok", format: "Video", why_it_works: "Relatable, creates hope" },
      { hook: "Stop validating in your head. Start validating with data.", platform: "LinkedIn", format: "Post", why_it_works: "Direct, challenges status quo" },
      { hook: "What 100 hours of market research looks like vs 2 minutes with AI", platform: "Twitter", format: "Comparison", why_it_works: "Shows time savings" },
      { hook: "My 12 AI agents just analyzed 500 startup ideas. Here's what works.", platform: "Newsletter", format: "Article", why_it_works: "Authority, broad appeal" },
      { hook: "The 3 questions every founder should ask before building", platform: "Instagram", format: "Carousel", why_it_works: "Actionable, educational" },
      { hook: "Why most startups fail (and how to not be one of them)", platform: "YouTube", format: "Shorts", why_it_works: "Universal pain point" },
      { hook: "Built this during WASSCE prep. Now it's helping 1000s of founders.", platform: "Twitter", format: "Origin story", why_it_works: "Underdog narrative" },
    ],
    content_system: {
      pillars: [
        "Startup validation tips",
        "Market research insights",
        "Founder success stories",
        "Behind the scenes of building",
      ],
      weekly_cadence: [
        { day: "Monday", content_type: "Educational thread", platform: "Twitter" },
        { day: "Tuesday", content_type: "Tips thread", platform: "LinkedIn" },
        { day: "Wednesday", content_type: "Short video", platform: "YouTube/TikTok" },
        { day: "Thursday", content_type: "Case study", platform: "Newsletter" },
        { day: "Friday", content_type: "Engagement post", platform: "Discord" },
      ],
      content_repurposing: [
        "Tweet thread -> LinkedIn post",
        "YouTube Shorts -> TikTok",
        "Newsletter -> Blog post",
        "Podcast clips -> Twitter threads",
      ],
    },
    seo_keywords: [
      "startup idea validation",
      "how to validate startup idea",
      "market research for startups",
      "startup idea analysis",
      "validate business idea",
      "startup idea score",
    ],
    email_subject_lines: [
      "The difference between a $50K idea and a $500K idea",
      "Your startup idea scored 72/100. Here's how to get to 90.",
      "What 12 AI agents think about your idea",
      "Founders who used this validated faster (data)",
      "Stop guessing. Start validating.",
    ],
    social_bio: "12 AI agents validate your startup idea in minutes. Free for first 3 analyses. Built for Africa/SEA/LATAM founders.",
  }
}
