import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import { formatPeso, getPercentage } from '../lib/utils'
import { spendingTrends, categoryTrends, budgetCategories, recentExpenses } from '../lib/demoData'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899', '#F97316']

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 shadow-xl text-xs min-w-[160px]">
      <p className="font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-slate-600 dark:text-slate-400 flex-1">{p.name}</span>
          <span className="font-bold text-slate-900 dark:text-white">{typeof p.value === 'number' && p.value > 999 ? formatPeso(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m')
  const pieData = budgetCategories.filter(c => c.spent > 0).map(c => ({ name: c.label, value: c.spent }))
  const savingsData = spendingTrends.map(d => ({ month: d.month, Savings: d.savings }))

  return (
    <div className="p-6 space-y-5 max-w-[1440px]">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        {(['3m', '6m', '1y'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${period === p ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {p === '3m' ? '3 Months' : p === '6m' ? '6 Months' : '1 Year'}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg Monthly Spend', value: '₱53,617', trend: '+4.1%', up: false },
          { label: 'Avg Monthly Savings', value: '₱10,033', trend: '+12.5%', up: true },
          { label: 'Budget Adherence', value: '87%', trend: '+3.2%', up: true },
          { label: 'Overspend Events', value: '3', trend: '−2 events', up: true },
        ].map(k => (
          <div key={k.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{k.label}</span>
              <span className={`badge text-[10px] ${k.up ? 'badge-emerald' : 'badge-amber'}`}>
                {k.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {k.trend}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Spending vs Budget</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Monthly comparison — 6 months</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={spendingTrends} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="#10B981" strokeWidth={2} fill="url(#gB)" dot={false} strokeDasharray="6 3" />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gA)" dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="#F59E0B" strokeWidth={1.5} fill="url(#gS)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Category Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Top categories stacked by month</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categoryTrends} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Food" stackId="a" fill="#10B981" radius={[0,0,0,0]} />
              <Bar dataKey="Dining" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Transport" stackId="a" fill="#4F46E5" />
              <Bar dataKey="Entertainment" stackId="a" fill="#EF4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="card p-6">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Spending Distribution</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">This month by category</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData.slice(0, 7)} cx="50%" cy="50%" outerRadius={82} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieData.slice(0, 7).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatPeso(v)} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-y-2 gap-x-3 mt-2">
            {pieData.slice(0, 6).map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{d.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 xl:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-1">Monthly Savings Growth</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">How much you saved each month</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={savingsData} margin={{ top: 0, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="savG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100 dark:stroke-slate-800" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="Savings" stroke="#10B981" strokeWidth={2.5} fill="url(#savG)" dot={{ r: 5, fill: '#10B981', strokeWidth: 2.5, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction history */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Transaction History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{recentExpenses.length} transactions</p>
          </div>
          <button className="btn-ghost text-xs"><Calendar className="w-3.5 h-3.5" /> June 2026</button>
        </div>

        <div className="hidden sm:grid grid-cols-12 px-6 py-2 bg-slate-50 dark:bg-slate-800/50">
          {['Date', 'Description', 'Category', 'Amount'].map((h, i) => (
            <div key={h} className={`${i===0?'col-span-2':i===1?'col-span-5':i===2?'col-span-3':'col-span-2 text-right'} text-[9px] font-bold text-slate-500 uppercase tracking-widest`}>{h}</div>
          ))}
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {recentExpenses.map(exp => (
            <div key={exp.id} className="grid sm:grid-cols-12 items-center px-6 py-3.5 gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="hidden sm:block col-span-2 text-xs text-slate-500 dark:text-slate-400">{exp.date}</div>
              <div className="col-span-5 flex items-center gap-3">
                <span className="text-xl w-8 text-center">{exp.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{exp.name}</div>
                  <div className="text-xs text-slate-500 sm:hidden">{exp.category} · {exp.date}</div>
                </div>
              </div>
              <div className="hidden sm:block col-span-3">
                <span className="badge-slate text-[10px]">{exp.category}</span>
              </div>
              <div className="sm:col-span-2 sm:text-right ml-auto sm:ml-0">
                <span className="text-sm font-bold text-red-600 dark:text-red-400">−{formatPeso(exp.amount)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500">{recentExpenses.length} transactions · June 2026</span>
          <span className="text-sm font-black text-red-600 dark:text-red-400">−{formatPeso(recentExpenses.reduce((s,e)=>s+e.amount,0))}</span>
        </div>
      </div>
    </div>
  )
}

export default Analytics
