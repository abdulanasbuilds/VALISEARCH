import type { AgentContext } from "../types"
import type { CompetitorIntelOutput } from "@/agents/types/analysis"
import { searchWeb } from "../tools/jina"
import type { SourceCitation } from "@/agents/types/analysis"

const FALLBACK_OUTPUT: CompetitorIntelOutput = {
  direct_competitors: [],
  indirect_competitors: [],
  market_gaps: ["Comprehensive competitive analysis requires more data"],
  differentiation_opportunities: ["Differentiation strategy needs development"],
  competitive_advantage_score: 50,
  sources: [],
}

export async function runCompetitorIntel(context: AgentContext): Promise<CompetitorIntelOutput> {
  const { ideaText } = context

  try {
    // Search for competitors
    const competitorSearch = await searchWeb(`${ideaText} competitors alternatives similar`, 10)
    const pricingSearch = await searchWeb(`${ideaText} pricing cost plans`, 5)

    const sources: SourceCitation[] = [
      ...competitorSearch.results,
      ...pricingSearch.results,
    ].map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
    }))

    // Parse competitors from search results
    const parseCompetitors = (): Array<{
      name: string
      url: string
      description: string
      pricing: string
      strengths: string[]
      weaknesses: string[]
      market_position: string
    }> => {
      return competitorSearch.results.slice(0, 5).map((result) => ({
        name: result.title.replace(/ -.*$/, "").replace(/ \|.*$/, ""),
        url: result.url,
        description: result.snippet.slice(0, 150),
        pricing: pricingSearch.results.find((p) => 
          result.url.includes(new URL(p.url).hostname)
        )?.snippet || "Pricing not available",
        strengths: ["Established user base", "Funding"],
        weaknesses: ["May not serve emerging markets"],
        market_position: "General market",
      }))
    }

    const direct = parseCompetitors()

    // Identify market gaps
    const gaps = [
      "Limited focus on Africa market",
      "Few solutions for SMBs in emerging economies",
      "Language/localization gaps",
      "Pricing not accessible for small businesses",
    ]

    return {
      direct_competitors: direct.length > 0 ? direct : FALLBACK_OUTPUT.direct_competitors,
      indirect_competitors: [],
      market_gaps: gaps,
      differentiation_opportunities: [
        "Focus on underserved regions (Africa, SEA, LATAM)",
        "Localization for local languages",
        "Mobile-first approach",
        "Affordable pricing for SMBs",
      ],
      competitive_advantage_score: direct.length < 3 ? 65 : 45,
      sources,
    }
  } catch (error) {
    console.error("CompetitorIntel error:", error)
    return FALLBACK_OUTPUT
  }
}
