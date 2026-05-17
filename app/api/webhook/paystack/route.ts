import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const paystackSecret = process.env.PAYSTACK_SECRET_KEY || ""

interface PaystackEvent {
  event: string
  data: {
    id: number
    reference: string
    amount: number
    currency?: string
    status: string
    customer?: {
      email?: string
      customer_code?: string
    }
    metadata?: {
      user_id?: string
    }
    subscription?: {
      id?: string
      code?: string
      status?: string
    }
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!paystackSecret) {
    console.error("PAYSTACK_SECRET_KEY not configured")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const signature = req.headers.get("x-paystack-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const crypto = await import("crypto")
  const hash = crypto
    .createHmac("sha512", paystackSecret)
    .update(rawBody)
    .digest("hex")

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload: PaystackEvent = JSON.parse(rawBody)
  const { event, data } = payload

  const userId = data.metadata?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in metadata" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event) {
    case "charge.success": {
      if (data.status === "success") {
        const amountKobo = data.amount
        const amountNaira = amountKobo / 100
        let creditsToAdd = 0

        if (amountNaira >= 79000) {
          creditsToAdd = -1
        } else if (amountNaira >= 29000) {
          creditsToAdd = 100
        }

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
            reason: `Paystack payment - ${data.reference}`,
          })

          await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              ls_subscription_id: `ps_${data.id}`,
              ls_customer_id: data.customer?.customer_code || data.customer?.email || "",
              status: "active",
              plan_id: creditsToAdd === 100 ? 1 : creditsToAdd === -1 ? 2 : 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          )
        }
      }
      break
    }

    case "subscription.created": {
      const subscription = data.subscription

      if (subscription?.code) {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            ls_subscription_id: subscription.code,
            ls_customer_id: data.customer?.customer_code || "",
            status: subscription.status === "active" ? "active" : "pending",
            plan_id: 1,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
      }
      break
    }

    case "subscription.disabled": {
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
        reason: "Paystack subscription cancelled",
      })
      break
    }

    case "invoice.payment_failed": {
      await supabase
        .from("subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("user_id", userId)
      break
    }

    default:
      console.log("Unhandled Paystack event:", event)
  }

  return NextResponse.json({ received: true })
}