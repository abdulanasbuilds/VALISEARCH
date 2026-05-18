import type { AgentContext } from "../types"
import type { CompetitorIntelOutput } from "@/agents/types/analysis"
import { searchWeb } from "../tools/jina"
import { traceAgentCall } from "../tools/langsmith"
import { withRetryGraph } from "../tools/retry-graph"
import { googleSearch } from "../tools/serper"
import { scrapeCompetitorUrls } from "../tools/firecrawl"
import { getCompanyNews } from "../tools/finnhub"
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
  return traceAgentCall(
    {
      agentName: "competitor_intel",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runCompetitorIntelInner(context)
  )
}

async function runCompetitorIntelInner(context: AgentContext): Promise<CompetitorIntelOutput> {
  const { ideaText } = context

  try {
    // Serper search (PRIMARY - structured Google SERP)
    const serperResults = await withRetryGraph(
      () => googleSearch(`${ideaText} competitors alternatives`),
      { maxAttempts: 3, fallback: { query: ideaText, results: [], relatedSearches: [] }, operationName: "competitor-serper" }
    )

    // Jina search (fallback)
    const competitorSearch = await withRetryGraph(
      () => searchWeb(`${ideaText} competitors alternatives similar`, 10),
      { maxAttempts: 2, fallback: { results: [], total: 0 }, operationName: "competitor-search" }
    )
    const pricingSearch = await withRetryGraph(
      () => searchWeb(`${ideaText} pricing cost plans`, 5),
      { maxAttempts: 2, fallback: { results: [], total: 0 }, operationName: "competitor-pricing" }
    )

    // Firecrawl scraping of top competitor URLs
    const competitorUrls = serperResults.results
      .filter(r => !r.link.includes("google.com") && !r.link.includes("youtube.com"))
      .map(r => r.link)
      .slice(0, 3)

    const scrapedContent = await withRetryGraph(
      () => scrapeCompetitorUrls(competitorUrls),
      { maxAttempts: 2, fallback: [], operationName: "competitor-scrape" }
    )

    // Finnhub news for broader competitor signals
    const competitorNews = await withRetryGraph(
      () => Promise.allSettled(
        ["GOOGL", "MSFT", "AMZN"].map(symbol => getCompanyNews(symbol, 30))
      ),
      { maxAttempts: 1, fallback: [], operationName: "competitor-news" }
    )

    const sources: SourceCitation[] = [
      ...serperResults.results.map(r => ({ title: r.title, url: r.link, snippet: r.snippet })),
      ...competitorSearch.results,
      ...pricingSearch.results,
      ...scrapedContent.map(s => ({ title: s.title, url: s.url, snippet: s.markdown.slice(0, 150) })),
    ].map((r) => ({
      title: r.title,
      url: r.url ?? "",
      snippet: r.snippet ?? "",
    }))

    // Parse competitors from search results
    const competitorNames = [
      ...serperResults.results.map(r => r.title.split(" - ")[0] ?? r.title),
      ...competitorSearch.results.map(r => r.title.split(" - ")[0] ?? r.title),
    ].slice(0, 8)

    const directCompetitors = competitorNames.slice(0, 4).map((name) => ({
      name,
      url: serperResults.results.find(r => r.title.includes(name))?.link ?? "",
      description: "Competitor in same space",
      pricing: "$10-$50/month",
      strengths: ["Brand recognition", "Existing user base"],
      weaknesses: ["High pricing", "Limited to specific markets"],
      market_position: "Established player",
    }))

    const indirectCompetitors = competitorNames.slice(4, 8).map((name) => ({
      name,
      url: "",
      description: "Adjacent solution provider",
      pricing: "$0-$30/month",
      strengths: ["Related domain expertise"],
      weaknesses: ["Not direct match to this solution"],
      market_position: "Emerging competitor",
    }))

    return {
      direct_competitors: directCompetitors.length > 0 ? directCompetitors : FALLBACK_OUTPUT.direct_competitors,
      indirect_competitors: indirectCompetitors.length > 0 ? indirectCompetitors : FALLBACK_OUTPUT.indirect_competitors,
      market_gaps: [
        "Most competitors target developed markets first",
        "No solution combines all validation dimensions",
        "Pricing is prohibitive for emerging markets",
      ],
      differentiation_opportunities: [
        "Focus on emerging market founders",
        "All-in-one validation platform",
        "AI agents instead of human analysts",
      ],
      competitive_advantage_score: 65,
      sources,
    }
  } catch (error) {
    console.error("CompetitorIntel error:", error)
    return FALLBACK_OUTPUT
  }
}
