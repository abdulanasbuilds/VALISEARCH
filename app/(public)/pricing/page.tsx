"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying things out",
    credits: "6 credits",
    features: [
      "6 startup idea analyses",
      "12 parallel AI agents",
      "Basic validation dimensions",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious founders",
    credits: "100 credits",
    features: [
      "100 startup idea analyses",
      "All 12 AI agents",
      "Advanced market research",
      "Competitor analysis",
      "Growth strategies",
      "Priority support",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "$79",
    period: "/month",
    description: "For teams and agencies",
    credits: "Unlimited",
    features: [
      "Unlimited analyses",
      "All AI agents + synthesis",
      "White-label reports",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Go Premium",
    popular: false,
  },
]

const FAQ = [
  {
    question: "What are credits?",
    answer: "Each credit lets you run one complete startup idea analysis with all 12 AI agents working in parallel.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription anytime. Your credits will remain until the billing period ends.",
  },
  {
    question: "Do unused credits roll over?",
    answer: "Pro plans include monthly credit allocations. Unused credits at month-end do not roll over.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards. Works globally.",
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
        body: JSON.stringify({
          plan,
          gateway: "stripe",
        }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error("Checkout failed:", data.error)
      }
    } catch (error) {
      console.error("Checkout error:", error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">
            Get actionable startup intelligence in seconds
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.credits}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 shrink-0 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.name === "Free" ? (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => router.push("/register")}
                  >
                    {plan.cta}
                  </Button>
                ) : plan.name === "Premium" ? (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe("premium")}
                    disabled={loading === "premium"}
                  >
                    {loading === "premium" ? "Processing..." : plan.cta}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe("pro")}
                    disabled={loading === "pro"}
                  >
                    {loading === "pro" ? "Processing..." : plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">Frequently asked questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-lg border p-6">
                <h3 className="mb-2 font-semibold">{item.question}</h3>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}