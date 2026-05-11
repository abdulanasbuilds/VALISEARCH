import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

const POSTS: Record<string, {
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  readTime: string
}> = {
  "12-ai-agents-validate-startup-idea": {
    title: "How 12 AI Agents Validate Your Startup Idea in Minutes",
    excerpt: "Traditional market research takes weeks. We built an agentic system that does it in seconds using 12 specialized AI agents working in parallel.",
    date: "2026-05-10",
    category: "Product",
    readTime: "5 min read",
    content: `
## The Problem with Traditional Market Research

When you're validating a startup idea, you need answers to critical questions:
- Is there real demand for this?
- Who are my competitors?
- What's the actual market size?
- What are the growth channels?

Traditionally, this takes weeks of manual research, surveys, and interviews. Most founders never get past this phase because it's overwhelming and time-consuming.

## Introducing the 12-Agent Validation System

We built ValiSearch to solve this problem. Here's how it works:

### 1. Idea Validator Agent
Scores your idea across 6 key dimensions: clarity, feasibility, market fit, scalability, timing, and differentiation.

### 2. Market Researcher Agent
Researches TAM, SAM, and SOM using web search. Finds industry reports, market trends, and growth projections.

### 3. Competitor Intel Agent
Identifies direct and indirect competitors. Analyzes their positioning, pricing, strengths, and weaknesses.

### 4. Problem Prioritizer Agent
Validates pain points by analyzing Reddit, Hacker News, and social discussions. Scores severity and frequency.

### 5-12. Seven More Specialized Agents
Product Manager, Offer Architect, Growth Strategist, Distribution Planner, Content Creator, Brand Namer, and Scale Architect each provide deep insights in their domain.

## The Secret: Parallel Execution

All 12 agents run simultaneously using Promise.allSettled(), completing in under 90 seconds. The Synthesis Agent then cross-references all outputs to generate a unified verdict.

## Try It Yourself

Get started with 6 free credits when you sign up. Each credit runs a complete 12-agent analysis.
    `,
  },
  "why-founders-stuck-idea-validation": {
    title: "Why Most Founders Get Stuck in Idea Validation",
    excerpt: "The biggest blocker to starting isn't funding or talent - it's the fear that your idea isn't good enough. Here's how to break through.",
    date: "2026-05-05",
    category: "Insights",
    readTime: "4 min read",
    content: `
## The Validation Trap

You've got an idea. It's been in your head for months. You've told friends, asked on Twitter, maybe even built a prototype. But you still haven't launched.

Why?

## The Root Cause: Perfectionism Masquerading as Research

We call it "validation" but often it's just procrastination with a fancy name. We tell ourselves we need:
- More market research
- More competitor analysis
- More customer interviews
- More certainty

But here's the truth: you'll never have 100% certainty. Every successful startup launched with incomplete information.

## The Fix: Minimum Viable Validation

Instead of trying to prove your idea will succeed, try to prove it won't. This flips the mindset:

1. **Identify your riskiest assumption**
2. **Design the cheapest test**
3. **Run it in 48 hours**
4. **Decide: pivot, proceed, or pause**

## How ValiSearch Helps

Our 12-agent system gives you a comprehensive validation in minutes, not weeks. It won't eliminate all uncertainty, but it will give you a data-backed foundation to make your decision.

The goal isn't to prove you're right - it's to learn what's true.
    `,
  },
  "bootstrap-saas-ghana-2026": {
    title: "Bootstrapping a SaaS from Ghana: Lessons Learned",
    excerpt: "Building a global AI product from Accra, Ghana with zero external funding. The challenges, the wins, and what's next.",
    date: "2026-04-28",
    category: "Founder Story",
    readTime: "6 min read",
    content: `
## Why Ghana?

I'm Abdul Anas, a solo founder building ValiSearch from Accra, Ghana. No VC funding. No accelerator. Just a laptop, Claude, and a lot of determination.

## The Challenges

### 1. Payment Processing
Most global payment processors don't support Ghana. We had to integrate multiple gateways (Flutterwave, Paystack) just to accept payments.

### 2. Internet Reliability
Power cuts and internet outages are common. I've learned to build offline-first workflows and use tools that sync when connectivity returns.

### 3. Time Zone Isolation
Everyone I need to talk to is in a different time zone. Early morning calls with US customers, late night calls with European ones.

## The Wins

### 1. Zero Overhead
No employees means no payroll stress. Every dollar earned goes back into product.

### 2. Rapid Iteration
With no board or investors to please, I can ship features in hours, not quarters.

### 3. Global from Day One
Building for the world from the start, not just the local market.

## What's Next

We're just getting started. The goal is to prove that world-class products can be built anywhere. Follow along.
    `,
  },
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article>
          <div className="mb-6 flex items-center gap-4">
            <Badge variant="secondary">{post.category}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold">{post.title}</h1>

          <div className="prose prose-lg max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={i} className="mt-8 mb-4 text-2xl font-bold">{paragraph.replace("## ", "")}</h2>
              }
              if (paragraph.startsWith("### ")) {
                return <h3 key={i} className="mt-6 mb-3 text-xl font-semibold">{paragraph.replace("### ", "")}</h3>
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter(p => p.startsWith("- "))
                return (
                  <ul key={i} className="my-4 list-disc pl-6">
                    {items.map((item, j) => (
                      <li key={j} className="mb-2">{item.replace("- ", "")}</li>
                    ))}
                  </ul>
                )
              }
              if (paragraph.startsWith("1. ")) {
                const items = paragraph.split("\n").filter(p => p.match(/^\d+\. /))
                return (
                  <ol key={i} className="my-4 list-decimal pl-6">
                    {items.map((item, j) => (
                      <li key={j} className="mb-2">{item.replace(/^\d+\. /, "")}</li>
                    ))}
                  </ol>
                )
              }
              return paragraph.trim() ? (
                <p key={i} className="mb-4 text-muted-foreground">{paragraph}</p>
              ) : null
            })}
          </div>
        </article>
      </div>
    </div>
  )
}