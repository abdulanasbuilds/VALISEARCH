import type { AgentContext } from "../types"
import type { ProblemPrioritizerOutput } from "@/agents/types/analysis"
import { getRedditSignals, extractPainPoints } from "../tools/reddit"
import { getHNSignals, extractTrends } from "../tools/hackernews"
import type { SourceCitation } from "@/agents/types/analysis"

const FALLBACK_OUTPUT: ProblemPrioritizerOutput = {
  problems: [],
  total_signals_found: 0,
  top_problem: "Unable to analyze problem signals",
  problem_market_fit_score: 50,
  sources: [],
}

export async function runProblemPrioritizer(context: AgentContext): Promise<ProblemPrioritizerOutput> {
  const { ideaText } = context

  try {
    // Get signals from Reddit and HN
    const redditResult = await getRedditSignals(ideaText, 15)
    const hnResult = await getHNSignals(ideaText, 10)

    // Extract pain points and trends
    const painPoints = extractPainPoints(redditResult.posts)
    const trends = extractTrends(hnResult.posts)

    const sources: SourceCitation[] = [
      ...redditResult.posts.map((p) => ({
        title: p.title,
        url: p.url,
        snippet: p.selftext?.slice(0, 100) || p.title,
      })),
      ...hnResult.posts.map((p) => ({
        title: p.title,
        url: p.url,
        snippet: `${p.score} points, ${p.descendants} comments`,
      })),
    ]

    // Map to ProblemSignal format
    const problems = painPoints.slice(0, 5).map((pp) => ({
      problem: pp.theme,
      severity: Math.min(10, Math.round(pp.frequency / 2) + 3),
      frequency: `${pp.frequency} mentions found`,
      source_platform: "Reddit",
      sample_quotes: pp.examples,
      source_urls: redditResult.posts
        .filter((p) => `${p.title} ${p.selftext}`.toLowerCase().includes(pp.theme))
        .slice(0, 3)
        .map((p) => p.url),
    }))

    // Calculate score based on signal volume
    const totalSignals = redditResult.total + hnResult.total
    const score = totalSignals > 20 ? 75 : totalSignals > 10 ? 60 : totalSignals > 5 ? 50 : 35

    return {
      problems: problems.length > 0 ? problems : FALLBACK_OUTPUT.problems,
      total_signals_found: totalSignals,
      top_problem: painPoints[0]?.theme || trends[0]?.trend || "No clear problem identified",
      problem_market_fit_score: score,
      sources,
    }
  } catch (error) {
    console.error("ProblemPrioritizer error:", error)
    return FALLBACK_OUTPUT
  }
}
