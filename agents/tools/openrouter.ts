// OpenRouter API client - all AI calls go through this
// NOTE: This runs in Edge Functions or Trigger.dev, never in browser

export type Model = 
  | "google/gemini-2.5-flash"      // Free tier fast
  | "google/gemini-flash-1.5-8b"  // Development
  | "anthropic/claude-sonnet-4-6" // Production (pro/premium)
  | "anthropic/claude-3-5-sonnet" // Fallback

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatOptions {
  model: Model
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  id: string
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// NOTE: Actual implementation in Edge Function - this is the types/interface only
// The Edge Function will make the actual OpenRouter API call with the secret key

export interface OpenRouterConfig {
  model: Model
  temperature?: number
  max_tokens?: number
}

export const MODEL_ROUTING: Record<string, Model> = {
  development: "google/gemini-flash-1.5-8b",
  "free-tier": "google/gemini-2.5-flash",
  "pro-tier": "anthropic/claude-sonnet-4-6",
  "premium-tier": "anthropic/claude-sonnet-4-6",
  synthesis: "anthropic/claude-sonnet-4-6",
  fallback: "google/gemini-flash-1.5-8b",
}

export function getModelForPlan(plan: string, isSynthesis = false): Model {
  if (isSynthesis) return "anthropic/claude-sonnet-4-6"
  return MODEL_ROUTING[plan] ?? MODEL_ROUTING["free-tier"]
}