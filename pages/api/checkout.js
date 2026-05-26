// pages/api/checkout.js
// Stripe Checkout session creator
// Requires: STRIPE_SECRET_KEY, NEXT_PUBLIC_APP_URL in environment

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return res.status(500).json({
      error: "Stripe not configured — add STRIPE_SECRET_KEY in Vercel Settings → Environment Variables"
    })
  }

  const { priceId, tierId, email } = req.body ?? {}

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vaultiq.vercel.app"

  // Only include customer_email if it looks like a real email — empty string causes Stripe 400
  const validEmail = typeof email === "string" && email.includes("@") && email.includes(".") ? email : null

  // Build params object — conditionally add optional fields
  const params = {
    "mode": "subscription",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "success_url": `${appUrl}/success?tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
    "cancel_url": `${appUrl}/?checkout=cancelled`,
    "allow_promotion_codes": "true",
    "billing_address_collection": "auto",
  }

  // Only add customer_email when valid — Stripe rejects empty strings and malformed emails
  if (validEmail) params["customer_email"] = validEmail

  // Only add coupon when env var is set
  if (process.env.STRIPE_BETA_COUPON) {
    params["discounts[0][coupon]"] = process.env.STRIPE_BETA_COUPON
  }

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params).toString(),
    })

    const session = await response.json()

    if (!response.ok) {
      console.error("[VaultIQ Stripe] Error:", session.error)
      return res.status(500).json({
        error: session.error?.message || `Stripe error ${response.status}`
      })
    }

    return res.status(200).json({ url: session.url, sessionId: session.id })

  } catch (err) {
    console.error("[VaultIQ Stripe] Network error:", err.message)
    return res.status(502).json({ error: "Could not reach Stripe — retry in a moment." })
  }
}
