"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Lock, ChevronRight, ShieldCheck, HelpCircle } from "lucide-react"
import { PLANS, BillingPeriod, getAnnualSavings } from "@/lib/constants"
import Link from "next/link"

export default function PricingPage() {
  const router = useRouter()
  const [period, setPeriod] = useState<BillingPeriod>("monthly")

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* SECTION 1 - Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">
        <span className="text-[11px] font-bold tracking-[0.06em] text-[#52565E] uppercase mb-4 block">Pricing</span>
        <h1 className="text-4xl md:text-5xl font-bold text-[#0C0D0E] tracking-tight mb-6">
          Intelligence that pays for itself
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-[#52565E] leading-[1.7] mb-12">
          Most founders waste months building something nobody wants. ValiSearch tells you in 60 seconds if your idea is worth pursuing.
        </p>

        {/* Monthly/Annual Toggle */}
        <div className="flex items-center justify-center gap-4">
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-1 inline-flex shadow-sm">
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                period === "monthly" 
                  ? "bg-[#1B4FFF] text-white shadow" 
                  : "text-[#52565E] hover:text-[#0C0D0E]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod("annual")}
              className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-colors ${
                period === "annual" 
                  ? "bg-[#1B4FFF] text-white shadow" 
                  : "text-[#52565E] hover:text-[#0C0D0E]"
              }`}
            >
              Annual
            </button>
          </div>
          {period === "annual" && (
            <span className="bg-[#16A34A]/10 text-[#16A34A] text-xs font-bold px-3 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* SECTION 2 - Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          
          {/* Card 1: Starter */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col h-full relative">
            <div className="mb-6">
              <span className="bg-[#F3F4F6] text-[#52565E] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                Starter
              </span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-[#0C0D0E]">$0</span>
              <span className="text-[#52565E] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#52565E] mb-6">Permanently free</p>
            
            <div className="h-px bg-[#E5E7EB] w-full mb-6"></div>
            
            <div className="flex-1 space-y-4 mb-8">
              {PLANS.starter.features.map(f => (
                <div key={f} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[#1A1D23] text-sm">{f}</span>
                </div>
              ))}
              {PLANS.starter.locked.map(f => (
                <div key={f} className="flex gap-3 items-start opacity-60">
                  <Lock className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span className="text-[#52565E] text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11 bg-white hover:bg-gray-50 border-[#D1D5DB] text-[#1A1D23] font-semibold mb-3"
              onClick={() => router.push('/register')}
            >
              Get started free &rarr;
            </Button>
            <p className="text-center text-xs text-[#9CA3AF]">
              7-day Pro trial included — no card required
            </p>
          </div>

          {/* Card 2: Pro */}
          <div className="bg-white border-2 border-[#1B4FFF] rounded-2xl p-7 shadow-lg shadow-blue-100 flex flex-col h-full relative mt-[-12px]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1B4FFF] text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
              MOST POPULAR
            </div>
            <div className="mb-6 mt-2">
              <span className="bg-[#EEF2FF] text-[#1B4FFF] text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                Pro
              </span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-[#0C0D0E]">
                ${period === "annual" ? PLANS.pro.annualPrice : PLANS.pro.price}
              </span>
              <span className="text-[#52565E] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#52565E] mb-6 h-5">
              {period === "annual" ? `Billed $${PLANS.pro.annualPrice * 12}/year` : "Billed monthly"}
            </p>
            
            <div className="h-px bg-[#E5E7EB] w-full mb-6"></div>
            
            <div className="flex-1 space-y-4 mb-8">
              {PLANS.pro.features.map(f => (
                <div key={f} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[#1A1D23] text-sm">{f}</span>
                </div>
              ))}
              {PLANS.pro.locked.map(f => (
                <div key={f} className="flex gap-3 items-start opacity-60">
                  <Lock className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span className="text-[#52565E] text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full h-11 bg-[#1B4FFF] hover:bg-[#1240CC] text-white font-semibold mb-3 shadow-md shadow-blue-500/20"
              onClick={() => router.push('/register')}
            >
              Start Pro trial &rarr;
            </Button>
            <p className="text-center text-xs text-[#9CA3AF]">
              7-day free trial — no credit card required
            </p>
          </div>

          {/* Card 3: Business */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col h-full relative">
            <div className="mb-6">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                Business
              </span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-[#0C0D0E]">
                ${period === "annual" ? PLANS.business.annualPrice : PLANS.business.price}
              </span>
              <span className="text-[#52565E] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#52565E] mb-6 h-5">
               {period === "annual" ? `Billed $${PLANS.business.annualPrice * 12}/year` : "Billed monthly"}
            </p>
            
            <div className="h-px bg-[#E5E7EB] w-full mb-6"></div>
            
            <div className="flex-1 space-y-4 mb-8">
              {PLANS.business.features.map(f => (
                <div key={f} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[#1A1D23] text-sm">{f}</span>
                </div>
              ))}
              {PLANS.business.locked.map(f => (
                <div key={f} className="flex gap-3 items-start opacity-60">
                  <Lock className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span className="text-[#52565E] text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline"
              className="w-full h-11 bg-white hover:bg-gray-50 border-[#D1D5DB] text-[#1A1D23] font-semibold mb-3"
              onClick={() => router.push('/register')}
            >
              Start Business trial &rarr;
            </Button>
            <p className="text-center text-xs text-[#9CA3AF]">
              7-day free trial — no credit card required
            </p>
          </div>

          {/* Card 4: Enterprise */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col h-full relative">
            <div className="mb-6">
              <span className="bg-[#0C0D0E] text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                Enterprise
              </span>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold text-[#0C0D0E]">
                ${period === "annual" ? PLANS.enterprise.annualPrice : PLANS.enterprise.price}
              </span>
              <span className="text-[#52565E] text-sm ml-1">/month</span>
            </div>
            <p className="text-sm text-[#52565E] mb-6 h-5">
               {period === "annual" ? `Billed $${PLANS.enterprise.annualPrice * 12}/year` : "Billed monthly"}
            </p>
            
            <div className="h-px bg-[#E5E7EB] w-full mb-6"></div>
            
            <div className="flex-1 space-y-4 mb-8">
              {PLANS.enterprise.features.map(f => (
                <div key={f} className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span className="text-[#1A1D23] text-sm">{f}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline"
              className="w-full h-11 bg-[#0C0D0E] hover:bg-[#1A1D23] border-[#0C0D0E] text-white font-semibold mb-3"
              onClick={() => router.push('/register')}
            >
              Start Enterprise trial &rarr;
            </Button>
            <p className="text-center text-xs text-[#9CA3AF]">
              7-day free trial — no credit card required
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 3 - Feature Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 overflow-x-auto pb-4">
        <h2 className="text-2xl font-bold text-[#0C0D0E] mb-8 text-center">Compare plans in detail</h2>
        <div className="inline-block min-w-full align-middle">
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-sm">
            <table className="min-w-full divide-y divide-[#E5E7EB]">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-[#52565E] uppercase tracking-wider sticky left-0 bg-[#F9FAFB] z-10 w-1/3">Features</th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-[#0C0D0E] uppercase tracking-wider">Starter</th>
                  <th className="py-4 px-6 text-center text-xs font-bold text-[#1B4FFF] uppercase tracking-wider bg-[#EEF2FF]/50">Pro</th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-[#0C0D0E] uppercase tracking-wider">Business</th>
                  <th className="py-4 px-6 text-center text-xs font-semibold text-[#0C0D0E] uppercase tracking-wider">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] bg-white">
                {/* Analyses */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">Analyses per month</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">3</td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20">50</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">200</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">Unlimited</td>
                </tr>
                {/* Team Members */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">Team workspace</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">Up to 5</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">Unlimited</td>
                </tr>
                {/* Web Search */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">Real-time web research</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                </tr>
                {/* PDF Export */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">PDF & DOCX Export</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                </tr>
                {/* History */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">Analysis history</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">7 days</td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20">90 days</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">1 year</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]">Unlimited</td>
                </tr>
                {/* AI Chat */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">AI Co-founder Chat</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                </tr>
                {/* API */}
                <tr>
                  <td className="py-4 px-6 text-sm text-[#1A1D23] font-medium sticky left-0 bg-white shadow-[1px_0_0_0_#E5E7EB]">API access</td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#0C0D0E] font-medium bg-[#EEF2FF]/20"><Lock className="w-4 h-4 mx-auto text-[#9CA3AF]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                  <td className="py-4 px-6 text-center text-sm text-[#52565E]"><Check className="w-5 h-5 mx-auto text-[#16A34A]" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 4 - Trial Explainer Box */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-[#0C0D0E] mb-8 text-center">How the 7-day trial works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-[#1B4FFF] shadow-sm mb-4">1</div>
              <h4 className="font-semibold text-[#0C0D0E] mb-2">Sign up</h4>
              <p className="text-sm text-[#52565E] leading-relaxed">Create your account in 30 seconds. No credit card required.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-[#1B4FFF] shadow-sm mb-4">2</div>
              <h4 className="font-semibold text-[#0C0D0E] mb-2">Get full Pro access</h4>
              <p className="text-sm text-[#52565E] leading-relaxed">Use every feature for 7 days. Run unlimited analyses.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-[#1B4FFF] shadow-sm mb-4">3</div>
              <h4 className="font-semibold text-[#0C0D0E] mb-2">Keep what works for you</h4>
              <p className="text-sm text-[#52565E] leading-relaxed">Upgrade to keep Pro, Business, or Enterprise. Or stay on Starter — forever free.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 - FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <h2 className="text-3xl font-bold text-[#0C0D0E] mb-12 text-center">Frequently asked questions</h2>
        <div className="space-y-8">
          
          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Do I need a credit card to start?</h4>
            <p className="text-[#52565E] leading-relaxed">No. Sign up with just your email. You get 7 days of full Pro access free. We ask for payment only when you choose to upgrade.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">What happens when my trial ends?</h4>
            <p className="text-[#52565E] leading-relaxed">Your account automatically moves to the free Starter plan. You keep 3 analyses and your history. Upgrade anytime to restore full access.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Can I change plans?</h4>
            <p className="text-[#52565E] leading-relaxed">Yes. Upgrade, downgrade, or cancel anytime from your billing settings. Changes take effect at the end of your current period.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Do unused analyses roll over?</h4>
            <p className="text-[#52565E] leading-relaxed">Pro and Business analyses reset monthly. Enterprise is unlimited, so rollover is not relevant.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">What is the annual discount?</h4>
            <p className="text-[#52565E] leading-relaxed">Annual subscribers save 20% — equivalent to getting 2.4 months free per year.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Is my data private?</h4>
            <p className="text-[#52565E] leading-relaxed">Yes. We never train AI models on your ideas. Your analyses are encrypted and belong only to you. Delete everything at any time.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Do you offer refunds?</h4>
            <p className="text-[#52565E] leading-relaxed">Yes. Email us within 7 days of your first charge and we'll refund you completely, no questions asked.</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-[#0C0D0E] mb-2">Can I use this from Africa or emerging markets?</h4>
            <p className="text-[#52565E] leading-relaxed">Yes. We built ValiSearch specifically for founders in Africa, Southeast Asia, and Latin America. Our pricing reflects emerging market realities.</p>
          </div>

        </div>
      </div>

      {/* SECTION 6 - Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white border border-[#E5E7EB] rounded-3xl p-12 shadow-sm">
        <h2 className="text-3xl font-bold text-[#0C0D0E] mb-4">Ready to validate your first idea?</h2>
        <p className="text-lg text-[#52565E] mb-8">Start your 7-day free trial &rarr; no card required</p>
        <Button 
          className="h-14 px-8 text-lg bg-[#1B4FFF] hover:bg-[#1240CC] text-white font-bold shadow-lg shadow-blue-500/20"
          onClick={() => router.push('/register')}
        >
          Get started free
        </Button>
      </div>
    </div>
  )
}
