// pages/api/beta.js
// Captures beta interest emails — stores in Supabase or logs for now

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { email } = req.body ?? {}
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" })
  }

  console.log(`[VaultIQ Beta] New interest: ${email}`)

  // TODO: Save to Supabase
  // await supabase.from('beta_interest').insert({ email, created_at: new Date() })

  // Send confirmation via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "VaultIQ <hello@vaultiq.ai>",
        to: email,
        subject: "You're in — here's your 50% off code",
        html: `
          <h2>Welcome to VaultIQ 🚀</h2>
          <p>You've secured founding member pricing — 50% off forever.</p>
          <p><strong>Your exclusive code: FOUNDING50</strong></p>
          <p>Use it at checkout: <a href="https://vaultiq.vercel.app/#pricing">vaultiq.vercel.app</a></p>
          <p>— The VaultIQ Team, Dallas TX</p>
        `,
      }),
    }).catch(err => console.error("[VaultIQ Beta] Email error:", err.message))
  }

  return res.status(200).json({ success: true })
}
