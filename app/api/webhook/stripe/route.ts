import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

interface StripeEvent {
  id: string
  type: string
  data: {
    object: {
      metadata?: {
        user_id?: string
      }
      customer?: string
      subscription?: string
      status?: string
      items?: {
        data: Array<{
          price?: {
            id?: string
          }
        }>
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 400 }
    )
  }

  const Stripe = (await import("stripe")).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

  let event: ReturnType<typeof stripe.webhooks.constructEvent>

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error("Stripe webhook error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const supabase = await createClient()
  const data = event.data.object as {
    metadata?: { user_id?: string }
    customer?: string
    subscription?: string
    status?: string
    mode?: string
  }
  const userId = data?.metadata?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = data as {
        customer?: string
        subscription?: string
        mode?: string
      }

      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        )
        const priceId = subscription.items.data[0]?.price?.id

        await handleSubscription(supabase, userId, {
          subscriptionId: session.subscription,
          customerId: session.customer || "",
          status: "active",
          planId: getPlanFromPriceId(priceId || ""),
        })
      }
      break
    }

    case "customer.subscription.updated": {
      const subscription = data as {
        id: string
        status: string
        customer?: string
        items?: {
          data: Array<{
            price?: { id?: string }
          }>
        }
      }

      await handleSubscription(supabase, userId, {
        subscriptionId: subscription.id,
        customerId: subscription.customer || "",
        status: subscription.status,
        planId: getPlanFromPriceId(
          subscription.items?.data[0]?.price?.id || ""
        ),
      })
      break
    }

    case "customer.subscription.deleted": {
      await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: 0,
        reason: "Stripe subscription cancelled",
      })
      break
    }

    case "invoice.payment_failed": {
      const invoice = data as { customer?: string }

      await supabase
        .from("subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("ls_customer_id", invoice.customer)
      break
    }

    default:
      console.log("Unhandled Stripe event:", event.type)
  }

  return NextResponse.json({ received: true })
}

function getPlanFromPriceId(priceId: string): number {
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID || "price_pro"
  const premiumPriceId = process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium"

  if (priceId === proPriceId) return 1
  if (priceId === premiumPriceId) return 2
  return 0
}

async function handleSubscription(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  sub: {
    subscriptionId: string
    customerId: string
    status: string
    planId: number
  }
) {
  await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        ls_subscription_id: sub.subscriptionId,
        ls_customer_id: sub.customerId,
        status: sub.status === "active" ? "active" : sub.status,
        plan_id: sub.planId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

  const creditsToAdd = sub.planId === 1 ? 100 : sub.planId === 2 ? -1 : 0

  if (creditsToAdd !== 0) {
    const { data: creditRow } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single()

    const newBalance =
      creditRow?.balance !== undefined
        ? creditRow.balance + creditsToAdd
        : creditsToAdd

    await supabase
      .from("credits")
      .update({ balance: newBalance })
      .eq("user_id", userId)

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: creditsToAdd,
      reason: `Stripe subscription activated (plan ${sub.planId})`,
    })
  }
}