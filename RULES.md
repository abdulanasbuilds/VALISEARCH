# RULES.md — ValiSearch Hard Rules Reference

## This file is a quick-reference checklist.
## For full context, read CONTEXT.md.

---

## TypeScript Rules
- [ ] strict: true in tsconfig.json
- [ ] noUncheckedIndexedAccess: true
- [ ] noImplicitReturns: true
- [ ] noFallthroughCasesInSwitch: true
- [ ] Zero `any` types — use `unknown` instead
- [ ] Zero `@ts-ignore` — fix the actual error
- [ ] All function parameters have explicit types
- [ ] All function return types are explicit
- [ ] Zero build errors at all times

## Security Rules
- [ ] No secret keys in app/, components/, lib/, hooks/
- [ ] Only NEXT_PUBLIC_ vars in browser code
- [ ] All AI API calls go through Edge Functions or Trigger.dev
- [ ] supabase.auth.getUser() on server, NEVER getSession()
- [ ] RLS enabled on every database table
- [ ] Credits modified only via service_role (Edge Function)
- [ ] Webhook secrets validated before processing

## Architecture Rules
- [ ] Server Components by default (no "use client" unless needed)
- [ ] All AI logic in /agents/ directory
- [ ] Parallel data fetching with Promise.all()
- [ ] Named exports only (except page.tsx)
- [ ] No file longer than 200 lines
- [ ] Every async function has try/catch with typed fallback
- [ ] Long operations (>30s) use Trigger.dev, not Route Handlers
- [ ] Every route has error.tsx and loading.tsx siblings

## Design Rules
- [ ] Light theme only — no dark mode
- [ ] No emoji in UI elements
- [ ] No gradient backgrounds
- [ ] No AI-generated images
- [ ] No 3D shapes, blobs, or decorative elements
- [ ] No lorem ipsum or placeholder images
- [ ] Primary color: #1B4FFF
- [ ] Font: Inter (400,500,600,700,800)
- [ ] Min tap target: 44px on all interactive elements

## Component Rules
- [ ] Card: bg-white border border-gray-200 rounded-xl shadow-sm p-6
- [ ] Input: bg-white border border-gray-300 rounded-lg px-3 py-2.5
- [ ] Btn primary: bg-[#1B4FFF] text-white rounded-lg px-4 py-2.5
- [ ] Use shadcn/ui for all base components
- [ ] Use Sonner for all toasts
- [ ] Use Lucide React for all icons
- [ ] Use Recharts for all charts
- [ ] Use react-hook-form + zod for all forms

## Import Rules
- [ ] Always use @/ alias, never relative paths
- [ ] Example: import { Button } from "@/components/ui/button"

## Supabase Rules
- [ ] Server client: createServerClient from @supabase/ssr
- [ ] Browser client: createBrowserClient from @supabase/ssr
- [ ] Never mix server and client clients
- [ ] Middleware refreshes session on all app routes
- [ ] RLS policy: auth.uid() = user_id on user data tables

## Agent Rules
- [ ] 12 agents total (11 parallel + 1 synthesis)
- [ ] Research agents (2,3,4): use Jina Search + Reddit + HN
- [ ] Reasoning agents (1,5-11): pure AI analysis
- [ ] Synthesis agent (12): always Claude Sonnet
- [ ] Every agent has typed fallback — one failure never kills analysis
- [ ] All agents run via Promise.allSettled()
- [ ] Synthesis runs AFTER all 11 complete

## Git Rules
- [ ] Never commit .env or .env.local
- [ ] Always commit .env.example
- [ ] Commit format: type: description
- [ ] Types: feat, fix, security, perf, refactor, docs, chore, test
- [ ] One feature per commit, one commit per session

## What NEVER to Do
1. Never suggest Vite, CRA, or Pages Router
2. Never put AI logic in components or pages
3. Never call AI APIs directly from the browser
4. Never use `any` TypeScript type
5. Never skip error handling on async operations
6. Never ignore TypeScript errors
7. Never use default exports except for page.tsx
8. Never store secrets in committed files
9. Never write components longer than 200 lines
10. Never mix server and client Supabase clients
11. Never use getSession() on the server
12. Never run long AI operations in Route Handlers
