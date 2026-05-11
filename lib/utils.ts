import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SCORE_THRESHOLDS } from "@/lib/constants"

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format score as display string with color class */
export function formatScore(score: number): {
  text: string
  colorClass: string
} {
  const text = `${score}/100`

  if (score >= SCORE_THRESHOLDS.good) {
    return { text, colorClass: "text-green-600" }
  }
  if (score >= SCORE_THRESHOLDS.moderate) {
    return { text, colorClass: "text-amber-600" }
  }
  return { text, colorClass: "text-red-600" }
}

/** Format credit balance for display */
export function formatCredits(balance: number): string {
  if (balance < 0) return "Unlimited"
  return `${balance} credit${balance === 1 ? "" : "s"}`
}

/** Sanitize idea text — trim, collapse whitespace */
export function sanitizeIdea(text: string): string {
  return text.trim().replace(/\s+/g, " ")
}

/** Format relative time (e.g. "2 hours ago") */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = typeof date === "string" ? new Date(date) : date
  const diffMs = now.getTime() - then.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: diffDays > 365 ? "numeric" : undefined,
  })
}

/** Truncate text to a max length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

/** Get word count from text */
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
