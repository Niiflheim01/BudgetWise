import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, Plus, Save, RefreshCw, Minus, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPeso, getPercentage } from '../lib/utils'
import { budgetCategories, MONTHLY_INCOME } from '../lib/demoData'

interface Cat { id: string; label: string; icon: string; allocated: number; spent: number; color: string; sort_order: number }

const BudgetPlanner: React.FC = () => {
  const [income, setIncome] = useState(MONTHLY_INCOME)
  const [cats, setCats] = useState<Cat[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    (async () => {
      const { data: prof } = await supabase.from('budget_profile').select('monthly_income').limit(1).maybeSingle()
      if (prof?.monthly_income) setIncome(prof.monthly_income)
      const { data } = await supabase.from('budget_categories').select('*').order('sort_order')
      setCats(data?.length ? data : budgetCategories.map(c => ({ ...c, sort_order: 0 })))
    })()
  }, [])

  const totalAllocated = cats.reduce((s, c) => s + (c.allocated || 0), 0)
  const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0)
  const remaining = income - totalAllocated
  const isBalanced = Math.abs(remaining) < 1
  const isOver = remaining < 0

  const update = (id: string, val: number) => {
    setCats(p => p.map(c => c.id === id ? { ...c, allocated: Math.max(0, val) } : c))
    setSaved(false)
  }

  const autoBalance = () => {
    const adj = cats.filter(c => !['Housing & Rent', 'Debt Payments'].includes(c.label))
    if (!adj.length || remaining === 0) return
    const share = remaining / adj.length
    setCats(p => p.map(c => adj.find(a => a.id === c.id) ? { ...c, allocated: Math.max(0, Math.round(c.allocated + share)) } : c))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const c of cats) {
        if (c.id?.length > 8) await supabase.from('budget_categories').update({ allocated: c.allocated, updated_at: new Date().toISOString() }).eq('id', c.id)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* */ } finally { setSaving(false) }
  }

  return (
    <div className="p-6 max-w-5xl space-y-5">
      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income */}
        <div className="card p-5">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Monthly Income</div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₱</span>
            <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))}
              className="input-field pl-7 text-2xl font-black" />
          </div>
        </div>

        {/* Allocated */}
        <div className="card p-5">
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Allocated</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{formatPeso(totalAllocated)}</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${Math.min(getPercentage(totalAllocated, income), 100)}%`, backgroundColor: isOver ? '#EF4444' : isBalanced ? '#10B981' : '#4F46E5' }} />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{getPercentage(totalAllocated, income)}% of income</div>
        </div>

        {/* Remaining/Over */}
        <div className={`card p-5 ${isBalanced ? 'ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20' : isOver ? 'ring-2 ring-red-500/30 bg-red-50/50 dark:bg-red-950/20' : ''}`}>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
            {isOver ? 'Over Budget' : 'Unallocated'}
          </div>
          <div className={`text-2xl font-black mb-1.5 ${isBalanced ? 'text-emerald-600' : isOver ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
            {isOver ? `−${formatPeso(Math.abs(remaining))}` : formatPeso(remaining)}
          </div>
          {isBalanced
            ? <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Zero-Based Achieved!</div>
            : isOver
            ? <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-semibold"><AlertTriangle className="w-3.5 h-3.5" /> Reduce by {formatPeso(Math.abs(remaining))}</div>
            : <button onClick={autoBalance} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Auto-distribute {formatPeso(remaining)} →</button>
          }
        </div>
      </div>

      {/* Visual allocation bar */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Allocation Visual</h3>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Every ₱1 must have a job</span>
        </div>
        <div className="flex h-8 rounded-xl overflow-hidden gap-0.5">
          {cats.filter(c => c.allocated > 0).map(cat => (
            <div key={cat.id} className="h-full relative group cursor-pointer transition-all duration-300 hover:opacity-90"
              style={{ width: `${getPercentage(cat.allocated, income)}%`, minWidth: 2, backgroundColor: cat.color }}>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none">
                {cat.icon} {cat.label}: {formatPeso(cat.allocated)}
              </div>
            </div>
          ))}
          {remaining > 0 && (
            <div className="h-full flex-1 bg-slate-200 dark:bg-slate-700 rounded-r-lg"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)' }} />
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {cats.slice(0, 8).map(c => (
            <div key={c.id} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{c.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Budget Categories</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cats.length} categories · adjust allocations below</p>
          </div>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-12 px-6 py-2 bg-slate-50 dark:bg-slate-800/50">
          {[{ l: 'Category', s: 'col-span-4' }, { l: 'Allocated', s: 'col-span-3 text-right' }, { l: 'Spent', s: 'col-span-2 text-right' }, { l: 'Progress', s: 'col-span-3' }].map(h => (
            <div key={h.l} className={`${h.s} text-[9px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest`}>{h.l}</div>
          ))}
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {cats.map(cat => {
            const pct = getPercentage(cat.spent, cat.allocated)
            const left = cat.allocated - cat.spent
            const barColor = pct >= 100 ? '#EF4444' : pct >= 80 ? '#F59E0B' : '#10B981'
            return (
              <div key={cat.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: cat.color + '18', border: `1px solid ${cat.color}30` }}>
                    {cat.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{cat.label}</span>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-1.5">
                  <button onClick={() => update(cat.id, cat.allocated - 500)}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <Minus className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                  </button>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₱</span>
                    <input type="number" value={cat.allocated} onChange={e => update(cat.id, Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 text-sm font-bold text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                  </div>
                  <button onClick={() => update(cat.id, cat.allocated + 500)}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <Plus className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                  </button>
                </div>

                <div className="col-span-2 text-right pr-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{formatPeso(cat.spent)}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${left >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {left >= 0 ? `${formatPeso(left)} left` : `${formatPeso(Math.abs(left))} over`}
                  </div>
                </div>

                <div className="col-span-3 pl-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold" style={{ color: barColor }}>{pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Totals footer */}
        <div className="grid grid-cols-12 items-center px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <div className="col-span-4 text-sm font-black text-slate-900 dark:text-white">Totals</div>
          <div className="col-span-3 text-sm font-black text-slate-900 dark:text-white text-right pr-12">{formatPeso(totalAllocated)}</div>
          <div className="col-span-2 text-sm font-black text-slate-900 dark:text-white text-right pr-2">{formatPeso(totalSpent)}</div>
          <div className="col-span-3 pl-4 text-xs font-bold text-slate-500">{getPercentage(totalSpent, totalAllocated)}% spent</div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {isBalanced && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          {isBalanced ? 'Perfect — every peso has a purpose.' : isOver ? `⚠ Over by ${formatPeso(Math.abs(remaining))}` : `${formatPeso(remaining)} still needs allocation`}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={autoBalance} className="btn-outline text-sm">
            <RefreshCw className="w-4 h-4" /> Auto Balance
          </button>
          <button onClick={handleSave} disabled={saving}
            className={`btn-primary text-sm ${saved ? '!bg-emerald-600' : ''}`}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BudgetPlanner
