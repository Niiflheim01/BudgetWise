import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, Plus, ArrowRight, Zap,
  Brain, Target, ChevronRight, AlertTriangle, Wallet,
  BarChart3, Sparkles,
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { supabase } from '../lib/supabase'
import { formatPeso, getPercentage } from '../lib/utils'
import {
  budgetCategories, spendingTrends, recentExpenses,
  MONTHLY_INCOME, FINANCIAL_HEALTH_SCORE, healthMetrics, nudges,
} from '../lib/demoData'

/* ─── Tooltip ─────────────────────────────────── */
const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs">
      <p className="font-semibold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-slate-400">{p.name}</span>
          <span className="font-bold text-slate-900 dark:text-white ml-auto pl-4">{formatPeso(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Animated number ──────────────────────────── */
const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string; decimals?: number }> = ({
  value, prefix = '', suffix = '', decimals = 0,
}) => {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const steps = 50
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplay(value * (i / steps))
      if (i >= steps) { setDisplay(value); clearInterval(id) }
    }, 900 / steps)
    return () => clearInterval(id)
  }, [value])

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-PH')

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

/* ─── Health ring ──────────────────────────────── */
const HealthRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 58
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'
  const label = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Poor'

  return (
    <div className="relative w-36 h-36 mx-auto">
      {/* Outer glow ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r="68" fill="none" stroke={color} strokeWidth="2" opacity="0.1" />
      </svg>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx="72" cy="72" r={r} fill="none" strokeWidth="10"
          stroke={color} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{score}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">/ 100</span>
        <span className="text-xs font-bold mt-1" style={{ color }}>{label}</span>
      </div>
    </div>
  )
}

/* ─── Dashboard ─────────────────────────────────── */
const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [categories, setCategories] = useState(budgetCategories)

  useEffect(() => {
    const load = async () => {
      const { data: prof } = await supabase.from('budget_profile').select('*').limit(1).maybeSingle()
      if (prof) setProfile(prof)
      const { data: cats } = await supabase.from('budget_categories').select('*').order('sort_order')
      if (cats?.length) setCategories(cats)
    }
    load()
  }, [])

  const income = profile?.monthly_income || MONTHLY_INCOME
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const totalAllocated = categories.reduce((s, c) => s + c.allocated, 0)
  const unspent = Math.max(0, income - totalSpent)
  const savingsRate = Math.round((unspent / income) * 100)

  const donutData = [
    { name: 'Needs', value: categories.filter(c => ['Housing & Rent','Utilities','Food & Groceries'].includes(c.label)).reduce((s,c)=>s+c.spent,0) },
    { name: 'Wants', value: categories.filter(c => ['Dining Out','Entertainment','Clothing'].includes(c.label)).reduce((s,c)=>s+c.spent,0) },
    { name: 'Savings', value: categories.filter(c => ['Emergency Fund','Investments'].includes(c.label)).reduce((s,c)=>s+c.spent,0) },
    { name: 'Other', value: categories.filter(c => ['Transportation','Health & Wellness','Education','Debt Payments'].includes(c.label)).reduce((s,c)=>s+c.spent,0) },
  ]
  const DONUT_COLORS = ['#4F46E5', '#F59E0B', '#10B981', '#94A3B8']

  const topCategories = [...categories].sort((a, b) => b.spent - a.spent).slice(0, 5)
  const highNudge = nudges.find(n => n.urgency === 'high')

  return (
    <div className="p-6 space-y-5 max-w-[1440px]">

      {/* ── ALERT BANNER ─────────────────────── */}
      {highNudge && (
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/30 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">{highNudge.title}</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{highNudge.message}</p>
          </div>
          <button onClick={() => navigate('/nudges')}
            className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 transition-colors flex-shrink-0 mt-0.5">
            View nudges <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── KPI CARDS ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Monthly Income',
            value: income,
            isAmount: true,
            icon: Wallet,
            iconBg: 'bg-indigo-50 dark:bg-indigo-950/50',
            iconColor: 'text-indigo-600 dark:text-indigo-400',
            trend: '+8.3%',
            trendUp: true,
            sub: 'Monthly salary',
          },
          {
            label: 'Total Spent',
            value: totalSpent,
            isAmount: true,
            icon: BarChart3,
            iconBg: 'bg-amber-50 dark:bg-amber-950/50',
            iconColor: 'text-amber-600 dark:text-amber-400',
            trend: `${getPercentage(totalSpent, income)}% used`,
            trendUp: false,
            sub: 'This month',
          },
          {
            label: 'Remaining',
            value: unspent,
            isAmount: true,
            icon: Target,
            iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
            trend: '12 days left',
            trendUp: true,
            sub: 'Budget surplus',
          },
          {
            label: 'Savings Rate',
            value: savingsRate,
            isAmount: false,
            icon: Zap,
            iconBg: 'bg-violet-50 dark:bg-violet-950/50',
            iconColor: 'text-violet-600 dark:text-violet-400',
            trend: '+3.2% vs last mo',
            trendUp: true,
            sub: formatPeso(unspent) + ' saved',
          },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5 group hover:-translate-y-0.5 hover:shadow-card-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <span className={`badge text-[10px] ${kpi.trendUp ? 'badge-emerald' : 'badge-amber'}`}>
                {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">
              {kpi.isAmount
                ? <AnimatedNumber value={kpi.value as number} prefix="₱" />
                : <AnimatedNumber value={kpi.value as number} suffix="%" />
              }
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{kpi.label}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── MAIN ROW ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Spending Trend */}
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Spending Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Budget vs. actual over 6 months</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-3 h-1 rounded-full bg-emerald-500 inline-block" /> Budget
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-3 h-1 rounded-full bg-indigo-500 inline-block" /> Actual
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={spendingTrends} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="#10B981" strokeWidth={2}
                fill="url(#gBudget)" dot={false} strokeDasharray="6 3" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#4F46E5" strokeWidth={2.5}
                fill="url(#gActual)" dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Health Score */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Financial Health</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overall score</p>
            </div>
            <span className="badge-emerald text-[10px]">
              <TrendingUp className="w-3 h-3" /> +6 pts
            </span>
          </div>

          <HealthRing score={FINANCIAL_HEALTH_SCORE} />

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3 mb-5">
            Improved from <strong className="text-slate-700 dark:text-slate-300">68</strong> last month
          </p>

          <div className="space-y-3.5 mt-auto">
            {healthMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-400">{m.label}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{m.score}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${m.score}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Budget Donut */}
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Budget Split</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">This month's allocation</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                paddingAngle={4} dataKey="value" strokeWidth={0}>
                {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatPeso(v)} contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {donutData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DONUT_COLORS[i] }} />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{d.name}</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatPeso(d.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top spending */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Top Spending</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">By category this month</p>
            </div>
            <button onClick={() => navigate('/analytics')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {topCategories.map((cat) => {
              const pct = getPercentage(cat.spent, cat.allocated)
              const barColor = pct >= 90 ? '#EF4444' : pct >= 75 ? '#F59E0B' : '#10B981'
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg w-7 text-center">{cat.icon}</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{cat.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{formatPeso(cat.spent)}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1">/{formatPeso(cat.allocated)}</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Nudges preview */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Insights</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Predictive nudges</p>
              </div>
            </div>
            <button onClick={() => navigate('/nudges')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 transition-colors flex items-center gap-1">
              All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {nudges.slice(0, 3).map((n) => {
              const palette = {
                warning: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/50', text: 'text-amber-800 dark:text-amber-200', sub: 'text-amber-600 dark:text-amber-400' },
                positive: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/50', text: 'text-emerald-800 dark:text-emerald-200', sub: 'text-emerald-600 dark:text-emerald-400' },
                goal: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-800/50', text: 'text-indigo-800 dark:text-indigo-200', sub: 'text-indigo-600 dark:text-indigo-400' },
                insight: { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800/50', text: 'text-violet-800 dark:text-violet-200', sub: 'text-violet-600 dark:text-violet-400' },
              }[n.type] ?? { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-800 dark:text-slate-200', sub: 'text-slate-600 dark:text-slate-400' }
              return (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl border ${palette.bg} ${palette.border}`}>
                  <span className="text-xl flex-shrink-0">{n.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-snug ${palette.text}`}>{n.title}</p>
                    <p className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${palette.sub}`}>{n.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── TRANSACTIONS + QUICK ACTIONS ─────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Recent transactions */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest expense activity</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-primary text-xs px-3 py-2">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
              <button onClick={() => navigate('/analytics')} className="btn-ghost text-xs px-3 py-2">
                All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            {recentExpenses.slice(0, 7).map((exp, i) => (
              <div key={exp.id}
                className={`flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${i < 6 ? 'border-b border-slate-50 dark:border-slate-800/50' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">
                  {exp.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{exp.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{exp.category} · {exp.date}</div>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">−{formatPeso(exp.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="card p-6 flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {[
              { label: 'Add Expense', icon: Plus, bg: 'gradient-indigo', shadow: 'shadow-glow-indigo', onClick: () => {} },
              { label: 'Budget Plan', icon: BarChart3, bg: 'gradient-emerald', shadow: 'shadow-glow-emerald', onClick: () => navigate('/budget') },
              { label: 'Create Goal', icon: Target, bg: 'gradient-blue', shadow: '', onClick: () => navigate('/goals') },
              { label: 'AI Insights', icon: Sparkles, bg: 'gradient-amber', shadow: '', onClick: () => navigate('/nudges') },
            ].map((a) => (
              <button key={a.label} onClick={a.onClick}
                className={`flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl ${a.bg} ${a.shadow} hover:-translate-y-1 transition-all duration-200 cursor-pointer`}>
                <a.icon className="w-6 h-6 text-white" />
                <span className="text-xs font-bold text-white">{a.label}</span>
              </button>
            ))}
          </div>

          {/* Mini insight */}
          <div className="mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/30">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">AI Tip</span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
              Redirect your ₱1,400 transport savings to your Laptop goal — reach it 2 weeks early.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
