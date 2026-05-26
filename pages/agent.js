import { useState } from "react"

const DEFAULT_CONTACTS = [
  { name: "Sarah Chen", role: "Freelance designer", platform: "LinkedIn", context: "We met at Dallas Design Week 2024. She mentioned wanting passive income." },
  { name: "Mike Rodriguez", role: "HVAC contractor owner", platform: "LinkedIn", context: "Referred a client to me. Always complaining about paperwork and proposals." },
  { name: "Priya Nair", role: "Business consultant", platform: "Email", context: "Former colleague. Recently posted about wanting to launch a SaaS product." },
  { name: "Tom Walsh", role: "Real estate agent", platform: "Instagram DM", context: "DFW market, active poster. Mentioned being overwhelmed with listings content." },
  { name: "Angela Brooks", role: "Marketing freelancer", platform: "LinkedIn", context: "We connected at Capital Factory event. Looking to build recurring revenue." },
]

export default function MarketingAgent() {
  const [contacts, setContacts] = useState(DEFAULT_CONTACTS)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)
  const [activeTab, setActiveTab] = useState("contacts") // contacts | results

  function updateContact(i, field, val) {
    setContacts(cs => cs.map((c, ci) => ci === i ? { ...c, [field]: val } : c))
  }

  function addContact() {
    setContacts(cs => [...cs, { name: "", role: "", platform: "LinkedIn", context: "" }])
  }

  function removeContact(i) {
    setContacts(cs => cs.filter((_, ci) => ci !== i))
  }

  async function generate() {
    const valid = contacts.filter(c => c.name && c.role && c.context)
    if (valid.length === 0) { setError("Add at least 1 contact with name, role and context."); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/marketing-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: valid.slice(0, 20) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages(data.messages)
      setActiveTab("results")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function copyMsg(i, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(i)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function copyAll() {
    const all = messages.map((m, i) =>
      `── ${i+1}. ${m.name} (${m.platform}) ──\n${m.message}\n\nFollow-up: ${m.followUp}\nBest time: ${m.bestTime}`
    ).join("\n\n")
    navigator.clipboard.writeText(all).then(() => {
      setCopied("all")
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const platforms = ["LinkedIn", "Email", "Instagram DM", "Twitter/X DM", "WhatsApp", "Text"]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;background:#F7F9FC;color:#1E293B;min-height:100vh}
        .page{max-width:900px;margin:0 auto;padding:40px 20px}
        .header{margin-bottom:32px}
        .logo-row{display:flex;align-items:center;gap:10px;margin-bottom:16px}
        .vq{width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#3D52A0,#7091E6);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:13px;font-weight:800;color:#fff}
        h1{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#08122A}
        .subtitle{font-size:15px;color:#64748B;margin-top:6px;max-width:600px;line-height:1.6}
        .offer-banner{background:#EEF2FF;border:1.5px solid #7091E6;border-radius:10px;padding:12px 16px;font-size:13px;color:#3D52A0;font-weight:500;margin-bottom:24px;display:flex;align-items:center;gap:8px}
        .tabs{display:flex;gap:4px;margin-bottom:24px;background:#E2E8F0;border-radius:10px;padding:4px;width:fit-content}
        .tab{padding:7px 20px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;color:#64748B;transition:all .15s;font-family:'DM Sans',sans-serif}
        .tab.active{background:#fff;color:#08122A;box-shadow:0 1px 4px rgba(0,0,0,.08)}
        .contacts-grid{display:flex;flex-direction:column;gap:12px;margin-bottom:24px}
        .contact-card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:16px;position:relative}
        .contact-num{position:absolute;top:14px;right:14px;width:22px;height:22px;border-radius:50%;background:#EEF2FF;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#3D52A0}
        .field-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px}
        .field-row-full{margin-bottom:0}
        label{display:block;font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
        input,select,textarea{width:100%;padding:8px 11px;border:1px solid #E2E8F0;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1E293B;background:#FAFBFC;outline:none;transition:border .15s}
        input:focus,select:focus,textarea:focus{border-color:#7091E6;background:#fff}
        textarea{resize:vertical;min-height:58px;line-height:1.5}
        .rm-btn{position:absolute;top:12px;right:44px;width:22px;height:22px;border-radius:50%;background:#FEE2E2;color:#DC2626;border:none;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;line-height:1}
        .action-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
        .btn-add{padding:9px 18px;border-radius:9px;border:1.5px dashed #CBD5E1;background:transparent;color:#64748B;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .15s}
        .btn-add:hover{border-color:#7091E6;color:#3D52A0}
        .btn-gen{padding:11px 28px;border-radius:9px;background:#3D52A0;color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:'Syne',sans-serif;transition:opacity .15s;display:flex;align-items:center;gap:6px}
        .btn-gen:hover:not(:disabled){opacity:.88}
        .btn-gen:disabled{opacity:.55;cursor:not-allowed}
        .count-note{font-size:12px;color:#94A3B8;margin-left:auto}
        .error-box{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px 14px;font-size:13px;color:#991B1B;margin-top:12px}
        .results-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .results-h{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#08122A}
        .btn-copy-all{padding:8px 16px;border-radius:8px;background:#EEF2FF;color:#3D52A0;border:none;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
        .btn-copy-all:hover{background:#E0E7FF}
        .msg-card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;margin-bottom:14px;overflow:hidden}
        .msg-head{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #F1F5F9;background:#FAFBFC}
        .msg-name{font-weight:700;font-size:14px;color:#08122A}
        .msg-platform{font-size:11px;font-weight:600;padding:3px 8px;border-radius:6px;background:#EEF2FF;color:#3D52A0}
        .msg-body{padding:16px}
        .msg-section{margin-bottom:14px}
        .msg-label{font-size:10px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
        .msg-text{font-size:13.5px;color:#1E293B;line-height:1.65;background:#F7F9FC;border-radius:8px;padding:12px 14px;border:1px solid #E2E8F0;white-space:pre-wrap}
        .msg-meta{display:flex;align-items:center;gap:8px}
        .meta-pill{font-size:11px;padding:3px 9px;border-radius:6px;background:#F0FDF4;color:#059669;font-weight:500}
        .copy-btn{padding:7px 14px;border-radius:8px;background:#EEF2FF;color:#3D52A0;border:none;font-size:12px;font-weight:600;cursor:pointer;margin-left:auto;transition:all .15s;font-family:'DM Sans',sans-serif}
        .copy-btn:hover{background:#E0E7FF}
        .copy-btn.copied-state{background:#ECFDF5;color:#059669}
        .loading-wrap{text-align:center;padding:60px 20px}
        .spinner{width:36px;height:36px;border:3px solid #E2E8F0;border-top-color:#3D52A0;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .loading-wrap p{font-size:14px;color:#64748B}
      `}</style>

      <div className="page">
        <div className="header">
          <div className="logo-row">
            <div className="vq">VQ</div>
            <h1>Marketing Agent</h1>
          </div>
          <p className="subtitle">
            Enter your warm contacts and VaultIQ generates personalised DM scripts — with 50% off founding member offer built in.
          </p>
        </div>

        <div className="offer-banner">
          🎯 Offer: 50% off founding membership — Starter $14.50/mo · Pro $24.50/mo · Agency $34.50/mo · Expires at public launch
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
            Contacts ({contacts.length})
          </button>
          <button className={`tab ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            DM Scripts {messages.length > 0 ? `(${messages.length})` : ""}
          </button>
        </div>

        {activeTab === "contacts" && (
          <>
            <div className="contacts-grid">
              {contacts.map((c, i) => (
                <div key={i} className="contact-card">
                  <div className="contact-num">{i + 1}</div>
                  <button className="rm-btn" onClick={() => removeContact(i)} title="Remove">×</button>
                  <div className="field-row">
                    <div>
                      <label>Full name</label>
                      <input value={c.name} onChange={e => updateContact(i, "name", e.target.value)} placeholder="Sarah Chen" />
                    </div>
                    <div>
                      <label>Role / industry</label>
                      <input value={c.role} onChange={e => updateContact(i, "role", e.target.value)} placeholder="Freelance designer" />
                    </div>
                    <div>
                      <label>Platform</label>
                      <select value={c.platform} onChange={e => updateContact(i, "platform", e.target.value)}>
                        {platforms.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field-row-full">
                    <label>Context (how you know them, what they care about)</label>
                    <textarea
                      value={c.context}
                      onChange={e => updateContact(i, "context", e.target.value)}
                      placeholder="Met at Dallas Startup Week. Mentioned wanting to launch a SaaS but doesn't know where to start."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="action-row">
              <button className="btn-add" onClick={addContact}>+ Add contact</button>
              <button className="btn-gen" onClick={generate} disabled={loading}>
                {loading ? <><span style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .7s linear infinite"}}></span> Generating…</> : "✨ Generate DM scripts →"}
              </button>
              <span className="count-note">{Math.min(contacts.filter(c => c.name && c.role && c.context).length, 20)} ready to generate</span>
            </div>
            {error && <div className="error-box">⚠ {error}</div>}
          </>
        )}

        {activeTab === "results" && (
          <>
            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <p>VaultIQ agent is personalising {contacts.filter(c=>c.name&&c.role&&c.context).length} scripts…</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#94A3B8" }}>
                <p style={{fontSize:15}}>No scripts yet — go to Contacts tab and click Generate.</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <span className="results-h">{messages.length} personalised DM scripts ready</span>
                  <button className="btn-copy-all" onClick={copyAll}>
                    {copied === "all" ? "✓ Copied all!" : "Copy all scripts"}
                  </button>
                </div>
                {messages.map((m, i) => (
                  <div key={i} className="msg-card">
                    <div className="msg-head">
                      <span className="msg-name">{m.name}</span>
                      <span className="msg-platform">{m.platform}</span>
                    </div>
                    <div className="msg-body">
                      <div className="msg-section">
                        <div className="msg-label">DM message</div>
                        <div className="msg-text">{m.message}</div>
                      </div>
                      <div className="msg-section">
                        <div className="msg-label">Follow-up (if no reply in 3 days)</div>
                        <div className="msg-text" style={{fontSize:13,background:"#FFFBEB",borderColor:"#FDE68A"}}>{m.followUp}</div>
                      </div>
                      <div className="msg-meta">
                        <div className="meta-pill">⏰ Best time: {m.bestTime}</div>
                        <button
                          className={`copy-btn ${copied === i ? "copied-state" : ""}`}
                          onClick={() => copyMsg(i, m.message)}
                        >
                          {copied === i ? "✓ Copied!" : "Copy DM"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
