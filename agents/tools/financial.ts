interface StockQuote {
  symbol: string
  price: number
  marketCap: number | null
  change: number
  changePercent: number
  volume: number
}

interface SectorPerformance {
  sector: string
  performance: number
}

interface CompanyOverview {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  marketCap: number
  peRatio: number
  revenue: number
  employees: number
}

const AV_BASE = "https://www.alphavantage.co/query"

async function alphaVantageRequest(
  params: Record<string, string>
): Promise<Record<string, unknown>> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey) return {}

  const url = new URL(AV_BASE)
  Object.entries({ ...params, apikey: apiKey }).forEach(
    ([k, v]) => url.searchParams.set(k, v)
  )

  try {
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return {}
    return await response.json() as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function getStockQuote(
  symbol: string
): Promise<StockQuote | null> {
  const data = await alphaVantageRequest({
    function: "GLOBAL_QUOTE",
    symbol,
  })

  const quote = data["Global Quote"] as Record<string, string> | undefined
  if (!quote) return null

  const priceStr = quote["05. price"]
  const changeStr = quote["09. change"]
  const changePercentStr = quote["10. change percent"]
  const volumeStr = quote["06. volume"]

  if (!priceStr || !changeStr || !changePercentStr || !volumeStr) return null

  return {
    symbol,
    price: parseFloat(priceStr),
    marketCap: null,
    change: parseFloat(changeStr),
    changePercent: parseFloat(changePercentStr.replace("%", "")),
    volume: parseInt(volumeStr),
  }
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  const data = await alphaVantageRequest({
    function: "SECTOR",
  })

  const daily = data["Rank A: Real-Time Performance"] as
    Record<string, string> | undefined

  if (!daily) return []

  return Object.entries(daily).map(([sector, perf]) => ({
    sector,
    performance: parseFloat(perf.replace("%", "")),
  }))
}

export async function getCompanyOverview(
  symbol: string
): Promise<CompanyOverview | null> {
  const data = await alphaVantageRequest({
    function: "OVERVIEW",
    symbol,
  })

  if (!data.Name) return null

  return {
    symbol,
    name: String(data.Name ?? ""),
    description: String(data.Description ?? "").slice(0, 500),
    sector: String(data.Sector ?? ""),
    industry: String(data.Industry ?? ""),
    marketCap: parseInt(String(data.MarketCapitalization ?? "0")),
    peRatio: parseFloat(String(data.PERatio ?? "0")),
    revenue: parseInt(String(data.RevenueTTM ?? "0")),
    employees: parseInt(String(data.FullTimeEmployees ?? "0")),
  }
}

export async function getMarketSentiment(
  topic: string
): Promise<{
  overallSentiment: "positive" | "neutral" | "negative"
  score: number
  articlesAnalyzed: number
}> {
  const data = await alphaVantageRequest({
    function: "NEWS_SENTIMENT",
    topics: topic,
    limit: "20",
  })

  const feed = data.feed as Array<{
    overall_sentiment_score: number
  }> | undefined

  if (!feed || feed.length === 0) {
    return {
      overallSentiment: "neutral",
      score: 0,
      articlesAnalyzed: 0,
    }
  }

  const avgScore = feed.reduce(
    (sum, item) => sum + (item.overall_sentiment_score ?? 0),
    0
  ) / feed.length

  return {
    overallSentiment: avgScore > 0.15
      ? "positive"
      : avgScore < -0.15
        ? "negative"
        : "neutral",
    score: Math.round(avgScore * 100) / 100,
    articlesAnalyzed: feed.length,
  }
}
