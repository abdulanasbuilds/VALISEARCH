interface FirecrawlResult {
  url: string
  markdown: string
  title: string
  description: string
  success: boolean
}

export async function scrapeUrl(
  url: string
): Promise<FirecrawlResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY

  if (!apiKey) {
    const { readUrl } = await import("./jina")
    const jinaResult = await readUrl(url)
    return {
      url,
      markdown: jinaResult.content,
      title: jinaResult.title,
      description: "",
      success: jinaResult.content.length > 0,
    }
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.status}`)
    }

    const data = await response.json() as {
      success: boolean
      markdown?: string
      metadata?: {
        title?: string
        description?: string
      }
    }

    if (!data.success) {
      throw new Error("Firecrawl scrape failed")
    }

    return {
      url,
      markdown: (data.markdown ?? "").slice(0, 8000),
      title: data.metadata?.title ?? "",
      description: data.metadata?.description ?? "",
      success: true,
    }
  } catch (error) {
    console.error(`[Firecrawl] Failed for ${url}:`, error)
    const { readUrl } = await import("./jina")
    const jinaResult = await readUrl(url)
    return {
      url,
      markdown: jinaResult.content,
      title: jinaResult.title,
      description: "",
      success: jinaResult.content.length > 0,
    }
  }
}

export async function scrapeCompetitorUrls(
  urls: string[]
): Promise<FirecrawlResult[]> {
  const results = await Promise.allSettled(
    urls.slice(0, 5).map(url => scrapeUrl(url))
  )
  return results
    .filter(r => r.status === "fulfilled")
    .map(r => (r as PromiseFulfilledResult<FirecrawlResult>).value)
    .filter(r => r.success && r.markdown.length > 100)
}
