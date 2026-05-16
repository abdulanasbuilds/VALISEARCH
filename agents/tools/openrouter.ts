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

// Higher Gemini models available via Direct API (Google AI Studio keys)
// These bypass OpenRouter and use multiple API keys with rotation
// Gemini 3.x is the latest generation with better quality than OpenRouter's Gemini offerings
export const GEMINI_DIRECT_MODELS = [
  "gemini-3.1-pro-preview",
  "gemini-3-flash",
  "gemini-3.1-flash-lite-preview",
  "gemini-3-deep-think",
  "gemini-2.5-pro-preview",
  "gemini-2.5-flash-preview",
] as const

// Map agents to higher Gemini Direct models for better quality
// Uses gemini-3.1-pro-preview for complex reasoning agents (best quality)
// Uses gemini-3-flash for faster/lighter agents (frontier quality, 3x faster)
export const GEMINI_DIRECT_ROUTING: Record<string, string> = {
  "idea-validator": "gemini-3.1-pro-preview",
  "market-researcher": "gemini-3.1-pro-preview",
  "competitor-intel": "gemini-3.1-pro-preview",
  "problem-prioritizer": "gemini-3-flash",
  "product-manager": "gemini-3.1-pro-preview",
  "offer-architect": "gemini-3-flash",
  "growth-strategist": "gemini-3.1-pro-preview",
  "distribution-planner": "gemini-3-flash",
  "content-creator": "gemini-3-flash",
  "brand-namer": "gemini-3-flash",
  "scale-architect": "gemini-3.1-pro-preview",
  synthesis: "gemini-3.1-pro-preview",
}

export function getModelForPlan(plan: string, isSynthesis = false): Model {
  if (isSynthesis) return "anthropic/claude-sonnet-4-6"
  return MODEL_ROUTING[plan] ?? MODEL_ROUTING["free-tier"]
}

export function getGeminiDirectModel(agentName: string): string {
  return GEMINI_DIRECT_ROUTING[agentName] ?? "gemini-3.1-pro-preview"
}