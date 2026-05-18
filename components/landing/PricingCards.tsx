"use client"

import { useState } from "react"
import { Check, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PLANS, PlanId, BillingPeriod } from "@/lib/constants"

export function PricingCards() {
  const [period, setPeriod] = useState<BillingPeriod>("monthly")

  return (
    <section className="py-24 md:py-32 bg-[#F9FAFB] overflow-hidden border-t border-gray-200/60 relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.06em] text-[#52565E] uppercase mb-3 block">
            Flexible Plans
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-[#0C0D0E]">
            Transparent pricing. Built for growth.
          </h2>
          <p className="text-lg text-[#52565E]">
            Start validating ideas instantly. Zero hidden fees. Cancel or upgrade at any time.
          </p>

          {/* Period Toggle */}
          <div className="mt-8 bg-white border border-[#E5E7EB] rounded-lg p-1 inline-flex shadow-sm">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                period === "monthly" 
                  ? "bg-[#1B4FFF] text-white shadow" 
                  : "text-[#52565E] hover:text-[#0C0D0E]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                period === "annual" 
                  ? "bg-[#1B4FFF] text-white shadow" 
                  : "text-[#52565E] hover:text-[#0C0D0E]"
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch mb-12">
          
          {/* Plan 1: Starter */}
          <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="mb-6">
              <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                Starter
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tighter text-[#0C0D0E]">$0</span>
                <span className="text-xs text-[#52565E]">/month</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Permanently free</p>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Perfect for absolute beginners validating their very first startup concept.
            </p>
            <ul className="space-y-3 mb-8 flex-1 border-t border-gray-100 pt-6">
              {PLANS.starter.features.slice(0, 4).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{f}</span>
                </li>
              ))}
              {PLANS.starter.locked.slice(0, 2).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 opacity-55">
                  <Lock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-1" />
                  <span className="text-xs text-gray-500">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="block w-full">
              <Button className="w-full h-11 font-semibold rounded-lg" variant="outline">
                Get started free
              </Button>
            </Link>
          </div>

          {/* Plan 2: Pro */}
          <div className="flex flex-col rounded-2xl border-2 border-[#1B4FFF] bg-white p-6 shadow-lg shadow-blue-500/5 relative hover:shadow-xl transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1B4FFF] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow">
              Most Popular
            </div>
            <div className="mb-6 mt-2">
              <span className="bg-blue-50 text-[#1B4FFF] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                Pro
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tighter text-[#0C0D0E]">
                  ${period === "annual" ? PLANS.pro.annualPrice : PLANS.pro.price}
                </span>
                <span className="text-xs text-[#52565E]">/month</span>
              </div>
              {period === "annual" && <p className="text-xs text-green-600 font-semibold mt-1">Billed ${PLANS.pro.annualPrice * 12}/yr</p>}
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Ideal for active builders, creators, and indie hackers with multiple ideas.
            </p>
            <ul className="space-y-3 mb-8 flex-1 border-t border-gray-100 pt-6">
              {PLANS.pro.features.slice(0, 5).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{f}</span>
                </li>
              ))}
              {PLANS.pro.locked.slice(0, 1).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 opacity-55">
                  <Lock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-1" />
                  <span className="text-xs text-gray-500">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?plan=pro" className="block w-full">
              <Button className="w-full h-11 font-semibold rounded-lg bg-[#1B4FFF] hover:bg-[#1240CC] text-white">
                Start Pro Trial
              </Button>
            </Link>
          </div>

          {/* Plan 3: Business */}
          <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="mb-6">
              <span className="bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                Business
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tighter text-[#0C0D0E]">
                  ${period === "annual" ? PLANS.business.annualPrice : PLANS.business.price}
                </span>
                <span className="text-xs text-[#52565E]">/month</span>
              </div>
              {period === "annual" && <p className="text-xs text-green-600 font-semibold mt-1">Billed ${PLANS.business.annualPrice * 12}/yr</p>}
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Designed for small startups, teams, and studio operations needing API keys.
            </p>
            <ul className="space-y-3 mb-8 flex-1 border-t border-gray-100 pt-6">
              {PLANS.business.features.slice(0, 5).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?plan=business" className="block w-full">
              <Button className="w-full h-11 font-semibold rounded-lg bg-gray-900 hover:bg-gray-800 text-white">
                Start Business Trial
              </Button>
            </Link>
          </div>

          {/* Plan 4: Enterprise */}
          <div className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="mb-6">
              <span className="bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                Enterprise
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tighter text-[#0C0D0E]">
                  ${period === "annual" ? PLANS.enterprise.annualPrice : PLANS.enterprise.price}
                </span>
                <span className="text-xs text-[#52565E]">/month</span>
              </div>
              {period === "annual" && <p className="text-xs text-green-600 font-semibold mt-1">Billed ${PLANS.enterprise.annualPrice * 12}/yr</p>}
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              For incubators, venture studios, and high-frequency analytical workflows.
            </p>
            <ul className="space-y-3 mb-8 flex-1 border-t border-gray-100 pt-6">
              {PLANS.enterprise.features.slice(0, 5).map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?plan=enterprise" className="block w-full">
              <Button className="w-full h-11 font-semibold rounded-lg bg-black hover:bg-gray-900 text-white">
                Start Enterprise Trial
              </Button>
            </Link>
          </div>

        </div>

        {/* Free Trial Messaging Callout */}
        <div className="max-w-xl mx-auto text-center p-4 border border-blue-200/60 bg-blue-50/50 rounded-xl flex items-center justify-center gap-2 shadow-sm">
          <span className="text-xs font-semibold text-gray-600 leading-relaxed">
            All paid tiers include a <strong>7-Day Free Trial</strong> without requiring a credit card on signup.
          </span>
        </div>

      </div>
    </section>
  )
}
