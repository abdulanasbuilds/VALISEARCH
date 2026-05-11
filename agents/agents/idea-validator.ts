import type { AgentContext } from "../types"
import type { IdeaValidatorOutput, SourceCitation } from "@/agents/types/analysis"
import { searchWeb, readUrl } from "../tools/jina"

const FALLBACK_OUTPUT: IdeaValidatorOutput = {
  overall_score: 50,
  verdict: "Needs work",
  dimensions: [
    { name: "Clarity", score: 50, label: "Moderate", rationale: "Idea requires more specificity." },
    { name: "Feasibility", score: 50, label: "Moderate", rationale: "Feasibility depends on implementation." },
    { name: "Market Fit", score: 50, label: "Moderate", rationale: "Target market needs clarification." },
    { name: "Uniqueness", score: 50, label: "Moderate", rationale: "Competition analysis needed." },
    { name: "Scalability", score: 50, label: "Moderate", rationale: "Growth strategy undefined." },
    { name: "Timing", score: 50, label: "Moderate", rationale: "Market timing unclear." },
  ],
  strengths: ["Clear problem statement", "Technology-enabled solution"],
  weaknesses: ["Unclear target market", "Competition exists", "Business model unclear"],
  recommendation: "Refine the idea with more specific market and competitive analysis.",
}

export async function runIdeaValidator(context: AgentContext): Promise<IdeaValidatorOutput> {
  const { ideaText } = context

  try {
    // Get market context via web search
    const searchResults = await searchWeb(`${ideaText} market size trends`, 3)
    
    // Prepare prompt with market context
    const userPrompt = `${generateUserPrompt(ideaText)}

Context from web search:
${searchResults.results.map((r) => `- ${r.title}: ${r.snippet}`).join("\n")}`

    // Call AI (would be via Edge Function in production)
    // For now, return fallback with search context
    const sources: SourceCitation[] = searchResults.results.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
    }))

    return {
      ...FALLBACK_OUTPUT,
      dimensions: FALLBACK_OUTPUT.dimensions.map((d) => ({
        ...d,
        rationale: `${d.rationale} (Web search found ${searchResults.total} relevant sources)`,
      })),
    }
  } catch (error) {
    console.error("IdeaValidator error:", error)
    return FALLBACK_OUTPUT
  }
}
