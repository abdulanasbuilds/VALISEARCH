// ============================================================
// Agent Output Types — ValiSearch 2.0
// ============================================================

/** Shared types used across multiple agents */
export interface SourceCitation {
  title: string
  url: string
  snippet: string
}

export interface ScoredDimension {
  name: string
  score: number
  label: string
  rationale: string
}

/** Agent 1: Idea Validator */
export interface IdeaValidatorOutput {
  overall_score: number
  verdict: string
  dimensions: ScoredDimension[]
  strengths: string[]
  weaknesses: string[]
  recommendation: string
}

/** Agent 2: Market Researcher */
export interface MarketSize {
  value: string
  year: string
  source: string
  growth_rate: string
}

export interface MarketResearcherOutput {
  tam: MarketSize
  sam: MarketSize
  som: MarketSize
  market_trends: string[]
  target_demographics: string[]
  regional_insights: string[]
  sources: SourceCitation[]
}

/** Agent 3: Competitor Intel */
export interface Competitor {
  name: string
  url: string
  description: string
  pricing: string
  strengths: string[]
  weaknesses: string[]
  market_position: string
}

export interface CompetitorIntelOutput {
  direct_competitors: Competitor[]
  indirect_competitors: Competitor[]
  market_gaps: string[]
  differentiation_opportunities: string[]
  competitive_advantage_score: number
  sources: SourceCitation[]
}

/** Agent 4: Problem Prioritizer */
export interface ProblemSignal {
  problem: string
  severity: number
  frequency: string
  source_platform: string
  sample_quotes: string[]
  source_urls: string[]
}

export interface ProblemPrioritizerOutput {
  problems: ProblemSignal[]
  total_signals_found: number
  top_problem: string
  problem_market_fit_score: number
  sources: SourceCitation[]
}

/** Agent 5: Product Manager */
export interface MvpFeature {
  name: string
  description: string
  priority: "must-have" | "should-have" | "nice-to-have"
  effort: "low" | "medium" | "high"
  user_story: string
}

export interface KanbanTask {
  title: string
  description: string
  column: "backlog" | "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  estimated_hours: number
}

export interface ProductManagerOutput {
  mvp_features: MvpFeature[]
  kanban_tasks: KanbanTask[]
  tech_stack_recommendation: string[]
  launch_timeline_weeks: number
  build_vs_buy: string[]
}

/** Agent 6: Offer Architect */
export interface PricingTier {
  name: string
  price: string
  billing_period: string
  features: string[]
  target_user: string
  recommended: boolean
}

export interface OfferArchitectOutput {
  headline: string
  subheadline: string
  value_proposition: string
  ideal_customer_profile: string
  pricing_tiers: PricingTier[]
  objection_handlers: Array<{ objection: string; response: string }>
  urgency_hook: string
}

/** Agent 7: Growth Strategist */
export interface GrowthChannel {
  channel: string
  strategy: string
  estimated_cac: string
  timeline: string
  difficulty: "easy" | "medium" | "hard"
}

export interface WeeklyAction {
  week: number
  theme: string
  actions: string[]
  expected_outcome: string
}

export interface GrowthStrategistOutput {
  primary_channels: GrowthChannel[]
  secondary_channels: GrowthChannel[]
  four_week_plan: WeeklyAction[]
  viral_loops: string[]
  key_metrics: string[]
}

/** Agent 8: Distribution Planner */
export interface LaunchPhase {
  phase: string
  duration: string
  actions: string[]
  goals: string[]
}

export interface Partnership {
  partner_type: string
  examples: string[]
  value_exchange: string
  outreach_template: string
}

export interface DistributionPlannerOutput {
  launch_strategy: LaunchPhase[]
  partnerships: Partnership[]
  distribution_channels: string[]
  community_building: string[]
  pr_angles: string[]
}

/** Agent 9: Content Creator */
export interface ContentHook {
  hook: string
  platform: string
  format: string
  why_it_works: string
}

export interface ContentSystem {
  pillars: string[]
  weekly_cadence: Array<{ day: string; content_type: string; platform: string }>
  content_repurposing: string[]
}

export interface ContentCreatorOutput {
  hooks: ContentHook[]
  content_system: ContentSystem
  seo_keywords: string[]
  email_subject_lines: string[]
  social_bio: string
}

/** Agent 10: Brand Namer */
export interface BrandName {
  name: string
  tagline: string
  domain_suggestion: string
  reasoning: string
  tone: string
}

export interface BrandVoice {
  personality: string[]
  tone_words: string[]
  avoid_words: string[]
  sample_sentences: string[]
}

export interface BrandNamerOutput {
  names: BrandName[]
  recommended_name: string
  brand_voice: BrandVoice
  color_palette: Array<{ name: string; hex: string; usage: string }>
  typography_suggestion: string
}

/** Agent 11: Scale Architect */
export interface ScalePhase {
  phase: number
  name: string
  duration: string
  revenue_target: string
  key_actions: string[]
  milestones: string[]
  risks: string[]
}

export interface ScaleArchitectOutput {
  phases: ScalePhase[]
  revenue_model: string
  unit_economics: {
    cac: string
    ltv: string
    ltv_cac_ratio: string
    payback_period: string
  }
  funding_recommendation: string
  key_assumptions: string[]
}

/** Agent 12: Synthesis */
export interface SynthesisInsight {
  insight: string
  confidence: "high" | "medium" | "low"
  supporting_agents: string[]
  contradictions: string[]
}

export interface SynthesisOutput {
  executive_summary: string
  overall_score: number
  verdict: "strong" | "promising" | "needs-work" | "risky" | "not-recommended"
  key_insights: SynthesisInsight[]
  top_3_strengths: string[]
  top_3_risks: string[]
  immediate_next_steps: string[]
  one_line_pitch: string
}

/** Full analysis result — stored in analysis.result_json */
export interface FullAnalysisOutput {
  idea_validator: IdeaValidatorOutput
  market_researcher: MarketResearcherOutput
  competitor_intel: CompetitorIntelOutput
  problem_prioritizer: ProblemPrioritizerOutput
  product_manager: ProductManagerOutput
  offer_architect: OfferArchitectOutput
  growth_strategist: GrowthStrategistOutput
  distribution_planner: DistributionPlannerOutput
  content_creator: ContentCreatorOutput
  brand_namer: BrandNamerOutput
  scale_architect: ScaleArchitectOutput
  synthesis: SynthesisOutput
}

/** Agent names for progress tracking */
export type AgentName =
  | "idea_validator"
  | "market_researcher"
  | "competitor_intel"
  | "problem_prioritizer"
  | "product_manager"
  | "offer_architect"
  | "growth_strategist"
  | "distribution_planner"
  | "content_creator"
  | "brand_namer"
  | "scale_architect"
  | "synthesis"

/** Agent status for progress tracking */
export type AgentStatus = "pending" | "running" | "completed" | "failed"

/** Analysis status */
export type AnalysisStatus = "pending" | "running" | "completed" | "failed"

/** Analysis type */
export type AnalysisType = "quick" | "full" | "deep"

/** User plan */
export type UserPlan = "free" | "pro" | "premium"
