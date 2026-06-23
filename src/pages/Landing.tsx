import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Zap, Check, Star, ChevronDown, TrendingUp, Shield, Brain } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

/* ─── Data ─────────────────────────────────────── */
const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Budget Planning',
    desc: 'Your budget builds itself. Just enter your income and goals — the AI allocates every peso with precision.',
    color: 'from-indigo-500/20 to-violet-500/10',
    border: 'border-indigo-500/20',
    tag: 'Zero-Based',
  },
  {
    icon: '🔔',
    title: 'Predictive Nudges',
    desc: 'Get warned before you overspend. Our ML model predicts budget risks 5–7 days ahead.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    tag: 'Predictive',
  },
  {
    icon: '🎯',
    title: 'Goal Tracking',
    desc: 'Emergency fund, laptop, travel — every goal has a timeline, a contribution plan, and AI acceleration tips.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    tag: 'Smart Goals',
  },
  {
    icon: '📊',
    title: 'Expense Analytics',
    desc: 'Deep-dive into your spending patterns with beautiful charts that reveal where every peso goes.',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/20',
    tag: 'Insights',
  },
  {
    icon: '💬',
    title: 'AI Financial Coach',
    desc: '"Can I afford this?" Ask your AI coach anything and get personalized answers backed by your real data.',
    color: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    tag: 'Chat-based',
  },
  {
    icon: '🛡️',
    title: 'Discipline System',
    desc: 'Not just a tracker. A complete financial discipline system that enforces good habits automatically.',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
    tag: 'ZBB Method',
  },
]

const STEPS = [
  { num: '01', icon: '👤', title: 'Build Your Profile', desc: 'Enter income, employment type, and financial personality.' },
  { num: '02', icon: '🎯', title: 'Set Your Goals', desc: 'Emergency fund, travel, gadgets — choose what matters.' },
  { num: '03', icon: '🧠', title: 'AI Builds Budget', desc: 'Zero-based budget generated instantly, tailored to you.' },
  { num: '04', icon: '✅', title: 'Stay Ahead', desc: 'Predictive nudges fire before problems happen.' },
]

const TESTIMONIALS = [
  { name: 'Maria Santos', role: 'Software Engineer', init: 'MS', color: 'bg-indigo-500', stars: 5, quote: 'BudgetWise AI warned me I was about to overspend on dining 4 days before payday. Saved me ₱1,800 that week alone.' },
  { name: 'Carlo Reyes', role: 'Freelancer', init: 'CR', color: 'bg-emerald-500', stars: 5, quote: 'As a freelancer, irregular income made budgeting impossible. Now I have a system that actually works. Emergency fund: ₱95K in 8 months.' },
  { name: 'Ana Dizon', role: 'Teacher', init: 'AD', color: 'bg-amber-500', stars: 5, quote: 'The Zero-Based Budget feature completely changed how I handle money. I\'m saving for my MBA and it finally feels achievable.' },
]

/* ─── Animated counter ──────────────────────────── */
const Counter: React.FC<{ to: string; duration?: number }> = ({ to, duration = 1800 }) => {
  const [display, setDisplay] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const isPercent = to.includes('%')
        const isMil = to.includes('M')
        const isX = to.includes('x')
        const raw = parseFloat(to.replace(/[^0-9.]/g, ''))
        const steps = 40
        let i = 0
        const interval = setInterval(() => {
          i++
          const val = (raw * i) / steps
          let formatted = isMil ? val.toFixed(1) : isX ? val.toFixed(1) : Math.round(val).toString()
          setDisplay(isMil ? `₱${formatted}M` : isX ? `${formatted}x` : isPercent ? `${formatted}%` : to)
          if (i >= steps) { setDisplay(to); clearInterval(interval) }
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to, duration])

  return <span ref={ref}>{display}</span>
}

/* ─── Reveal wrapper ───────────────────────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── Hero dashboard mockup ─────────────────────── */
const HeroMockup: React.FC = () => (
  <div className="relative">
    {/* Glow behind */}
    <div className="absolute -inset-8 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

    <div className="relative glass-card border border-white/10 p-5 shadow-2xl animate-float"
      style={{ background: 'rgba(10,13,22,0.85)', borderColor: 'rgba(255,255,255,0.08)' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="w-3 h-3 rounded-full bg-red-400/60" />
        <span className="w-3 h-3 rounded-full bg-amber-400/60" />
        <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
        <div className="flex-1 h-2.5 rounded-full bg-white/5 ml-2" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Income', value: '₱65K', color: 'text-indigo-300', bg: 'bg-indigo-500/15' },
          { label: 'Budgeted', value: '₱65K', color: 'text-emerald-300', bg: 'bg-emerald-500/15' },
          { label: 'Spent', value: '₱58K', color: 'text-amber-300', bg: 'bg-amber-500/15' },
          { label: 'Score', value: '74', color: 'text-blue-300', bg: 'bg-blue-500/15' },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-2.5`}>
            <div className="text-[9px] text-white/40 mb-0.5">{k.label}</div>
            <div className={`font-bold text-sm ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Sparkline bars */}
      <div className="flex items-end gap-1 h-16 mb-3">
        {[55, 65, 72, 60, 80, 68, 90, 75, 85, 70, 95, 78].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm transition-all"
            style={{
              height: `${h}%`,
              background: i === 10 ? 'rgba(79,70,229,0.9)' : i === 11 ? 'rgba(79,70,229,0.6)' : 'rgba(255,255,255,0.08)',
            }} />
        ))}
      </div>

      {/* Nudge card */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/20">
        <span className="text-base">⚠️</span>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-semibold text-amber-300">Dining at 96% — risk in 5 days</div>
          <div className="text-[8px] text-white/40 mt-0.5">Reduce GrabFood by 3 orders this week</div>
        </div>
        <div className="text-[8px] font-bold text-amber-400 border border-amber-500/30 rounded-lg px-1.5 py-0.5">Act</div>
      </div>
    </div>
  </div>
)

/* ─── Landing ─────────────────────────────────── */
const Landing: React.FC = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#06090F] text-white overflow-x-hidden">

      {/* ── NAV ─────────────────────────────── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#06090F]/90 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center shadow-glow-indigo">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px]">BudgetWise <span className="text-gradient">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'How it Works', 'Testimonials'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
                {l}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              Demo
            </button>
            <button onClick={() => navigate('/onboarding')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-overlay opacity-100" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-950/30 blur-[120px] pointer-events-none" />

        {/* Decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-indigo-500/5 animate-spin-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-indigo-500/3 pointer-events-none"
          style={{ animation: 'spin-slow 30s linear infinite reverse' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left col */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Zero-Based Budgeting × AI Predictive Nudging
            </div>

            <h1 className="text-5xl lg:text-6xl font-black leading-[1.07] tracking-tight mb-6 animate-slide-up">
              Every Peso
              <br />
              <span style={{ background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #34D399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Has a Purpose.
              </span>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl animate-slide-up delay-100">
              Build smarter financial habits with Zero-Based Budgeting and ML-powered predictive nudges
              that catch problems <em className="text-white/80 not-italic font-medium">before they happen.</em>
            </p>

            <div className="flex flex-wrap gap-4 mb-12 animate-slide-up delay-200">
              <button onClick={() => navigate('/onboarding')}
                className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 20px rgba(79,70,229,0.5)' }}>
                Start Budgeting Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-3 px-7 py-4 rounded-2xl font-semibold text-white/80 hover:text-white border border-white/10 hover:bg-white/5 transition-all duration-200">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                Live Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 animate-fade-in delay-300">
              <div className="flex -space-x-2">
                {['#4F46E5', '#10B981', '#F59E0B', '#EF4444'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#06090F] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c }}>
                    {['M', 'C', 'A', 'J'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-white/50"><span className="text-white/80 font-semibold">4,800+</span> Filipino users saving smarter</p>
              </div>
            </div>
          </div>

          {/* Right col — mockup */}
          <div className="hidden lg:flex justify-center animate-slide-up delay-300">
            <HeroMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────── */}
      <section className="relative bg-[#0B0E1A] border-y border-white/5 py-14">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '₱2.4M', label: 'Avg annual savings per user' },
            { value: '94%', label: 'Budget adherence improvement' },
            { value: '3.2x', label: 'Faster goal achievement' },
            { value: '87%', label: 'Less impulse spending' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #818CF8, #34D399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                <Counter to={s.value} />
              </div>
              <p className="text-xs text-white/40 font-medium leading-relaxed">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section id="features" className="py-28 px-6 bg-[#06090F]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="badge-indigo text-xs mb-5 inline-flex border border-indigo-500/30">PLATFORM FEATURES</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Not just a tracker.
              <br />
              <span className="text-gradient">An AI financial system.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              BudgetWise AI combines the iron discipline of Zero-Based Budgeting with machine learning
              to predict and prevent financial mistakes before they occur.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className={`relative p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} group cursor-default hover:-translate-y-1 transition-all duration-300`}
                  style={{ background: undefined }}>
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${f.color} opacity-60`} />
                  <div className="absolute inset-0 rounded-2xl border border-white/5" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{f.icon}</span>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/10">{f.tag}</span>
                    </div>
                    <h3 className="font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 bg-[#0B0E1A] relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="relative max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="badge-emerald text-xs mb-5 inline-flex border border-emerald-500/30">HOW IT WORKS</span>
            <h2 className="text-4xl font-black tracking-tight">
              From setup to savings in <span className="text-gradient-emerald">4 steps</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-emerald-500/30" />

            {STEPS.map((s, i) => (
              <Reveal key={s.num} delay={i * 120} className="text-center">
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-3xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(79,70,229,0.2), rgba(124,58,237,0.1))`,
                      border: '1px solid rgba(79,70,229,0.25)',
                      boxShadow: '0 8px 32px rgba(79,70,229,0.15)',
                    }}>
                    {s.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-indigo flex items-center justify-center text-[11px] font-black text-white shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section id="testimonials" className="py-28 px-6 bg-[#06090F]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="badge-amber text-xs mb-5 inline-flex border border-amber-500/30">REAL RESULTS</span>
            <h2 className="text-4xl font-black tracking-tight">
              Trusted by financial <span className="text-gradient-gold">achievers</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="relative p-6 rounded-2xl border border-white/6 group hover:-translate-y-1 transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <div className="absolute inset-0 rounded-2xl bg-card-shine opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed mb-6 italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.init}</div>
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-xs text-white/40">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden bg-[#0B0E1A]">
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[80px] rounded-full" />

        <Reveal className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-8">
            <Check className="w-3.5 h-3.5" />
            Free · No credit card · Setup in 2 minutes
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Start your journey to
            <br />
            <span style={{ background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #34D399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              financial freedom.
            </span>
          </h2>
          <p className="text-white/50 mb-10 text-lg max-w-xl mx-auto">
            Join thousands of Filipinos achieving financial discipline through intelligent, proactive budgeting.
          </p>
          <button onClick={() => navigate('/onboarding')}
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:-translate-y-1"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 8px 32px rgba(79,70,229,0.4)' }}>
            Build My Free Budget
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </Reveal>
      </section>

      {/* ── FOOTER ───────────────────────────── */}
      <footer className="bg-[#06090F] border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg gradient-indigo flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">BudgetWise AI</span>
          </div>
          <p className="text-white/25 text-xs">© 2026 BudgetWise AI · Every Peso Has a Purpose.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support'].map(l => (
              <a key={l} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
