import type { AgentContext } from "../types"

interface KnowledgeResult {
  id: string
  source_type: string
  source_name: string
  source_url: string
  title: string
  content: string
  metadata: Record<string, unknown>
  similarity: number
}

export async function retrieveKnowledge(
  context: AgentContext,
  options: {
    limit?: number
    sourceTypes?: string[]
  } = {}
): Promise<KnowledgeResult[]> {
  const { ideaText } = context
  const { limit = 5, sourceTypes } = options

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log("RAG: Missing Supabase credentials")
    return []
  }

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/rag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        action: "search",
        data: {
          query: ideaText,
          limit,
          source_type: sourceTypes?.[0] || null,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.log("RAG search error:", error)
      return []
    }

    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.log("RAG retrieval error:", error)
    return []
  }
}

export function formatKnowledgeForPrompt(results: KnowledgeResult[]): string {
  if (results.length === 0) return ""

  const formatted = results.map((r) => {
    return `[${r.source_name}] ${r.title}\n${r.content.slice(0, 300)}...\nSource: ${r.source_url}`
  })

  return `\n\n=== RELEVANT KNOWLEDGE ===\n${formatted.join("\n\n")}\n=== END KNOWLEDGE ===\n`
}