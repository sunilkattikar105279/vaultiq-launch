import { useState, useEffect, useRef } from "react"

// ── Pricing tiers ─────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    desc: "Perfect for solo founders validating their first SaaS",
    features: [
      "50 AI strategy sessions / month",
      "7-day launch sprint planner",
      "Niche selection framework",
      "Email support",
      "Cancel anytime",
    ],
    cta: "Start for $29 / mo",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    desc: "For entrepreneurs moving fast and scaling hard",
    features: [
      "Unlimited AI strategy sessions",
      "Revenue optimizer tool",
      "Marketing & sales playbooks",
      "Priority support (4hr SLA)",
      "1 live coaching call / month",
    ],
    cta: "Start for $49 / mo",
    highlight: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 69,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENCY,
    desc: "Built for consultants managing multiple clients",
    features: [
      "Everything in Pro",
      "5 team seats",
      "White-label coach persona",
      "API access",
      "Dedicated success manager",
    ],
    cta: "Start for $69 / mo",
    highlight: false,
  },
]

// ── Demo chat messages ────────────────────────────────────────────────────
const DEMO_MSGS = [
  { role: "user", text: "I want to launch a SaaS tool for HVAC contractors in Dallas. Where do I start?" },
  { role: "ai",  text: "Sharp niche. Here's your Day 1 plan:\n\n1. Build a single-output MVP: proposal writer that turns a job form into a professional PDF in 60 seconds.\n2. Price at $49/mo — contractors bill $150/hr, this saves them 2 hours a week.\n3. DM 10 HVAC owners on LinkedIn today with a free trial.\n\nWhat's your tech skill level — can you ship a React app?" },
  { role: "user", text: "Yes I can code. What's the fastest way to get first revenue?" },
  { role: "ai",  text: "Build in 6 hours, charge in 24:\n\n• Hour 1–3: Claude API + 1 intake form → PDF output on Vercel free\n• Hour 4: Stripe checkout, $49/mo\n• Hour 5: Carrd landing page, demo GIF, live link\n• Hour 6: DM 20 HVAC contacts — offer 50% off for feedback\n\nYou only need 1 paying customer to prove the model. Go." },
]

// ── Social proof ──────────────────────────────────────────────────────────
const PROOF = [
  { name: "Marcus T.", role: "Solo founder, Dallas", quote: "Closed my first $2,400 client on Day 3. VaultIQ told me exactly what to say." },
  { name: "Priya S.", role: "Freelance consultant", quote: "I went from idea to landing page in 48 hours. The strategy sessions are like having a McKinsey advisor." },
  { name: "Jason K.", role: "SaaS entrepreneur", quote: "Hit $5k MRR in 6 weeks. The niche framework alone was worth 10× the price." },
]

export default function LandingPage() {
  const [activeMsg, setActiveMsg] = useState(0)
  const [typed, setTyped] = useState("")
  const [selectedTier, setSelectedTier] = useState("pro")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [betaSubmitted, setBetaSubmitted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const demoRef = useRef(null)
  const pricingRef = useRef(null)

  // Typing animation for demo
  useEffect(() => {
    if (activeMsg >= DEMO_MSGS.length) return
    const msg = DEMO_MSGS[activeMsg]
    if (msg.role !== "ai") {
      const t = setTimeout(() => setActiveMsg(i => i + 1), 900)
      return () => clearTimeout(t)
    }
    let i = 0
    setTyped("")
    const interval = setInterval(() => {
      setTyped(msg.text.slice(0, i + 1))
      i++
      if (i >= msg.text.length) {
        clearInterval(interval)
        if (activeMsg < DEMO_MSGS.length - 1) {
          setTimeout(() => setActiveMsg(a => a + 1), 1200)
        }
      }
    }, 14)
    return () => clearInterval(interval)
  }, [activeMsg])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function handleCheckout(tier) {
    setLoading(true)
    setSelectedTier(tier.id)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId: tier.id }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || "Server error " + res.status)
      if (!data.url) throw new Error("No checkout URL returned")
      window.location.href = data.url
    } catch (err) {
      alert("Checkout error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleBeta(e) {
    e.preventDefault()
    if (!email) return
    // Submit beta interest — store via API or directly
    await fetch("/api/beta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => {})
    setBetaSubmitted(true)
  }

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth" })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy:   #08122A;
          --ink:    #0F1E3C;
          --indigo: #3D52A0;
          --violet: #7091E6;
          --gold:   #F4A61C;
          --goldlt: #FEF3C7;
          --teal:   #0D9488;
          --mint:   #CCFBF1;
          --white:  #FFFFFF;
          --off:    #F7F9FC;
          --slate:  #64748B;
          --muted:  #94A3B8;
          --border: #E2E8F0;
          --dark:   #1E293B;
          --r: 12px;
        }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--off);
          color: var(--dark);
          line-height: 1.65;
          overflow-x: hidden;
        }
        h1,h2,h3,h4 { font-family: 'Syne', sans-serif; line-height: 1.15; }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%;
          height: 62px;
          background: ${scrollY > 20 ? "rgba(8,18,42,0.96)" : "transparent"};
          backdrop-filter: ${scrollY > 20 ? "blur(12px)" : "none"};
          transition: background 0.3s, backdrop-filter 0.3s;
          border-bottom: ${scrollY > 20 ? "0.5px solid rgba(255,255,255,0.08)" : "none"};
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; }
        .nav-vq {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, var(--indigo), var(--violet));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 800;
          color: var(--white);
        }
        .nav-name { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--white); }
        .nav-links { display: flex; gap: 28px; align-items: center; }
        .nav-links a { font-size: 13.5px; color: rgba(255,255,255,0.72); text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .nav-links a:hover { color: var(--white); }
        .nav-cta {
          padding: 7px 18px; border-radius: 20px;
          background: var(--gold); color: var(--navy);
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.2s;
        }
        .nav-cta:hover { opacity: 0.88; }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          background: var(--navy);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 120px 5% 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 55% at 50% 35%, rgba(61,82,160,0.22) 0%, transparent 70%);
        }
        .hero-dots {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.18;
          background-image: radial-gradient(rgba(112,145,230,0.6) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 20px;
          border: 1px solid rgba(112,145,230,0.35);
          background: rgba(61,82,160,0.18);
          font-size: 12px; font-weight: 500; color: var(--violet);
          margin-bottom: 28px;
          animation: fadeUp 0.6s ease both;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        h1.hero-h1 {
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 800;
          color: var(--white);
          text-align: center;
          max-width: 820px;
          margin-bottom: 22px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        h1.hero-h1 em { font-style: normal; color: var(--gold); }

        .hero-sub {
          font-size: clamp(16px, 2vw, 19px);
          color: rgba(255,255,255,0.62);
          text-align: center;
          max-width: 560px;
          margin-bottom: 40px;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
          margin-bottom: 60px;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .btn-primary {
          padding: 14px 32px; border-radius: 10px;
          background: var(--gold); color: var(--navy);
          font-size: 15px; font-weight: 700;
          border: none; cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
          font-family: 'Syne', sans-serif;
        }
        .btn-primary:hover { transform: translateY(-2px); opacity: 0.92; }
        .btn-ghost {
          padding: 14px 32px; border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          color: var(--white); font-size: 15px; font-weight: 500;
          cursor: pointer; transition: background 0.2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.12); }

        /* ── Demo window ── */
        .demo-wrap {
          width: 100%; max-width: 720px;
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .demo-chrome {
          background: #1A2540;
          border-radius: 14px 14px 0 0;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          border-bottom: none;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-r { background: #FF5F57; }
        .dot-y { background: #FEBC2E; }
        .dot-g { background: #28C840; }
        .demo-url { margin-left: 10px; font-size: 11px; color: rgba(255,255,255,0.3); font-family: monospace; }
        .demo-body {
          background: #0F1E3C;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0 0 14px 14px;
          padding: 20px;
          min-height: 320px;
          display: flex; flex-direction: column; gap: 14px;
          overflow: hidden;
        }
        .demo-msg { display: flex; gap: 8px; align-items: flex-start; }
        .demo-msg.user { flex-direction: row-reverse; }
        .demo-av {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; margin-top: 2px;
        }
        .demo-av.ai { background: linear-gradient(135deg,var(--indigo),var(--violet)); color: var(--white); }
        .demo-av.user { background: rgba(244,166,28,0.2); color: var(--gold); }
        .demo-bubble {
          max-width: 82%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px; line-height: 1.65;
          white-space: pre-wrap;
        }
        .demo-bubble.ai { background: rgba(61,82,160,0.28); color: rgba(255,255,255,0.88); border-radius: 12px 12px 12px 3px; }
        .demo-bubble.user { background: rgba(244,166,28,0.15); color: rgba(255,255,255,0.85); border-radius: 12px 12px 3px 12px; }
        .cursor { display: inline-block; width: 2px; height: 13px; background: var(--violet); animation: blink 0.8s infinite; vertical-align: middle; margin-left: 2px; }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }

        /* ── Social proof strip ── */
        .proof-strip {
          background: var(--ink);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 14px 5%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 13px; color: rgba(255,255,255,0.5);
          flex-wrap: wrap;
        }
        .proof-strip strong { color: var(--white); }
        .proof-sep { opacity: 0.3; }

        /* ── Section ── */
        section { padding: 90px 5%; }
        .section-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--indigo); margin-bottom: 12px;
        }
        h2.section-h2 {
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 800; color: var(--dark);
          max-width: 600px; margin-bottom: 16px;
        }
        h2.section-h2 em { font-style: normal; color: var(--indigo); }
        .section-sub {
          font-size: 16px; color: var(--slate);
          max-width: 520px; margin-bottom: 50px;
        }
        .centered { text-align: center; align-items: center; }
        .centered h2, .centered .section-sub { margin-left: auto; margin-right: auto; }

        /* ── How it works ── */
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
        .step-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--r);
          padding: 28px 24px;
          position: relative;
        }
        .step-num {
          font-family: 'Syne', sans-serif;
          font-size: 48px; font-weight: 800;
          color: rgba(61,82,160,0.08);
          position: absolute; top: 16px; right: 18px;
          line-height: 1;
        }
        .step-icon {
          width: 44px; height: 44px; border-radius: 11px;
          background: var(--off); display: flex; align-items: center;
          justify-content: center; font-size: 20px; margin-bottom: 16px;
          border: 1px solid var(--border);
        }
        .step-card h3 { font-size: 16px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
        .step-card p { font-size: 14px; color: var(--slate); line-height: 1.6; }

        /* ── Pricing ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px; max-width: 980px; margin: 0 auto;
        }
        .tier-card {
          background: var(--white);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 32px 28px;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex; flex-direction: column;
        }
        .tier-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.09); }
        .tier-card.featured {
          border-color: var(--indigo);
          border-width: 2px;
          background: linear-gradient(160deg, #EEF2FF 0%, var(--white) 60%);
        }
        .popular-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: var(--indigo); color: var(--white);
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          padding: 4px 14px; border-radius: 20px;
          text-transform: uppercase;
        }
        .beta-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: var(--goldlt); color: #92400E;
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 20px; margin-bottom: 16px;
        }
        .tier-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
        .tier-desc { font-size: 13px; color: var(--slate); margin-bottom: 20px; min-height: 36px; }
        .tier-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
        .price-orig { font-size: 17px; color: var(--muted); text-decoration: line-through; }
        .price-val { font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 800; color: var(--dark); }
        .price-val.featured-price { color: var(--indigo); }
        .price-period { font-size: 14px; color: var(--slate); }
        .beta-note { font-size: 11px; color: var(--teal); font-weight: 600; margin-bottom: 24px; }
        .tier-features { list-style: none; flex: 1; margin-bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
        .tier-features li { display: flex; gap: 8px; font-size: 14px; color: var(--dark); align-items: flex-start; }
        .check { width: 18px; height: 18px; border-radius: 50%; background: var(--mint); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 10px; }
        .check.featured-check { background: #EEF2FF; }
        .tier-btn {
          width: 100%; padding: 13px; border-radius: 10px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          border: none; transition: opacity 0.2s, transform 0.15s;
          font-family: 'Syne', sans-serif;
        }
        .tier-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .tier-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .tier-btn.default-btn { background: var(--off); border: 1.5px solid var(--border); color: var(--dark); }
        .tier-btn.featured-btn { background: var(--indigo); color: var(--white); }
        .guarantee { text-align: center; margin-top: 24px; font-size: 13px; color: var(--slate); }
        .guarantee strong { color: var(--dark); }

        /* ── Testimonials ── */
        .testimonials { background: var(--navy); }
        .testimonials .section-label { color: var(--violet); }
        .testimonials h2.section-h2 { color: var(--white); }
        .testimonials .section-sub { color: rgba(255,255,255,0.5); }
        .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .testi-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--r);
          padding: 26px 22px;
        }
        .testi-stars { color: var(--gold); font-size: 14px; margin-bottom: 12px; letter-spacing: 2px; }
        .testi-quote { font-size: 14.5px; color: rgba(255,255,255,0.8); line-height: 1.65; margin-bottom: 18px; font-style: italic; }
        .testi-author { display: flex; align-items: center; gap: 10px; }
        .testi-av {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg,var(--indigo),var(--violet));
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: var(--white);
        }
        .testi-name { font-size: 13px; font-weight: 600; color: var(--white); }
        .testi-role { font-size: 11px; color: rgba(255,255,255,0.4); }

        /* ── Beta CTA ── */
        .beta-section {
          background: linear-gradient(135deg, var(--indigo) 0%, #5A72D0 100%);
          padding: 80px 5%;
          text-align: center;
        }
        .beta-section h2 { color: var(--white); font-size: clamp(28px,4vw,44px); font-weight: 800; margin-bottom: 12px; }
        .beta-section p { color: rgba(255,255,255,0.72); font-size: 16px; margin-bottom: 32px; }
        .beta-form { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 480px; margin: 0 auto; }
        .beta-input {
          flex: 1; min-width: 220px; padding: 13px 16px;
          border-radius: 10px; border: none; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          background: rgba(255,255,255,0.12);
          color: var(--white); outline: none;
        }
        .beta-input::placeholder { color: rgba(255,255,255,0.5); }
        .beta-input:focus { background: rgba(255,255,255,0.18); }
        .beta-submit {
          padding: 13px 24px; border-radius: 10px;
          background: var(--gold); color: var(--navy);
          font-size: 14px; font-weight: 700;
          border: none; cursor: pointer;
          font-family: 'Syne', sans-serif;
          transition: opacity 0.2s;
        }
        .beta-submit:hover { opacity: 0.9; }
        .beta-success { color: var(--mint); font-size: 15px; font-weight: 600; }
        .beta-terms { margin-top: 12px; font-size: 11px; color: rgba(255,255,255,0.45); }

        /* ── Footer ── */
        footer {
          background: var(--navy);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 32px 5%;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-logo { display: flex; align-items: center; gap: 8px; }
        .footer-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--white); }
        .footer-links { display: flex; gap: 20px; }
        .footer-links a { font-size: 12px; color: rgba(255,255,255,0.4); text-decoration: none; }
        .footer-links a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero { padding: 100px 5% 60px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <div className="nav-vq">VQ</div>
          <span className="nav-name">VaultIQ</span>
        </div>
        <div className="nav-links">
          <a onClick={() => scrollTo(demoRef)}>Demo</a>
          <a onClick={() => scrollTo(pricingRef)}>Pricing</a>
          <a href="/coach">Launch coach</a>
          <button className="nav-cta" onClick={() => scrollTo(pricingRef)}>Get 50% off →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-dots" />

        <div className="hero-badge">
          <span className="badge-dot" />
          Beta launch — 50% off founding members
        </div>

        <h1 className="hero-h1">
          Your AI Executive Advisor.<br />
          <em>Launch anything in 48 hours.</em>
        </h1>
        <p className="hero-sub">
          VaultIQ gives every entrepreneur a world-class strategic advisor in their pocket — for less than your Spotify subscription.
        </p>

        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => scrollTo(pricingRef)}>
            Start for $14.50 / mo →
          </button>
          <button className="btn-ghost" onClick={() => scrollTo(demoRef)}>
            See it in action
          </button>
        </div>

        {/* DEMO WINDOW */}
        <div className="demo-wrap" ref={demoRef}>
          <div className="demo-chrome">
            <div className="dot dot-r" />
            <div className="dot dot-y" />
            <div className="dot dot-g" />
            <span className="demo-url">vaultiq.ai/coach</span>
          </div>
          <div className="demo-body">
            {DEMO_MSGS.slice(0, activeMsg + 1).map((msg, i) => (
              <div key={i} className={`demo-msg ${msg.role}`}>
                <div className={`demo-av ${msg.role}`}>{msg.role === "ai" ? "VQ" : "You"}</div>
                <div className={`demo-bubble ${msg.role}`}>
                  {i === activeMsg && msg.role === "ai"
                    ? typed
                    : msg.text}
                  {i === activeMsg && msg.role === "ai" && typed.length < msg.text.length
                    ? <span className="cursor" />
                    : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="proof-strip">
        <strong>🎯 Dallas-born</strong><span className="proof-sep">·</span>
        <span>Trusted by <strong>247+ entrepreneurs</strong></span><span className="proof-sep">·</span>
        <span>Avg first revenue in <strong>2.3 days</strong></span><span className="proof-sep">·</span>
        <span>Net Promoter Score <strong>72</strong></span>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ background: "var(--white)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">How it works</div>
          <h2 className="section-h2 centered">From idea to revenue<br /><em>in 48 hours</em></h2>
          <p className="section-sub" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            No fluff, no vague strategy. VaultIQ gives you numbered actions you can execute today.
          </p>
        </div>
        <div className="steps" style={{ maxWidth: 960, margin: "0 auto" }}>
          {[
            { icon: "🎯", n: "01", title: "Pick your niche", body: "Use our 3-Filter Formula to find a painful, specific, reachable market in under 60 minutes." },
            { icon: "⚡", n: "02", title: "Build your MVP", body: "VaultIQ guides you through a 6-hour sprint: intake form + AI output + Stripe checkout. Ship it." },
            { icon: "📣", n: "03", title: "Land first customers", body: "Get a personalised outreach script. DM 20 warm contacts. Convert the first 3 to paying users." },
            { icon: "📈", n: "04", title: "Scale to $10k MRR", body: "Weekly strategy sessions adapt to your real numbers. VaultIQ tells you what to do next, always." },
          ].map((s) => (
            <div key={s.n} className="step-card">
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} style={{ background: "var(--off)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">Pricing</div>
          <h2 className="section-h2 centered">Start free, grow fast</h2>
          <p className="section-sub" style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            Beta launch pricing — <strong>50% off</strong> for founding members. Lock in your rate forever.
          </p>
        </div>
        <div className="pricing-grid">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`tier-card ${tier.highlight ? "featured" : ""}`}>
              {tier.highlight && <div className="popular-badge">Most popular</div>}
              <div className="beta-badge">🔥 Beta — 50% off</div>
              <div className="tier-name">{tier.name}</div>
              <div className="tier-desc">{tier.desc}</div>
              <div className="tier-price">
                <span className="price-orig">${tier.price}</span>
                <span className={`price-val ${tier.highlight ? "featured-price" : ""}`}>
                  ${Math.round(tier.price * 0.5)}
                </span>
                <span className="price-period">/ mo</span>
              </div>
              <div className="beta-note">↑ Founding member rate — locked forever</div>
              <ul className="tier-features">
                {tier.features.map((f) => (
                  <li key={f}>
                    <span className={`check ${tier.highlight ? "featured-check" : ""}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`tier-btn ${tier.highlight ? "featured-btn" : "default-btn"}`}
                onClick={() => handleCheckout(tier)}
                disabled={loading && selectedTier === tier.id}
              >
                {loading && selectedTier === tier.id ? "Opening checkout…" : tier.cta}
              </button>
            </div>
          ))}
        </div>
        <div className="guarantee">
          <strong>🛡️ 14-day money-back guarantee</strong> — if VaultIQ doesn't help you make progress in 2 weeks, we'll refund you. No questions.
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-label">Results</div>
          <h2 className="section-h2 centered" style={{ color: "var(--white)" }}>
            What founders are saying
          </h2>
        </div>
        <div className="testi-grid" style={{ maxWidth: 960, margin: "0 auto" }}>
          {PROOF.map((p) => (
            <div key={p.name} className="testi-card">
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">"{p.quote}"</p>
              <div className="testi-author">
                <div className="testi-av">{p.name[0]}</div>
                <div>
                  <div className="testi-name">{p.name}</div>
                  <div className="testi-role">{p.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BETA CTA */}
      <div className="beta-section">
        <h2>Join 247 founders already inside</h2>
        <p>Get 50% off forever as a founding member. Your rate locks in on signup.</p>
        {betaSubmitted ? (
          <p className="beta-success">✓ You're on the list! Check your inbox for early access.</p>
        ) : (
          <form className="beta-form" onSubmit={handleBeta}>
            <input
              className="beta-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="beta-submit">Get 50% off →</button>
          </form>
        )}
        <p className="beta-terms">No credit card required for early access. Cancel anytime.</p>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <div className="nav-vq" style={{ width: 28, height: 28, fontSize: 11 }}>VQ</div>
          <span className="footer-name">VaultIQ</span>
        </div>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/coach">AI Coach</a>
          <a href="mailto:hello@vaultiq.ai">Contact</a>
        </div>
        <span className="footer-copy">© 2025 VaultIQ. Built in Dallas, TX.</span>
      </footer>
    </>
  )
}
