import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

const LS_SECRET = process.env.LEMON_SQUEEZY_SECRET

interface LemonSqueezyPayload {
  meta: {
    event_name: string
    custom_data: {
      user_id: string
    }
  }
  data: {
    id: string
    attributes: {
      customer_id: string
      status: string
      renews_at: string | null
      ends_at: string | null
      plan_id: number
      variant_id: number
    }
  }
}

export async function POST(req: NextRequest) {
  if (!LS_SECRET) {
    console.error("LEMON_SQUEEZY_SECRET not configured")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get("x-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const hmac = crypto.createHmac("sha256", LS_SECRET)
  const digest = hmac.update(rawBody).digest("hex")

  if (digest !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload: LemonSqueezyPayload = JSON.parse(rawBody)
  const { meta, data } = payload
  const eventName = meta.event_name
  const userId = meta.custom_data?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in custom_data" }, { status: 400 })
  }

  const supabase = await createClient()

  const subscriptionData = {
    user_id: userId,
    ls_subscription_id: data.id,
    ls_customer_id: data.attributes.customer_id,
    status: data.attributes.status,
    plan_id: data.attributes.variant_id,
    current_period_end: data.attributes.renews_at || data.attributes.ends_at,
    updated_at: new Date().toISOString(),
  }

  switch (eventName) {
    case "subscription_created":
    case "subscription_updated": {
      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: "user_id" })

      if (subError) {
        console.error("Subscription upsert error:", subError)
        return NextResponse.json({ error: "DB error" }, { status: 500 })
      }

      const creditsToAdd = data.attributes.variant_id === 1 ? 6 : data.attributes.variant_id === 2 ? 100 : -1

      if (creditsToAdd > 0) {
        const { data: creditRow } = await supabase
          .from("credits")
          .select("balance")
          .eq("user_id", userId)
          .single()

        const newBalance = creditRow?.balance ? creditRow.balance + creditsToAdd : creditsToAdd

        await supabase
          .from("credits")
          .update({ balance: newBalance })
          .eq("user_id", userId)

        await supabase.from("credit_transactions").insert({
          user_id: userId,
          type: "purchase",
          amount: creditsToAdd,
          description: `Lemon Squeezy subscription activated`,
        })
      }

      break
    }

    case "subscription_cancelled":
    case "subscription_expired": {
      await supabase
        .from("subscriptions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("user_id", userId)

      break
    }

    case "subscription_payment_failed": {
      await supabase
        .from("subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("user_id", userId)

      break
    }

    default:
      console.log("Unhandled event:", eventName)
  }

  return NextResponse.json({ received: true })
}