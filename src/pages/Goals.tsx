import React, { useState, useEffect } from 'react'
import { Plus, TrendingUp, Sparkles, X } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { supabase } from '../lib/supabase'
import { formatPeso, getPercentage } from '../lib/utils'
import { goals as demo } from '../lib/demoData'

interface Goal {
  id: string | number; name: string; icon: string; target_amount: number; current_amount: number
  monthly_contribution: number; color: string; deadline?: string; description?: string; contributions?: number[]
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: '', target_amount: 50000, monthly_contribution: 3000, icon: '🎯', color: '#4F46E5', deadline: '', description: '' })

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('goals').select('*').eq('is_active', true).order('created_at')
      if (data?.length) {
        setGoals(data.map(g => ({ ...g, contributions: demo.find(d => d.name === g.name)?.contributions })))
      } else {
        setGoals(demo.map(g => ({ id: g.id, name: g.name, icon: g.icon, target_amount: g.target, current_amount: g.current, monthly_contribution: g.monthly, color: g.color, deadline: g.deadline, description: g.description, contributions: g.contributions })))
      }
    })()
  }, [])

  const add = async () => {
    if (!form.name || !form.target_amount) return
    const { data, error } = await supabase.from('goals').insert({ name: form.name, icon: form.icon, target_amount: form.target_amount, current_amount: 0, monthly_contribution: form.monthly_contribution, color: form.color, deadline: form.deadline || null, description: form.description, is_active: true }).select().single()
    if (!error && data) { setGoals(p => [...p, { ...data }]); setAdding(false); setForm({ name: '', target_amount: 50000, monthly_contribution: 3000, icon: '🎯', color: '#4F46E5', deadline: '', description: '' }) }
  }

  const totalSaved = goals.reduce((s, g) => s + g.current_amount, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target_amount, 0)
  const monthlyCommit = goals.reduce((s, g) => s + g.monthly_contribution, 0)

  return (
    <div className="p-6 max-w-5xl space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Saved', value: formatPeso(totalSaved), sub: `across ${goals.length} goals`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total Target', value: formatPeso(totalTarget), sub: `${getPercentage(totalSaved, totalTarget)}% complete`, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Monthly Commitment', value: formatPeso(monthlyCommit), sub: 'saving per month', color: 'text-slate-900 dark:text-white' },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</div>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Header + add button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Goals</h2>
        <button onClick={() => setAdding(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Goal
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="card p-6 border-2 border-indigo-200 dark:border-indigo-800/50 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 dark:text-white">New Financial Goal</h3>
            <button onClick={() => setAdding(false)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Goal Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g. New Car Down Payment" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Target Amount (₱)</label><input type="number" value={form.target_amount} onChange={e => setForm(f => ({ ...f, target_amount: Number(e.target.value) }))} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Monthly Contribution (₱)</label><input type="number" value={form.monthly_contribution} onChange={e => setForm(f => ({ ...f, monthly_contribution: Number(e.target.value) }))} className="input-field" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Target Deadline</label><input type="month" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="input-field" /></div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={add} className="btn-primary text-sm">Create Goal</button>
            <button onClick={() => setAdding(false)} className="btn-outline text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Goal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map(goal => {
          const pct = getPercentage(goal.current_amount, goal.target_amount)
          const monthsLeft = Math.ceil((goal.target_amount - goal.current_amount) / Math.max(1, goal.monthly_contribution))
          const chartData = (goal.contributions || [goal.monthly_contribution]).map((v, i) => ({
            m: ['J', 'F', 'M', 'A', 'M', 'J'][i] || `${i+1}`,
            v,
          }))

          return (
            <div key={goal.id} className="card-elevated p-6 group hover:-translate-y-1 transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: goal.color + '18', border: `1px solid ${goal.color}35` }}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{goal.name}</h3>
                    {goal.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{goal.description}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black" style={{ color: goal.color }}>{pct}%</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">complete</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatPeso(goal.current_amount)}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">of {formatPeso(goal.target_amount)}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${pct}%`, backgroundColor: goal.color }}>
                    <div className="absolute inset-0 bg-white/20"
                      style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)' }} />
                  </div>
                  {pct > 3 && <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 transition-all duration-1000" style={{ left: `calc(${pct}% - 8px)`, borderColor: goal.color }} />}
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-14 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 2, right: 0, left: -40, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gGoal${goal.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={goal.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={goal.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v: number) => formatPeso(v)} />
                    <Area type="monotone" dataKey="v" stroke={goal.color} fill={`url(#gGoal${goal.id})`} strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'per month', value: formatPeso(goal.monthly_contribution) },
                  { label: 'months left', value: monthsLeft <= 0 ? '🎉 Done' : `${monthsLeft}` },
                  { label: 'deadline', value: goal.deadline || '—' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{s.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* AI tip */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50 dark:bg-indigo-950/20">
                <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  {pct >= 90 ? "Almost there! You're ahead of schedule — great financial discipline!" : `Add ${formatPeso(goal.monthly_contribution * 0.15)}/month more to reach this goal ${Math.max(1, Math.floor(monthsLeft * 0.12))} months sooner.`}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Combined Goal Progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All goals · {formatPeso(totalTarget - totalSaved)} remaining</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{getPercentage(totalSaved, totalTarget)}%</div>
            <div className="text-xs text-slate-500">overall</div>
          </div>
        </div>
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
            style={{ width: `${getPercentage(totalSaved, totalTarget)}%`, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
            <div className="absolute inset-0 bg-white/10"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)' }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{formatPeso(totalSaved)} saved</span>
          <span>{formatPeso(totalTarget)} total target</span>
        </div>
      </div>
    </div>
  )
}

export default Goals
