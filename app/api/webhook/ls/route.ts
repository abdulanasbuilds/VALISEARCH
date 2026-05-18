export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-signature")
    const secret = process.env.LS_WEBHOOK_SECRET

    if (!signature || !secret) {
      return new Response("Unauthorized", { status: 401 })
    }

    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(rawBody)

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const sigBytes = hexToBytes(signature)
    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      sigBytes.slice().buffer,
      messageData
    )

    if (!isValid) {
      return new Response("Invalid signature", { status: 401 })
    }

    const payload = JSON.parse(rawBody) as {
      meta: { event_name: string }
      data: {
        attributes: {
          user_email: string
          first_order_item?: {
            variant_id: number
          }
        }
        meta?: { custom?: { user_id?: string } }
      }
    }

    const { createClient } = await import(
      "@supabase/supabase-js"
    )
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (payload.meta.event_name === "order_created") {
      const userId =
        payload.data.meta?.custom?.user_id
      if (!userId) {
        return new Response("Missing user_id", { status: 400 })
      }

      const variantId =
        payload.data.attributes.first_order_item?.variant_id
      const plan = variantId?.toString() ===
        process.env.NEXT_PUBLIC_LS_PREMIUM_VARIANT_ID
        ? "premium"
        : "pro"

      const credits = plan === "premium" ? 9999 : 100

      await supabase
        .from("credits")
        .update({ balance: credits })
        .eq("user_id", userId)

      await supabase.from("profiles")
        .update({ plan })
        .eq("id", userId)

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        plan,
        status: "active",
      })
    }

    return new Response("OK", { status: 200 })

  } catch (error) {
    console.error("[ls-webhook] error:", error)
    return new Response("Error", { status: 500 })
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}
