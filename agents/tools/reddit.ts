// Reddit API - free, no API key needed
// Get complaint signals from relevant subreddits

export interface RedditPost {
  id: string
  title: string
  selftext: string
  url: string
  score: number
  num_comments: number
  created_utc: number
  subreddit: string
}

export interface RedditSearchResult {
  posts: RedditPost[]
  total: number
}

// Search Reddit using their JSON API
async function searchReddit(query: string, limit = 10): Promise<RedditPost[]> {
  const encodedQuery = encodeURIComponent(query)
  const url = `https://www.reddit.com/search.json?q=${encodedQuery}&sort=new&limit=${limit}`
  
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ValiSearch/1.0",
      },
    })
    
    if (!response.ok) {
      throw new Error(`Reddit search failed: ${response.status}`)
    }
    
    const data = await response.json()
    const children = data.data?.children ?? []
    
    return children.map((child: { data: Record<string, unknown> }) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext,
      url: child.data.url,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      subreddit: child.data.subreddit,
    }))
  } catch (error) {
    console.error("Reddit search error:", error)
    return []
  }
}

// Subreddits relevant for startup pain points
const RELEVANT_SUBREDDITS = [
  "smallbusiness",
  "entrepreneur",
  "startups",
  "SaaS",
  "IndieHackers",
  "coding",
  "webdev",
  "freelance",
]

export async function getRedditSignals(
  problemDescription: string,
  maxPosts = 20
): Promise<RedditSearchResult> {
  // Extract keywords from problem description
  const keywords = problemDescription
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 5)
    .join(" OR ")
  
  const allPosts: RedditPost[] = []
  
  // Search for posts mentioning these problems
  const posts = await searchReddit(`${keywords} problem OR issue OR complaint OR frustrating`, maxPosts)
  allPosts.push(...posts)
  
  // Deduplicate by ID
  const uniquePosts = Array.from(
    new Map(allPosts.map((p) => [p.id, p])).values()
  )
  
  // Sort by score (engagement = strong signal)
  uniquePosts.sort((a, b) => b.score - a.score)
  
  return {
    posts: uniquePosts.slice(0, maxPosts),
    total: uniquePosts.length,
  }
}

// Extract complaint themes from Reddit posts
export function extractPainPoints(posts: RedditPost[]): Array<{
  theme: string
  frequency: number
  examples: string[]
}> {
  const themes: Record<string, { count: number; examples: string[] }> = {}
  
  const painKeywords = [
    "expensive",
    "slow",
    "complicated",
    "broken",
    "frustrat",
    "waste",
    "hard",
    "difficult",
    "confus",
    "annoying",
    "terrible",
    "awful",
    "don't work",
    "can't",
    "won't",
    "problem",
    "issue",
  ]
  
  for (const post of posts) {
    const text = `${post.title} ${post.selftext}`.toLowerCase()
    
    for (const keyword of painKeywords) {
      if (text.includes(keyword)) {
        if (!themes[keyword]) {
          themes[keyword] = { count: 0, examples: [] }
        }
        themes[keyword].count++
        
        if (themes[keyword].examples.length < 3) {
          themes[keyword].examples.push(post.title.slice(0, 100))
        }
      }
    }
  }
  
  return Object.entries(themes)
    .map(([theme, data]) => ({
      theme,
      frequency: data.count,
      examples: data.examples,
    }))
    .sort((a, b) => b.frequency - a.frequency)
}
