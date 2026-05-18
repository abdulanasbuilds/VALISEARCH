import type { AgentContext } from "../types"
import type { MarketResearcherOutput } from "@/agents/types/analysis"
import { searchWeb, readUrl } from "../tools/jina"
import { retrieveKnowledge, formatKnowledgeForPrompt } from "../tools/rag"
import { traceAgentCall } from "../tools/langsmith"
import { withRetryGraph } from "../tools/retry-graph"
import { googleSearch } from "../tools/serper"
import { getSectorPerformance, getMarketSentiment } from "../tools/financial"
import { getIPOCalendar } from "../tools/finnhub"
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
  return traceAgentCall(
    {
      agentName: "market_researcher",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runMarketResearcherInner(context)
  )
}

async function runMarketResearcherInner(context: AgentContext): Promise<MarketResearcherOutput> {
  const { ideaText } = context

  // First, retrieve relevant knowledge from RAG
  const knowledgeResults = await retrieveKnowledge(context, { limit: 3 })
  const knowledgeContext = formatKnowledgeForPrompt(knowledgeResults)

  try {
    // Serper search (PRIMARY - structured Google SERP data)
    const serperResults = await withRetryGraph(
      () => googleSearch(`${ideaText} market size TAM SAM 2026`),
      { maxAttempts: 2, fallback: { query: ideaText, results: [], relatedSearches: [] }, operationName: "market-serper" }
    )

    // Jina search (fallback for trends)
    const tamSearch = await withRetryGraph(
      () => searchWeb(`${ideaText} market size TAM SAM`, 5),
      { maxAttempts: 2, fallback: { results: [], total: 0 }, operationName: "market-tam" }
    )
    const growthSearch = await withRetryGraph(
      () => searchWeb(`${ideaText} market growth rate 2024 2025`, 3),
      { maxAttempts: 2, fallback: { results: [], total: 0 }, operationName: "market-growth" }
    )
    const trendSearch = await withRetryGraph(
      () => searchWeb(`${ideaText} industry trends`, 3),
      { maxAttempts: 2, fallback: { results: [], total: 0 }, operationName: "market-trends" }
    )

    // Real sector performance data from Alpha Vantage
    const sectorData = await withRetryGraph(
      () => getSectorPerformance(),
      { maxAttempts: 1, fallback: [], operationName: "sector-performance" }
    )

    // News sentiment from Alpha Vantage
    const sentiment = await withRetryGraph(
      () => getMarketSentiment(ideaText),
      { maxAttempts: 1, fallback: { overallSentiment: "neutral" as const, score: 0, articlesAnalyzed: 0 }, operationName: "market-sentiment" }
    )

    // IPO calendar from Finnhub (follow-the-money data)
    const ipoData = await withRetryGraph(
      () => getIPOCalendar(),
      { maxAttempts: 1, fallback: [], operationName: "ipo-calendar" }
    )

    const sources: SourceCitation[] = [
      ...serperResults.results.map(r => ({ title: r.title, url: r.link, snippet: r.snippet })),
      ...tamSearch.results,
      ...growthSearch.results,
      ...trendSearch.results,
    ].map((r) => ({
      title: r.title,
      url: r.url ?? "",
      snippet: r.snippet ?? "",
    }))

    const parseMarketValue = (text: string): string => {
      const match = text.match(/\$[\d,]+(\.\d+)?\s*(billion|bn|million|m|trillion|t)/i)
      if (match) return match[0]
      return "Market data from search results"
    }

    const getSourceUrl = (item: { url?: string; link?: string } | undefined): string => {
      if (!item) return ""
      return item.url ?? item.link ?? ""
    }

    const tamResults = tamSearch.results.length > 0 ? tamSearch.results : serperResults.results
    const tam = tamResults[0]?.snippet
      ? { value: parseMarketValue(tamResults[0].snippet), year: "2024", source: getSourceUrl(tamResults[0]), growth_rate: "See trends" }
      : FALLBACK_OUTPUT.tam

    const sam = tamResults[1]?.snippet
      ? { value: parseMarketValue(tamResults[1].snippet), year: "2024", source: getSourceUrl(tamResults[1]), growth_rate: "See trends" }
      : FALLBACK_OUTPUT.sam

    const som = tamResults[2]?.snippet
      ? { value: parseMarketValue(tamResults[2].snippet), year: "2024", source: getSourceUrl(tamResults[2]), growth_rate: "See trends" }
      : FALLBACK_OUTPUT.som

    const marketTrends = [
      ...trendSearch.results.map((r) => r.snippet),
      ...growthSearch.results.map((r) => r.snippet),
      ...sectorData.map((s) => `${s.sector}: ${s.performance}%`),
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
      sources: [
        ...sources,
        ...knowledgeResults.map((k) => ({
          title: k.title,
          url: k.source_url,
          snippet: k.content.slice(0, 150),
        })),
      ],
    }
  } catch (error) {
    console.error("MarketResearcher error:", error)
    return FALLBACK_OUTPUT
  }
}
