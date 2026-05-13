type PosthogInstance = {
  init: (key: string, options: Record<string, unknown>) => void
  capture: (event: string, properties?: Record<string, unknown>) => void
  identify: (userId: string, traits?: Record<string, unknown>) => void
}

let posthog: PosthogInstance | null = null
let initialized = false

export function initAnalytics(): void {
  if (typeof window === "undefined") return
  if (initialized) return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  try {
    const mod = require("posthog-js")
    posthog = mod.default ?? mod
    posthog!.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "https://us.posthog.com",
      capture_pageview: false,
    })
    initialized = true
  } catch {
    console.info("[Analytics] PostHog not available")
    return
  }
}

export function track(
  event: string,
  properties?: Record<string, string | number | boolean | null>
): void {
  if (typeof window === "undefined") return
  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", event, properties)
    return
  }
  posthog?.capture(event, properties)
}

export function identify(
  userId: string,
  traits?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return
  posthog?.identify(userId, traits)
}