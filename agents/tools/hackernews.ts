// HackerNews API via Algolia - free, no API key needed
// Get demand signals from HN posts

export interface HNPost {
  id: number
  title: string
  url: string
  score: number
  descendants: number // comment count
  by: string
  time: number
  type: string
}

export interface HNSearchResult {
  posts: HNPost[]
  total: number
}

// Algolia HN Search API
async function searchHN(query: string, limit = 10): Promise<HNPost[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&sortBy=new&hitsPerPage=${limit}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HN search failed: ${response.status}`)
    }
    
    const data = await response.json()
    const hits = data.hits ?? []
    
    return hits.map((hit: Record<string, unknown>) => ({
      id: hit.objectID,
      title: hit.title,
      url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      score: hit.points ?? 0,
      descendants: hit.num_comments ?? 0,
      by: hit.author ?? "",
      time: hit.created_at_i ?? 0,
      type: hit.type ?? "story",
    }))
  } catch (error) {
    console.error("HN search error:", error)
    return []
  }
}

// Get demand signals for a problem space
export async function getHNSignals(
  problemDescription: string,
  maxPosts = 20
): Promise<HNSearchResult> {
  // Extract keywords
  const keywords = problemDescription
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5)
    .join(" ")
  
  const posts = await searchHN(keywords, maxPosts)
  
  // Sort by score + comments (engagement = demand)
  posts.sort((a, b) => (b.score + b.descendants) - (a.score + a.descendants))
  
  return {
    posts,
    total: posts.length,
  }
}

// Get Show HN posts (launches) for a category
export async function getShowHN(category: string, limit = 10): Promise<HNPost[]> {
  const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(category)}&tags=showhn&sortBy=popularity&hitsPerPage=${limit}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Show HN search failed: ${response.status}`)
    }
    
    const data = await response.json()
    const hits = data.hits ?? []
    
    return hits.map((hit: Record<string, unknown>) => ({
      id: hit.objectID,
      title: hit.title,
      url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      score: hit.points ?? 0,
      descendants: hit.num_comments ?? 0,
      by: hit.author ?? "",
      time: hit.created_at_i ?? 0,
      type: "showhn",
    }))
  } catch (error) {
    console.error("Show HN error:", error)
    return []
  }
}

// Extract trends from HN posts
export function extractTrends(posts: HNPost[]): Array<{
  trend: string
  score: number
  posts: string[]
}> {
  const trends: Record<string, { score: number; posts: string[] }> = {}
  
  for (const post of posts) {
    const engagement = post.score + post.descendants
    
    // Simple keyword extraction from title
    const words = post.title
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4)
    
    for (const word of words.slice(0, 3)) {
      if (!trends[word]) {
        trends[word] = { score: 0, posts: [] }
      }
      trends[word].score += engagement
      if (trends[word].posts.length < 2) {
        trends[word].posts.push(post.title.slice(0, 80))
      }
    }
  }
  
  return Object.entries(trends)
    .map(([trend, data]) => ({
      trend,
      score: data.score,
      posts: data.posts,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
}
