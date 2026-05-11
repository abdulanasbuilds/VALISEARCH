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

/** Plan configuration */
export const PLANS = {
  free: {
    name: "Free",
    credits: 6,
    price: 0,
    features: [
      "6 analysis credits",
      "Full 12-agent analysis",
      "Export as text",
      "Community support",
    ],
  },
  pro: {
    name: "Pro",
    credits: 100,
    price: 29,
    features: [
      "100 credits/month",
      "Full 12-agent analysis",
      "Deep analysis with web search",
      "Priority support",
      "Export all formats",
    ],
  },
  premium: {
    name: "Premium",
    credits: -1, // unlimited
    price: 79,
    features: [
      "Unlimited credits",
      "Full 12-agent analysis",
      "Deep analysis with web search",
      "Priority support",
      "Export all formats",
      "API access (coming soon)",
      "Custom agents (coming soon)",
    ],
  },
} as const

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
