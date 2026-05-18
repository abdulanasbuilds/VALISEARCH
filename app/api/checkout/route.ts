import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

interface CheckoutRequest {
  plan: "pro" | "premium"
  gateway: "stripe" | "flutterwave" | "paystack" | "lemonsqueezy"
}

const PLAN_PRICES = {
  pro: {
    stripe: process.env.STRIPE_PRO_PRICE_ID || "price_pro_monthly",
    flutterwave: process.env.FLUTTERWAVE_PRO_PLAN || "pro_monthly",
    paystack: process.env.PAYSTACK_PRO_PLAN || "pro_monthly",
    lemonsqueezy: process.env.LS_PRO_VARIANT_ID || "ls_pro_monthly",
  },
  premium: {
    stripe: process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium_monthly",
    flutterwave: process.env.FLUTTERWAVE_PREMIUM_PLAN || "premium_monthly",
    paystack: process.env.PAYSTACK_PREMIUM_PLAN || "premium_monthly",
    lemonsqueezy: process.env.LS_PREMIUM_VARIANT_ID || "ls_premium_monthly",
  },
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body: CheckoutRequest = await req.json()
  const { plan, gateway } = body

  if (!plan || !gateway) {
    return NextResponse.json(
      { error: "Missing plan or gateway" },
      { status: 400 }
    )
  }

  const planPrices = PLAN_PRICES[plan]

  switch (gateway) {
    case "stripe":
      return await createStripeCheckout(user.id, plan, planPrices.stripe)

    case "flutterwave":
      return await createFlutterwaveCheckout(user.id, plan, planPrices.flutterwave)

    case "paystack":
      return await createPaystackCheckout(user.id, plan, planPrices.paystack)

    case "lemonsqueezy":
      return await createLemonSqueezyCheckout(user.id, plan, planPrices.lemonsqueezy)

    default:
      return NextResponse.json({ error: "Invalid gateway" }, { status: 400 })
  }
}

async function createStripeCheckout(
  userId: string,
  plan: "pro" | "premium",
  priceId: string
) {
  const Stripe = (await import("stripe")).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        plan: plan,
      },
      success_url: `${APP_URL}/settings/billing?success=true`,
      cancel_url: `${APP_URL}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create Stripe checkout" },
      { status: 500 }
    )
  }
}

async function createFlutterwaveCheckout(
  userId: string,
  plan: "pro" | "premium",
  planId: string
) {
  const amount = plan === "pro" ? 2900 : 7900
  const currency = "USD"

  const txRef = `valisearch_${userId}_${Date.now()}`

  const redirectUrl = `${APP_URL}/settings/billing?gateway=flutterwave&status=pending`

  return NextResponse.json({
    url: `https://checkout.flutterwave.com/v3/hosted/pay?tx_ref=${txRef}&amount=${amount}&currency=${currency}&customer_email=user@example.com&meta[user_id]=${userId}&meta[plan]=${plan}&redirect_url=${encodeURIComponent(redirectUrl)}`,
  })
}

async function createPaystackCheckout(
  userId: string,
  plan: "pro" | "premium",
  planId: string
) {
  const amount = plan === "pro" ? 29000 : 79000

  return NextResponse.json({
    url: `https://checkout.paystack.com/charge/pay?amount=${amount}&email=user@example.com&metadata[user_id]=${userId}&metadata[plan]=${plan}`,
  })
}

async function createLemonSqueezyCheckout(
  userId: string,
  plan: "pro" | "premium",
  variantId: string
) {
  return NextResponse.json({
    url: `https://store.lemonsqueezy.com/checkout/buy/${variantId}?checkout[data][custom][user_id]=${userId}&checkout[data][custom][plan]=${plan}`,
  })
}
