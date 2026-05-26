import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function Success() {
  const router = useRouter()
  const { tier } = router.query
  const [count, setCount] = useState(5)

  useEffect(() => {
    if (count <= 0) { router.push("/coach"); return }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, router])

  const tierNames = { starter: "Starter", pro: "Pro", agency: "Agency" }
  const tierName = tierNames[tier] || "VaultIQ"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#08122A;min-height:100vh;display:flex;align-items:center;justify-content:center;color:#fff}
        .card{text-align:center;max-width:480px;padding:48px 40px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:20px}
        .emoji{font-size:56px;margin-bottom:24px}
        h1{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;margin-bottom:12px}
        p{color:rgba(255,255,255,0.6);font-size:16px;line-height:1.6;margin-bottom:8px}
        .plan{color:#F4A61C;font-weight:600}
        .redirect{margin-top:28px;font-size:13px;color:rgba(255,255,255,0.4)}
        .btn{margin-top:20px;padding:13px 28px;border-radius:10px;background:#3D52A0;color:#fff;font-size:15px;font-weight:600;border:none;cursor:pointer;font-family:'Syne',sans-serif}
      `}</style>
      <div className="card">
        <div className="emoji">🎉</div>
        <h1>You're in!</h1>
        <p>Welcome to VaultIQ <span className="plan">{tierName}</span>.</p>
        <p>Your 50% founding member rate is locked in forever.</p>
        <p>Redirecting to your AI coach in {count}s…</p>
        <button className="btn" onClick={() => router.push("/coach")}>
          Open VaultIQ now →
        </button>
        <p className="redirect">
          Check your email for your welcome message and onboarding guide.
        </p>
      </div>
    </>
  )
}
