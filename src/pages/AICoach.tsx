import React, { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Sparkles, TrendingUp, Target, PieChart, HelpCircle, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPeso } from '../lib/utils'
import { MONTHLY_INCOME, budgetCategories } from '../lib/demoData'

interface Msg { id: string | number; role: 'user' | 'assistant'; message: string }

const SUGGESTIONS = [
  'Can I afford a new phone?',
  'How much should I save this month?',
  'Why am I overspending on food?',
  "What's my biggest budget risk?",
  'How do I reach my Emergency Fund faster?',
  'Am I on track with my goals?',
]

const AI: Record<string, string> = {
  phone: `Based on your current budget, here's my honest assessment:

**Current Available:** ₱6,890 (this month's surplus)
**Recommended Phone Budget:** ₱25,000 – ₱40,000

**Verdict:** Don't buy now — but here's the smart play.

Create a "New Device" goal with ₱5,000/month. At that rate, you'll have ₱35,000 in 7 months without touching your Emergency Fund or other goals.

**Risk if you buy on credit:** Adds ₱1,200–₱2,500/month in debt payments, pushing your budget 18% over.

**Bottom line:** Wait 7 months, buy it debt-free. Your future self will thank you.`,

  save: `Here's your optimal savings plan for this month:

**Your Income:** ₱65,000
**Current Spend Rate:** ₱58,110 (89.4%)

**Non-Negotiable Savings:**
- Emergency Fund: ₱8,000 ✓ (allocated)
- Investments: ₱6,000 ✓ (allocated)

**Bonus Opportunity:**
Your Transportation budget has ₱1,400 unspent. Transfer this to your Laptop goal now.

**Recommended Total Savings:** ₱15,400/month (23.7% of income)

This keeps you on the 50/30/20 framework while following Zero-Based Budgeting discipline. You're doing better than 78% of users in your income bracket.`,

  food: `I've spotted a clear behavioral pattern in your food spending:

**Dining Out Trend:**
- April: ₱3,200
- May: ₱3,700 (+15.6%)
- June (on pace): ₱4,200 (+35% over budget!)

**Root Cause:** 67% of your dining overspend happens on weekday lunches — GrabFood orders between 11AM–2PM.

**3-Step Fix:**
1. Set GrabFood weekly budget to ₱600 (in-app feature)
2. Meal prep on Sundays for 3 weekday lunches
3. Use GrabFood promo codes — saves ~₱200/week

**Projected monthly savings:** ₱1,500–₱1,800

This single habit change could fund your Vacation goal 4 months earlier.`,

  risk: `Your top budget risks right now, ranked:

**🔴 CRITICAL — Dining Out (96% utilized)**
₱3,850 of ₱4,000 spent. At current pace: +₱1,200 over budget in 5 days. Reduce GrabFood orders by 3 this week.

**🟡 WATCH — Entertainment (78% utilized)**
Historical data shows you spend +32% more in the last week of each month. Pre-set a ₱500 cap for the remaining 8 days.

**🟢 SAFE — Everything else**
Transportation, groceries, housing all well within limits.

**Overall Risk Score: 3.2/10**
Manageable if you act on Dining today. Want me to send you a reminder?`,

  emergency: `Great news — you're ahead of schedule on this goal!

**Current Status:**
- Saved: ₱112,500 of ₱195,000 (57.7%)
- Monthly contribution: ₱8,000

**To reach by June 2027 (on-time):** Keep going ✓

**To reach 3 months EARLY (March 2027):**
- Option A: Increase contribution to ₱11,200/month
- Option B: Redirect transport surplus (~₱1,400/month) each month

**My Recommendation:** Go with Option B. It's passive — you don't need to change your behavior, just redirect money that's already unspent. Zero sacrifice required.`,

  goals: `Here's your complete goal health check:

**🏦 Emergency Fund** — 57.7% · On Track ✅
- ₱112,500 / ₱195,000 · Est. June 2027

**💻 New Laptop** — 61.2% · On Track ✅
- ₱52,000 / ₱85,000 · Est. December 2026

**🎓 Tuition Fund** — 31.7% · Needs Attention ⚠️
- ₱38,000 / ₱120,000 · Needs ₱7,500/month (current: ₱6,000)
- Increase by ₱1,500/month to stay on schedule for March 2027

**✈️ Vacation Fund** — 41.1% · On Track ✅
- ₱18,500 / ₱45,000 · Est. December 2026

**Priority action:** Increase Tuition Fund contribution by ₱1,500/month. This is your only at-risk goal.`,
}

const getReply = (msg: string): string => {
  const m = msg.toLowerCase()
  if (m.includes('phone') || m.includes('gadget') || m.includes('afford') || m.includes('buy')) return AI.phone
  if (m.includes('save') || m.includes('saving') || m.includes('how much')) return AI.save
  if (m.includes('food') || m.includes('overspend') || m.includes('dining') || m.includes('why')) return AI.food
  if (m.includes('risk') || m.includes('biggest') || m.includes('danger')) return AI.risk
  if (m.includes('emergency') || m.includes('faster') || m.includes('accelerate')) return AI.emergency
  if (m.includes('goal') || m.includes('track') || m.includes('progress')) return AI.goals
  const totalSpent = budgetCategories.reduce((s, c) => s + c.spent, 0)
  return `I've analyzed your financial profile. Here's your snapshot:

**Monthly Income:** ${formatPeso(MONTHLY_INCOME)}
**Total Spent:** ${formatPeso(totalSpent)} (${Math.round(totalSpent/MONTHLY_INCOME*100)}% of income)
**Remaining:** ${formatPeso(MONTHLY_INCOME - totalSpent)}
**Savings Rate:** ${Math.round((1 - totalSpent/MONTHLY_INCOME)*100)}%

You're in good standing overall. Try asking me about specific areas:
- "Why am I overspending on food?"
- "Can I afford a new phone?"
- "How do I reach my Emergency Fund faster?"`
}

const renderMsg = (text: string) =>
  text.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-1.5" />
    if (line.startsWith('**') && line.endsWith('**')) return <div key={i} className="font-bold text-slate-900 dark:text-white mt-2.5 first:mt-0">{line.slice(2, -2)}</div>
    if (line.startsWith('- ') || line.startsWith('• ')) return (
      <div key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
        <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-200">$1</strong>') }} />
      </div>
    )
    return <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800 dark:text-slate-200">$1</strong>') }} />
  })

const AICoach: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('chat_messages').select('*').order('created_at').limit(50)
      if (data?.length) { setMsgs(data as Msg[]) }
      else setMsgs([{ id: 1, role: 'assistant', message: `Hello! I'm your BudgetWise AI Financial Coach.\n\nI have full context of your financial profile — income, spending, goals, and budget utilization. Ask me anything and I'll give you personalized, data-backed advice.\n\n**Try asking:**\n- "Can I afford a new phone?"\n- "Why am I overspending on food?"\n- "Am I on track with my goals?"` }])
    })()
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = async () => {
    if (!input.trim() || typing) return
    const q = input.trim()
    setMsgs(p => [...p, { id: Date.now(), role: 'user', message: q }])
    setInput('')
    setTyping(true)
    try { await supabase.from('chat_messages').insert({ role: 'user', message: q }) } catch { /* */ }
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 700))
    const reply = getReply(q)
    setTyping(false)
    setMsgs(p => [...p, { id: Date.now() + 1, role: 'assistant', message: reply }])
    try { await supabase.from('chat_messages').insert({ role: 'assistant', message: reply }) } catch { /* */ }
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Context panel */}
      <div className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B0E1A] overflow-y-auto">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-glow-indigo">
              <Sparkles className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">AI Context</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Live financial data</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          {[
            { label: 'Monthly Income', value: formatPeso(MONTHLY_INCOME), icon: TrendingUp, color: 'text-indigo-500' },
            { label: 'Budget Used', value: '89.4%', icon: PieChart, color: 'text-amber-500' },
            { label: 'Active Goals', value: '4 goals', icon: Target, color: 'text-emerald-500' },
            { label: 'Health Score', value: '74 / 100', icon: Zap, color: 'text-violet-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5">Suggested Questions</div>
          <div className="space-y-1">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="w-full text-left text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-150 flex items-start gap-2">
                <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" />
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-[#080C14]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {msgs.map(msg => (
            <div key={msg.id} className={`flex items-start gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'gradient-indigo shadow-glow-indigo' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-[18px] h-[18px] text-slate-600 dark:text-slate-300" />}
              </div>
              <div className={`max-w-[78%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-md'
                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tl-md shadow-sm'
                }`} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : {}}>
                  {msg.role === 'user'
                    ? <p>{msg.message}</p>
                    : <div className="space-y-1">{renderMsg(msg.message)}</div>
                  }
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-glow-indigo flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  {[0, 0.25, 0.5].map((d, i) => (
                    <span key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0B0E1A] px-6 py-4">
          {/* Mobile suggestions */}
          <div className="flex gap-2 overflow-x-auto pb-3 lg:hidden scrollbar-none">
            {SUGGESTIONS.slice(0, 3).map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="flex-shrink-0 text-[11px] font-semibold px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors">
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder="Ask your AI Financial Coach anything…"
                rows={1} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-none transition-all"
                style={{ maxHeight: 120 }} />
            </div>
            <button onClick={send} disabled={!input.trim() || typing}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: input.trim() ? '0 4px 14px rgba(79,70,229,0.4)' : 'none' }}>
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
            Responses are generated from your live budget data · Press Enter to send
          </p>
        </div>
      </div>
    </div>
  )
}

export default AICoach
