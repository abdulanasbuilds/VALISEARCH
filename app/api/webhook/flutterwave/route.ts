import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

const fwSecret = process.env.FLUTTERWAVE_SECRET_KEY || ""

interface FlutterwaveEvent {
  event: string
  "event.type"?: string
  data: {
    id: string
    tx_ref: string
    flw_ref?: string
    amount: number
    currency?: string
    status: string
    customer?: {
      email?: string
      user_id?: string
    }
    meta?: {
      user_id?: string
    }
    subscription?: {
      id?: string
      status?: string
    }
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  if (!fwSecret) {
    console.error("FLUTTERWAVE_SECRET_KEY not configured")
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const signature = req.headers.get("verif-hash")
  const hash = crypto.createHash("sha256").update(fwSecret).digest("hex")

  if (signature !== hash) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const payload: FlutterwaveEvent = JSON.parse(rawBody)
  const { event, data } = payload

  const userId = data.customer?.user_id || data.meta?.user_id

  if (!userId) {
    return NextResponse.json({ error: "No user_id in payload" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event) {
    case "charge.completed": {
      if (data.status === "successful") {
        const amount = data.amount
        let creditsToAdd = 0

        if (amount >= 7900) {
          creditsToAdd = -1
        } else if (amount >= 2900) {
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
            reason: `Flutterwave payment - ${data.tx_ref}`,
          })

          await supabase.from("subscriptions").upsert(
            {
              user_id: userId,
              ls_subscription_id: `fw_${data.id}`,
              ls_customer_id: data.customer?.email || "",
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

      if (subscription?.id) {
        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            ls_subscription_id: subscription.id,
            ls_customer_id: data.customer?.email || "",
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
        reason: "Flutterwave subscription cancelled",
      })
      break
    }

    case "card.payment.failed": {
      await supabase
        .from("subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("user_id", userId)
      break
    }

    default:
      console.log("Unhandled Flutterwave event:", event)
  }

  return NextResponse.json({ received: true })
}
