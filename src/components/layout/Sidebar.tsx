import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, PieChart, Target, Bell, BarChart3,
  MessageSquare, Settings, Zap, LogOut, TrendingUp,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/budget', icon: PieChart, label: 'Budget Planner' },
  { to: '/nudges', icon: Bell, label: 'AI Nudges', badge: 2 },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/coach', icon: MessageSquare, label: 'AI Coach' },
]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full bg-white dark:bg-[#0B0E1A] border-r border-slate-100 dark:border-slate-800/80">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center shadow-glow-indigo flex-shrink-0">
            <Zap className="w-[18px] h-[18px] text-white" />
          </div>
          <div>
            <div className="font-black text-[15px] text-slate-900 dark:text-white leading-tight">BudgetWise</div>
            <div className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase">AI</div>
          </div>
        </div>
      </div>

      {/* Profile chip */}
      <div className="mx-4 mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full gradient-indigo flex items-center justify-center text-white text-xs font-bold flex-shrink-0">J</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">Juan dela Cruz</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Pro Member · 74 score</div>
        </div>
        <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 mb-2">
        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Navigation</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                <span className="flex-1 text-[13px]">{label}</span>
                {badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-0.5">
        <button className="nav-link w-full">
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-[13px]">Settings</span>
        </button>
        <button onClick={() => navigate('/')} className="nav-link w-full text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-[13px]">Back to Home</span>
        </button>

        {/* Upgrade card */}
        <div className="mt-3 mx-1 p-3.5 rounded-xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))', border: '1px solid rgba(79,70,229,0.2)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300">AI Pro Active</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Unlimited nudges, coaching & analytics.
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
