import type { AgentContext } from "../types"
import type { ProductManagerOutput } from "@/agents/types/analysis"
import { traceAgentCall } from "../tools/langsmith"

const FALLBACK_OUTPUT: ProductManagerOutput = {
  mvp_features: [
    { name: "User Authentication", description: "Sign up, login, password reset", priority: "must-have", effort: "medium", user_story: "As a user, I want to create an account" },
    { name: "Core Feature", description: "Primary value proposition feature", priority: "must-have", effort: "high", user_story: "As a user, I want to use the core feature" },
    { name: "Dashboard", description: "User dashboard to view their data", priority: "should-have", effort: "medium", user_story: "As a user, I want to see my dashboard" },
  ],
  kanban_tasks: [
    { title: "Setup project", description: "Initialize repo, CI/CD, basic structure", column: "todo", priority: "high", estimated_hours: 8 },
    { title: "Auth system", description: "Implement Supabase auth", column: "todo", priority: "high", estimated_hours: 16 },
    { title: "Core MVP", description: "Build minimum viable product", column: "in-progress", priority: "high", estimated_hours: 40 },
  ],
  tech_stack_recommendation: ["Next.js 15", "Supabase", "Tailwind CSS", "TypeScript"],
  launch_timeline_weeks: 8,
  build_vs_buy: ["Use Supabase for auth/db - buy", "Use Vercel for hosting - buy", "Custom UI needed - build"],
}

export async function runProductManager(context: AgentContext): Promise<ProductManagerOutput> {
  return traceAgentCall(
    {
      agentName: "product_manager",
      userId: context.userId ?? "anonymous",
      analysisId: context.analysisId ?? "dev",
      model: "auto",
      userPlan: "free",
    },
    () => runProductManagerInner(context)
  )
}

async function runProductManagerInner(context: AgentContext): Promise<ProductManagerOutput> {
  const { ideaText } = context

  try {
    // Basic MVP based on idea type
    const features: ProductManagerOutput["mvp_features"] = [
      {
        name: "User Authentication",
        description: "Email/password signup and login via Supabase",
        priority: "must-have",
        effort: "low",
        user_story: "As a user, I want to create an account to access the platform",
      },
      {
        name: "Idea Input Interface",
        description: "Simple form to input and describe startup idea",
        priority: "must-have",
        effort: "low",
        user_story: "As a user, I want to enter my startup idea",
      },
      {
        name: "Analysis Results Dashboard",
        description: "View generated analysis reports",
        priority: "must-have",
        effort: "high",
        user_story: "As a user, I want to see my analysis results",
      },
      {
        name: "Credit System",
        description: "Track and deduct credits for analyses",
        priority: "should-have",
        effort: "medium",
        user_story: "As a user, I want to see my credit balance",
      },
      {
        name: "Export Options",
        description: "Download analysis as PDF or text",
        priority: "nice-to-have",
        effort: "medium",
        user_story: "As a user, I want to export my analysis",
      },
    ]

    const tasks: ProductManagerOutput["kanban_tasks"] = [
      { title: "Initialize Next.js project with TypeScript", column: "todo", priority: "high", estimated_hours: 4 },
      { title: "Set up Supabase auth and database", column: "todo", priority: "high", estimated_hours: 8 },
      { title: "Create landing page and auth forms", column: "todo", priority: "high", estimated_hours: 16 },
      { title: "Build idea input form", column: "in-progress", priority: "high", estimated_hours: 8 },
      { title: "Implement analysis trigger system", column: "todo", priority: "high", estimated_hours: 16 },
      { title: "Create results dashboard UI", column: "todo", priority: "high", estimated_hours: 24 },
      { title: "Add credit system and billing UI", column: "backlog", priority: "medium", estimated_hours: 16 },
    ]

    return {
      mvp_features: features,
      kanban_tasks: tasks,
      tech_stack_recommendation: [
        "Next.js 15 (App Router)",
        "TypeScript",
        "Tailwind CSS v4",
        "Supabase (Auth + Database)",
        "shadcn/ui components",
        "Trigger.dev for background jobs",
      ],
      launch_timeline_weeks: 6,
      build_vs_buy: [
        "Supabase Auth - buy (handled)",
        "Supabase Database - buy (handled)",
        "UI Components - build with shadcn/ui",
        "Analysis Engine - build with Trigger.dev",
        "Hosting - Vercel or Cloudflare Pages",
      ],
    }
  } catch (error) {
    console.error("ProductManager error:", error)
    return FALLBACK_OUTPUT
  }
}
