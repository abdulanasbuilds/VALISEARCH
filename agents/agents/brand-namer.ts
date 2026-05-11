import type { AgentContext } from "../types"
import type { BrandNamerOutput } from "@/agents/types/analysis"

export async function runBrandNamer(context: AgentContext): Promise<BrandNamerOutput> {
  const { ideaText } = context

  return {
    names: [
      { name: "ValiSearch", tagline: "Validate. Build. Scale.", domain_suggestion: "valisearch.co", reasoning: "Direct, memorable, describes action", tone: "Professional, trustworthy" },
      { name: "IdeaForge", tagline: "Forge Your Vision", domain_suggestion: "ideaforge.io", reasoning: "Action-oriented, powerful", tone: "Bold, dynamic" },
      { name: "LaunchPad", tagline: "Launch With Confidence", domain_suggestion: "launchpadhq.com", reasoning: "Classic startup metaphor", tone: "Encouraging, actionable" },
      { name: "VentureAI", tagline: "Smart Ventures Start Here", domain_suggestion: "ventureai.co", reasoning: "AI-focused, professional", tone: "Modern, tech-forward" },
      { name: "ValidateIQ", tagline: "Intelligence for Ideas", domain_suggestion: "validateiq.com", reasoning: "Smart positioning", tone: "Analytical, smart" },
    ],
    recommended_name: "ValiSearch",
    brand_voice: {
      personality: ["Helpful", "Empowering", "Direct", "Visionary"],
      tone_words: ["validate", "discover", "build", "scale"],
      avoid_words: ["complicated", "expensive", "slow", "uncertain"],
      sample_sentences: [
        "Your next big idea deserves better than a guess.",
        "Validation isn't about doubt—it's about confidence.",
        "Every successful founder started with a validated idea.",
        "Data beats intuition. Every time.",
      ],
    },
    color_palette: [
      { name: "Primary Blue", hex: "#1B4FFF", usage: "Main brand color, buttons, accents" },
      { name: "Light Blue", hex: "#EEF2FF", usage: "Backgrounds, highlights" },
      { name: "Success Green", hex: "#16A34A", usage: "Scores, positive indicators" },
      { name: "Warning Amber", hex: "#D97706", usage: "Medium scores, caution" },
      { name: "Text Dark", hex: "#0C0D0E", usage: "Headings, primary text" },
      { name: "Text Muted", hex: "#52565E", usage: "Secondary text, labels" },
    ],
    typography_suggestion: "Inter (Google Fonts) - Clean, modern, highly legible. Use weights 500-700 for headings, 400 for body text.",
  }
}
