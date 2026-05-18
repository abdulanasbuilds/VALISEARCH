// ============================================================
// Constants — ValiSearch 2.0
// ============================================================

/** Application metadata */
export const APP_NAME = "ValiSearch" as const
export const APP_DESCRIPTION =
  "AI-powered startup intelligence platform. 12 agents validate your idea in minutes." as const
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

/** Payment gateway configuration */
export const PAYMENT_GATEWAYS = {
  lemonSqueezy: {
    name: "Lemon Squeezy",
    icon: "lemon",
    color: "#FFD80A",
    plans: {
      pro: "ls_pro_monthly",
      premium: "ls_premium_monthly",
    },
  },
  stripe: {
    name: "Stripe",
    icon: "stripe",
    color: "#635BFF",
    plans: {
      pro: "price_pro_monthly",
      premium: "price_premium_monthly",
    },
  },
  flutterwave: {
    name: "Flutterwave",
    icon: "flutterwave",
    color: "#2A2A2A",
    plans: {
      pro: "pro_monthly",
      premium: "premium_monthly",
    },
  },
  paystack: {
    name: "Paystack",
    icon: "paystack",
    color: "#00CBE4",
    plans: {
      pro: "pro_monthly",
      premium: "premium_monthly",
    },
  },
} as const

export type PaymentGateway = keyof typeof PAYMENT_GATEWAYS

/** Credit costs per analysis type */
export const CREDIT_COSTS = {
  quick: 1,
  full: 2,
  deep: 3,
} as const

/** Default credits for new users */
export const DEFAULT_CREDITS = 6

export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    annualPrice: 0,
    analyses: 3,
    credits: 6,
    teamMembers: 1,
    historyDays: 7,
    model: "google/gemini-2.5-flash-preview",
    features: [
      "3 startup analyses",
      "Core 6 intelligence sections",
      "Basic market overview",
      "7-day analysis history",
      "Community support",
    ],
    locked: [
      "Real-time web research",
      "Competitor website scraping",
      "PDF and DOCX export",
      "AI Co-founder Chat",
      "Team workspace",
      "API access",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 29,
    annualPrice: 23,
    analyses: 50,
    credits: 100,
    teamMembers: 1,
    historyDays: 90,
    model: "anthropic/claude-sonnet-4-5",
    lsMonthlyVariantId: process.env.NEXT_PUBLIC_LS_PRO_MONTHLY_ID ?? "",
    lsAnnualVariantId: process.env.NEXT_PUBLIC_LS_PRO_ANNUAL_ID ?? "",
    features: [
      "50 intelligence reports per month",
      "All 12 AI agents",
      "Real-time web research (Serper + Firecrawl)",
      "Competitor website deep scraping",
      "PDF and DOCX export",
      "AI Co-founder Chat",
      "90-day history",
      "Priority Claude Sonnet model",
      "Email support (48hr)",
    ],
    locked: [
      "Team workspace",
      "API access",
      "White-label reports",
    ],
  },
  business: {
    id: "business",
    name: "Business",
    price: 79,
    annualPrice: 63,
    analyses: 200,
    credits: 400,
    teamMembers: 5,
    historyDays: 365,
    model: "anthropic/claude-sonnet-4-5",
    lsMonthlyVariantId: process.env.NEXT_PUBLIC_LS_BIZ_MONTHLY_ID ?? "",
    lsAnnualVariantId: process.env.NEXT_PUBLIC_LS_BIZ_ANNUAL_ID ?? "",
    features: [
      "200 intelligence reports per month",
      "Everything in Pro",
      "Team workspace (5 members)",
      "API access with key management",
      "White-label PDF reports",
      "1-year history",
      "Financial signals (market data)",
      "Priority support (24hr)",
    ],
    locked: [
      "Unlimited analyses",
      "Custom agents",
      "Dedicated support",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    annualPrice: 159,
    analyses: -1,
    credits: -1,
    teamMembers: -1,
    historyDays: -1,
    model: "anthropic/claude-sonnet-4-5",
    lsMonthlyVariantId: process.env.NEXT_PUBLIC_LS_ENT_MONTHLY_ID ?? "",
    lsAnnualVariantId: process.env.NEXT_PUBLIC_LS_ENT_ANNUAL_ID ?? "",
    features: [
      "Unlimited intelligence reports",
      "Everything in Business",
      "Unlimited team members",
      "Custom AI agents",
      "Bulk analysis (CSV upload)",
      "Side-by-side comparison mode",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "Unlimited history",
    ],
    locked: [],
  },
} as const

export type PlanId = keyof typeof PLANS

// Trial system
export const TRIAL = {
  DURATION_DAYS: 7,
  PLAN_DURING_TRIAL: "pro" as PlanId,
  PLAN_AFTER_TRIAL: "starter" as PlanId,
} as const

// Billing period
export type BillingPeriod = "monthly" | "annual"

export function getAnnualSavings(planId: PlanId): number {
  const plan = PLANS[planId]
  if (plan.price === 0) return 0
  return Math.round(
    ((plan.price - plan.annualPrice) / plan.price) * 100
  )
}

export function getLSVariantId(
  planId: PlanId,
  period: BillingPeriod
): string {
  const plan = PLANS[planId]
  if ("lsMonthlyVariantId" in plan && "lsAnnualVariantId" in plan) {
    return period === "annual"
      ? (plan.lsAnnualVariantId as string)
      : (plan.lsMonthlyVariantId as string)
  }
  return ""
}

/** Agent display names for UI */
export const AGENT_DISPLAY_NAMES = {
  idea_validator: "Idea Validator",
  market_researcher: "Market Researcher",
  competitor_intel: "Competitor Intel",
  problem_prioritizer: "Problem Prioritizer",
  product_manager: "Product Manager",
  offer_architect: "Offer Architect",
  growth_strategist: "Growth Strategist",
  distribution_planner: "Distribution Planner",
  content_creator: "Content Creator",
  brand_namer: "Brand Namer",
  scale_architect: "Scale Architect",
  synthesis: "Synthesis",
} as const

/** Agent descriptions for progress UI */
export const AGENT_DESCRIPTIONS = {
  idea_validator: "Scoring your idea across 6 dimensions",
  market_researcher: "Researching market size and trends",
  competitor_intel: "Finding real competitors via web search",
  problem_prioritizer: "Analyzing Reddit and HN for pain points",
  product_manager: "Designing MVP features and tasks",
  offer_architect: "Crafting your value proposition and pricing",
  growth_strategist: "Planning growth channels and calendar",
  distribution_planner: "Mapping launch strategy and partnerships",
  content_creator: "Generating content hooks and systems",
  brand_namer: "Creating brand names and voice",
  scale_architect: "Building roadmap to $10K MRR",
  synthesis: "Cross-referencing all agent insights",
} as const

/** Idea input validation */
export const IDEA_MIN_LENGTH = 20
export const IDEA_MAX_LENGTH = 2000

/** LocalStorage keys */
export const LS_PENDING_IDEA_KEY = "valisearch_pending_idea" as const

/** Score thresholds for color coding */
export const SCORE_THRESHOLDS = {
  good: 70,
  moderate: 40,
} as const

/** Design system colors */
export const COLORS = {
  primary: "#1B4FFF",
  primaryHover: "#1240CC",
  primaryLight: "#EEF2FF",
  scoreGood: "#16A34A",
  scoreModerate: "#D97706",
  scorePoor: "#DC2626",
} as const

/** Routes */
export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  blog: "/blog",
  about: "/about",
  changelog: "/changelog",
  terms: "/terms",
  privacy: "/privacy",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  authCallback: "/auth/callback",
  onboarding: "/onboarding",
  workspace: "/workspace",
  workspaceNew: "/workspace/new",
  settings: "/settings",
  settingsBilling: "/settings/billing",
} as const
