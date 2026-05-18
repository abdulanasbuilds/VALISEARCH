export interface SerperResult {
  title: string
  link: string
  snippet: string
  position: number
  date?: string
}

interface SerperResponse {
  query: string
  results: SerperResult[]
  relatedSearches: string[]
}

export async function googleSearch(
  query: string,
  options: {
    numResults?: number
    timeRange?: "d" | "w" | "m" | "y"
  } = {}
): Promise<SerperResponse> {
  const apiKey = process.env.SERPER_API_KEY

  if (!apiKey) {
    const { searchWeb } = await import("./jina")
    const jinaResult = await searchWeb(query)
    return {
      query,
      results: jinaResult.results.map((r, i) => ({
        title: r.title,
        link: r.url,
        snippet: r.snippet.slice(0, 200),
        position: i + 1,
      })),
      relatedSearches: [],
    }
  }

  try {
    const body: Record<string, unknown> = {
      q: query,
      num: options.numResults ?? 10,
    }

    if (options.timeRange) {
      body.tbs = `qdr:${options.timeRange}`
    }

    const response = await fetch(
      "https://google.serper.dev/search",
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`)
    }

    const data = await response.json() as {
      organic?: Array<{
        title: string
        link: string
        snippet: string
        position: number
        date?: string
      }>
      relatedSearches?: Array<{ query: string }>
    }

    return {
      query,
      results: (data.organic ?? []).map(r => ({
        title: r.title,
        link: r.link,
        snippet: r.snippet,
        position: r.position,
        date: r.date,
      })),
      relatedSearches: (data.relatedSearches ?? []).map(
        r => r.query
      ),
    }
  } catch (error) {
    console.error(`[Serper] Failed for "${query}", trying Jina fallback:`, error)
    try {
      const { searchWeb } = await import("./jina")
      const jinaResult = await searchWeb(query)
      return {
        query,
        results: jinaResult.results.map((r, i) => ({
          title: r.title,
          link: r.url,
          snippet: r.snippet.slice(0, 200),
          position: i + 1,
        })),
        relatedSearches: [],
      }
    } catch (jinaError) {
      console.error("[Serper Fallback Jina] Failed:", jinaError)
      return { query, results: [], relatedSearches: [] }
    }
  }
}

export async function searchNews(
  query: string,
  timeRange: "d" | "w" | "m" = "m"
): Promise<SerperResult[]> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return []

  try {
    const response = await fetch(
      "https://google.serper.dev/news",
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, tbs: `qdr:${timeRange}` }),
      }
    )

    const data = await response.json() as {
      news?: Array<{
        title: string
        link: string
        snippet: string
        position: number
        date?: string
      }>
    }

    return (data.news ?? []).map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet,
      position: r.position,
      date: r.date,
    }))
  } catch {
    return []
  }
}
