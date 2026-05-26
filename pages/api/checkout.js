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

  const { priceId, tierId } = req.body ?? {}

  if (!priceId) {
    return res.status(400).json({ error: "priceId is required" })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vaultiq.vercel.app"

  try {
    // Call Stripe API directly — no SDK needed
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "subscription",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "success_url": `${appUrl}/success?tier=${tierId}&session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${appUrl}/?checkout=cancelled`,
        "allow_promotion_codes": "true",
        "billing_address_collection": "auto",
        "customer_email": req.body.email || "",
        // Collect trial period — 14-day money-back equivalent
        "subscription_data[trial_period_days]": "0",
        // Beta coupon applied automatically if STRIPE_BETA_COUPON set
        ...(process.env.STRIPE_BETA_COUPON
          ? { "discounts[0][coupon]": process.env.STRIPE_BETA_COUPON }
          : {}),
      }).toString(),
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
