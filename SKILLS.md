# SKILLS.md — Reusable Workflow Skills

## How to Use
Reference a skill with: "Use the [skill-name] skill"
Or describe the task and the agent selects the right skill.

---

## Skill: new-agent

**Trigger phrases:** "create a new agent", "add an agent",
"build the X agent"

**What it does:** Creates a complete new AI agent following
the established pattern.

**Steps:**
1. Read agents/types/analysis.ts for output type
2. Read agents/tools/openrouter.ts for API pattern
3. Create agents/agents/[agent-name].ts with:
   - Tool initialization (if research agent)
   - OpenRouter call with retry logic
   - Zod schema validation for output
   - Fallback mock data
   - Proper TypeScript return type
4. Add agent to agents/orchestrator.ts Promise.allSettled()
5. Add TypeScript type to agents/types/analysis.ts
6. Run npm run typecheck

**Output file structure:**
```typescript
// agents/agents/[agent-name].ts
import { z } from "zod"
import { callModel } from "@/agents/tools/openrouter"
import type { [AgentName]Output } from "@/agents/types/analysis"

interface AgentInput {
  idea: string
  model: string
}

export async function run[AgentName]Agent(
  input: AgentInput
): Promise<[AgentName]Output> {
  try {
    const response = await callModel({
      model: input.model,
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: input.idea,
    })

    return [AgentName]Schema.parse(JSON.parse(response))
  } catch (error) {
    console.error("[AgentName] failed:", error)
    return get[AgentName]Fallback(input.idea)
  }
}

function get[AgentName]Fallback(idea: string): [AgentName]Output {
  // Return typed mock data
}
```

---

## Skill: new-dashboard-section

**Trigger phrases:** "create section", "build the X section",
"add dashboard section"

**What it does:** Creates a complete dashboard section
component following the established pattern.

**Steps:**
1. Read agents/types/analysis.ts for the section's data type
2. Create components/analysis/sections/[Name]Section.tsx
3. Include:
   - TypeScript interface for props
   - Loading skeleton (shown via Suspense)
   - Empty state (shown when no data)
   - Full data render
   - "Copy as text" button
   - Source citations where applicable
   - Proper error handling
4. Add section to the sidebar navigation
5. Keep under 200 lines — split if needed

**Component template:**
```typescript
import type { [SectionType] } from "@/agents/types/analysis"
import { CopyButton } from "@/components/shared/CopyButton"

interface [Name]SectionProps {
  data: [SectionType] | null
  isLoading?: boolean
}

export function [Name]Section({
  data,
  isLoading,
}: [Name]SectionProps): JSX.Element {
  if (isLoading) return <[Name]SectionSkeleton />
  if (!data) return <[Name]SectionEmpty />

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0C0D0E]">
          Section Title
        </h2>
        <CopyButton text={formatForCopy(data)} />
      </div>
      {/* Section content */}
    </section>
  )
}
```

---

## Skill: add-page

**Trigger phrases:** "create page", "add route", "build page"

**What it does:** Creates a complete Next.js page with all
required sibling files.

**Steps:**
1. Determine if public, auth, or app route group
2. Create app/(group)/[route]/page.tsx
3. Create app/(group)/[route]/loading.tsx
4. Create app/(group)/[route]/error.tsx
5. If data fetching: fetch in parallel with Promise.all()
6. Add to navigation if needed
7. Run npm run typecheck

---

## Skill: database-migration

**Trigger phrases:** "add table", "create table", "migrate",
"add column", "change schema"

**What it does:** Creates a proper Supabase migration.

**Steps:**
1. Create file: supabase/migrations/[timestamp]_[name].sql
2. Include:
   - CREATE TABLE with all columns
   - ALTER TABLE ENABLE ROW LEVEL SECURITY
   - CREATE POLICY for user data access
   - CREATE INDEX for frequently queried columns
   - Comments explaining design decisions
3. Update types: npx supabase gen types
4. Update agents/types/analysis.ts if needed

---

## Skill: security-audit

**Trigger phrases:** "audit security", "check for secrets",
"security review"

**What it does:** Scans for security issues.

**Checks:**
1. Scan for exposed secrets in app/, agents/, components/, lib/, hooks/
   - Must find zero instances of OPENROUTER, JINA, SERPER, sk-, AIza
2. Check all env vars in src use NEXT_PUBLIC_ prefix
3. Check all API calls from server or Edge Functions only
4. Verify RLS on all tables in migration files
5. Check middleware.ts exists and runs on all app routes
6. Verify getUser() not getSession() on server

---

## Skill: fix-build

**Trigger phrases:** "fix build errors", "fix TypeScript errors",
"build is failing"

**What it does:** Systematic build error resolution.

**Steps:**
1. Run: npm run typecheck — capture all errors
2. Group errors by file
3. Fix errors file by file, starting with lowest-level
   utilities (errors cascade from imports)
4. Run: npm run build — verify zero errors
5. Never use @ts-ignore as a fix
6. Never use `as any` as a fix

---

## Skill: add-supabase-realtime

**Trigger phrases:** "add realtime", "live updates",
"streaming progress"

**What it does:** Adds Supabase Realtime subscription.

**Pattern:**
```typescript
"use client"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useRealtimeChannel(channelName: string) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "agent_complete" }, (payload) => {
        // Handle event
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelName])
}
```

---

## Skill: write-blog-post

**Trigger phrases:** "write blog post", "create article",
"draft post about"

**What it does:** Creates a complete MDX blog post.

**Steps:**
1. Get the topic from user
2. Research the topic using web search (if needed)
3. Write 1,500-2,500 word article
4. Save to content/blog/posts/[slug].mdx
5. Include frontmatter: title, slug, date, excerpt,
   author, readTime, category, published

**Writing rules:**
- No corporate speak or empty buzzwords
- Write like a founder talking to another founder
- Every section has actionable advice
- End with natural CTA to try ValiSearch
- No lorem ipsum, no placeholder text

---

## Skill: trigger-dev-task

**Trigger phrases:** "create background job", "add trigger task",
"long-running task"

**What it does:** Creates a Trigger.dev v3 task for
long-running operations.

**Steps:**
1. Create triggers/[task-name].ts
2. Define the task with proper typing
3. Add error handling and retry logic
4. Create or update the API route that triggers it
5. Add webhook handler for completion callback

**Pattern:**
```typescript
import { task } from "@trigger.dev/sdk/v3"

export const myTask = task({
  id: "my-task",
  run: async (payload: MyPayload) => {
    // Long-running work here
    // Can take minutes without timeout
    return result
  },
})
```

---

## Skill: component-refactor

**Trigger phrases:** "refactor component", "split component",
"component too long"

**What it does:** Breaks a component exceeding 200 lines
into smaller focused components.

**Steps:**
1. Read the component fully
2. Identify logical sections that can be extracted
3. Create sub-components in the same directory
4. Move logic into custom hooks if stateful
5. Keep the parent component as a composition layer
6. Verify all imports resolve
7. Run npm run typecheck

---

## Skill: rag-architect

**Trigger phrases:** "build RAG pipeline", "add knowledge base",
"set up vector search", "embed documents"

**What it does:** Designs and implements RAG (Retrieval-Augmented
Generation) pipelines for ValiSearch's knowledge base.
Inspired by alirezarezvani/claude-skills rag-architect skill.

**Steps:**
1. Define the data source and chunk strategy
2. Create or update the knowledge_base table schema
3. Implement document chunking (500-1000 token chunks, 100 token overlap)
4. Generate embeddings via Gemini API or OpenRouter
5. Store embeddings in Supabase pgvector(1536)
6. Create similarity search function using cosine distance
7. Add retrieval step to relevant agents (Market, Competitor, Problem)
8. Validate retrieval quality with test queries

**Chunking rules:**
- Max chunk size: 1000 tokens
- Overlap: 100 tokens
- Always preserve sentence boundaries
- Include metadata: source, category, date, relevance_score

**Search pattern:**
```sql
-- Supabase pgvector similarity search
SELECT content, metadata, 1 - (embedding <=> query_embedding) AS similarity
FROM knowledge_base
WHERE 1 - (embedding <=> query_embedding) > 0.7
ORDER BY similarity DESC
LIMIT 5;
```

---

## Skill: agent-designer

**Trigger phrases:** "design agent system", "orchestrate agents",
"multi-agent architecture", "agent workflow"

**What it does:** Designs multi-agent orchestration patterns
for ValiSearch's 12-agent system. Covers agent communication,
error handling, parallel execution, and result synthesis.
Inspired by alirezarezvani/claude-skills agent-designer skill.

**Steps:**
1. Define agent inputs and outputs (typed interfaces)
2. Determine execution order (parallel vs sequential)
3. Design fallback strategy per agent
4. Implement Promise.allSettled() orchestration
5. Add progress reporting via Supabase Realtime
6. Design synthesis pass (cross-referencing outputs)
7. Test with mock data first, then live

**Orchestration pattern:**
```typescript
// Run 11 agents in parallel, synthesis after
const results = await Promise.allSettled([
  runIdeaValidator(input),
  runMarketResearcher(input),
  runCompetitorIntel(input),
  // ... 8 more agents
])

// Extract successful results, use fallbacks for failures
const agentOutputs = results.map((r, i) =>
  r.status === 'fulfilled' ? r.value : getFallback(agents[i])
)

// Synthesis always runs last, always with Claude
const synthesis = await runSynthesis(agentOutputs, 'anthropic/claude-sonnet-4-6')
```

---

## Skill: performance-profiler

**Trigger phrases:** "profile performance", "optimize speed",
"slow page", "bundle analysis", "core web vitals"

**What it does:** Profiles and optimizes ValiSearch performance.
Inspired by alirezarezvani/claude-skills performance-profiler skill.

**Checks:**
1. Bundle size analysis: `npm run build` + check .next/analyze
2. Server Component vs Client Component split
3. Image optimization (next/image usage)
4. Font loading (Inter preload check)
5. Suspense boundaries for streaming
6. Parallel data fetching (no sequential awaits)
7. Dynamic imports for heavy components (Recharts, @dnd-kit)

**Targets:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 200ms
- Bundle size (JS): < 200KB initial load
- Analysis completion: < 90 seconds

---

## Skill: seo-optimization

**Trigger phrases:** "optimize SEO", "add meta tags",
"improve search ranking", "structured data"

**What it does:** Implements SEO best practices across
ValiSearch's public pages.
Inspired by alirezarezvani/claude-skills SEO pod.

**Steps:**
1. Add metadata export to every public page:
```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title | ValiSearch",
  description: "Specific, compelling description under 160 chars",
  openGraph: {
    title: "...",
    description: "...",
    url: "https://valisearch.com/page",
    siteName: "ValiSearch",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
  },
}
```
2. Create JSON-LD structured data for landing + pricing pages
3. Verify sitemap.xml includes all public routes
4. Check robots.txt allows crawling of public routes
5. Verify canonical URLs on all pages
6. Check heading hierarchy (single H1, proper H2-H4 nesting)
7. Verify alt text on all images

---

## Skill: landing-page-builder

**Trigger phrases:** "build landing page", "create landing section",
"update hero", "conversion optimization"

**What it does:** Creates or updates high-converting landing
page sections following ValiSearch's design system.
Inspired by alirezarezvani/claude-skills landing-page-generator.

**Design rules:**
- Hero: Clear headline (< 10 words), subhead (< 25 words),
  single CTA, idea textarea
- Social proof: Real numbers only (users, analyses run)
- Features: Icon + heading + 1-sentence description, grid layout
- How it works: 3 numbered steps, simple illustrations via CSS
- Pricing: 3 cards, recommended plan highlighted
- No gradients, no dark backgrounds, no emoji, no stock photos

**Component structure:**
```
components/landing/
  HeroSection.tsx       — headline + textarea + CTA
  HowItWorks.tsx        — 3 steps
  FeatureGrid.tsx       — feature cards
  DashboardMockup.tsx   — HTML/CSS preview
  PricingCards.tsx       — 3 plan cards
```

---

## Skill: api-route-handler

**Trigger phrases:** "create API route", "add endpoint",
"build route handler"

**What it does:** Creates Next.js App Router route handlers
following ValiSearch's patterns.

**Steps:**
1. Create app/api/[path]/route.ts
2. Use proper HTTP method exports (GET, POST, etc.)
3. Validate request body with zod
4. Authenticate via supabase.auth.getUser()
5. Handle errors with proper HTTP status codes
6. Never include secret keys — call Edge Functions instead
7. Rate limit via Upstash Redis if public-facing

**Pattern:**
```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const requestSchema = z.object({
  idea: z.string().min(20).max(2000),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = requestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    // Process request...
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] route failed:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
```

---

## Skill: env-secrets-manager

**Trigger phrases:** "manage secrets", "check env vars",
"rotate keys", "env security"

**What it does:** Manages environment variables and secrets
safely following ValiSearch's security model.
Inspired by alirezarezvani/claude-skills env-secrets-manager.

**Checks:**
1. Verify .env.local is in .gitignore
2. Verify .env.example exists with all required vars documented
3. Scan for hardcoded secrets in source code
4. Verify secret keys are ONLY in Edge Function env vars
5. Verify NEXT_PUBLIC_ prefix on all browser-safe vars
6. Check Supabase Edge Function secrets are set

**Secret rotation checklist:**
- [ ] Generate new key
- [ ] Update in Supabase Edge Function secrets
- [ ] Update in Trigger.dev environment
- [ ] Verify old key no longer works
- [ ] Update .env.example if variable name changed

---

## Skill: webhook-handler

**Trigger phrases:** "create webhook", "handle webhook",
"Lemon Squeezy webhook", "payment webhook"

**What it does:** Creates secure webhook handlers for
external service integrations.

**Steps:**
1. Create app/api/webhook/[service]/route.ts
2. Validate webhook signature (HMAC-SHA256)
3. Parse and validate payload with zod
4. Process the event idempotently
5. Return 200 quickly (process async if needed)
6. Log the event for debugging
7. Never expose internal errors to the caller

**Lemon Squeezy webhook pattern:**
```typescript
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-signature")
    const secret = process.env.LS_WEBHOOK_SECRET

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 })
    }

    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(rawBody)
    const digest = hmac.digest("hex")

    if (digest !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    // Process event...

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[Webhook] processing failed:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
```

---

## Skill: test-driven-development

**Trigger phrases:** "write tests", "add test coverage",
"TDD", "test this feature"

**What it does:** Writes tests before or alongside implementation.
Inspired by obra/superpowers test-driven-development skill.

**Steps:**
1. Understand the feature requirement
2. Write failing test first (if TDD)
3. Implement minimum code to pass
4. Refactor while keeping tests green
5. Add edge case tests
6. Run full test suite: npm run test

**Testing priorities for ValiSearch:**
1. Agent fallback behavior (mock data returns correct types)
2. Credit deduction logic (never go negative)
3. Auth middleware (redirects work correctly)
4. Zod schema validation (rejects bad data)
5. Utility functions (formatScore, sanitizeIdea, etc.)

---

## Skill: changelog-entry

**Trigger phrases:** "update changelog", "document changes",
"what changed"

**What it does:** Creates structured changelog entries for
the /changelog page.
Inspired by ComposioHQ/awesome-claude-skills changelog-generator.

**Steps:**
1. Read recent git commits since last changelog entry
2. Group changes by type (feat, fix, perf, etc.)
3. Write user-facing descriptions (not technical commit messages)
4. Add to content/changelog/[date].mdx
5. Include version number if applicable

**Format:**
```markdown
---
date: "2026-05-11"
version: "0.1.0"
title: "Project Foundation"
---

## New
- Initial project setup with Next.js 15 + TypeScript
- Supabase auth integration with email signup

## Improved
- TypeScript strict mode enabled across entire codebase

## Fixed
- None yet
```
