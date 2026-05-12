interface FinnhubNews {
  headline: string
  source: string
  url: string
  summary: string
  sentiment?: number
}

const FINNHUB_BASE = "https://finnhub.io/api/v1"

async function finnhubRequest(
  endpoint: string,
  params: Record<string, string>
): Promise<unknown> {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) return null

  const url = new URL(`${FINNHUB_BASE}${endpoint}`)
  Object.entries({ ...params, token: apiKey }).forEach(
    ([k, v]) => url.searchParams.set(k, v)
  )

  try {
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function getCompanyNews(
  symbol: string,
  days = 30
): Promise<FinnhubNews[]> {
  const from = new Date()
  from.setDate(from.getDate() - days)
  const to = new Date()

  const data = await finnhubRequest("/company-news", {
    symbol,
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  })

  const articles = data as Array<{
    headline: string
    source: string
    url: string
    summary: string
    sentiment?: number
  }> | null

  if (!articles) return []

  return articles.slice(0, 5).map(a => ({
    headline: a.headline,
    source: a.source,
    url: a.url,
    summary: (a.summary ?? "").slice(0, 300),
    sentiment: a.sentiment,
  }))
}

export async function getIPOCalendar(): Promise<Array<{
  name: string
  date: string
  shares: number
  price: number
}>> {
  const data = await finnhubRequest("/calendar/ipo", {
    from: new Date().toISOString().split("T")[0],
    to: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0],
  })

  const calendar = data as {
    ipoCalendar?: Array<{
      name: string
      date: string
      numberOfShares: number
      price: string
    }>
  } | null

  return (calendar?.ipoCalendar ?? []).slice(0, 10).map(ipo => ({
    name: ipo.name,
    date: ipo.date,
    shares: ipo.numberOfShares,
    price: parseFloat(ipo.price.split("-")[0]),
  }))
}