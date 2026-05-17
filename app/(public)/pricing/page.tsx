"use client"

export const runtime = "edge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles, Database, ShieldCheck, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

const PLANS = [
  {
    name: "Base Compute",
    price: "$0",
    description: "Ideal for testing individual ideas",
    allocation: "6 Execution Tokens",
    features: [
      "6 startup idea analyses",
      "Deploy 12 parallel AI agents",
      "Basic validation pipeline",
      "Standard data resolution",
      "Email support access",
    ],
    cta: "Initialize Free",
    popular: false,
    highlight: false,
  },
  {
    name: "Pro Allocation",
    price: "$29",
    period: "/month",
    description: "Engineered for active builders",
    allocation: "100 Execution Tokens",
    features: [
      "100 startup idea analyses",
      "Deep analytical reasoning (Sonnet 3.5)",
      "Real-time web search (Jina AI)",
      "High-fidelity competitor mapping",
      "Strategic growth modeling",
      "Priority execution queue",
    ],
    cta: "Deploy Pro Engine",
    popular: true,
    highlight: true,
  },
  {
    name: "Enterprise Core",
    price: "$79",
    period: "/month",
    description: "High-throughput intelligence",
    allocation: "Unlimited Tokens",
    features: [
      "Unlimited startup analyses",
      "Custom analytical frameworks",
      "Exportable white-label reports",
      "Full API & SDK access",
      "Dedicated infrastructure",
      "SSO & Team management",
    ],
    cta: "Go Enterprise",
    popular: false,
    highlight: false,
  },
]

const FAQ = [
  {
    question: "What is an Execution Token?",
    answer: "A token represents one complete analytical cycle where 12 specialized AI agents simultaneously research, scrape, and synthesize data for your startup idea.",
  },
  {
    question: "How does the parallel execution work?",
    answer: "We utilize Promise.allSettled() to deploy agents across search, market analysis, and competitive intelligence simultaneously, completing deep research in under 90 seconds.",
  },
  {
    question: "Can I adjust my compute allocation?",
    answer: "Yes. You can scale your execution tokens up or down directly from your command center dashboard as your validation needs evolve.",
  },
  {
    question: "Is my analytical data secure?",
    answer: "All inputs are encrypted. Your startup concepts are treated as proprietary intellectual property and are never used for model training.",
  },
]

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(plan: "pro" | "premium") {
    setLoading(plan)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, gateway: "stripe" }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background opacity-60 -z-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-3xl -z-10" />

      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary tracking-wider uppercase">
            <Zap className="h-3 w-3" />
            Compute Allocation
          </div>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl leading-[1.1]">
            Scale your <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">intelligence capacity.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose the compute power required for your startup validation pipeline. Transparent, token-based pricing with zero hidden fees.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border-border/40 bg-background/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group ${plan.highlight ? "border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                  Most Optimized
                </div>
              )}
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  {plan.highlight ? <Sparkles className="h-5 w-5 text-primary" /> : <Database className="h-5 w-5 text-muted-foreground/50" />}
                </div>
                <CardDescription className="text-sm font-medium h-10 line-clamp-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold tracking-tighter">{plan.price}</span>
                  {plan.period && (
                    <span className="text-lg font-medium text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                
                <div className="mb-8 p-3 rounded-lg bg-muted/30 border border-border/50 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-md bg-background border border-border/50 flex items-center justify-center shadow-inner">
                      <Zap className={`h-4 w-4 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                   </div>
                   <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mb-1">Compute Capacity</p>
                      <p className="text-sm font-bold font-mono tracking-tight">{plan.allocation}</p>
                   </div>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-tight group-hover:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                <Button
                  className={`w-full h-12 font-bold transition-all duration-300 rounded-xl ${plan.highlight ? "shadow-lg shadow-primary/30" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => {
                    if (plan.name === "Base Compute") router.push("/register")
                    else handleSubscribe(plan.name === "Pro Allocation" ? "pro" : "premium")
                  }}
                  disabled={!!loading}
                >
                  {loading === (plan.name === "Pro Allocation" ? "pro" : "premium") ? "Initializing..." : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Security / Trust Band */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-8 text-muted-foreground/60 text-xs font-mono font-medium">
           <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> SECURE STRIPE GATEWAY</div>
           <div className="h-1 w-1 rounded-full bg-border" />
           <div className="flex items-center gap-2"><Database className="h-4 w-4" /> ENCRYPTED PIPELINES</div>
           <div className="h-1 w-1 rounded-full bg-border" />
           <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> INSTANT ALLOCATION</div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 pt-20 border-t border-border/40">
          <div className="grid lg:grid-cols-3 gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Technical <br />FAQ</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know about ValiSearch compute cycles.</p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-x-12 gap-y-10">
              {FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="mb-3 font-bold text-lg">{item.question}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}