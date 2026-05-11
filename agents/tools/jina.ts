// Jina AI tools - free web search and URL reading
// NOTE: This runs in Edge Functions or Trigger.dev, never in browser

export interface SearchResult {
  title: string
  url: string
  snippet: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
}

export interface ReadResponse {
  title: string
  content: string
  url: string
}

// Jina Search API (s.jina.ai/search?q=...)
export async function searchWeb(query: string, limit = 5): Promise<SearchResponse> {
  const encodedQuery = encodeURIComponent(query)
  const url = `https://s.jina.ai/search?q=${encodedQuery}&limit=${limit}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      results: (data.results ?? []).map((r: { title: string; url: string; description: string }) => ({
        title: r.title ?? "",
        url: r.url ?? "",
        snippet: r.description ?? "",
      })),
      total: data.total ?? data.results?.length ?? 0,
    }
  } catch (error) {
    console.error("Jina search error:", error)
    return { results: [], total: 0 }
  }
}

// Jina Reader API (r.jina.ai/http://...)
export async function readUrl(url: string): Promise<ReadResponse> {
  const encodedUrl = encodeURIComponent(url)
  const readerUrl = `https://r.jina.ai/http://${encodedUrl}`
  
  try {
    const response = await fetch(readerUrl)
    if (!response.ok) {
      throw new Error(`Read failed: ${response.status}`)
    }
    
    const text = await response.text()
    
    // Jina reader returns markdown - extract title from first line if it's # Title
    const lines = text.split("\n")
    let title = url
    let content = text
    
    if (lines[0]?.startsWith("# ")) {
      title = lines[0].slice(2).trim()
      content = lines.slice(1).join("\n").trim()
    }
    
    return {
      title,
      content,
      url,
    }
  } catch (error) {
    console.error("Jina read error:", error)
    return {
      title: url,
      content: "",
      url,
    }
  }
}

// Combine search + read for research agents
export async function researchTopic(
  query: string,
  readTopResults = 2
): Promise<{
  searchResults: SearchResult[]
  readContents: ReadResponse[]
}> {
  const searchResults = await searchWeb(query, 5)
  
  const readContents: ReadResponse[] = []
  
  // Read top 2 results
  for (const result of searchResults.results.slice(0, readTopResults)) {
    const readResult = await readUrl(result.url)
    readContents.push(readResult)
  }
  
  return {
    searchResults: searchResults.results,
    readContents,
  }
}