import React, { useState, useEffect } from 'react'
import { X, Check, TrendingUp, ArrowRight, Bell, Sparkles, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { nudges as demo } from '../lib/demoData'

interface Nudge {
  id: string | number; type: string; title: string; message: string
  action?: string; impact?: string; category?: string; urgency: string; icon: string; is_dismissed?: boolean
}

type FilterType = 'all' | 'warning' | 'positive' | 'goal' | 'insight'

const PALETTE = {
  warning: { outer: 'border-amber-200 dark:border-amber-800/60', inner: 'bg-amber-50 dark:bg-amber-950/20', dot: 'bg-amber-500', tag: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300', action: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900/70' },
  positive: { outer: 'border-emerald-200 dark:border-emerald-800/60', inner: 'bg-emerald-50 dark:bg-emerald-950/20', dot: 'bg-emerald-500', tag: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300', action: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900/70' },
  goal: { outer: 'border-indigo-200 dark:border-indigo-800/60', inner: 'bg-indigo-50 dark:bg-indigo-950/20', dot: 'bg-indigo-500', tag: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300', action: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-900/70' },
  insight: { outer: 'border-violet-200 dark:border-violet-800/60', inner: 'bg-violet-50 dark:bg-violet-950/20', dot: 'bg-violet-500', tag: 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300', action: 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-200 hover:bg-violet-200 dark:hover:bg-violet-900/70' },
}

const URGENCY = { high: 'Urgent', medium: 'This week', low: 'Good to know' }

const NudgingCenter: React.FC = () => {
  const [nudges, setNudges] = useState<Nudge[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [dismissed, setDismissed] = useState<Set<string | number>>(new Set())

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('nudges').select('*').eq('is_dismissed', false).order('created_at', { ascending: false })
      setNudges(data?.length ? data : demo as Nudge[])
    })()
  }, [])

  const dismiss = async (id: string | number) => {
    setDismissed(p => new Set([...p, id]))
    if (typeof id === 'string' && id.length > 8) await supabase.from('nudges').update({ is_dismissed: true }).eq('id', id)
  }

  const visible = nudges.filter(n => !dismissed.has(n.id) && (filter === 'all' || n.type === filter))
  const counts = nudges.reduce((a, n) => ({ ...a, [n.type]: (a[n.type] || 0) + 1 }), {} as Record<string, number>)
  const urgentCount = nudges.filter(n => n.urgency === 'high' && !dismissed.has(n.id)).length

  return (
    <div className="p-6 max-w-4xl space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: nudges.filter(n => !dismissed.has(n.id)).length, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/50' },
          { label: 'Urgent', value: urgentCount, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50' },
          { label: 'Savings Opportunity', value: '₱9,900', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' },
          { label: 'AI Accuracy', value: '91%', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.bg}`}>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI analysis banner */}
      <div className="relative overflow-hidden rounded-2xl p-5 text-white"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', boxShadow: '0 8px 32px rgba(79,70,229,0.3)' }}>
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold">AI Financial Analysis — June 2026</h3>
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/20 border border-white/20 tracking-widest">LIVE</span>
            </div>
            <p className="text-sm text-white/75 leading-relaxed">
              You have a <strong className="text-white">high risk</strong> of exceeding your Dining Out budget.
              Your transportation spending is exemplary — 40% under budget.
              Redirecting those savings toward your Emergency Fund could accelerate goal completion by <strong className="text-white">2 months</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { id: 'all', label: 'All Nudges', count: nudges.length },
          { id: 'warning', label: '⚠ Warnings', count: counts.warning || 0 },
          { id: 'positive', label: '🎉 Wins', count: counts.positive || 0 },
          { id: 'goal', label: '🎯 Goals', count: counts.goal || 0 },
          { id: 'insight', label: '🔍 Insights', count: counts.insight || 0 },
        ] as { id: FilterType; label: string; count: number }[]).map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${filter === tab.id ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Nudge cards */}
      <div className="space-y-4">
        {!visible.length
          ? (
            <div className="card p-14 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">All clear in this category!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">No active nudges. You're right on track.</p>
            </div>
          )
          : visible.map(n => {
            const p = PALETTE[n.type as keyof typeof PALETTE] || PALETTE.insight
            return (
              <div key={n.id} className={`card border ${p.outer} overflow-hidden animate-slide-up`}>
                <div className={`${p.inner} p-5`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{n.title}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.tag}`}>{URGENCY[n.urgency as keyof typeof URGENCY] || n.urgency}</span>
                          {n.category && <span className="badge-slate text-[10px]">{n.category}</span>}
                        </div>
                        <button onClick={() => dismiss(n.id)}
                          className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0">
                          <X className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{n.message}</p>

                      {(n.action || n.impact) && (
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                          {n.action && (
                            <div className="flex-1 flex items-start gap-2.5 p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-white dark:border-slate-700">
                              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500" />
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Action</div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.action}</div>
                              </div>
                            </div>
                          )}
                          {n.impact && (
                            <div className="flex-1 flex items-start gap-2.5 p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-white dark:border-slate-700">
                              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Impact</div>
                                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{n.impact}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <button onClick={() => dismiss(n.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${p.action}`}>
                        <Check className="w-3.5 h-3.5" /> Mark as Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default NudgingCenter
