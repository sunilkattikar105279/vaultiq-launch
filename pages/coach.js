import { useState, useRef, useEffect } from "react"

const QUICK_PROMPTS = [
  "Which business should I launch first as a Dallas entrepreneur?",
  "Give me my exact next 3 moves to make money this week.",
  "Write my LinkedIn launch post for VaultIQ.",
  "How do I land my first AI Content Studio client today?",
  "What is the best niche for my AI Micro-SaaS?",
  "Build me a 7-day revenue sprint plan.",
]

const INITIAL = {
  role: "assistant",
  content:
    "Hey — I'm VaultIQ, your AI business strategist.\n\nI'm built for entrepreneurs who move fast. You've got three businesses in motion — an Executive Coach platform, an AI Micro-SaaS, and an AI Content Studio — and a 7-day window to first revenue.\n\nLet's not waste time. What's the first thing you want to crack?",
}

export default function CoachPage() {
  const [messages, setMessages] = useState([INITIAL])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim()
    if (!text || loading) return
    setInput("")
    setError(null)
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    const next = [...messages, { role: "user", content: text }]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`)
      setMessages([...next, { role: "assistant", content: data.reply }])
    } catch (err) {
      setError(err.message)
      setMessages(messages)
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function autoResize(e) {
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const canSend = input.trim().length > 0 && !loading

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%}
        body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#F9F8FF;color:#111827}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#D1D5DB;border-radius:2px}
        @keyframes blink{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
        .vd{display:inline-block;width:5px;height:5px;border-radius:50%;background:#9CA3AF;animation:blink 1.3s infinite}
        .vd:nth-child(2){animation-delay:.2s}.vd:nth-child(3){animation-delay:.4s}
        .vc{font-size:11px;padding:4px 12px;border-radius:20px;border:1px solid #E5E7EB;background:#FFFFFF;cursor:pointer;color:#6B7280;white-space:nowrap;font-weight:500;transition:all .15s}
        .vc:hover:not(:disabled){background:#EEF2FF;border-color:#C7D2FE;color:#4F46E5}
        .vc:disabled{opacity:.45;cursor:not-allowed}
        textarea{font-family:inherit}
        textarea:focus{outline:none;border-color:#4F46E5!important;box-shadow:0 0 0 2px #C7D2FE}
        .vs{width:38px;height:38px;border-radius:10px;border:none;background:#4F46E5;color:#fff;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:background .15s}
        .vs:disabled{background:#C7D2FE;cursor:not-allowed}
        .vs:not(:disabled):hover{background:#4338CA}
        .vm{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;flex-shrink:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .vl{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s infinite}
        .back-link{font-size:12px;color:#6B7280;text-decoration:none;display:flex;align-items:center;gap:4px;transition:color .15s}
        .back-link:hover{color:#4F46E5}
      `}</style>

      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16,background:"#F9F8FF"}}>

        {/* Back to home */}
        <div style={{width:"100%",maxWidth:720,marginBottom:10}}>
          <a href="/" className="back-link">← Back to home</a>
        </div>

        <div style={{width:"100%",maxWidth:720,height:"88vh",display:"flex",flexDirection:"column",background:"#FFFFFF",borderRadius:20,border:"1px solid #E5E7EB",overflow:"hidden",boxShadow:"0 8px 40px rgba(79,70,229,.10)"}}>

          {/* Header */}
          <header style={{padding:"14px 20px",borderBottom:"1px solid #F3F4F6",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className="vm">VQ</div>
              <div>
                <div style={{fontSize:16,fontWeight:700,letterSpacing:"-.3px",color:"#111827"}}>VaultIQ Coach</div>
                <div style={{fontSize:11,color:"#6B7280",marginTop:1,fontWeight:500}}>AI business strategist · Launch fast · Scale smart</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6B7280",padding:"5px 12px",borderRadius:20,border:"1px solid #E5E7EB",background:"#F9F8FF",fontWeight:500}}>
              <div className="vl"/>Online
            </div>
          </header>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"20px 20px 8px",display:"flex",flexDirection:"column",gap:18}}>
            {messages.map((msg,i) => {
              const isUser = msg.role === "user"
              return (
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",flexDirection:isUser?"row-reverse":"row"}}>
                  {isUser
                    ? <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,marginTop:2,background:"#FDF4FF",color:"#7E22CE"}}>You</div>
                    : <div style={{width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,marginTop:2,background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff"}}>VQ</div>
                  }
                  <div style={{maxWidth:"76%",padding:"11px 15px",borderRadius:isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",fontSize:13.5,lineHeight:1.72,background:isUser?"#F5F3FF":"#FFFFFF",border:`1px solid ${isUser?"#DDD6FE":"#E5E7EB"}`,whiteSpace:"pre-wrap",wordBreak:"break-word",color:"#111827"}}>
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {loading && (
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:"linear-gradient(135deg,#4F46E5,#7C3AED)",color:"#fff"}}>VQ</div>
                <div style={{padding:"13px 16px",borderRadius:"16px 16px 16px 4px",border:"1px solid #E5E7EB",background:"#FFFFFF",display:"flex",gap:5,alignItems:"center"}}>
                  <span className="vd"/><span className="vd"/><span className="vd"/>
                </div>
              </div>
            )}

            {error && (
              <div style={{padding:"10px 14px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,fontSize:12,color:"#991B1B",display:"flex",alignItems:"center",gap:10}}>
                <span>⚠ {error}</span>
                <button onClick={()=>{setError(null);sendMessage(messages[messages.length-1]?.content)}}
                  style={{marginLeft:"auto",padding:"3px 10px",borderRadius:6,border:"1px solid #FECACA",background:"#fff",color:"#991B1B",fontSize:11,cursor:"pointer",fontWeight:500}}>
                  Retry
                </button>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Quick prompts */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,padding:"10px 18px",borderTop:"1px solid #F3F4F6",background:"#F9F8FF"}}>
            {QUICK_PROMPTS.map((q,i) => (
              <button key={i} className="vc" disabled={loading} onClick={()=>sendMessage(q)}>
                {q.length>46?q.slice(0,46)+"…":q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:"12px 16px",borderTop:"1px solid #E5E7EB",display:"flex",gap:8,alignItems:"flex-end",background:"#FFFFFF"}}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e)=>{setInput(e.target.value);autoResize(e)}}
              onKeyDown={handleKeyDown}
              placeholder="Ask VaultIQ anything…"
              rows={1}
              disabled={loading}
              style={{flex:1,resize:"none",border:"1px solid #E5E7EB",borderRadius:11,padding:"9px 13px",fontSize:13.5,background:"#F9F8FF",color:"#111827",lineHeight:1.55,minHeight:40,maxHeight:120}}
            />
            <button className="vs" onClick={()=>sendMessage()} disabled={!canSend} aria-label="Send">↑</button>
          </div>

        </div>
      </div>
    </>
  )
}
