# AGENTS.md — ValiSearch AI Agents

## 12 AI Agents Architecture

ValiSearch uses 12 specialized AI agents that run in parallel using `Promise.allSettled()`:
- 3 agents search the live web for real data
- 8 agents perform deep analytical reasoning  
- 1 agent synthesizes everything into a final report

All agents complete in under 90 seconds.

---

## Agent Definitions

### 1. Idea Validator Agent
**File:** `agents/agents/idea-validator.ts`
**Purpose:** Score the startup idea across 6 dimensions
**Output:** `IdeaValidatorOutput`
**Dimensions:**
- Clarity (how well-articulated is the idea)
- Feasibility (can it be built)
- Market Fit (is there demand)
- Scalability (can it grow)
- Timing (is now the right time)
- Differentiation (how unique)

---

### 2. Market Researcher Agent
**File:** `agents/agents/market-researcher.ts`
**Purpose:** Research market size and trends
**Output:** `MarketResearcherOutput`
**Data Sources:**
- Web search via Jina AI
- RAG knowledge base
- Industry reports

---

### 3. Competitor Intel Agent
**File:** `agents/agents/competitor-intel.ts`
**Purpose:** Find and analyze real competitors
**Output:** `CompetitorIntelOutput`
**Data Sources:**
- Web search
- Competitor websites
- G2/Capterra reviews

---

### 4. Problem Prioritizer Agent
**File:** `agents/agents/problem-prioritizer.ts`
**Purpose:** Validate pain points via social search
**Output:** `ProblemPrioritizerOutput`
**Data Sources:**
- Reddit API
- Hacker News API

---

### 5. Product Manager Agent
**File:** `agents/agents/product-manager.ts`
**Purpose:** Design MVP features and roadmap
**Output:** `ProductManagerOutput`
**Includes:**
- MVP feature list
- Feature prioritization
- Technical requirements

---

### 6. Offer Architect Agent
**File:** `agents/agents/offer-architect.ts`
**Purpose:** Craft value proposition and pricing
**Output:** `OfferArchitectOutput`
**Includes:**
- Value proposition
- Key features
- Pricing strategy

---

### 7. Growth Strategist Agent
**File:** `agents/agents/growth-strategist.ts`
**Purpose:** Plan growth channels and calendar
**Output:** `GrowthStrategistOutput`
**Includes:**
- Growth strategies
- Channel recommendations
- Quick wins

---

### 8. Distribution Planner Agent
**File:** `agents/agents/distribution-planner.ts`
**Purpose:** Map launch strategy and partnerships
**Output:** `DistributionPlannerOutput`
**Includes:**
- Distribution channels
- Partnership opportunities

---

### 9. Content Creator Agent
**File:** `agents/agents/content-creator.ts`
**Purpose:** Generate content hooks and systems
**Output:** `ContentCreatorOutput`
**Includes:**
- Content strategy
- Content assets
- Key messages

---

### 10. Brand Namer Agent
**File:** `agents/agents/brand-namer.ts`
**Purpose:** Create brand names and voice
**Output:** `BrandNamerOutput`
**Includes:**
- Brand name options
- Tagline
- Brand voice guidelines

---

### 11. Scale Architect Agent
**File:** `agents/agents/scale-architect.ts`
**Purpose:** Build roadmap to $10K MRR
**Output:** `ScaleArchitectOutput`
**Includes:**
- Scale phases
- Milestones
- Resource requirements

---

### 12. Synthesis Agent
**File:** `agents/agents/synthesis.ts`
**Purpose:** Cross-reference all agent insights
**Output:** `SynthesisOutput`
**Model:** Always Claude Sonnet (runs last)
**Includes:**
- Executive summary
- Overall score (0-100)
- Verdict (strong/weak/mixed)
- Top strengths/risks
- Next steps

---

## Agent Execution Flow

1. User submits idea
2. API route (`/api/analyze`) creates analysis record
3. 11 agents run in parallel via `Promise.allSettled()`
4. All 11 complete → Synthesis runs
5. Results stored in `analysis.result_json`
6. Dashboard renders all 13 sections

---

## Tool Dependencies

| Tool | File | Purpose |
|------|------|---------|
| openrouter | `agents/tools/openrouter.ts` | AI model calls |
| jina | `agents/tools/jina.ts` | Web search & scraping |
| reddit | `agents/tools/reddit.ts` | Reddit API |
| hackernews | `agents/tools/hackernews.ts` | HN API |
| rag | `agents/tools/rag.ts` | Knowledge base retrieval |

---

## TypeScript Interfaces

All agent outputs defined in: `agents/types/analysis.ts`

Each agent has:
- Input interface (AgentContext)
- Output interface (AgentNameOutput)
- Zod validation schema
- Fallback output for error cases