import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Zap, Check, DollarSign, Target, PieChart, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { formatPeso } from '../lib/utils'

const GOAL_OPTIONS = [
  { id: 'emergency', label: 'Emergency Fund', icon: '🏦', desc: '3–6 months of expenses' },
  { id: 'education', label: 'Education', icon: '🎓', desc: 'Tuition, courses, MBA' },
  { id: 'gadget', label: 'New Device', icon: '💻', desc: 'Laptop, phone upgrade' },
  { id: 'travel', label: 'Travel', icon: '✈️', desc: 'Vacation & adventures' },
  { id: 'investments', label: 'Investments', icon: '📈', desc: 'Stocks, crypto, funds' },
  { id: 'housing', label: 'Home', icon: '🏡', desc: 'Down payment savings' },
  { id: 'retirement', label: 'Retirement', icon: '🌴', desc: 'Long-term security' },
  { id: 'debt', label: 'Debt Freedom', icon: '💳', desc: 'Pay off all loans' },
]

const EMPLOYMENT_TYPES = [
  { id: 'employed', label: 'Employed', icon: '🏢' },
  { id: 'self-employed', label: 'Self-Employed', icon: '💼' },
  { id: 'freelancer', label: 'Freelancer', icon: '🖥️' },
  { id: 'business', label: 'Business Owner', icon: '🏪' },
]

const INCOME_FREQS = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'semi-monthly', label: 'Semi-Monthly' },
  { id: 'bi-weekly', label: 'Bi-Weekly' },
  { id: 'weekly', label: 'Weekly' },
]

interface Data {
  monthly_income: number
  income_frequency: string
  employment_type: string
  goals: string[]
  needs_pct: number
  wants_pct: number
  savings_pct: number
  investments_pct: number
  debt_pct: number
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<Data>({
    monthly_income: 65000, income_frequency: 'monthly', employment_type: 'employed',
    goals: ['emergency', 'travel'],
    needs_pct: 50, wants_pct: 20, savings_pct: 15, investments_pct: 10, debt_pct: 5,
  })

  const totalPct = data.needs_pct + data.wants_pct + data.savings_pct + data.investments_pct + data.debt_pct
  const sliders = [
    { key: 'needs_pct', label: 'Needs', desc: 'Rent, food, utilities', color: '#4F46E5', emoji: '🏠' },
    { key: 'wants_pct', label: 'Wants', desc: 'Dining, entertainment', color: '#F59E0B', emoji: '🎬' },
    { key: 'savings_pct', label: 'Savings', desc: 'Emergency, goals', color: '#10B981', emoji: '🏦' },
    { key: 'investments_pct', label: 'Investments', desc: 'Stocks, funds', color: '#7C3AED', emoji: '📈' },
    { key: 'debt_pct', label: 'Debt', desc: 'Loan payments', color: '#EF4444', emoji: '💳' },
  ]

  const finish = async () => {
    setSaving(true)
    try {
      const { data: ex } = await supabase.from('budget_profile').select('id').limit(1).maybeSingle()
      const payload = { monthly_income: data.monthly_income, income_frequency: data.income_frequency, employment_type: data.employment_type, needs_pct: data.needs_pct, wants_pct: data.wants_pct, savings_pct: data.savings_pct, investments_pct: data.investments_pct, debt_pct: data.debt_pct, onboarding_complete: true, updated_at: new Date().toISOString() }
      if (ex) await supabase.from('budget_profile').update(payload).eq('id', ex.id)
      else await supabase.from('budget_profile').insert({ ...payload })
    } catch { /* continue */ } finally {
      setSaving(false)
      navigate('/dashboard')
    }
  }

  const STEPS = [
    { num: 1, label: 'Profile', icon: DollarSign },
    { num: 2, label: 'Goals', icon: Target },
    { num: 3, label: 'Split', icon: PieChart },
    { num: 4, label: 'Budget', icon: Sparkles },
  ]

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-16"
      style={{ background: 'linear-gradient(160deg, #06090F 0%, #0D1120 45%, #080C14 100%)' }}>
      {/* BG effects */}
      <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-glow-indigo">
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-black text-white text-lg">BudgetWise <span className="text-gradient">AI</span></span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Set Up Your Financial Profile</h1>
          <p className="text-white/40 text-sm">Takes about 2 minutes · No payment required</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > s.num ? 'bg-emerald-500 text-white' : step === s.num ? 'bg-indigo-600 text-white ring-4 ring-indigo-600/30' : 'bg-white/10 text-white/40'
                }`}>
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`hidden sm:block text-xs font-medium transition-colors ${step === s.num ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 max-w-8 h-px rounded transition-all duration-500 ${step > s.num ? 'bg-emerald-500' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 border border-white/8" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)' }}>

          {step === 1 && (
            <div className="animate-slide-up space-y-6">
              <div>
                <h2 className="text-xl font-black text-white mb-0.5">Financial Profile</h2>
                <p className="text-sm text-white/40">Tell us about your income situation</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">Monthly Net Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">₱</span>
                  <input type="number" value={data.monthly_income}
                    onChange={e => setData(d => ({ ...d, monthly_income: Number(e.target.value) }))}
                    className="w-full pl-8 pr-4 py-4 rounded-xl text-xl font-black text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all" />
                </div>
                <p className="text-xs text-white/30 mt-1.5">Your take-home pay after taxes & deductions</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">Income Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {INCOME_FREQS.map(f => (
                    <button key={f.id} onClick={() => setData(d => ({ ...d, income_frequency: f.id }))}
                      className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${data.income_frequency === f.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8 hover:border-white/20'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wide">Employment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {EMPLOYMENT_TYPES.map(e => (
                    <button key={e.id} onClick={() => setData(d => ({ ...d, employment_type: e.id }))}
                      className={`flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all duration-200 ${data.employment_type === e.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/8 hover:border-white/20'}`}>
                      <span>{e.icon}</span>{e.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up space-y-5">
              <div>
                <h2 className="text-xl font-black text-white mb-0.5">Financial Goals</h2>
                <p className="text-sm text-white/40">What are you saving for? Select all that apply.</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map(g => {
                  const sel = data.goals.includes(g.id)
                  return (
                    <button key={g.id} onClick={() => setData(d => ({ ...d, goals: sel ? d.goals.filter(x => x !== g.id) : [...d.goals, g.id] }))}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${sel ? 'bg-indigo-600/20 border-indigo-500/60' : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'}`}>
                      <span className="text-xl">{g.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${sel ? 'text-indigo-300' : 'text-white/80'}`}>{g.label}</div>
                        <div className="text-[10px] text-white/30 truncate">{g.desc}</div>
                      </div>
                      {sel && <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up space-y-5">
              <div>
                <h2 className="text-xl font-black text-white mb-0.5">Budget Split</h2>
                <p className="text-sm text-white/40">Allocate your {formatPeso(data.monthly_income)} monthly income</p>
              </div>
              <div className="space-y-5">
                {sliders.map(s => {
                  const val = data[s.key as keyof Data] as number
                  return (
                    <div key={s.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{s.emoji}</span>
                          <div>
                            <span className="text-sm font-bold text-white">{s.label}</span>
                            <span className="text-xs text-white/35 ml-2">{s.desc}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-white">{formatPeso(data.monthly_income * val / 100)}</span>
                          <span className="text-xs text-white/40 ml-1.5">{val}%</span>
                        </div>
                      </div>
                      <div className="relative h-2 bg-white/10 rounded-full">
                        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${val}%`, backgroundColor: s.color }} />
                        <input type="range" min={0} max={80} step={5} value={val}
                          onChange={e => setData(d => ({ ...d, [s.key]: Number(e.target.value) }))}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className={`p-3 rounded-xl border text-sm flex items-center justify-between ${totalPct === 100 ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : totalPct > 100 ? 'bg-red-500/15 border-red-500/30 text-red-300' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'}`}>
                <span className="font-semibold">Total Allocated</span>
                <span className="font-black">{totalPct}% {totalPct === 100 ? '✓ Perfect' : totalPct > 100 ? '⚠ Over' : `(${100 - totalPct}% left)`}</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-slide-up space-y-5">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-indigo flex items-center justify-center mb-3 shadow-glow-indigo">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-black text-white mb-1">Your AI Budget is Ready! 🎉</h2>
                <p className="text-sm text-white/40">Based on {formatPeso(data.monthly_income)}/month</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Housing & Rent', pct: 23, icon: '🏠', color: '#4F46E5' },
                  { label: 'Food & Groceries', pct: 15, icon: '🛒', color: '#10B981' },
                  { label: 'Savings & Emergency', pct: data.savings_pct, icon: '🏦', color: '#059669' },
                  { label: 'Investments', pct: data.investments_pct, icon: '📈', color: '#7C3AED' },
                  { label: 'Entertainment & Wants', pct: data.wants_pct, icon: '🎬', color: '#F59E0B' },
                  { label: 'Transportation', pct: 5, icon: '🚌', color: '#6366F1' },
                  { label: 'Debt Payments', pct: data.debt_pct, icon: '💳', color: '#EF4444' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                    <span className="text-lg w-7 text-center">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white/80 truncate">{item.label}</span>
                        <span className="text-xs font-black text-white ml-2">{formatPeso(data.monthly_income * item.pct / 100)}</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(item.pct, 100)}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/35 w-7 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200">
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? 'Home' : 'Back'}
            </button>
            {step < 4
              ? <button onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 14px rgba(79,70,229,0.4)' }}>
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              : <button onClick={finish} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #059669, #10B981)', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}>
                  {saving ? 'Setting up...' : 'Enter Dashboard'} <ChevronRight className="w-4 h-4" />
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
