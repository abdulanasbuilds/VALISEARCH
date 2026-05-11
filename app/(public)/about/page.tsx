import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit, Target, Zap, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">About ValiSearch</h1>
          <p className="text-lg text-muted-foreground">
            AI-powered startup intelligence for founders everywhere
          </p>
        </div>

        <div className="mb-12 rounded-lg border bg-muted/50 p-8">
          <h2 className="mb-4 text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            We believe every founder deserves access to the same quality of market intelligence that Fortune 500 companies have.
            Whether you're in San Francisco, Lagos, or Accra, ValiSearch gives you 12 AI agents working in parallel to validate your startup idea in minutes.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <BrainCircuit className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>12 AI Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each agent specializes in a different aspect of startup validation - from market research to competitive analysis to growth strategy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>90 Seconds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All 12 agents run in parallel, delivering a complete analysis in under 90 seconds. No more waiting weeks for market research.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Data-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every insight is backed by real data from web search, Reddit, Hacker News, and industry reports. No guesswork.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Global Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We accept payments from everywhere - Stripe, Flutterwave, Paystack, and Lemon Squeezy. No Ghana card required.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border p-8">
          <h2 className="mb-4 text-2xl font-bold">The Team</h2>
          <p className="mb-4 text-muted-foreground">
            ValiSearch is built by Abdul Anas, a solo founder from Accra, Ghana.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">AA</span>
            </div>
            <div>
              <p className="font-semibold">Abdul Anas</p>
              <p className="text-sm text-muted-foreground">Founder & Builder</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}