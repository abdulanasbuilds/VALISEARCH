"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { PLANS, PlanId, getAnnualSavings } from "@/lib/constants"
import { Check, CreditCard, Zap, Shield, AlertCircle, Clock } from "lucide-react"

export default function BillingSettingsPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        if (data) setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
  }, [supabase])

  const handleUpgrade = async (planId: PlanId) => {
    // In production, this redirects to Lemon Squeezy checkout
    alert(`Checkout flow initiated for ${planId} (${billingPeriod})`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4FFF]" />
      </div>
    )
  }

  const isTrial = profile?.is_trial_active
  const currentPlanId = profile?.plan as PlanId || "starter"
  const currentPlan = PLANS[currentPlanId]
  
  let daysLeft = 0
  if (isTrial && profile.trial_ends_at) {
    daysLeft = Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Credits</h1>
        <p className="text-sm text-gray-500">Manage your subscription and analysis credits</p>
      </div>

      {/* Trial Status Banner */}
      {isTrial && daysLeft > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Your Pro trial ends in {daysLeft} day{daysLeft === 1 ? "" : "s"}</h3>
            <p className="text-sm text-amber-700 mt-1">
              You currently have full access to all 12 agents. To keep this access and prevent your workspace from downgrading to Starter, choose a plan below.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold text-gray-900">Current Plan: {currentPlan?.name || "Starter"}</h2>
            {isTrial && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">TRIAL</span>}
          </div>
          <p className="text-sm text-gray-500">
            {isTrial ? "You have unlimited access during your trial period." : "Your plan automatically renews."}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{currentPlan?.credits < 0 ? "∞" : currentPlan?.credits}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Credits</div>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{currentPlan?.analyses < 0 ? "∞" : currentPlan?.analyses}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Analyses / mo</div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
          
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                billingPeriod === "monthly" ? "bg-white text-gray-900 shadow" : "text-gray-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                billingPeriod === "annual" ? "bg-[#1B4FFF] text-white shadow" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Annual <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${billingPeriod === 'annual' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>-20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(["pro", "business", "enterprise"] as PlanId[]).map((planId) => {
            const plan = PLANS[planId]
            if (!plan || planId === 'starter') return null // Skip starter here
            const price = billingPeriod === "annual" ? plan.annualPrice : plan.price
            const isCurrent = currentPlanId === planId && !isTrial

            return (
              <div 
                key={planId} 
                className={`bg-white rounded-2xl p-6 flex flex-col h-full ${
                  planId === 'pro' ? 'border-2 border-[#1B4FFF] shadow-md relative' : 'border border-gray-200 shadow-sm'
                }`}
              >
                {planId === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1B4FFF] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black text-gray-900">${price}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                
                {billingPeriod === "annual" && plan.price > 0 && (
                  <p className="text-xs text-green-600 font-semibold mb-6">
                    Billed ${price * 12} annually
                  </p>
                )}
                {billingPeriod === "monthly" && (
                  <p className="text-xs text-gray-500 mb-6 h-4" />
                )}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.slice(0, 5).map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    isCurrent 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : planId === 'pro'
                        ? "bg-[#1B4FFF] hover:bg-[#1240CC] text-white shadow-sm"
                        : "bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                  }`}
                >
                  {isCurrent ? "Current Plan" : isTrial ? `Keep ${plan.name}` : `Upgrade to ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
