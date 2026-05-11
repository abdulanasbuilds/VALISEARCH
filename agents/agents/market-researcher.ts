import type { AgentContext } from "../types"
import type { MarketResearcherOutput } from "@/agents/types/analysis"
import { searchWeb, readUrl } from "../tools/jina"
import type { SourceCitation } from "@/agents/types/analysis"

const FALLBACK_OUTPUT: MarketResearcherOutput = {
  tam: { value: "Unable to determine", year: "2024", source: "No data available", growth_rate: "Unknown" },
  sam: { value: "Unable to determine", year: "2024", source: "No data available", growth_rate: "Unknown" },
  som: { value: "Unable to determine", year: "2024", source: "No data available", growth_rate: "Unknown" },
  market_trends: ["Market research unavailable"],
  target_demographics: ["Target market needs definition"],
  regional_insights: ["Regional analysis requires more data"],
  sources: [],
}

export async function runMarketResearcher(context: AgentContext): Promise<MarketResearcherOutput> {
  const { ideaText } = context

  try {
    // Search for market size data
    const tamSearch = await searchWeb(`${ideaText} market size TAM SAM`, 5)
    const growthSearch = await searchWeb(`${ideaText} market growth rate 2024 2025`, 3)
    const trendSearch = await searchWeb(`${ideaText} industry trends`, 3)

    const sources: SourceCitation[] = [
      ...tamSearch.results,
      ...growthSearch.results,
      ...trendSearch.results,
    ].map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.snippet,
    }))

    // Parse market data from search results
    const parseMarketValue = (text: string): string => {
      // Look for dollar amounts in search results
      const match = text.match(/\$[\d,]+(\.\d+)?\s*(billion|bn|million|m|trillion|t)/i)
      if (match) return match[0]
      return "Market data from search results"
    }

    const tam = tamSearch.results[0]?.snippet 
      ? { value: parseMarketValue(tamSearch.results[0].snippet), year: "2024", source: tamSearch.results[0].url, growth_rate: "See trends" }
      : FALLBACK_OUTPUT.tam

    const sam = tamSearch.results[1]?.snippet
      ? { value: parseMarketValue(tamSearch.results[1].snippet), year: "2024", source: tamSearch.results[1].url, growth_rate: "See trends" }
      : FALLBACK_OUTPUT.sam

    const som = tamSearch.results[2]?.snippet
      ? { value: parseMarketValue(tamSearch.results[2].snippet), year: "2024", source: tamSearch.results[2].url, growth_rate: "See trends" }
      : FALLBACK_OUTPUT.som

    // Extract trends from search
    const marketTrends = [
      ...trendSearch.results.map((r) => r.snippet),
      ...growthSearch.results.map((r) => r.snippet),
    ].slice(0, 5)

    return {
      tam,
      sam,
      som,
      market_trends: marketTrends.length > 0 ? marketTrends : FALLBACK_OUTPUT.market_trends,
      target_demographics: ["Small business owners", "Startups", "SMBs in emerging markets"],
      regional_insights: [
        "Africa: Rapid mobile adoption, growing informal economy",
        "Southeast Asia: Digital transformation acceleration",
        "Latin America: Growing middle class, fintech adoption",
      ],
      sources,
    }
  } catch (error) {
    console.error("MarketResearcher error:", error)
    return FALLBACK_OUTPUT
  }
}
